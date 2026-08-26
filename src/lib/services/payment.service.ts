import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, BookingStatus } from "@prisma/client";
import { EmailService } from "./email.service";

export class PaymentService {
  /**
   * Creates a Razorpay order for a booking reservation.
   * Derives order amount directly from server-side booking.totalAmount (INR converted to Paise).
   */
  static async createOrder(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) throw new Error("BOOKING_NOT_FOUND");

    if (booking.bookingStatus === BookingStatus.CANCELLED) {
      throw new Error("BOOKING_CANCELLED: Cannot initiate payment for a cancelled reservation.");
    }

    if (booking.bookingStatus === BookingStatus.COMPLETED) {
      throw new Error("BOOKING_COMPLETED: This reservation has already been completed.");
    }

    const amountInPaise = Math.round(booking.totalAmount * 100);
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isProduction = process.env.NODE_ENV === "production";


    // Validate credentials
    const isConfigured = Boolean(
      keyId &&
      !keyId.includes("placeholder") &&
      keySecret &&
      !keySecret.includes("secret") &&
      !keySecret.includes("placeholder")
    );

    if (isProduction && !isConfigured) {
      console.error("[PaymentService] Production environment detected but Razorpay credentials are not configured.");
      throw new Error("PAYMENT_GATEWAY_NOT_CONFIGURED: Valid Razorpay credentials are required in production.");
    }

    let orderId = `order_sim_${booking.id.slice(-6)}_${Date.now()}`;

    if (isConfigured) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const res = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: "INR",
            receipt: booking.bookingCode,
            notes: {
              bookingId: booking.id,
              bookingCode: booking.bookingCode,
              customerName: booking.customerName,
            },
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.id) {
          console.error("[PaymentService] Razorpay order creation failed:", data);
          throw new Error(`RAZORPAY_ORDER_FAILED: ${data.error?.description || "Failed to initialize gateway order."}`);
        }
        orderId = data.id;
      } catch (err: any) {
        console.error("[PaymentService] Error communicating with Razorpay API:", err);
        throw err;
      }
    } else {
      console.log(`[PaymentService - DEV / SIMULATED] Generated simulated order ID for booking: ${booking.bookingCode} (Amount: ₹${booking.totalAmount} / ${amountInPaise} paise)`);
    }

    // Persist razorpayOrderId in the payment ledger and reset status to PENDING for new attempt
    if (booking.payment) {
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: {
          razorpayOrderId: orderId,
          status: PaymentStatus.PENDING,
        },
      });
    } else {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.totalAmount,
          currency: "INR",
          status: PaymentStatus.PENDING,
          razorpayOrderId: orderId,
        },
      });
    }

    if (booking.paymentStatus === PaymentStatus.FAILED) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { paymentStatus: PaymentStatus.PENDING },
      });
    }

    return {
      orderId,
      amount: booking.totalAmount,
      amountInPaise,
      currency: "INR",
      bookingCode: booking.bookingCode,
      keyId: isConfigured ? (keyId as string) : "rzp_test_placeholder_key_id",
      isSimulated: !isConfigured,
    };
  }

  /**
   * Verifies Razorpay payment signature server-side and atomically confirms booking.
   * Completely idempotent and protected against replay / duplicate payment IDs.
   */
  static async verifyPayment(data: {
    bookingId: string;
    razorpayOrderId?: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
  }) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: {
        payment: true,
        experience: true,
        package: true,
      },
    });

    if (!booking) throw new Error("BOOKING_NOT_FOUND");

    if (booking.bookingStatus === BookingStatus.CANCELLED) {
      throw new Error("BOOKING_CANCELLED: Cannot verify payment for a cancelled reservation.");
    }

    // 1. Idempotency check: if already confirmed and paid, return existing confirmed booking

    if (booking.paymentStatus === PaymentStatus.SUCCESS && booking.payment?.status === PaymentStatus.SUCCESS) {
      console.log(`[PaymentService] Booking ${booking.bookingCode} is already verified and confirmed. Returning idempotently.`);
      return {
        success: true,
        bookingCode: booking.bookingCode,
        booking,
        alreadyVerified: true,
      };
    }

    // 2. Prevent duplicate razorpayPaymentId association across different bookings
    if (data.razorpayPaymentId) {
      const existingDuplicatePayment = await prisma.payment.findFirst({
        where: {
          razorpayPaymentId: data.razorpayPaymentId,
          bookingId: { not: booking.id },
          status: PaymentStatus.SUCCESS,
        },
      });

      if (existingDuplicatePayment) {
        console.error(`[PaymentService] Duplicate payment ID detected: ${data.razorpayPaymentId} already used for booking ${existingDuplicatePayment.bookingId}`);
        throw new Error("DUPLICATE_PAYMENT_ID: This payment transaction ID has already been utilized for another booking.");
      }
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isProduction = process.env.NODE_ENV === "production";
    const isConfigured = Boolean(
      keySecret &&
      !keySecret.includes("secret") &&
      !keySecret.includes("placeholder")
    );

    // 3. Cryptographic Signature Verification
    if (isProduction || isConfigured) {
      if (!data.razorpayOrderId || !data.razorpaySignature || !keySecret) {
        // Record failed attempt in payment ledger
        if (booking.payment) {
          await prisma.payment.update({
            where: { id: booking.payment.id },
            data: {
              status: PaymentStatus.FAILED,
              razorpayPaymentId: data.razorpayPaymentId,
              razorpaySignature: data.razorpaySignature || null,
            },
          });
          await prisma.booking.update({
            where: { id: booking.id },
            data: { paymentStatus: PaymentStatus.FAILED },
          });
        }
        throw new Error("INVALID_PAYMENT_SIGNATURE: Missing order ID, cryptographic signature, or gateway credentials.");
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== data.razorpaySignature) {
        console.error("[PaymentService] Signature mismatch during verification:", {
          received: data.razorpaySignature,
          expected: generatedSignature,
        });

        // Record failed payment in ledger
        if (booking.payment) {
          await prisma.payment.update({
            where: { id: booking.payment.id },
            data: {
              status: PaymentStatus.FAILED,
              razorpayOrderId: data.razorpayOrderId,
              razorpayPaymentId: data.razorpayPaymentId,
              razorpaySignature: data.razorpaySignature,
            },
          });
          await prisma.booking.update({
            where: { id: booking.id },
            data: { paymentStatus: PaymentStatus.FAILED },
          });
        }
        throw new Error("INVALID_PAYMENT_SIGNATURE: Cryptographic signature mismatch.");
      }
    } else {
      // DEV / SIMULATED mode only
      console.log(`[PaymentService - DEV / SIMULATED] Validating simulated payment for booking: ${booking.bookingCode}`);
      if (!data.razorpayPaymentId) {
        throw new Error("VALIDATION_ERROR: razorpayPaymentId is required for payment verification.");
      }

      // If simulated signature indicates mismatch or failure
      if (
        data.razorpaySignature &&
        (data.razorpaySignature.includes("invalid") ||
          data.razorpaySignature.includes("fail") ||
          data.razorpaySignature.includes("mismatch") ||
          data.razorpaySignature !== "simulated_dev_signature")
      ) {
        console.error("[PaymentService - DEV / SIMULATED] Simulated signature mismatch triggered.");
        if (booking.payment) {
          await prisma.payment.update({
            where: { id: booking.payment.id },
            data: {
              status: PaymentStatus.FAILED,
              razorpayOrderId: data.razorpayOrderId,
              razorpayPaymentId: data.razorpayPaymentId,
              razorpaySignature: data.razorpaySignature,
            },
          });
          await prisma.booking.update({
            where: { id: booking.id },
            data: { paymentStatus: PaymentStatus.FAILED },
          });
        }
        throw new Error("INVALID_PAYMENT_SIGNATURE: Cryptographic signature mismatch.");
      }
    }


    // 4. Atomic transaction updating Booking and Payment ledger
    const updatedBooking = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: PaymentStatus.SUCCESS,
          bookingStatus: BookingStatus.CONFIRMED,
        },
        include: {
          experience: true,
          package: true,
          payment: true,
        },
      });

      if (booking.payment) {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: {
            status: PaymentStatus.SUCCESS,
            razorpayOrderId: data.razorpayOrderId || booking.payment.razorpayOrderId,
            razorpayPaymentId: data.razorpayPaymentId,
            razorpaySignature: data.razorpaySignature || null,
          },
        });
      }

      return b;
    });

    // 5. Trigger automatic email notifications to Manager and Customer upon payment success (idempotent)
    EmailService.sendBookingNotificationEmails(updatedBooking.id).catch((err) => {
      console.error("[PaymentService] Failed to dispatch booking email notifications:", err);
    });

    return {
      success: true,
      bookingCode: updatedBooking.bookingCode,
      booking: updatedBooking,
    };
  }
}

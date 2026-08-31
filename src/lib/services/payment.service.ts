import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, BookingStatus } from "@prisma/client";
import { EmailService } from "./email.service";

export class PaymentService {
  /**
   * Helper to determine whether valid Razorpay credentials (Test or Live) are present.
   */
  static isRazorpayConfigured(): boolean {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    return Boolean(
      keyId &&
      !keyId.includes("placeholder") &&
      !keyId.includes("your_") &&
      keySecret &&
      !keySecret.includes("placeholder") &&
      !keySecret.includes("your_")
    );
  }

  /**
   * Creates an official Razorpay order for a booking reservation.
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

    if (!keyId || !keySecret) {
      console.error("[PaymentService] Missing Razorpay credentials in environment.");
      throw new Error("PAYMENT_GATEWAY_NOT_CONFIGURED: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be configured.");
    }

    let orderId: string;

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
            customerEmail: booking.customerEmail,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.id) {
        console.error("[PaymentService] Razorpay order creation API error:", data);
        throw new Error(`RAZORPAY_ORDER_FAILED: ${data.error?.description || data.error?.message || "Failed to initialize gateway order."}`);
      }
      orderId = data.id;
    } catch (err: any) {
      console.error("[PaymentService] Error communicating with Razorpay API:", err);
      throw err;
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
      keyId,
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
    const isConfigured = this.isRazorpayConfigured();

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

      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
        .digest("hex");

      const expectedBuffer = Buffer.from(expectedSignature, "utf8");
      const receivedBuffer = Buffer.from(data.razorpaySignature, "utf8");

      const isSignatureValid =
        expectedBuffer.length === receivedBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

      if (!isSignatureValid) {
        console.error("[PaymentService] Signature mismatch during verification:", {
          received: data.razorpaySignature,
          expected: expectedSignature,
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
          (data.razorpaySignature !== "simulated_dev_signature" && data.razorpaySignature !== "simulated_retry_signature"))
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
            razorpayPaymentId: data.razorpayPaymentId,
            razorpayOrderId: data.razorpayOrderId || booking.payment.razorpayOrderId,
            razorpaySignature: data.razorpaySignature || null,
          },
        });
      } else {
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            amount: booking.totalAmount,
            currency: "INR",
            status: PaymentStatus.SUCCESS,
            razorpayPaymentId: data.razorpayPaymentId,
            razorpayOrderId: data.razorpayOrderId,
            razorpaySignature: data.razorpaySignature || null,
          },
        });
      }

      return b;
    });

    console.log(`[PaymentService] Payment verified successfully for booking: ${updatedBooking.bookingCode}`);

    // 5. Dispatch confirmation email notifications asynchronously (non-blocking)
    EmailService.sendBookingNotificationEmails(updatedBooking.id).catch((emailErr) => {
      console.error("[PaymentService] Non-blocking email delivery failure:", emailErr);
    });

    return {
      success: true,
      bookingCode: updatedBooking.bookingCode,
      booking: updatedBooking,
    };
  }

  /**
   * Processes a refund via Razorpay REST API (when configured) and updates database state.
   */
  static async refundPayment(bookingId: string, amount?: number, reason?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });

    if (!booking) throw new Error("BOOKING_NOT_FOUND");
    if (!booking.payment || !booking.payment.razorpayPaymentId) {
      throw new Error("NO_PAYMENT_FOUND: Cannot refund a booking without captured payment.");
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isConfigured = this.isRazorpayConfigured();
    const refundAmountInPaise = amount ? Math.round(amount * 100) : undefined;

    if (isConfigured && keyId && keySecret) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
        const res = await fetch(`https://api.razorpay.com/v1/payments/${booking.payment.razorpayPaymentId}/refund`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            ...(refundAmountInPaise ? { amount: refundAmountInPaise } : {}),
            notes: {
              bookingCode: booking.bookingCode,
              reason: reason || "Customer cancellation",
            },
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("[PaymentService] Razorpay refund API failed:", data);
          throw new Error(`REFUND_FAILED: ${data.error?.description || "Failed to process refund on gateway."}`);
        }
      } catch (err: any) {
        console.error("[PaymentService] Refund API error:", err);
        throw err;
      }
    }

    // Update database states
    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.payment.update({
        where: { id: booking.payment!.id },
        data: { status: PaymentStatus.REFUNDED },
      });
      const b = await tx.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: PaymentStatus.REFUNDED,
          bookingStatus: BookingStatus.REFUNDED,
        },
      });
      return { booking: b, payment: p };
    });

    // Send cancellation & refund notification
    EmailService.sendBookingCancellationEmail(booking.id, reason).catch((err) => {
      console.error("[PaymentService] Failed to send refund email:", err);
    });

    return updated;
  }
}

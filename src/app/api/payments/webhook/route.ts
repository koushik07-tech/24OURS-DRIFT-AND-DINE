import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, BookingStatus } from "@prisma/client";
import { EmailService } from "@/lib/services/email.service";

/**
 * Razorpay Webhook Handler
 * Verifies webhook signature against RAZORPAY_WEBHOOK_SECRET and idempotently updates Booking and Payment records.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSignature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const isSecretConfigured = Boolean(
      webhookSecret &&
      !webhookSecret.includes("placeholder") &&
      !webhookSecret.includes("your_") &&
      !webhookSecret.includes("secret")
    );

    if (!isSecretConfigured) {
      console.warn("[Razorpay Webhook] Webhook secret not configured or placeholder. Skipping signature verification in dev.");
    } else {
      if (!webhookSignature) {
        return NextResponse.json({ success: false, message: "Missing x-razorpay-signature header" }, { status: 400 });
      }

      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret!)
        .update(rawBody)
        .digest("hex");

      const expectedBuffer = Buffer.from(expectedSignature, "utf8");
      const receivedBuffer = Buffer.from(webhookSignature, "utf8");

      const isSignatureValid =
        expectedBuffer.length === receivedBuffer.length &&
        crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

      if (!isSignatureValid) {
        console.error("[Razorpay Webhook] Signature verification failed.");
        return NextResponse.json({ success: false, message: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id;
    const paymentId = paymentEntity?.id;

    console.log(`[Razorpay Webhook] Received event: ${event} for payment ${paymentId} / order ${orderId}`);

    // 1. Payment Captured / Order Paid
    if (event === "payment.captured" || event === "order.paid") {
      if (!orderId && !paymentId) {
        return NextResponse.json({ success: true, message: "No payment entity found" });
      }

      // Find the payment record matching orderId or paymentId
      const paymentRecord = await prisma.payment.findFirst({
        where: {
          OR: [
            ...(orderId ? [{ razorpayOrderId: orderId }] : []),
            ...(paymentId ? [{ razorpayPaymentId: paymentId }] : []),
          ],
        },
        include: { booking: true },
      });

      if (!paymentRecord) {
        console.warn(`[Razorpay Webhook] No matching payment found for order: ${orderId} / payment: ${paymentId}`);
        return NextResponse.json({ success: true, message: "Payment not found in ledger" });
      }

      // Guard: Cannot confirm cancelled booking
      if (paymentRecord.booking?.bookingStatus === BookingStatus.CANCELLED) {
        console.warn(`[Razorpay Webhook] Webhook received for CANCELLED booking ${paymentRecord.booking.bookingCode}. Ignoring confirmation.`);
        return NextResponse.json({ success: false, message: "Cannot confirm a cancelled booking" }, { status: 400 });
      }

      // Idempotency: skip if already SUCCESS
      if (paymentRecord.status === PaymentStatus.SUCCESS && paymentRecord.booking?.paymentStatus === PaymentStatus.SUCCESS) {
        console.log(`[Razorpay Webhook] Booking ${paymentRecord.booking?.bookingCode} already marked SUCCESS. Skipping.`);
        return NextResponse.json({ success: true, message: "Already processed" });
      }

      // Prevent duplicate razorpayPaymentId association
      if (paymentId) {
        const duplicate = await prisma.payment.findFirst({
          where: {
            razorpayPaymentId: paymentId,
            id: { not: paymentRecord.id },
            status: PaymentStatus.SUCCESS,
          },
        });
        if (duplicate) {
          console.error(`[Razorpay Webhook] Duplicate payment ID detected: ${paymentId}`);
          return NextResponse.json({ success: false, message: "Duplicate payment ID" }, { status: 409 });
        }
      }

      // Atomically confirm booking and payment
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: paymentRecord.id },
          data: {
            status: PaymentStatus.SUCCESS,
            razorpayPaymentId: paymentId || paymentRecord.razorpayPaymentId,
            razorpayOrderId: orderId || paymentRecord.razorpayOrderId,
          },
        });

        await tx.booking.update({
          where: { id: paymentRecord.bookingId },
          data: {
            paymentStatus: PaymentStatus.SUCCESS,
            bookingStatus: BookingStatus.CONFIRMED,
          },
        });
      });

      // Dispatch confirmation emails (idempotent)
      EmailService.sendBookingNotificationEmails(paymentRecord.bookingId).catch((err) => {
        console.error("[Razorpay Webhook] Failed to dispatch booking email notifications:", err);
      });

      return NextResponse.json({ success: true, message: "Payment processed successfully" });
    }

    // 2. Payment Failed
    if (event === "payment.failed") {
      if (orderId || paymentId) {
        const paymentRecord = await prisma.payment.findFirst({
          where: {
            OR: [
              ...(orderId ? [{ razorpayOrderId: orderId }] : []),
              ...(paymentId ? [{ razorpayPaymentId: paymentId }] : []),
            ],
          },
        });

        if (paymentRecord && paymentRecord.status === PaymentStatus.PENDING) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: paymentRecord.id },
              data: {
                status: PaymentStatus.FAILED,
                razorpayPaymentId: paymentId || paymentRecord.razorpayPaymentId,
              },
            }),
            prisma.booking.update({
              where: { id: paymentRecord.bookingId },
              data: { paymentStatus: PaymentStatus.FAILED },
            }),
          ]);
        }
      }
      return NextResponse.json({ success: true, message: "Payment failure recorded" });
    }

    // 3. Refund Processed
    if (event === "refund.processed" || event === "refund.created") {
      const refundPaymentId = payload.payload?.refund?.entity?.payment_id || paymentId;
      if (refundPaymentId) {
        const paymentRecord = await prisma.payment.findFirst({
          where: { razorpayPaymentId: refundPaymentId },
          include: { booking: true },
        });

        if (paymentRecord) {
          await prisma.$transaction([
            prisma.payment.update({
              where: { id: paymentRecord.id },
              data: { status: PaymentStatus.REFUNDED },
            }),
            prisma.booking.update({
              where: { id: paymentRecord.bookingId },
              data: {
                paymentStatus: PaymentStatus.REFUNDED,
                bookingStatus: BookingStatus.REFUNDED,
              },
            }),
          ]);

          EmailService.sendBookingCancellationEmail(paymentRecord.bookingId, "Refund processed via payment gateway").catch((err) => {
            console.error("[Razorpay Webhook] Failed to dispatch refund notification:", err);
          });
        }
      }
      return NextResponse.json({ success: true, message: "Refund processed recorded" });
    }

    return NextResponse.json({ success: true, message: `Event ${event} acknowledged` });
  } catch (error: any) {
    console.error("[Razorpay Webhook Error]:", error);
    return NextResponse.json({ success: false, message: error.message || "Webhook handling failed" }, { status: 500 });
  }
}

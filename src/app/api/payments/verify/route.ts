import { NextRequest, NextResponse } from "next/server";
import { paymentVerifySchema } from "@/lib/validation/schemas";
import { PaymentService } from "@/lib/services/payment.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = paymentVerifySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validated.error.errors[0]?.message } },
        { status: 400 }
      );
    }

    const result = await PaymentService.verifyPayment(validated.data);
    return NextResponse.json({
      success: true,
      data: result,
      message: "Payment verified successfully",
    });
  } catch (error: any) {
    const msg = error.message || "Payment verification failed";

    if (msg.startsWith("INVALID_PAYMENT_SIGNATURE")) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_SIGNATURE", message: msg } },
        { status: 400 }
      );
    }

    if (msg.startsWith("DUPLICATE_PAYMENT_ID")) {
      return NextResponse.json(
        { success: false, error: { code: "DUPLICATE_PAYMENT", message: msg } },
        { status: 409 }
      );
    }

    if (msg.startsWith("BOOKING_NOT_FOUND")) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Booking reservation not found." } },
        { status: 404 }
      );
    }

    console.error("[VerifyRoute] Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: msg } },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/lib/services/payment.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.bookingId) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Booking ID is required" } },
        { status: 400 }
      );
    }

    const order = await PaymentService.createOrder(body.bookingId);
    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error: any) {
    console.error("Create payment order error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message || "Failed to create payment order" } },
      { status: 500 }
    );
  }
}

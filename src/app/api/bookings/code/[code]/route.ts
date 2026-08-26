import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/lib/services/booking.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const booking = await BookingService.getBookingByCode(code);

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    if (error.message === "BOOKING_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Invalid booking code" } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to verify booking pass" } },
      { status: 500 }
    );
  }
}

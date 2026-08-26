import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/lib/services/booking.service";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getUserFromRequest(req);
    const cancelled = await BookingService.cancelBooking(id, session?.userId, session?.role);

    return NextResponse.json({
      success: true,
      data: cancelled,
      message: "Booking reservation cancelled successfully",
    });
  } catch (error: any) {
    const msg = error.message || "Failed to cancel booking";

    if (msg.startsWith("ALREADY_CANCELLED")) {
      return NextResponse.json(
        { success: false, error: { code: "ALREADY_CANCELLED", message: msg } },
        { status: 400 }
      );
    }

    if (msg.startsWith("CANNOT_CANCEL_COMPLETED")) {
      return NextResponse.json(
        { success: false, error: { code: "CANNOT_CANCEL_COMPLETED", message: msg } },
        { status: 400 }
      );
    }

    if (msg === "BOOKING_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Booking not found" } },
        { status: 404 }
      );
    }

    if (msg === "FORBIDDEN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Unauthorized to cancel this booking" } },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { BookingService } from "@/lib/services/booking.service";
import { bookingUpdateSchema } from "@/lib/validation/schemas";
import { getUserFromRequest, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getUserFromRequest(req);
    const booking = await BookingService.getBookingById(id, session?.userId, session?.role);

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Unauthorized to access this booking" } },
        { status: 403 }
      );
    }
    if (error.message === "BOOKING_NOT_FOUND") {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Booking not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch booking details" } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await requireAdmin(req);

    const body = await req.json();
    const validated = bookingUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: validated.error.errors[0]?.message },
        },
        { status: 400 }
      );
    }

    const updated = await BookingService.updateBooking(id, validated.data as any);
    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to update booking" } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getUserFromRequest(req);
    const cancelled = await BookingService.cancelBooking(id, session?.userId, session?.role);

    return NextResponse.json({
      success: true,
      data: cancelled,
      message: "Booking cancelled successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: error.message || "Failed to cancel booking" } },
      { status: 500 }
    );
  }
}

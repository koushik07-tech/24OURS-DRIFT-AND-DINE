import { NextRequest, NextResponse } from "next/server";
import { bookingCreateSchema } from "@/lib/validation/schemas";
import { BookingService } from "@/lib/services/booking.service";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = bookingCreateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: validated.error.errors[0]?.message || "Invalid booking payload",
          },
        },
        { status: 400 }
      );
    }

    const session = await getUserFromRequest(req);
    const booking = await BookingService.createBooking(validated.data, session?.userId);

    return NextResponse.json(
      {
        success: true,
        data: booking,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message.startsWith("CAPACITY_EXCEEDED")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CAPACITY_EXCEEDED",
            message: error.message.replace("CAPACITY_EXCEEDED: ", ""),
          },
        },
        { status: 409 }
      );
    }

    console.error("Booking creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: error.message || "Failed to process booking reservation.",
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    const bookings = await BookingService.getBookings(session?.userId, session?.role);

    return NextResponse.json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to fetch bookings" },
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    if (!code) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Booking reference code is required." } },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { bookingCode: code.trim().toUpperCase() },
      include: {
        payment: {
          select: {
            status: true,
            createdAt: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "PASS_NOT_FOUND",
            message: "No registered boarding pass found matching this reference code.",
          },
        },
        { status: 404 }
      );
    }

    const isValidPass =
      booking.bookingStatus === BookingStatus.CONFIRMED &&
      booking.paymentStatus === PaymentStatus.SUCCESS &&
      booking.payment?.status === PaymentStatus.SUCCESS;

    // Redacted privacy-safe public verification payload
    const safeData = {
      bookingCode: booking.bookingCode,
      experienceName: booking.experienceName,
      date: booking.date,
      timeSlot: booking.timeSlot,
      guestCount: booking.guestCount,
      bookingStatus: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      isValidPass,
      statusDescription: isValidPass
        ? "AUTHENTICATED & VALID FOR ENTRY"
        : booking.bookingStatus === BookingStatus.CANCELLED
        ? "RESERVATION CANCELLED"
        : "UNVERIFIED / PENDING PAYMENT",
      verifiedAt: new Date().toISOString(),
      location: "24OURS Pit-Lane & Dining Paddock, Chikkaballapura, Karnataka",
    };

    return NextResponse.json({
      success: true,
      data: safeData,
    });
  } catch (error: any) {
    console.error("[Pass Verification Error]:", error);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to verify pass ticket." } },
      { status: 500 }
    );
  }
}

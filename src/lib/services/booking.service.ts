import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus, Role } from "@prisma/client";
import { EmailService } from "./email.service";

function generateBookingCode(): string {
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `TORQ-24O-${randomDigits}${randomChars.slice(0, 1)}`;
}

export class BookingService {
  static async createBooking(
    data: {
      experienceName?: string;
      experienceId?: string;
      packageId?: string;
      date: string;
      timeSlot: string;
      guests: number;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      specialRequests?: string;
      discountCode?: string;
    },
    userId?: string
  ) {
    const bookingDate = new Date(data.date);
    if (isNaN(bookingDate.getTime())) {
      throw new Error("INVALID_DATE");
    }

    // 1. Resolve pricing & experience details SERVER-SIDE
    let basePricePerGuest = 1299.0;
    let resolvedExperienceId: string | null = data.experienceId || null;
    let resolvedPackageId: string | null = data.packageId || null;
    let resolvedExperienceName = data.experienceName || "Electric Go-Karting Grand Prix";
    let maxCapacityPerSlot = 12;

    if (data.experienceId) {
      const exp = await prisma.experience.findUnique({
        where: { id: data.experienceId },
      });
      if (exp) {
        basePricePerGuest = exp.basePrice;
        resolvedExperienceName = exp.name;
        maxCapacityPerSlot = exp.capacityPerSlot;
      }
    } else if (data.experienceName) {
      const exp = await prisma.experience.findFirst({
        where: { name: { contains: data.experienceName, mode: "insensitive" } },
      });
      if (exp) {
        resolvedExperienceId = exp.id;
        basePricePerGuest = exp.basePrice;
        maxCapacityPerSlot = exp.capacityPerSlot;
      } else if (data.experienceName.toLowerCase().includes("sky dining") || data.experienceName.toLowerCase().includes("restaurant")) {
        basePricePerGuest = 1899.0;
        maxCapacityPerSlot = 30;
      } else if (data.experienceName.toLowerCase().includes("rc")) {
        basePricePerGuest = 599.0;
        maxCapacityPerSlot = 8;
      } else if (data.experienceName.toLowerCase().includes("vr") || data.experienceName.toLowerCase().includes("simulator")) {
        basePricePerGuest = 499.0;
        maxCapacityPerSlot = 6;
      }
    } else if (data.packageId) {
      const pkg = await prisma.package.findUnique({
        where: { id: data.packageId },
      });
      if (pkg) {
        basePricePerGuest = pkg.price;
        resolvedExperienceName = pkg.name;
        maxCapacityPerSlot = pkg.maxGuests;
      }
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const bookingCode = generateBookingCode();
    const qrData = `24OURS-PASS:${bookingCode}:${data.date}:${data.timeSlot}`;

    // Execute capacity check, discount application, and booking + payment in a Serializable transaction with retry
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      try {
        const newBooking = await prisma.$transaction(
          async (tx) => {
            // 1. Row lock on Experience if available to serialize concurrent bookings for the same experience
            if (resolvedExperienceId) {
              try {
                await tx.$queryRawUnsafe(
                  `SELECT "id" FROM "Experience" WHERE "id" = $1 FOR UPDATE`,
                  resolvedExperienceId
                );
              } catch {
                // Fallback for non-Postgres environments (e.g. SQLite / in-memory mocks)
              }
            }

            // 2. Transactional Availability & Capacity Check
            const existingBookings = await tx.booking.findMany({
              where: {
                date: { gte: startOfDay, lte: endOfDay },
                timeSlot: data.timeSlot,
                bookingStatus: { notIn: [BookingStatus.CANCELLED, BookingStatus.REFUNDED] },
                ...(resolvedExperienceId ? { experienceId: resolvedExperienceId } : {}),
              },
              select: { guestCount: true },
            });

            const bookedGuests = existingBookings.reduce((sum, b) => sum + b.guestCount, 0);
            if (bookedGuests + data.guests > maxCapacityPerSlot) {
              throw new Error(`CAPACITY_EXCEEDED: Only ${Math.max(0, maxCapacityPerSlot - bookedGuests)} slot(s) available for this time window.`);
            }

            // 3. Transactional discount calculation and usage limit update
            let calculatedTotal = basePricePerGuest * data.guests;
            if (data.discountCode) {
              const offer = await tx.offer.findUnique({
                where: { code: data.discountCode.trim().toUpperCase() },
              });
              if (offer && offer.isActive && new Date() <= offer.endDate && offer.usedCount < offer.usageLimit) {
                if (offer.discountType === "PERCENTAGE") {
                  calculatedTotal = calculatedTotal * (1 - offer.discountAmount / 100);
                } else {
                  calculatedTotal = Math.max(0, calculatedTotal - offer.discountAmount);
                }
                await tx.offer.update({
                  where: { id: offer.id },
                  data: { usedCount: { increment: 1 } },
                });
              }
            }

            // 4. Create Booking
            const booking = await tx.booking.create({
              data: {
                bookingCode,
                userId: userId || null,
                customerName: data.customerName.trim(),
                customerEmail: data.customerEmail.trim().toLowerCase(),
                customerPhone: data.customerPhone.trim(),
                experienceId: resolvedExperienceId,
                packageId: resolvedPackageId,
                date: bookingDate,
                timeSlot: data.timeSlot,
                guestCount: data.guests,
                totalAmount: calculatedTotal,
                bookingStatus: BookingStatus.PENDING,
                paymentStatus: PaymentStatus.PENDING,
                qrCodeUrl: qrData,
                notes: data.specialRequests || null,
              },
              include: {
                experience: true,
                package: true,
                payment: true,
              },
            });

            // 5. Create Payment ledger record
            await tx.payment.create({
              data: {
                bookingId: booking.id,
                amount: calculatedTotal,
                currency: "INR",
                status: PaymentStatus.PENDING,
              },
            });

            return booking;
          },
          {
            isolationLevel: "Serializable",
            maxWait: 5000,
            timeout: 10000,
          }
        );

        return newBooking;
      } catch (err: any) {
        // If capacity exceeded, propagate immediately
        if (err.message && err.message.startsWith("CAPACITY_EXCEEDED")) {
          throw err;
        }

        // Check if error is serialization failure (P2034 in Prisma) or concurrency conflict
        const isConflict = err.code === "P2034" || (err.message && err.message.includes("could not serialize"));
        if (isConflict && attempt < maxRetries) {
          // Jitter delay before retry
          await new Promise((res) => setTimeout(res, 50 * attempt + Math.random() * 50));
          continue;
        }
        throw err;
      }
    }

    throw new Error("CONCURRENCY_ERROR: High transaction volume. Please try again.");
  }

  static async getBookings(userId?: string, role?: Role) {
    if (role === Role.ADMIN) {
      return prisma.booking.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          experience: true,
          package: true,
          payment: true,
          user: { select: { id: true, name: true, email: true } },
        },
      });
    }

    if (!userId) return [];

    return prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        experience: true,
        package: true,
        payment: true,
      },
    });
  }

  static async getBookingById(id: string, userId?: string, role?: Role) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        experience: true,
        package: true,
        payment: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!booking) {
      throw new Error("BOOKING_NOT_FOUND");
    }

    if (role !== Role.ADMIN && booking.userId && booking.userId !== userId) {
      throw new Error("FORBIDDEN");
    }

    return booking;
  }

  static async getBookingByCode(bookingCode: string) {
    const booking = await prisma.booking.findUnique({
      where: { bookingCode },
      include: {
        experience: true,
        package: true,
        payment: true,
      },
    });

    if (!booking) {
      throw new Error("BOOKING_NOT_FOUND");
    }

    return booking;
  }

  static async updateBooking(
    id: string,
    data: {
      bookingStatus?: BookingStatus;
      paymentStatus?: PaymentStatus;
      notes?: string;
    }
  ) {
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("BOOKING_NOT_FOUND");
    }

    return prisma.booking.update({
      where: { id },
      data: {
        ...(data.bookingStatus ? { bookingStatus: data.bookingStatus } : {}),
        ...(data.paymentStatus ? { paymentStatus: data.paymentStatus } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
      },
      include: {
        experience: true,
        package: true,
        payment: true,
      },
    });
  }

  static async cancelBooking(id: string, userId?: string, role?: Role) {
    const booking = await this.getBookingById(id, userId, role);

    if (booking.bookingStatus === BookingStatus.CANCELLED) {
      throw new Error("ALREADY_CANCELLED: This booking is already cancelled.");
    }

    if (booking.bookingStatus === BookingStatus.COMPLETED) {
      throw new Error("CANNOT_CANCEL_COMPLETED: Completed bookings cannot be cancelled.");
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        bookingStatus: BookingStatus.CANCELLED,
      },
      include: {
        experience: true,
        package: true,
        payment: true,
      },
    });

    // Dispatch cancellation email asynchronously
    EmailService.sendBookingCancellationEmail(updated.id).catch((err) => {
      console.error("[BookingService] Failed to dispatch cancellation email:", err);
    });

    return updated;
  }
}


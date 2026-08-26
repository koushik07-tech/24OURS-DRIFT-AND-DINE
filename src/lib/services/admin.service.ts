import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export class AdminService {
  static async getDashboardKPIs() {
    const [
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalEnquiries,
      totalUsers,
      totalSubscribers,
      recentBookings,
      recentEnquiries,
      payments,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { bookingStatus: BookingStatus.CONFIRMED } }),
      prisma.booking.count({ where: { bookingStatus: BookingStatus.PENDING } }),
      prisma.booking.count({ where: { bookingStatus: BookingStatus.CANCELLED } }),
      prisma.eventEnquiry.count(),
      prisma.user.count(),
      prisma.newsletterSubscriber.count(),
      prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          payment: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.eventEnquiry.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.findMany({
        where: { status: PaymentStatus.SUCCESS },
        select: { amount: true },
      }),
    ]);

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      totalEnquiries,
      totalUsers,
      totalSubscribers,
      totalRevenue,
      recentBookings,
      recentEnquiries,
    };
  }

  static async getAllUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });
  }

  static async getAllPayments() {
    return prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        booking: {
          select: {
            bookingCode: true,
            customerName: true,
            customerEmail: true,
            experienceName: true,
          },
        },
      },
    });
  }
}

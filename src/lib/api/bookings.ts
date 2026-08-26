import { Booking } from "@/types";

export const bookingsApi = {
  async createBooking(details: {
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
  }): Promise<{ success: boolean; data?: Booking; error?: { code: string; message: string } }> {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    return res.json();
  },

  async getBookings(): Promise<{ success: boolean; data?: Booking[]; error?: any }> {
    const res = await fetch("/api/bookings", {
      method: "GET",
    });
    return res.json();
  },

  async getBookingByCode(code: string): Promise<{ success: boolean; data?: Booking; error?: any }> {
    const res = await fetch(`/api/bookings/code/${encodeURIComponent(code)}`, {
      method: "GET",
    });
    return res.json();
  },

  async cancelBooking(id: string): Promise<{ success: boolean; data?: Booking; error?: any }> {
    const res = await fetch(`/api/bookings/${encodeURIComponent(id)}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },
};


export const adminApi = {
  async getDashboardKPIs() {
    const res = await fetch("/api/admin/dashboard");
    return res.json();
  },

  async getBookings() {
    const res = await fetch("/api/admin/bookings");
    return res.json();
  },

  async updateBooking(id: string, data: { bookingStatus?: string; paymentStatus?: string; notes?: string }) {
    const res = await fetch(`/api/admin/bookings/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getEnquiries() {
    const res = await fetch("/api/admin/enquiries");
    return res.json();
  },

  async updateEnquiry(id: string, data: { status?: string; message?: string }) {
    const res = await fetch(`/api/admin/enquiries/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getUsers() {
    const res = await fetch("/api/admin/users");
    return res.json();
  },

  async getPayments() {
    const res = await fetch("/api/admin/payments");
    return res.json();
  },
};

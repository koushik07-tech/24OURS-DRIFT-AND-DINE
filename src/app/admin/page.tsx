"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, LayoutDashboard, Ticket, Users, Award, 
  Trash2, Search, CheckCircle2, DollarSign, Flag, Filter, ArrowUpRight,
  Clock, AlertTriangle, XCircle, ChevronRight, RefreshCw
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { adminApi } from "@/lib/api/admin";
import Link from "next/link";

export default function AdminPage() {
  const { user } = useAuth();
  const { allBookings, allEnquiries, refreshBookings, refreshEnquiries } = useBooking();

  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "enquiries">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [paymentFilter, setPaymentFilter] = useState("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [kpis, setKpis] = useState<{
    totalBookings: number;
    confirmedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    totalEnquiries: number;
    totalUsers: number;
    totalRevenue: number;
  }>({
    totalBookings: allBookings.length,
    confirmedBookings: allBookings.filter((b) => b.bookingStatus === "CONFIRMED" || b.status === "CONFIRMED").length,
    pendingBookings: allBookings.filter((b) => b.bookingStatus === "PENDING" || b.status === "PENDING").length,
    cancelledBookings: allBookings.filter((b) => b.bookingStatus === "CANCELLED" || b.status === "CANCELLED").length,
    totalEnquiries: allEnquiries.length,
    totalUsers: 2,
    totalRevenue: 0,
  });

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refreshBookings(), refreshEnquiries()]);
      const res = await adminApi.getDashboardKPIs();
      if (res.success && res.data) {
        setKpis(res.data);
      }
    } catch {
      // fallback to client context
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBookings = allBookings.filter((b) => {
    const codeMatch = (b.bookingCode || "").toLowerCase().includes(searchTerm.toLowerCase());
    const nameMatch = (b.customerName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = (b.customerEmail || "").toLowerCase().includes(searchTerm.toLowerCase());
    const expMatch = (b.experienceName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = codeMatch || nameMatch || emailMatch || expMatch;

    const bStatus = b.bookingStatus || b.status || "PENDING";
    const pStatus = b.paymentStatus || b.payment?.status || "PENDING";

    const matchesStatus = statusFilter === "ALL" || bStatus === statusFilter;
    const matchesPayment = paymentFilter === "ALL" || pStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <div className="pt-32 pb-20 min-h-screen subtle-grid text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* Admin Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-carbon-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-card-elevated">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-white uppercase">
                  24OURS Master Admin Console
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase">
                  Super Admin
                </span>
              </div>
              <p className="text-xs font-mono text-carbon-400 mt-0.5">Session: {user?.email || "admin@24ours.com"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-carbon-900 border border-white/10 text-carbon-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-mono"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand-red" : ""}`} />
              <span>Refresh Ledger</span>
            </button>
            <span className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live DB Sync
            </span>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "overview" ? "bg-brand-red text-white font-bold shadow-glow-red" : "bg-carbon-950 text-carbon-400 hover:text-white"
            }`}
          >
            Dashboard KPIs
          </button>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "bookings" ? "bg-brand-red text-white font-bold shadow-glow-red" : "bg-carbon-950 text-carbon-400 hover:text-white"
            }`}
          >
            Pass Ledger ({allBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("enquiries")}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "enquiries" ? "bg-brand-red text-white font-bold shadow-glow-red" : "bg-carbon-950 text-carbon-400 hover:text-white"
            }`}
          >
            Event Enquiries ({allEnquiries.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Confirmed Passes */}
              <div className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-carbon-400">
                  <span className="text-xs font-mono uppercase">Confirmed Passes</span>
                  <Ticket className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-display font-black text-white">{kpis.confirmedBookings}</p>
                <p className="text-[11px] text-carbon-400 font-mono">Paid & Pass Issued</p>
              </div>

              {/* Pending Bookings */}
              <div className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-carbon-400">
                  <span className="text-xs font-mono uppercase">Pending Bookings</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-3xl font-display font-black text-white">{kpis.pendingBookings}</p>
                <p className="text-[11px] text-carbon-400 font-mono">Awaiting Checkout</p>
              </div>

              {/* Cancelled Bookings */}
              <div className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-carbon-400">
                  <span className="text-xs font-mono uppercase">Cancelled Slots</span>
                  <XCircle className="w-4 h-4 text-brand-red" />
                </div>
                <p className="text-3xl font-display font-black text-white">{kpis.cancelledBookings}</p>
                <p className="text-[11px] text-carbon-400 font-mono">Released Inventory</p>
              </div>

              {/* Total Revenue */}
              <div className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-carbon-400">
                  <span className="text-xs font-mono uppercase">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-display font-black text-white">
                  ₹{kpis.totalRevenue?.toLocaleString("en-IN") || "0"}
                </p>
                <p className="text-[11px] text-carbon-400 font-mono">Verified Ledger Total</p>
              </div>
            </div>

            {/* Recent Stream */}
            <div className="p-6 sm:p-8 rounded-3xl bg-carbon-950 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-heading font-bold text-white uppercase">Recent Booking Stream</h3>
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="text-xs font-mono text-brand-red hover:underline flex items-center gap-1"
                >
                  <span>View All Ledger</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {allBookings.slice(0, 6).map((b) => (
                  <Link
                    key={b.id}
                    href={`/admin/bookings/${b.id}`}
                    className="p-3 rounded-xl bg-carbon-900 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2 hover:border-brand-red transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-brand-red font-bold">{b.bookingCode}</span>
                      <span className="text-white font-medium">{b.customerName}</span>
                      <span className="text-carbon-400">({b.experienceName})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-carbon-400">₹{b.totalAmount?.toLocaleString("en-IN")}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        (b.bookingStatus || b.status) === "CONFIRMED"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : (b.bookingStatus || b.status) === "CANCELLED"
                          ? "bg-red-500/20 text-brand-red"
                          : "bg-amber-500/20 text-amber-400"
                      }`}>
                        {b.bookingStatus || b.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Queue Tab with Full Filters */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            
            {/* Search and Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search code, guest name, email, or attraction..."
                  className="w-full pl-9 pr-4 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-brand-red"
                />
                <Search className="w-3.5 h-3.5 text-carbon-500 absolute left-3 top-3" />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-brand-red"
                >
                  <option value="ALL">Booking Status: ALL</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-carbon-900 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-brand-red"
                >
                  <option value="ALL">Payment: ALL</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="PENDING">PENDING</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-carbon-950">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-carbon-900 text-carbon-400 uppercase border-b border-white/10">
                  <tr>
                    <th className="p-4">Reference Code</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Experience</th>
                    <th className="p-4">Date & Slot</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Booking</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-carbon-300">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-carbon-400 font-mono">
                        No bookings matching filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => {
                      const bStatus = b.bookingStatus || b.status || "PENDING";
                      const pStatus = b.paymentStatus || b.payment?.status || "PENDING";
                      return (
                        <tr key={b.id} className="hover:bg-carbon-900/50 transition-colors">
                          <td className="p-4 text-brand-red font-bold">
                            <Link href={`/admin/bookings/${b.id}`} className="hover:underline">
                              {b.bookingCode}
                            </Link>
                          </td>
                          <td className="p-4">
                            <p className="text-white font-medium">{b.customerName}</p>
                            <p className="text-[10px] text-carbon-500">{b.customerEmail}</p>
                          </td>
                          <td className="p-4">{b.experienceName}</td>
                          <td className="p-4 text-[11px]">
                            <p>{typeof b.date === "string" ? b.date.slice(0, 10) : new Date(b.date).toISOString().slice(0, 10)}</p>
                            <p className="text-carbon-500">{b.timeSlot}</p>
                          </td>
                          <td className="p-4 text-emerald-400 font-bold">
                            ₹{b.totalAmount?.toLocaleString("en-IN")}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              bStatus === "CONFIRMED"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : bStatus === "CANCELLED"
                                ? "bg-red-500/20 text-brand-red"
                                : "bg-amber-500/20 text-amber-400"
                            }`}>
                              {bStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pStatus === "SUCCESS"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : pStatus === "FAILED"
                                ? "bg-red-500/20 text-brand-red"
                                : "bg-amber-500/20 text-amber-400"
                            }`}>
                              {pStatus}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <Link
                              href={`/admin/bookings/${b.id}`}
                              className="inline-flex items-center gap-1 text-[11px] text-brand-red hover:underline font-bold"
                            >
                              <span>Inspect</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Enquiries Pipeline Tab */}
        {activeTab === "enquiries" && (
          <div className="space-y-6">
            <h3 className="text-base font-heading font-bold text-white uppercase">Corporate & Banquet Enquiries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allEnquiries.map((enq) => (
                <div key={enq.id} className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-display font-bold text-white">{enq.name}</h4>
                    <span className="text-xs font-mono text-brand-red">{enq.eventType}</span>
                  </div>
                  <div className="text-xs font-mono text-carbon-400 space-y-1">
                    <p>Email: {enq.email} • Phone: {enq.phone}</p>
                    <p>Expected Guests: {enq.expectedGuests} • Date: {enq.preferredDate ? String(enq.preferredDate).slice(0, 10) : "Flexible"}</p>
                    {enq.requirements && <p className="text-carbon-300 italic pt-1">"{enq.requirements}"</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

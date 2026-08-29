"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, LayoutDashboard, Ticket, Users, Award, 
  Trash2, Search, CheckCircle2, DollarSign, Flag
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";

export default function AdminPage() {
  const { user } = useAuth();
  const { allBookings, allEnquiries } = useBooking();

  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "enquiries">("overview");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = allBookings.filter((b) =>
    b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.experienceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

          <span className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            PostgreSQL & Queue Sync Active
          </span>
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
            Pass Queues ({allBookings.length})
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
              <div className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-carbon-400">
                  <span className="text-xs font-mono uppercase">Issued Passes</span>
                  <Ticket className="w-4 h-4 text-brand-red" />
                </div>
                <p className="text-3xl font-display font-black text-white">{allBookings.length}</p>
                <p className="text-[11px] text-carbon-400 font-mono">100% Digital QR Validation</p>
              </div>

              <div className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-carbon-400">
                  <span className="text-xs font-mono uppercase">Bespoke Enquiries</span>
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-display font-black text-white">{allEnquiries.length}</p>
                <p className="text-[11px] text-carbon-400 font-mono">Corporate & Banquet Pipeline</p>
              </div>

              <div className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-carbon-400">
                  <span className="text-xs font-mono uppercase">Attraction Fleet</span>
                  <Flag className="w-4 h-4 text-amber-400" />
                </div>
                <p className="text-3xl font-display font-black text-white">6</p>
                <p className="text-[11px] text-carbon-400 font-mono">Active Destination Zones</p>
              </div>

              <div className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-carbon-400">
                  <span className="text-xs font-mono uppercase">Location Hub</span>
                  <CheckCircle2 className="w-4 h-4 text-brand-red" />
                </div>
                <p className="text-2xl font-display font-black text-white">Malur, Kolar</p>
                <p className="text-[11px] text-carbon-400 font-mono">Karnataka Paddock</p>
              </div>
            </div>

            {/* Recent Stream */}
            <div className="p-6 sm:p-8 rounded-3xl bg-carbon-950 border border-white/10 space-y-4">
              <h3 className="text-base font-heading font-bold text-white uppercase">Live Session Passes Dispatch</h3>
              <div className="space-y-2">
                {allBookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-carbon-900 border border-white/5 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <span className="text-brand-red font-bold">{b.bookingCode}</span>
                      <span className="text-white">{b.customerName}</span>
                      <span className="text-carbon-400">({b.experienceName})</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Queue Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-heading font-bold text-white uppercase">All Issued Passes</h3>
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search code, guest, activity..."
                  className="w-full pl-9 pr-4 py-2 bg-carbon-900 border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-brand-red"
                />
                <Search className="w-3.5 h-3.5 text-carbon-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-carbon-950">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-carbon-900 text-carbon-400 uppercase border-b border-white/10">
                  <tr>
                    <th className="p-4">Reference Code</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Experience</th>
                    <th className="p-4">Date & Slot</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-carbon-300">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-carbon-900/50">
                      <td className="p-4 text-brand-red font-bold">{b.bookingCode}</td>
                      <td className="p-4 text-white font-medium">{b.customerName}</td>
                      <td className="p-4">{b.experienceName}</td>
                      <td className="p-4">{b.date} • {b.timeSlot}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
                    <p>Expected Guests: {enq.expectedGuests} • Date: {enq.preferredDate}</p>
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

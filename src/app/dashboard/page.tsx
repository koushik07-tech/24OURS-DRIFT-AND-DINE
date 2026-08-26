"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Calendar, User, Trophy, LogOut, Ticket, Printer, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { Booking } from "@/types";

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const { allBookings, openBookingModal } = useBooking();

  const [activeTab, setActiveTab] = useState<"passes" | "telemetry">("passes");
  const [selectedPass, setSelectedPass] = useState<Booking | null>(null);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="pt-32 pb-20 min-h-screen subtle-grid text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* User Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-carbon-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-card-elevated">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-red to-orange-500 flex items-center justify-center text-2xl font-display font-black text-white shadow-glow-red">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "DR"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-white">
                  Welcome back, {user?.name || "Driver VIP"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold">
                  {user?.role || "VIP Driver"}
                </span>
              </div>
              <p className="text-xs font-mono text-carbon-400 mt-0.5">{user?.email || "racer@24ours.com"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openBookingModal()}
              className="px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book New Session</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-carbon-900 border border-white/10 text-carbon-400 hover:text-red-400"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("passes")}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "passes" ? "bg-brand-red text-white font-bold shadow-glow-red" : "bg-carbon-950 text-carbon-400 hover:text-white"
            }`}
          >
            My Digital Passes ({allBookings.length})
          </button>
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
              activeTab === "telemetry" ? "bg-brand-red text-white font-bold shadow-glow-red" : "bg-carbon-950 text-carbon-400 hover:text-white"
            }`}
          >
            Circuit Telemetry Profile
          </button>
        </div>

        {/* Passes Tab */}
        {activeTab === "passes" && (
          <div className="space-y-6">
            <h3 className="text-base font-heading font-bold text-white uppercase tracking-wider">
              Issued Session Passes & Tickets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-6 rounded-3xl bg-carbon-950 border border-white/10 glass-panel-hover flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-xs font-mono text-brand-red font-bold">{bk.bookingCode}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                        ● {bk.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-display font-bold text-white">{bk.experienceName}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-carbon-300">
                      <div>
                        <span className="text-carbon-500 text-[10px] block uppercase">Date</span>
                        <span className="text-white font-semibold">{bk.date}</span>
                      </div>
                      <div>
                        <span className="text-carbon-500 text-[10px] block uppercase">Time Slot</span>
                        <span className="text-brand-red font-semibold">{bk.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-carbon-500 text-[10px] block uppercase">Guests</span>
                        <span className="text-white">{bk.guests} Racers</span>
                      </div>
                      <div>
                        <span className="text-carbon-500 text-[10px] block uppercase">Driver</span>
                        <span className="text-white truncate">{bk.customerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <button
                      onClick={() => setSelectedPass(bk)}
                      className="w-full py-2.5 rounded-xl bg-carbon-900 border border-white/10 text-xs font-mono text-white hover:border-brand-red"
                    >
                      View QR Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Telemetry Profile Tab */}
        {activeTab === "telemetry" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 rounded-3xl bg-carbon-950 border border-white/10 space-y-4">
              <h3 className="text-base font-heading font-bold text-white uppercase">Personal Lap Record Telemetry</h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-carbon-900 border border-white/5 flex justify-between">
                  <span className="text-carbon-400">Driver License ID:</span>
                  <span className="text-brand-red font-bold">24O-LIC-88219</span>
                </div>
                <div className="p-3.5 rounded-xl bg-carbon-900 border border-white/5 flex justify-between">
                  <span className="text-carbon-400">Personal Circuit Record:</span>
                  <span className="text-emerald-400 font-bold">31.890s (GT-X Electric)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-carbon-900 border border-white/5 flex justify-between">
                  <span className="text-carbon-400">Total Circuit Laps:</span>
                  <span className="text-white font-bold">42 Laps Completed</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* QR Ticket Modal */}
      {selectedPass && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn"
          onClick={() => setSelectedPass(null)}
        >
          <div
            className="relative max-w-sm w-full bg-carbon-950 border border-white/15 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-xs font-mono text-brand-red font-bold">{selectedPass.bookingCode}</span>
            <h4 className="text-xl font-display font-bold text-white uppercase">{selectedPass.experienceName}</h4>
            <p className="text-xs font-mono text-carbon-400">{selectedPass.date} • {selectedPass.timeSlot}</p>
            
            <div className="p-4 rounded-2xl bg-white text-black inline-block my-2">
              <QRCodeSVG
                value={selectedPass.qrData || selectedPass.qrCodeUrl || `24OURS-PASS:${selectedPass.bookingCode}`}
                size={140}
                bgColor="#FFFFFF"
                fgColor="#0A0A0A"
              />
            </div>


            <p className="text-[11px] font-mono text-carbon-400">Present this QR code upon arrival at the 24OURS pit lane.</p>

            <button
              onClick={() => setSelectedPass(null)}
              className="w-full py-2.5 rounded-xl bg-carbon-900 border border-white/10 text-white text-xs font-mono hover:border-brand-red"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

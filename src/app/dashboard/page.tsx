"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  Calendar,
  User as UserIcon,
  LogOut,
  Ticket,
  ShieldCheck,
  Mail,
  Phone,
  AtSign,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import { Booking } from "@/types";

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { allBookings, openBookingModal } = useBooking();

  const [selectedPass, setSelectedPass] = useState<Booking | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      window.location.replace("/login");
    }
  };

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen subtle-grid text-white selection:bg-brand-red selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* Navigation Breadcrumb / Return Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-carbon-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-brand-red" />
            <span>Return to Circuit / Homepage</span>
          </Link>
          <span className="text-[11px] font-mono text-carbon-500 uppercase tracking-widest">
            24OURS Driver Portal
          </span>
        </div>

        {/* User Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-carbon-950/95 border border-white/15 backdrop-blur-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-brand-red to-orange-600 flex items-center justify-center text-2xl sm:text-3xl font-display font-black text-white shadow-glow-red shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "DR"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight">
                  {user?.name || "Driver Account"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold tracking-wider">
                  {user?.role || "VIP Driver"}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-carbon-400 mt-1 flex flex-wrap items-center gap-2">
                {user?.username && (
                  <span className="text-carbon-300 font-semibold">@{user.username}</span>
                )}
                {user?.username && <span>•</span>}
                <span>{user?.email || "driver@24ours.com"}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openBookingModal()}
              className="px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book New Session</span>
            </button>
            
            {/* Prominent, Clearly Visible Logout Control */}
            <button
              id="dashboard-logout-btn"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="px-4 py-2.5 rounded-xl bg-carbon-900 border border-white/15 text-carbon-300 hover:text-white hover:border-brand-red hover:bg-brand-red/10 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
              title="Sign Out of 24OURS"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 text-brand-red animate-spin" />
                  <span>LOGGING OUT...</span>
                </>
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5 text-brand-red" />
                  <span>SIGN OUT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECTION 1: DIGITAL PASSES & TICKETS */}
        {/* =================================================================== */}
        <div id="section-passes" className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Ticket className="w-5 h-5 text-brand-red" />
                <span>Digital Passes & Booked Sessions</span>
              </h2>
              <p className="text-xs font-mono text-carbon-400 mt-0.5">
                Present your digital QR boarding passes upon arrival at the 24OURS pit lane check-in.
              </p>
            </div>
            <span className="text-xs font-mono text-carbon-400 bg-carbon-900 border border-white/10 px-3 py-1.5 rounded-xl">
              Active Passes: <strong className="text-white">{allBookings.length}</strong>
            </span>
          </div>

          {allBookings.length === 0 ? (
            <div className="p-10 sm:p-12 rounded-3xl bg-carbon-950/90 border border-white/10 text-center space-y-4 shadow-xl">
              <Ticket className="w-12 h-12 text-carbon-600 mx-auto" />
              <h3 className="text-base font-display font-bold text-white uppercase">No Session Passes Found</h3>
              <p className="text-xs text-carbon-400 max-w-md mx-auto font-sans leading-relaxed">
                You do not have any active reservations yet. Book your first high-speed electric karting, RC arena, or 360° dining experience.
              </p>
              <button
                onClick={() => openBookingModal()}
                className="px-6 py-2.5 rounded-xl bg-brand-red text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red inline-flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Experience Now</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-6 rounded-3xl bg-carbon-950 border border-white/10 glass-panel-hover flex flex-col justify-between space-y-4 shadow-card-elevated"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-xs font-mono text-brand-red font-bold tracking-wider">{bk.bookingCode}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                        ● {bk.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-display font-bold text-white">{bk.experienceName}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-mono text-carbon-300">
                      <div>
                        <span className="text-carbon-500 text-[10px] block uppercase">Session Date</span>
                        <span className="text-white font-semibold">{bk.date}</span>
                      </div>
                      <div>
                        <span className="text-carbon-500 text-[10px] block uppercase">Time Slot</span>
                        <span className="text-brand-red font-semibold">{bk.timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-carbon-500 text-[10px] block uppercase">Guests</span>
                        <span className="text-white">{bk.guests} {bk.guests > 1 ? "Guests" : "Guest"}</span>
                      </div>
                      <div>
                        <span className="text-carbon-500 text-[10px] block uppercase">Driver / Customer</span>
                        <span className="text-white truncate">{bk.customerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <button
                      onClick={() => setSelectedPass(bk)}
                      className="w-full py-2.5 rounded-xl bg-carbon-900 border border-white/10 text-xs font-mono text-white hover:border-brand-red hover:bg-brand-red/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Ticket className="w-3.5 h-3.5 text-brand-red" />
                      <span>View QR Boarding Pass</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* SECTION 2: DRIVER CREDENTIALS & SECURITY */}
        {/* =================================================================== */}
        <div id="section-profile" className="space-y-4 pt-4">
          <div className="border-b border-white/10 pb-3">
            <h2 className="text-lg sm:text-xl font-display font-black text-white uppercase tracking-wider flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-brand-red" />
              <span>Driver Credentials & Account Security</span>
            </h2>
            <p className="text-xs font-mono text-carbon-400 mt-0.5">
              Verified account details and secure session management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Info */}
            <div className="p-7 rounded-3xl bg-carbon-950 border border-white/10 space-y-4">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                Personal Credentials
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between p-3 rounded-xl bg-carbon-900 border border-white/5">
                  <span className="text-carbon-400 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-carbon-500" />
                    <span>Full Name:</span>
                  </span>
                  <span className="text-white font-bold">{user?.name || "Driver Account"}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-carbon-900 border border-white/5">
                  <span className="text-carbon-400 flex items-center gap-2">
                    <AtSign className="w-4 h-4 text-carbon-500" />
                    <span>Username:</span>
                  </span>
                  <span className="text-white font-bold">{user?.username ? `@${user.username}` : "—"}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-carbon-900 border border-white/5">
                  <span className="text-carbon-400 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-carbon-500" />
                    <span>Email:</span>
                  </span>
                  <span className="text-white font-bold">{user?.email || "driver@24ours.com"}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-carbon-900 border border-white/5">
                  <span className="text-carbon-400 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-carbon-500" />
                    <span>Phone:</span>
                  </span>
                  <span className="text-white font-bold">{user?.phone || "—"}</span>
                </div>
              </div>
            </div>

            {/* Session Security */}
            <div className="p-7 rounded-3xl bg-carbon-950 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
                  Session & Authentication Status
                </h3>
                <div className="p-4 rounded-2xl bg-carbon-900 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Encrypted HTTP-Only Session Active</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-carbon-400">
                    Your session token is cryptographically signed and stored in a secure HTTP-Only cookie protected from client-side script injection.
                  </p>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full py-3 rounded-xl bg-red-950/80 border border-brand-red/60 text-red-200 hover:bg-brand-red hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>LOGGING OUT...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span>SIGN OUT OF ACCOUNT</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

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
            <span className="text-xs font-mono text-brand-red font-bold tracking-wider">{selectedPass.bookingCode}</span>
            <h4 className="text-xl font-display font-bold text-white uppercase">{selectedPass.experienceName}</h4>
            <p className="text-xs font-mono text-carbon-400">{selectedPass.date} • {selectedPass.timeSlot}</p>
            
            <div className="p-4 rounded-2xl bg-white text-black inline-block my-2 shadow-glow-white">
              <QRCodeSVG
                value={selectedPass.qrData || selectedPass.qrCodeUrl || `24OURS-PASS:${selectedPass.bookingCode}`}
                size={140}
                bgColor="#FFFFFF"
                fgColor="#0A0A0A"
              />
            </div>

            <p className="text-[11px] font-mono text-carbon-400">
              Present this QR code upon arrival at the 24OURS pit lane check-in.
            </p>

            <button
              onClick={() => setSelectedPass(null)}
              className="w-full py-2.5 rounded-xl bg-carbon-900 border border-white/10 text-white text-xs font-mono hover:border-brand-red transition-all cursor-pointer"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

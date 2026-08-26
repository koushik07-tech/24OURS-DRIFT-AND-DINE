"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, XCircle, ShieldCheck, Clock, Calendar, Users, MapPin, Flag, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PassVerificationPage() {
  const params = useParams();
  const bookingCode = params?.bookingCode as string;

  const [loading, setLoading] = useState(true);
  const [passData, setPassData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyPass() {
      if (!bookingCode) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/verify/${encodeURIComponent(bookingCode)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setPassData(json.data);
        } else {
          setError(json.error?.message || "Invalid or unverified boarding pass code.");
        }
      } catch {
        setError("Network error while validating pass credentials.");
      } finally {
        setLoading(false);
      }
    }

    verifyPass();
  }, [bookingCode]);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 subtle-grid flex items-center justify-center text-white">
      <div className="max-w-xl w-full bg-carbon-950 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-left">
        
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-brand-red" />
            <span className="font-display font-bold text-sm tracking-wider uppercase text-white">
              24OURS Pit-Lane Access Kiosk
            </span>
          </div>
          <span className="text-[10px] font-mono text-carbon-400 uppercase">
            Official Ticket Validation
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3 font-mono">
            <Loader2 className="w-8 h-8 text-brand-red animate-spin mx-auto" />
            <p className="text-xs text-carbon-400">Verifying cryptographically signed pass...</p>
          </div>
        ) : error || !passData ? (
          <div className="py-8 text-center space-y-4 font-mono animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-red-950/80 border border-brand-red/60 flex items-center justify-center mx-auto text-brand-red">
              <XCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white uppercase">Pass Verification Failed</h2>
              <p className="text-xs text-red-300 max-w-sm mx-auto">{error || "Invalid ticket identifier."}</p>
            </div>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-block px-5 py-2 rounded-xl bg-carbon-900 border border-white/10 text-xs font-mono text-white hover:border-brand-red transition-all"
              >
                Back to 24OURS Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Status Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 font-mono text-xs ${
                passData.isValidPass
                  ? "bg-emerald-950/50 border-emerald-500/50 text-emerald-300"
                  : "bg-red-950/50 border-red-500/50 text-red-300"
              }`}
            >
              {passData.isValidPass ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-brand-red shrink-0" />
              )}
              <div>
                <p className="font-bold text-sm tracking-wide">
                  {passData.statusDescription}
                </p>
                <p className="text-[11px] opacity-80">
                  {passData.isValidPass
                    ? "Passholder verified and authorized for entry."
                    : "Pass is not authorized for entry. Please check with concierge desk."}
                </p>
              </div>
            </div>

            {/* Pass Details Card */}
            <div className="p-6 rounded-2xl bg-carbon-900 border border-white/10 space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-carbon-400 uppercase text-[10px]">Booking Code</span>
                <span className="text-base font-black text-brand-red">{passData.bookingCode}</span>
              </div>

              <div className="space-y-3 text-carbon-300">
                <div className="flex items-center justify-between">
                  <span className="text-carbon-400">Experience</span>
                  <span className="text-white font-bold">{passData.experienceName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-carbon-400">Date of Visit</span>
                  <span className="text-white font-bold">
                    {new Date(passData.date).toLocaleDateString("en-IN", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-carbon-400">Time Slot</span>
                  <span className="text-brand-red font-bold">{passData.timeSlot}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-carbon-400">Authorized Guests</span>
                  <span className="text-white font-bold">{passData.guestCount} Drivers / Guests</span>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="text-carbon-400">Payment Status</span>
                  <span className={`font-bold ${passData.paymentStatus === "SUCCESS" ? "text-emerald-400" : "text-amber-400"}`}>
                    {passData.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Guarantee */}
            <div className="p-4 rounded-xl bg-carbon-950 border border-white/10 flex items-start gap-2.5 font-mono text-[11px] text-carbon-400">
              <MapPin className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
              <span>{passData.location}</span>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-xs font-mono text-carbon-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                ← Return to 24OURS Platform
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

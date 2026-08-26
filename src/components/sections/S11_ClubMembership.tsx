"use client";

import React, { useState } from "react";
import { Award, ShieldCheck, CheckCircle2, Lock, Unlock, CreditCard, Sparkles, Gift, ArrowRight, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";

export default function S11_ClubMembership() {
  const { isAuthenticated, user } = useAuth();
  const { openBookingModal, openEnquiryModal } = useBooking();

  // Interactive dual criteria demo sliders / trackers
  const [demoVisits, setDemoVisits] = useState(2);
  const [demoLaps, setDemoLaps] = useState(24);
  const [applied, setApplied] = useState(false);

  const targetVisits = 3;
  const targetLaps = 30;

  const visitsProgress = Math.min(100, Math.round((demoVisits / targetVisits) * 100));
  const lapsProgress = Math.min(100, Math.round((demoLaps / targetLaps) * 100));

  const isEligible = demoVisits >= targetVisits && demoLaps >= targetLaps;

  const memberBenefits = [
    { title: "Priority Paddock Booking", desc: "Skip the regular queue with express pit lane access and reserved table priority at 360° sky dining." },
    { title: "Exclusive Numbered Daily Coupons", desc: "Guaranteed access to rollover daily discount coupons (1–250 pool) across racing heats and banquet services." },
    { title: "VIP Invitation to Closed-Door Cups", desc: "Complimentary entry into private endurance championships, product reveals, and celebrity driver meets." },
    { title: "Permanent Driver Telemetry Archive", desc: "Lifetime cloud backup of all telemetry data, lap-by-lap split times, and personal racing statistics." },
  ];

  return (
    <section id="club" className="py-24 sm:py-32 bg-carbon-950 border-b border-white/10 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] bg-brand-red/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
                <Award className="w-3.5 h-3.5" />
                Earned Membership Tier
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                100% Non-Alcoholic Club Experience
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              JOIN THE <span className="text-brand-red">24OURS CLUB.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              24Ours Club is a strictly <strong>non-alcoholic restaurant & club experience</strong> — alcohol-free by design, established as a family- and community-safe space. Membership is <strong>earned, not purchased</strong>.
            </p>
          </div>
        </div>

        {/* Dual Criteria Box & Interactive Gauge */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* Left Column: Interactive Dual Criteria Tracker */}
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-3xl bg-carbon-900 border border-white/15 space-y-8 shadow-card-elevated">
            <div className="space-y-2">
              <span className="text-xs font-mono text-brand-red font-bold uppercase tracking-wider">
                Compulsory Dual-Requirement Verification
              </span>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase">
                MEMBERSHIP ELIGIBILITY TRACKER
              </h3>
              <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                Both criteria are required together. Meeting only one condition does not qualify a customer. Track your current visits and cumulative racing laps below:
              </p>
            </div>

            {/* Criteria 1: Visits Tracker */}
            <div className="space-y-3 p-5 rounded-2xl bg-carbon-950 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${demoVisits >= targetVisits ? "bg-emerald-500 text-black" : "bg-carbon-800 text-carbon-400"}`}>
                    {demoVisits >= targetVisits ? "✓" : "1"}
                  </span>
                  <span className="text-xs font-mono text-white font-bold uppercase">
                    Condition 1: Minimum 3 Facility Visits
                  </span>
                </div>
                <span className="text-xs font-mono text-brand-red font-bold">
                  {demoVisits} / {targetVisits} Visits ({visitsProgress}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-carbon-850 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${visitsProgress === 100 ? "bg-emerald-400 shadow-glow-emerald" : "bg-brand-red"}`}
                  style={{ width: `${visitsProgress}%` }}
                />
              </div>

              {/* Interactive Test Slider */}
              <div className="flex items-center justify-between text-[11px] font-mono text-carbon-500 pt-1">
                <span>Simulate Visits:</span>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setDemoVisits(v)}
                      className={`px-2 py-0.5 rounded text-[10px] ${demoVisits === v ? "bg-brand-red text-white font-bold" : "bg-carbon-900 text-carbon-400"}`}
                    >
                      {v} Visit{v > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Criteria 2: Laps Tracker */}
            <div className="space-y-3 p-5 rounded-2xl bg-carbon-950 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${demoLaps >= targetLaps ? "bg-emerald-500 text-black" : "bg-carbon-800 text-carbon-400"}`}>
                    {demoLaps >= targetLaps ? "✓" : "2"}
                  </span>
                  <span className="text-xs font-mono text-white font-bold uppercase">
                    Condition 2: Minimum 30 Cumulative Laps
                  </span>
                </div>
                <span className="text-xs font-mono text-brand-red font-bold">
                  {demoLaps} / {targetLaps} Laps ({lapsProgress}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-carbon-850 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${lapsProgress === 100 ? "bg-emerald-400 shadow-glow-emerald" : "bg-brand-red"}`}
                  style={{ width: `${lapsProgress}%` }}
                />
              </div>

              {/* Interactive Test Slider */}
              <div className="flex items-center justify-between text-[11px] font-mono text-carbon-500 pt-1">
                <span>Simulate Laps:</span>
                <div className="flex gap-1.5">
                  {[10, 20, 30, 45].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setDemoLaps(l)}
                      className={`px-2 py-0.5 rounded text-[10px] ${demoLaps === l ? "bg-brand-red text-white font-bold" : "bg-carbon-900 text-carbon-400"}`}
                    >
                      {l} Laps
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Unlock Status / Application Button */}
            <div className="pt-2">
              {isEligible ? (
                <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase">
                    <Unlock className="w-4 h-4" />
                    <span>Dual Criteria Complete • Eligible to Join!</span>
                  </div>
                  <p className="text-xs text-carbon-300 font-sans">
                    Congratulations! You have completed the mandatory 3 visits and 30 laps requirement.
                  </p>
                  {applied ? (
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold text-center">
                      ✓ APPLICATION SUBMITTED FOR AUDIT & DIGITAL CARD ISSUANCE
                    </div>
                  ) : (
                    <button
                      onClick={() => setApplied(true)}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>APPLY FOR OFFICIAL 24OURS CLUB CARD</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-carbon-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-carbon-500 shrink-0" />
                    <span className="text-xs font-mono text-carbon-400">
                      Need {Math.max(0, targetVisits - demoVisits)} more visit{targetVisits - demoVisits === 1 ? "" : "s"} & {Math.max(0, targetLaps - demoLaps)} more lap{targetLaps - demoLaps === 1 ? "" : "s"} to unlock card eligibility.
                    </span>
                  </div>
                  <button
                    onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
                    className="px-5 py-2.5 rounded-xl bg-brand-red text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-brand-redDark shrink-0 shadow-glow-red"
                  >
                    BOOK SESSION LAPS
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Luxury Club Card Visual Mockup & Perks */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Holographic Carbon Club Card Mockup */}
            <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-carbon-850 via-carbon-900 to-black border border-white/20 shadow-2xl space-y-8 relative overflow-hidden group">
              {/* Metallic shine overlay */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-white/10 via-transparent to-transparent rounded-full pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-white font-display font-black text-sm shadow-glow-red">
                    24
                  </div>
                  <span className="font-display font-black text-sm tracking-tight text-white">24OURS CLUB</span>
                </div>
                <span className="px-3 py-1 rounded-full text-[9px] font-mono font-bold uppercase bg-brand-red/30 text-brand-red border border-brand-red/50">
                  BLACK PASS TIER
                </span>
              </div>

              <div className="space-y-1 py-4">
                <p className="text-[10px] font-mono text-carbon-400 uppercase tracking-widest">Driver Member</p>
                <p className="text-lg font-mono font-bold text-white tracking-wider">
                  {isAuthenticated ? user?.name?.toUpperCase() : "VERIFIED CIRCUIT RACER"}
                </p>
                <p className="text-xs font-mono text-carbon-500">CARD ID: 24O-CLUB-0892-KA</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[10px] font-mono text-carbon-400">
                <span>NON-ALCOHOLIC RESTAURANT & CLUB</span>
                <span className="text-emerald-400 font-bold">● DUAL AUDIT VERIFIED</span>
              </div>
            </div>

            {/* Perks List */}
            <div className="space-y-2.5">
              {memberBenefits.map((b, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-carbon-900/80 border border-white/5 space-y-0.5 text-left">
                  <h4 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-carbon-400 font-sans pl-5.5 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

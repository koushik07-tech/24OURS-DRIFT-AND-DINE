"use client";

import React, { useState } from "react";
import { Trophy, Medal, Flag, Zap, Clock, Calendar, ChevronRight, Award, Flame } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S10_Leaderboard() {
  const { openBookingModal } = useBooking();
  const [activeTab, setActiveTab] = useState<"karting" | "rc">("karting");

  const kartEntries = mediaConfig.leaderboard;
  const rcEntries = mediaConfig.rcLeaderboard;

  const top3Kart = kartEntries.slice(0, 3);
  const remainingKart = kartEntries.slice(3);

  return (
    <section id="leaderboard" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase font-bold flex items-center gap-1.5 w-fit">
                <Trophy className="w-3.5 h-3.5" />
                Public Telemetry & Hall of Fame
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold">
                Weekly Reset • Top 30 Free Karting
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              CIRCUIT <span className="text-brand-red">LEADERBOARD.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              Real-time RFID transponder lap times recorded on our FIA-calibrated timing loop. Top 30 drivers every week earn complimentary race heats!
            </p>
          </div>

          {/* Toggle Tab */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-carbon-950 border border-white/10 self-start lg:self-auto">
            <button
              onClick={() => setActiveTab("karting")}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-bold transition-all ${
                activeTab === "karting"
                  ? "bg-brand-red text-white shadow-glow-red"
                  : "text-carbon-400 hover:text-white"
              }`}
            >
              Electric Karting
            </button>
            <button
              onClick={() => setActiveTab("rc")}
              className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-bold transition-all ${
                activeTab === "rc"
                  ? "bg-brand-red text-white shadow-glow-red"
                  : "text-carbon-400 hover:text-white"
              }`}
            >
              RC Racing
            </button>
          </div>
        </div>

        {/* Podium Presentation for Top 3 */}
        {activeTab === "karting" && top3Kart.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
            
            {/* P2: Silver Podium */}
            <div className="order-2 md:order-1 p-6 sm:p-8 rounded-3xl bg-carbon-950 border border-slate-400/40 space-y-4 text-center relative shadow-lg">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-300/20 text-slate-200 flex items-center justify-center font-display font-black text-xl border border-slate-300/40">
                2
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">P2 • SILVER TROPHY</span>
                <h3 className="text-xl font-display font-bold text-white uppercase">{top3Kart[1].driver}</h3>
                <p className="text-xs font-mono text-brand-red font-bold text-lg mt-1">{top3Kart[1].lapTime}</p>
                <p className="text-[11px] font-mono text-carbon-400">{top3Kart[1].kart}</p>
              </div>
            </div>

            {/* P1: Gold Podium (Elevated) */}
            <div className="order-1 md:order-2 p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-carbon-900 to-carbon-950 border border-amber-400 space-y-4 text-center relative shadow-glow-amber md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-black text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-1 shadow-md">
                <Flame className="w-3 h-3 text-red-600" />
                CIRCUIT RECORD HOLDER
              </div>
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-display font-black text-2xl border border-amber-400">
                1
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">P1 • CHAMPION GOLD</span>
                <h3 className="text-2xl font-display font-black text-white uppercase">{top3Kart[0].driver}</h3>
                <p className="text-2xl font-mono text-amber-400 font-black mt-1">{top3Kart[0].lapTime}</p>
                <p className="text-xs font-mono text-carbon-300">{top3Kart[0].kart}</p>
              </div>
            </div>

            {/* P3: Bronze Podium */}
            <div className="order-3 md:order-3 p-6 sm:p-8 rounded-3xl bg-carbon-950 border border-amber-700/40 space-y-4 text-center relative shadow-lg">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-700/20 text-amber-500 flex items-center justify-center font-display font-black text-xl border border-amber-700/40">
                3
              </div>
              <div>
                <span className="text-[10px] font-mono text-amber-600 uppercase">P3 • BRONZE TROPHY</span>
                <h3 className="text-xl font-display font-bold text-white uppercase">{top3Kart[2].driver}</h3>
                <p className="text-xs font-mono text-brand-red font-bold text-lg mt-1">{top3Kart[2].lapTime}</p>
                <p className="text-[11px] font-mono text-carbon-400">{top3Kart[2].kart}</p>
              </div>
            </div>

          </div>
        )}

        {/* Detailed Table for Remaining Standings */}
        <div className="p-6 sm:p-8 rounded-3xl bg-carbon-950 border border-white/10 text-left">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {activeTab === "karting" ? "Top 30 Circuit Leaderboard Standings" : "RC Championship Official Standings"}
            </span>
            <span className="text-xs font-mono text-carbon-400">Resets Every Monday 04:00 AM</span>
          </div>

          <div className="space-y-2">
            {activeTab === "karting" ? (
              remainingKart.map((entry) => (
                <div
                  key={entry.rank}
                  className="p-3.5 rounded-2xl bg-carbon-900 border border-white/5 flex items-center justify-between font-mono text-xs hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-carbon-950 text-carbon-300 font-bold flex items-center justify-center">
                      #{entry.rank}
                    </span>
                    <div>
                      <p className="text-white font-bold">{entry.driver}</p>
                      <p className="text-[10px] text-carbon-500">{entry.kart}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-red font-bold">{entry.lapTime}</p>
                    <p className="text-[10px] text-carbon-500">{entry.gap}</p>
                  </div>
                </div>
              ))
            ) : (
              rcEntries.map((entry) => (
                <div
                  key={entry.rank}
                  className="p-3.5 rounded-2xl bg-carbon-900 border border-white/5 flex items-center justify-between font-mono text-xs hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-carbon-950 text-brand-red font-bold flex items-center justify-center">
                      #{entry.rank}
                    </span>
                    <div>
                      <p className="text-white font-bold">{entry.racer}</p>
                      <p className="text-[10px] text-carbon-500">{entry.car}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-red font-bold">{entry.lapTime}</p>
                    <p className="text-[10px] text-carbon-500">{entry.points} Pts</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action CTA */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-mono text-carbon-400">
              Want to set your official lap record on the digital leaderboard?
            </span>
            <button
              onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
              className="px-6 py-3 rounded-xl bg-brand-red text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red"
            >
              ENTER CIRCUIT & SET YOUR TIME
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

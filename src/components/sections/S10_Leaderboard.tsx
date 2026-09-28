"use client";

import React, { useState, useEffect } from "react";
import { Trophy, Medal, Flag, Zap, Clock, Calendar, ChevronRight, Award, Flame, Activity, ShieldCheck } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";
import Card3D from "@/components/ui/Card3D";
import MagneticButton from "@/components/ui/MagneticButton";
import MotionReveal from "@/components/ui/MotionReveal";

export default function S10_Leaderboard() {
  const { openBookingModal } = useBooking();
  const [activeTab, setActiveTab] = useState<"karting" | "rc">("karting");
  const [liveP1Time, setLiveP1Time] = useState("0:55.720");

  const kartEntries = mediaConfig.leaderboard;
  const rcEntries = mediaConfig.rcLeaderboard;

  const top3Kart = kartEntries.slice(0, 3);
  const remainingKart = kartEntries.slice(3);

  // Micro-telemetry subtle fluctuation to feel alive
  useEffect(() => {
    const timer = setInterval(() => {
      const ms = Math.floor(Math.random() * 20) + 710;
      setLiveP1Time(`0:55.${ms}`);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="leaderboard" className="py-24 sm:py-32 bg-[#060608] border-b border-white/10 relative overflow-hidden">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[500px] bg-brand-crimson/15 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[400px] bg-amber-500/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <MotionReveal direction="left" className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-[0_0_15px_rgba(245,158,11,0.25)]">
                <Trophy className="w-3.5 h-3.5" />
                Public Telemetry & Hall of Fame
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 uppercase font-bold shadow-[0_0_15px_rgba(255,46,0,0.25)]">
                Weekly Reset • Top 30 Free Karting
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              CIRCUIT <span className="text-brand-crimson font-orbitron text-glow-red">LEADERBOARD.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              Real-time RFID transponder lap times recorded on our FIA-calibrated timing loop. Top 30 drivers every week earn complimentary race heats!
            </p>
          </MotionReveal>

          {/* High-Tech Tab Switcher with Neon Indicator */}
          <MotionReveal direction="right" className="flex items-center gap-2 p-1.5 rounded-full bg-carbon-950 border border-white/10 self-start lg:self-auto backdrop-blur-xl">
            <button
              onClick={() => setActiveTab("karting")}
              className={`px-5 py-2 rounded-full font-mono text-xs uppercase font-bold transition-all ${
                activeTab === "karting"
                  ? "bg-gradient-to-r from-brand-crimson to-red-600 text-white shadow-[0_0_20px_rgba(255,46,0,0.6)]"
                  : "text-carbon-400 hover:text-white"
              }`}
            >
              Electric Karting
            </button>
            <button
              onClick={() => setActiveTab("rc")}
              className={`px-5 py-2 rounded-full font-mono text-xs uppercase font-bold transition-all ${
                activeTab === "rc"
                  ? "bg-gradient-to-r from-brand-crimson to-red-600 text-white shadow-[0_0_20px_rgba(255,46,0,0.6)]"
                  : "text-carbon-400 hover:text-white"
              }`}
            >
              RC Racing
            </button>
          </MotionReveal>
        </div>

        {/* 3D Perspective Podium Presentation for Top 3 */}
        {activeTab === "karting" && top3Kart.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 perspective-1200">
            
            {/* P2: Silver Podium */}
            <MotionReveal delay={0.1} direction="up" className="order-2 md:order-1">
              <Card3D depth={22} className="bg-carbon-950/80 border border-slate-400/40 backdrop-blur-xl">
                <div className="p-6 sm:p-8 space-y-4 text-center relative h-full">
                  <div className="w-12 h-12 mx-auto rounded-full bg-slate-300/20 text-slate-200 flex items-center justify-center font-display font-black text-xl border border-slate-300/40 shadow-[0_0_20px_rgba(203,213,225,0.3)]">
                    2
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                      P2 • SILVER TROPHY
                    </span>
                    <h3 className="text-xl font-display font-bold text-white uppercase mt-1">
                      {top3Kart[1].driver}
                    </h3>
                    <p className="text-xl font-mono text-brand-crimson font-black mt-1">
                      {top3Kart[1].lapTime}
                    </p>
                    <p className="text-[11px] font-mono text-carbon-400">{top3Kart[1].kart}</p>
                  </div>

                  {/* Segmented Speed Metric */}
                  <div className="grid grid-cols-7 gap-1 pt-3 border-t border-white/5">
                    {Array.from({ length: 7 }).map((_, barIdx) => (
                      <div
                        key={barIdx}
                        className={`h-1.5 rounded-sm ${
                          barIdx < 6 ? "bg-slate-300 shadow-[0_0_6px_rgba(255,255,255,0.7)]" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card3D>
            </MotionReveal>

            {/* P1: Champion Gold Podium (Elevated) */}
            <MotionReveal delay={0} direction="up" className="order-1 md:order-2 md:-translate-y-4">
              <Card3D depth={28} className="bg-gradient-to-b from-carbon-900/90 to-carbon-950/95 border border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.35)] backdrop-blur-2xl">
                <div className="p-8 sm:p-10 space-y-4 text-center relative h-full">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-mono font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                    <Flame className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                    CIRCUIT RECORD HOLDER
                  </div>

                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/25 text-amber-300 flex items-center justify-center font-display font-black text-2xl border border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
                    1
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-black tracking-widest">
                      P1 • CHAMPION GOLD
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase mt-1">
                      {top3Kart[0].driver}
                    </h3>
                    <p className="text-2xl sm:text-3xl font-mono text-amber-400 font-black mt-1 tracking-tight text-glow-white">
                      {liveP1Time}
                    </p>
                    <p className="text-xs font-mono text-carbon-300 mt-0.5">{top3Kart[0].kart}</p>
                  </div>

                  {/* Segmented Speed Metric Gold */}
                  <div className="grid grid-cols-8 gap-1 pt-3 border-t border-white/10">
                    {Array.from({ length: 8 }).map((_, barIdx) => (
                      <div
                        key={barIdx}
                        className="h-1.5 rounded-sm bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]"
                      />
                    ))}
                  </div>
                </div>
              </Card3D>
            </MotionReveal>

            {/* P3: Bronze Podium */}
            <MotionReveal delay={0.2} direction="up" className="order-3 md:order-3">
              <Card3D depth={22} className="bg-carbon-950/80 border border-amber-700/40 backdrop-blur-xl">
                <div className="p-6 sm:p-8 space-y-4 text-center relative h-full">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-700/20 text-amber-500 flex items-center justify-center font-display font-black text-xl border border-amber-700/40 shadow-[0_0_20px_rgba(180,83,9,0.3)]">
                    3
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-600 uppercase tracking-widest font-bold">
                      P3 • BRONZE TROPHY
                    </span>
                    <h3 className="text-xl font-display font-bold text-white uppercase mt-1">
                      {top3Kart[2].driver}
                    </h3>
                    <p className="text-xl font-mono text-brand-crimson font-black mt-1">
                      {top3Kart[2].lapTime}
                    </p>
                    <p className="text-[11px] font-mono text-carbon-400">{top3Kart[2].kart}</p>
                  </div>

                  {/* Segmented Speed Metric Bronze */}
                  <div className="grid grid-cols-7 gap-1 pt-3 border-t border-white/5">
                    {Array.from({ length: 7 }).map((_, barIdx) => (
                      <div
                        key={barIdx}
                        className={`h-1.5 rounded-sm ${
                          barIdx < 5 ? "bg-amber-600 shadow-[0_0_6px_rgba(217,119,6,0.7)]" : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card3D>
            </MotionReveal>

          </div>
        )}

        {/* Detailed High-Tech Table for Remaining Standings */}
        <MotionReveal direction="up" className="p-6 sm:p-8 rounded-3xl bg-carbon-950/90 border border-white/15 backdrop-blur-2xl text-left shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-brand-crimson" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                {activeTab === "karting" ? "Top 30 Circuit Leaderboard Standings" : "RC Championship Official Standings"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-carbon-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Resets Every Monday 04:00 AM</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {activeTab === "karting" ? (
              remainingKart.map((entry) => (
                <div
                  key={entry.rank}
                  className="p-3.5 rounded-2xl bg-carbon-900/70 border border-white/5 flex items-center justify-between font-mono text-xs hover:border-brand-crimson/40 hover:bg-carbon-900 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-carbon-950 text-carbon-300 font-bold flex items-center justify-center border border-white/5 group-hover:border-brand-crimson/30 group-hover:text-brand-crimson transition-colors">
                      #{entry.rank}
                    </span>
                    <div>
                      <p className="text-white font-bold group-hover:text-brand-crimson transition-colors">{entry.driver}</p>
                      <p className="text-[10px] text-carbon-500">{entry.kart}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-crimson font-bold">{entry.lapTime}</p>
                    <p className="text-[10px] text-carbon-500">{entry.gap}</p>
                  </div>
                </div>
              ))
            ) : (
              rcEntries.map((entry) => (
                <div
                  key={entry.rank}
                  className="p-3.5 rounded-2xl bg-carbon-900/70 border border-white/5 flex items-center justify-between font-mono text-xs hover:border-brand-crimson/40 hover:bg-carbon-900 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-carbon-950 text-brand-crimson font-bold flex items-center justify-center border border-white/5">
                      #{entry.rank}
                    </span>
                    <div>
                      <p className="text-white font-bold group-hover:text-brand-crimson transition-colors">{entry.racer}</p>
                      <p className="text-[10px] text-carbon-500">{entry.car}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-crimson font-bold">{entry.lapTime}</p>
                    <p className="text-[10px] text-carbon-500">{entry.points} Pts</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action CTA */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-carbon-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Want to set your official lap record on the digital leaderboard?</span>
            </div>
            <MagneticButton
              variant="primary"
              onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
              className="px-6 py-3 text-xs w-full sm:w-auto"
            >
              <span>ENTER CIRCUIT & SET YOUR TIME</span>
            </MagneticButton>
          </div>
        </MotionReveal>

      </div>
    </section>
  );
}

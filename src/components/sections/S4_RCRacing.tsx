"use client";

import React from "react";
import { Radio, Trophy, Zap, Calendar, ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";
import Card3D from "@/components/ui/Card3D";
import MagneticButton from "@/components/ui/MagneticButton";
import MotionReveal from "@/components/ui/MotionReveal";

export default function S4_RCRacing() {
  const { openBookingModal } = useBooking();

  const raceFormats = [
    {
      title: "Time Attack Sprint",
      duration: "15 Mins",
      desc: "Single driver telemetry run on the banked raceway against the digital lap clock.",
      telemetry: "PRO SPEED",
      frequency: "2.4 GHz",
    },
    {
      title: "Multi-Driver Grand Prix",
      duration: "30 Mins",
      desc: "Up to 8 drivers on the grid battling with proportional 2.4GHz controllers.",
      telemetry: "8 CAR GRID",
      frequency: "BRUSHLESS",
    },
    {
      title: "Night Glow Cup",
      duration: "20 Mins",
      desc: "Under-glow illuminated scale buggies racing on a darkened stadium neon circuit.",
      telemetry: "NEON TRACK",
      frequency: "NIGHT VIS",
    },
  ];

  return (
    <section id="rc-racing" className="py-24 sm:py-32 bg-[#060608] border-b border-white/10 subtle-grid relative overflow-hidden">
      {/* Ambient Crimson Glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[450px] bg-brand-crimson/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <MotionReveal direction="left" className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-[0_0_15px_rgba(255,46,0,0.35)]">
              <Radio className="w-3.5 h-3.5" />
              Scale 1:8 & 1:10 Arena
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              RC RACING <span className="text-brand-crimson font-orbitron text-glow-red">ARENA.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
              Experience the thrill of high-torque brushless scale racing across multi-surface chicanes and elevated crossover ramps.
            </p>
          </MotionReveal>

          <MotionReveal direction="right">
            <MagneticButton
              variant="primary"
              onClick={() => openBookingModal("Scale 1:8 RC Racing Arena")}
              className="px-6 py-3.5 text-xs self-start lg:self-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK RC ARENA SESSION</span>
            </MagneticButton>
          </MotionReveal>
        </div>

        {/* Formats in 3D Perspective Stacks & RC Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Tournament Formats in 3D Perspective Card Stack */}
          <div className="lg:col-span-7 space-y-4 text-left perspective-1200">
            {raceFormats.map((fmt, idx) => (
              <MotionReveal key={idx} delay={idx * 0.12} direction="up">
                <Card3D depth={18} className="bg-carbon-900/60 border border-white/10 backdrop-blur-xl">
                  <div className="p-6 rounded-3xl space-y-2 h-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono text-brand-crimson uppercase font-bold bg-carbon-950 px-2.5 py-0.5 rounded border border-brand-crimson/30">
                          {fmt.telemetry}
                        </span>
                        <span className="text-[10px] font-mono text-carbon-500 uppercase">{fmt.frequency}</span>
                      </div>
                      <span className="text-xs font-mono text-brand-crimson font-bold bg-brand-crimson/15 px-3 py-1 rounded-full border border-brand-crimson/30">
                        {fmt.duration}
                      </span>
                    </div>

                    <h4 className="text-lg font-display font-bold text-white uppercase pt-1">{fmt.title}</h4>
                    <p className="text-xs text-carbon-300 font-sans leading-relaxed">{fmt.desc}</p>

                    {/* Segmented Frequency Indicator */}
                    <div className="grid grid-cols-12 gap-1 pt-2">
                      {Array.from({ length: 12 }).map((_, barIdx) => (
                        <div
                          key={barIdx}
                          className={`h-1 rounded-sm ${
                            barIdx < 9
                              ? "bg-brand-crimson/80 shadow-[0_0_6px_rgba(255,46,0,0.6)]"
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </Card3D>
              </MotionReveal>
            ))}
          </div>

          {/* Right: High-Tech RC Leaderboard HUD Card */}
          <MotionReveal direction="left" className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-carbon-950/90 border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-crimson/20 border border-brand-crimson/40 flex items-center justify-center text-brand-crimson shadow-[0_0_15px_rgba(255,46,0,0.3)]">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider block">
                      RC Championship Standings
                    </span>
                    <span className="text-[10px] font-mono text-carbon-500 uppercase">Season Heat 04 Live</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-crimson/20 border border-brand-crimson/40">
                  <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
                  <span className="text-[10px] font-mono text-brand-crimson font-bold uppercase">LIVE</span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {mediaConfig.rcLeaderboard.map((entry, idx) => (
                  <div
                    key={entry.rank}
                    className="p-3.5 rounded-2xl bg-carbon-900/80 border border-white/5 hover:border-brand-crimson/30 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg font-bold flex items-center justify-center text-[11px] ${
                        idx === 0
                          ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                          : "bg-carbon-800 text-brand-crimson"
                      }`}>
                        {entry.rank}
                      </span>
                      <div>
                        <p className="text-white font-semibold">{entry.racer}</p>
                        <p className="text-[10px] text-carbon-400">{entry.car}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{entry.lapTime}</p>
                      <p className="text-[10px] text-brand-crimson font-bold">{entry.points} PTS</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Segmented signal strength */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-carbon-400">
                <span>TELEMETRY STREAM</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> 99.8% ACCURACY
                </span>
              </div>
            </div>
          </MotionReveal>

        </div>

      </div>
    </section>
  );
}

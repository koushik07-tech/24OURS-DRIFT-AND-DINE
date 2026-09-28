"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Flag, Trophy, Zap, ShieldCheck, ArrowRight, Calendar, Activity, Timer, Gauge } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";
import KartFallback from "../3d/KartFallback";
import Card3D from "@/components/ui/Card3D";
import MagneticButton from "@/components/ui/MagneticButton";
import MotionReveal from "@/components/ui/MotionReveal";

const KartCanvas = dynamic(() => import("../3d/KartCanvas"), {
  ssr: false,
  loading: () => <KartFallback />,
});

export default function S3_Karting() {
  const { openBookingModal } = useBooking();
  const [liveSectors, setLiveSectors] = useState([
    { name: "Sector 1 (Hairpin)", time: "18.24s", status: "PURPLE" },
    { name: "Sector 2 (Chicane)", time: "21.60s", status: "GREEN" },
    { name: "Sector 3 (Sprint)", time: "15.88s", status: "GREEN" },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSectors((prev) =>
        prev.map((s, idx) => ({
          ...s,
          time: (parseFloat(s.time) + (Math.random() * 0.08 - 0.04)).toFixed(2) + "s",
        }))
      );
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const kartFeatures = [
    {
      title: "Twin AC Motors",
      desc: "15kW instantaneous torque delivery for blistering chicane exits.",
      spec: "15kW TORQUE",
      icon: Zap,
    },
    {
      title: "RFID Telemetry",
      desc: "Live transponder lap timing beaming to trackside leaderboards.",
      spec: "100Hz TIMING",
      icon: Activity,
    },
    {
      title: "Spring-Absorption Barriers",
      desc: "Championship-grade energy-absorbing perimeter safety system.",
      spec: "FIA SAFETY",
      icon: ShieldCheck,
    },
    {
      title: "Push-to-Pass Boost",
      desc: "Digital power boost button on the steering column for high-speed overtakes.",
      spec: "+25% NITRO",
      icon: Gauge,
    },
  ];

  return (
    <section id="karting" className="py-24 sm:py-32 bg-[#060608] border-b border-white/10 relative overflow-hidden">
      {/* Ambient Crimson Glow behind 3D kart */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[600px] h-[500px] bg-brand-crimson/15 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <MotionReveal direction="left" className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-[0_0_15px_rgba(255,46,0,0.35)]">
              <Flag className="w-3.5 h-3.5" />
              Motorsport Flagship
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              ELECTRIC GO-KARTING <span className="text-brand-crimson font-orbitron text-glow-red">CIRCUIT.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
              Engineered with multi-level elevation shifts, high-speed sweepers, and hairpins designed to test true driver precision.
            </p>
          </MotionReveal>

          <MotionReveal direction="right">
            <MagneticButton
              variant="primary"
              onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
              className="px-6 py-3.5 text-xs self-start lg:self-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK RACE SESSION</span>
            </MagneticButton>
          </MotionReveal>
        </div>

        {/* 3D WebGL Kart Canvas & Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: 3D Interactive WebGL Kart */}
          <div className="lg:col-span-7">
            <KartCanvas />
          </div>

          {/* Right: Technical Highlights in 3D Perspective Card Stacks & Telemetry HUD */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Feature Cards in 3D Perspective Stack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 perspective-1000">
              {kartFeatures.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <Card3D key={idx} depth={18} className="bg-carbon-900/60 border border-white/10 backdrop-blur-xl">
                    <div className="p-4 rounded-2xl space-y-2 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-brand-crimson uppercase tracking-widest font-bold bg-carbon-950 px-2 py-0.5 rounded border border-brand-crimson/20">
                          {f.spec}
                        </span>
                        <Icon className="w-3.5 h-3.5 text-carbon-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-mono font-bold text-white uppercase">{f.title}</h4>
                        <p className="text-[11px] text-carbon-400 font-sans leading-relaxed mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  </Card3D>
                );
              })}
            </div>

            {/* High-Tech Daily Leaderboard HUD Snapshot */}
            <div className="p-5 sm:p-6 rounded-3xl bg-carbon-950/90 border border-white/15 backdrop-blur-xl space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                    <Trophy className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-white uppercase block leading-none">
                      Daily Track Leaderboard
                    </span>
                    <span className="text-[9px] font-mono text-carbon-400 uppercase">FIA Calibrated RFID Loop</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-crimson/20 border border-brand-crimson/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-crimson animate-ping" />
                  <span className="text-[9px] font-mono text-brand-crimson font-bold uppercase tracking-wider">
                    LIVE TELEMETRY
                  </span>
                </div>
              </div>

              {/* Leaderboard entries with racing progress bars */}
              <div className="space-y-2 font-mono text-xs">
                {mediaConfig.leaderboard.slice(0, 3).map((item, i) => (
                  <div
                    key={item.rank}
                    className="p-2.5 rounded-xl bg-carbon-900/80 border border-white/5 hover:border-white/20 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] ${
                          i === 0
                            ? "bg-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                            : i === 1
                            ? "bg-slate-300 text-black"
                            : "bg-amber-700/50 text-amber-300"
                        }`}>
                          #{item.rank}
                        </span>
                        <span className="text-white text-xs font-bold">{item.driver}</span>
                        <span className="text-[10px] text-carbon-500 hidden sm:inline">({item.kart})</span>
                      </div>
                      <span className="text-brand-crimson font-mono font-bold text-xs bg-carbon-950 px-2 py-0.5 rounded border border-brand-crimson/25 shadow-[0_0_10px_rgba(255,46,0,0.2)]">
                        {item.lapTime}
                      </span>
                    </div>

                    {/* Segmented Lap Consistency Bar */}
                    <div className="grid grid-cols-8 gap-1">
                      {Array.from({ length: 8 }).map((_, barIdx) => (
                        <div
                          key={barIdx}
                          className={`h-1 rounded-sm ${
                            barIdx < (8 - i * 2)
                              ? "bg-brand-crimson shadow-[0_0_6px_rgba(255,46,0,0.8)]"
                              : "bg-white/10"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Track Micro-Telemetry */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                {liveSectors.map((sec, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-carbon-900/60 text-center border border-white/5">
                    <span className="text-carbon-500 block truncate">{sec.name}</span>
                    <span className="text-white font-bold block">{sec.time}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

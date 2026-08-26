"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Flag, Trophy, Zap, ShieldCheck, ArrowRight, Calendar, Activity } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";
import KartFallback from "../3d/KartFallback";

const KartCanvas = dynamic(() => import("../3d/KartCanvas"), {
  ssr: false,
  loading: () => <KartFallback />,
});

export default function S3_Karting() {
  const { openBookingModal } = useBooking();

  const kartFeatures = [
    { title: "Twin AC Motors", desc: "15kW instantaneous torque delivery for blistering chicane exits." },
    { title: "RFID Telemetry", desc: "Live transponder lap timing beaming to trackside leaderboards." },
    { title: "Spring-Absorption Barriers", desc: "Championship-grade energy-absorbing perimeter safety system." },
    { title: "Push-to-Pass Boost", desc: "Digital power boost button on the steering column for high-speed overtakes." },
  ];

  return (
    <section id="karting" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit">
              <Flag className="w-3.5 h-3.5" />
              Motorsport Flagship
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              ELECTRIC GO-KARTING CIRCUIT.
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
              Engineered with multi-level elevation shifts, high-speed sweepers, and hairpins designed to test true driver precision.
            </p>
          </div>

          <button
            onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
            className="px-6 py-3.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2 self-start lg:self-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>BOOK RACE SESSION</span>
          </button>
        </div>

        {/* 3D WebGL Kart Canvas & Specifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: 3D Interactive WebGL Kart */}
          <div className="lg:col-span-7">
            <KartCanvas />
          </div>

          {/* Right: Technical Highlights & Daily Leaderboard Stream */}
          <div className="lg:col-span-5 space-y-6 text-left">
            
            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {kartFeatures.map((f, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-carbon-950 border border-white/10 space-y-1">
                  <h4 className="text-xs font-mono font-bold text-white uppercase">{f.title}</h4>
                  <p className="text-[11px] text-carbon-400 font-sans leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Daily Leaderboard Snapshot */}
            <div className="p-5 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase">Daily Track Leaderboard</span>
                </div>
                <span className="text-[10px] font-mono text-brand-red animate-pulse">● LIVE TELEMETRY</span>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                {mediaConfig.leaderboard.slice(0, 3).map((item) => (
                  <div key={item.rank} className="p-2 rounded-lg bg-carbon-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-brand-red font-bold">#{item.rank}</span>
                      <span className="text-white text-xs">{item.driver}</span>
                    </div>
                    <span className="text-white font-bold">{item.lapTime}</span>
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

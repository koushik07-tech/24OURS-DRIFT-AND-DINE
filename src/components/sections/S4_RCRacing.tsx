"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Radio, Trophy, Zap, Calendar, ArrowRight, ShieldCheck, Video, Compass, Target, Waves, Plane, Eye } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S4_RCRacing() {
  const { openBookingModal } = useBooking();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="rc-racing" className="py-24 sm:py-32 bg-carbon-950 border-b border-white/10 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-red/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
              <Radio className="w-3.5 h-3.5" />
              Scale Motorsport & Tactical Arena
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              SMALL CARS. <span className="text-brand-red">SERIOUS RACING.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              From scale 1:8 off-road championships and FPV cockpit goggles to tactical laser-guided RC tank battles, water basins, and aero simulators.
            </p>
          </div>

          <button
            onClick={() => openBookingModal("Scale 1:8 Championship RC Racing")}
            className="px-6 py-3.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2 self-start lg:self-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>DISCOVER RC ARENA</span>
          </button>
        </div>

        {/* 6 RC Experience Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {mediaConfig.rcExperiences.map((rc, idx) => (
            <div
              key={rc.id}
              className="group rounded-3xl bg-carbon-900 border border-white/10 overflow-hidden hover:border-brand-red/60 transition-all duration-300 flex flex-col justify-between hover:shadow-glow-red"
            >
              {/* Image Banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <Image
                  src={rc.image}
                  alt={rc.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-900 via-carbon-900/40 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-black/70 text-brand-red border border-white/15 backdrop-blur-md">
                  {rc.badge}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white uppercase group-hover:text-brand-red transition-colors">
                    {rc.title}
                  </h3>
                  <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                    {rc.description}
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {rc.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-mono text-carbon-300 bg-carbon-950 border border-white/5"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => openBookingModal(rc.title)}
                    className="w-full py-2.5 rounded-xl bg-carbon-850 hover:bg-brand-red border border-white/10 hover:border-brand-red text-white text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2"
                  >
                    <span>EXPERIENCE NOW</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RC Live Standings & FPV Telemetry Strip */}
        <div className="p-6 sm:p-8 rounded-3xl bg-carbon-900/90 border border-white/15 shadow-card-elevated text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-brand-red" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                RC Championship Lap Standings (Live Telemetry)
              </h3>
            </div>
            <span className="text-xs font-mono text-brand-red flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
              RFID Transponder Synced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
            {mediaConfig.rcLeaderboard.slice(0, 4).map((entry) => (
              <div
                key={entry.rank}
                className="p-3.5 rounded-2xl bg-carbon-950 border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-carbon-900 text-brand-red font-bold flex items-center justify-center text-xs border border-white/5 font-mono">
                    P{entry.rank}
                  </span>
                  <div>
                    <p className="text-xs text-white font-bold truncate max-w-[100px]">{entry.racer}</p>
                    <p className="text-[10px] text-carbon-400 font-mono truncate max-w-[100px]">{entry.car}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-brand-red font-bold">{entry.lapTime}</p>
                  <p className="text-[9px] font-mono text-carbon-400">{entry.points} Pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


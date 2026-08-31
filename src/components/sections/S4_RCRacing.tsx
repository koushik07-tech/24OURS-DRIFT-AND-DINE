"use client";

import React from "react";
import { Radio, Trophy, Zap, Calendar, ArrowRight } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S4_RCRacing() {
  const { openBookingModal } = useBooking();

  const raceFormats = [
    { title: "Time Attack Sprint", duration: "15 Mins", desc: "Single driver telemetry run on the banked raceway against the digital lap clock." },
    { title: "Multi-Driver Grand Prix", duration: "30 Mins", desc: "Up to 8 drivers on the grid battling with proportional 2.4GHz controllers." },
    { title: "Night Glow Cup", duration: "20 Mins", desc: "Under-glow illuminated scale buggies racing on a darkened stadium neon circuit." },
  ];

  return (
    <section id="rc-racing" className="py-24 sm:py-32 bg-carbon-950 border-b border-white/10 subtle-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit">
              <Radio className="w-3.5 h-3.5" />
              Scale 1:8 & 1:10 Arena
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              RC RACING ARENA.
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
              Experience the thrill of high-torque brushless scale racing across multi-surface chicanes and elevated crossover ramps.
            </p>
          </div>

          <button
            onClick={() => openBookingModal("Scale 1:8 RC Racing Arena")}
            className="px-6 py-3.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2 self-start lg:self-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>BOOK RC ARENA SESSION</span>
          </button>
        </div>

        {/* Formats & RC Leaderboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Tournament Formats */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {raceFormats.map((fmt, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-carbon-900 border border-white/10 space-y-1.5 glass-panel-hover"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-display font-bold text-white uppercase">{fmt.title}</h4>
                  <span className="text-xs font-mono text-brand-red font-bold">{fmt.duration}</span>
                </div>
                <p className="text-xs text-carbon-400 font-sans leading-relaxed">{fmt.desc}</p>
              </div>
            ))}
          </div>

          {/* Right: RC Leaderboard HUD */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-carbon-900 border border-white/15 shadow-card-elevated space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-brand-red" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    RC Championship Standings
                  </span>
                </div>
                <span className="text-[10px] font-mono text-brand-red">● LIVE</span>
              </div>

              <div className="space-y-2.5 font-mono text-xs">
                {mediaConfig.rcLeaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className="p-3.5 rounded-xl bg-carbon-950 border border-white/5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded bg-carbon-800 text-brand-red font-bold flex items-center justify-center text-[11px]">
                        {entry.rank}
                      </span>
                      <div>
                        <p className="text-white font-semibold">{entry.racer}</p>
                        <p className="text-[10px] text-carbon-400">{entry.car}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{entry.lapTime}</p>
                      <p className="text-[10px] text-brand-red">{entry.points} Pts</p>
                    </div>
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

"use client";

import React from "react";
import Image from "next/image";
import { Smile, ShieldCheck, Trophy, Sparkles, Calendar, ArrowRight, Heart } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S5_KidzZone() {
  const { openBookingModal } = useBooking();

  return (
    <section id="kidz-zone" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      {/* Playful accent glow */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase font-bold flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              Junior Motorsport & Family Fun
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              KIDZ <span className="text-amber-400">ZONE.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              A dedicated, fully cushioned adventure space tailored specifically for young drivers. Engineered with speed-governed cadet karts, anti-collision RC circuits, and supervised racing marshals.
            </p>
          </div>

          <button
            onClick={() => openBookingModal("Kidz Zone Junior Adventure")}
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 self-start lg:self-auto shadow-lg shadow-amber-500/20"
          >
            <Calendar className="w-4 h-4" />
            <span>BOOK JUNIOR PASS</span>
          </button>
        </div>

        {/* 3 Kidz Zone Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {mediaConfig.kidzExperiences.map((exp, idx) => (
            <div
              key={idx}
              className="group rounded-3xl bg-carbon-950 border border-white/10 overflow-hidden hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/30 to-transparent" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-black/70 text-amber-400 border border-white/15 backdrop-blur-md">
                  {exp.age}
                </span>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-display font-bold text-white uppercase group-hover:text-amber-400 transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                    {exp.desc}
                  </p>
                </div>

                <button
                  onClick={() => openBookingModal(exp.title)}
                  className="w-full py-2.5 rounded-xl bg-carbon-900 hover:bg-amber-500 hover:text-black border border-white/10 text-white text-xs font-mono font-bold uppercase transition-all flex items-center justify-center gap-2"
                >
                  <span>RESERVE FOR JUNIORS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Junior Safety Features Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-carbon-950/70 border border-white/10 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase">Certified Youth Safety Gear</h4>
              <p className="text-[11px] text-carbon-400 font-sans mt-0.5">Ultra-lightweight neck braces and sanitized helmets fitted for junior racers.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-carbon-950/70 border border-white/10 flex items-start gap-3">
            <Heart className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase">Parent-Assisted Option</h4>
              <p className="text-[11px] text-carbon-400 font-sans mt-0.5">Dual-seat electric karts permitting parents to accompany younger thrill seekers.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-carbon-950/70 border border-white/10 flex items-start gap-3">
            <Trophy className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-mono font-bold text-white uppercase">Junior Podium Awards</h4>
              <p className="text-[11px] text-carbon-400 font-sans mt-0.5">Every young racer receives an official 24Ours driver certificate upon race finish.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

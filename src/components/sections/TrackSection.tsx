"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Flag, Navigation, ShieldCheck, Zap, Activity, Calendar, Compass, ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import MotionReveal from "@/components/ui/MotionReveal";

const TrackScene = dynamic(() => import("../3d/TrackScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[420px] sm:h-[500px] lg:h-[580px] rounded-3xl liquid-glass flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full border-2 border-coral border-t-transparent animate-spin" />
        <span className="text-xs font-mono text-zinc-400">Loading 3D Circuit Geometry...</span>
      </div>
    </div>
  ),
});

export default function TrackSection() {
  const { openBookingModal } = useBooking();

  return (
    <section id="track-circuit" className="py-24 sm:py-32 bg-[#06080d] border-b border-white/10 relative overflow-hidden">
      {/* Dusk Horizon Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-coral/10 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <MotionReveal direction="left" className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-coral/20 text-coral border border-coral/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-coral-glow">
              <Compass className="w-3.5 h-3.5" />
              Interactive 3D Circuit Layout
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              THE 1.2 KM <span className="text-coral font-orbitron text-glow-coral">RACE TRACK.</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 font-sans max-w-xl leading-relaxed">
              Explore the championship-grade asphalt circuit featuring elevation hairpins, starting grid gantries, high-grip curbs, and pit-lane telemetry.
            </p>
          </MotionReveal>

          <MotionReveal direction="right" className="flex items-center gap-3">
            <button
              onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-coral to-[#ff3b14] hover:brightness-110 active:scale-95 text-white font-display font-bold text-xs uppercase tracking-wider shadow-coral-glow transition-all flex items-center gap-2 border border-coral-glow/30"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK A TRACK HEAT</span>
            </button>
          </MotionReveal>
        </div>

        {/* 3D Track Canvas */}
        <MotionReveal direction="up">
          <TrackScene />
        </MotionReveal>

        {/* Track Technical Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          <div className="liquid-glass-card p-6 rounded-2xl space-y-2 border border-white/10 hover:border-coral/40 transition-all text-left">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-coral font-bold">01 // ASPHALT</span>
              <Flag className="w-4 h-4 text-coral" />
            </div>
            <h4 className="font-display font-black text-lg text-white">FIA Spec High-Grip Mix</h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Precision-graded asphalt formulation providing optimal tire adhesion across rain and twilight track conditions.
            </p>
          </div>

          <div className="liquid-glass-card p-6 rounded-2xl space-y-2 border border-white/10 hover:border-coral/40 transition-all text-left">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-coral font-bold">02 // SAFETY</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="font-display font-black text-lg text-white">Polymer Spring Barriers</h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Dynamic energy-absorbing modular barriers and safety tire clusters lining all critical run-off apex zones.
            </p>
          </div>

          <div className="liquid-glass-card p-6 rounded-2xl space-y-2 border border-white/10 hover:border-coral/40 transition-all text-left">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-coral font-bold">03 // TIMING</span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="font-display font-black text-lg text-white">100Hz RFID Loop Antennas</h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Millisecond transponder lap telemetry synchronized directly to trackside LED boards and customer printouts.
            </p>
          </div>

          <div className="liquid-glass-card p-6 rounded-2xl space-y-2 border border-white/10 hover:border-coral/40 transition-all text-left">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-coral font-bold">04 // LIGHTING</span>
              <Zap className="w-4 h-4 text-coral" />
            </div>
            <h4 className="font-display font-black text-lg text-white">LED Floodlight Gantries</h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Glare-free high-lux optical illumination towers enabling intense night racing heats until 11:30 PM daily.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

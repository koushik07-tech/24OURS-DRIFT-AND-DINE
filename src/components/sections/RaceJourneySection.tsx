"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  ShieldCheck,
  Radio,
  Flame,
  Gauge,
  Trophy,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { soundEngine } from "@/lib/soundEngine";

const JOURNEY_STEPS = [
  {
    step: "01",
    phase: "ARRIVE",
    title: "Paddock Check-In & RFID Sync",
    desc: "Step into our air-conditioned pit facility. Register your official driver profile and sync your personal RFID telemetry transponder.",
    telemetry: "Driver ID & Transponder Activation",
    icon: MapPin,
    accent: "#38BDF8",
  },
  {
    step: "02",
    phase: "SUIT UP",
    title: "Race-Certified Gear Fitment",
    desc: "Don sanitized race-spec full-face helmets with anti-fog visors, reinforced racing overalls, and impact-absorbing neck braces.",
    telemetry: "FIA-Standard Safety Certification",
    icon: ShieldCheck,
    accent: "#10B981",
  },
  {
    step: "03",
    phase: "BRIEFING",
    title: "Championship Race Briefing",
    desc: "Our race directors brief you on apex clipping points, electronic marshaling flag lights, steering geometry, and overtakes.",
    telemetry: "Circuit Dynamics & Flag Rules",
    icon: Radio,
    accent: "#F59E0B",
  },
  {
    step: "04",
    phase: "RACE",
    title: "Instant Electric Torque Combat",
    desc: "Take your starting grid slot. Unleash instant electric motor acceleration through 14 technical corners, high-camber sweepers, and straightaways.",
    telemetry: "Full Power Output & Hot Laps",
    icon: Flame,
    accent: "#FF5A36",
  },
  {
    step: "05",
    phase: "FINISH",
    title: "Checkered Flag & Telemetry",
    desc: "Take the checkered flag. Review your sector-by-sector delta times, theoretical best lap, and overall ranking on the pit-lane screen.",
    telemetry: "Millisecond Precision Lap Telemetry",
    icon: Gauge,
    accent: "#A855F7",
  },
  {
    step: "06",
    phase: "CELEBRATE",
    title: "360° Sky Deck Celebration",
    desc: "Ascend to the panoramic Sky Dining deck overlooking the circuit. Toast podium victories with signature mocktails and gourmet dinner.",
    telemetry: "Podium Trophies & Horizon Dining",
    icon: Trophy,
    accent: "#EC4899",
  },
];

export default function RaceJourneySection() {
  const { openBookingModal } = useBooking();
  const [activeStep, setActiveStep] = useState(3); // Start with RACE highlighted

  return (
    <section id="journey" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#07090e] border-t border-b border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-[#FF5A36]/8 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-[#FF5A36]/40 text-[#FF5A36] text-xs font-mono font-bold uppercase mb-4 shadow-[0_0_20px_rgba(255,90,54,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE 24OURS MOTORSPORT PROTOCOL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
            YOUR RACE DAY <span className="bg-gradient-to-r from-[#FF5A36] to-[#F59E0B] bg-clip-text text-transparent">JOURNEY</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-sans">
            From the moment you arrive at the pit gate to the champagne celebration atop our 360° sky deck, experience true professional motorsport hospitality.
          </p>
        </div>

        {/* 6-Step Horizontal Progress Flow */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {JOURNEY_STEPS.map((s, idx) => {
            const IconComponent = s.icon;
            const isActive = activeStep === idx;

            return (
              <button
                key={s.step}
                onClick={() => {
                  soundEngine.playClick(600 + idx * 30);
                  setActiveStep(idx);
                }}
                className={`p-4 rounded-2xl text-left transition-all duration-300 relative border flex flex-col justify-between ${
                  isActive
                    ? "bg-[#FF5A36]/15 border-[#FF5A36] shadow-[0_0_25px_rgba(255,90,54,0.3)] scale-[1.02]"
                    : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: isActive ? "#FF5A36" : "#71717a" }}
                  >
                    PHASE {s.step}
                  </span>
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isActive ? "bg-[#FF5A36] text-white shadow-md" : "bg-black/40 text-zinc-400"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-display font-bold text-white tracking-wide uppercase">
                    {s.phase}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-sans mt-0.5 line-clamp-1">
                    {s.title}
                  </p>
                </div>

                {/* Bottom active pill indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeJourneyIndicator"
                    className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-[#FF5A36] to-[#F59E0B] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Highlighted Active Step Showcase Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="liquid-glass rounded-3xl border border-white/10 p-6 sm:p-10 bg-[#0b0f17]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${JOURNEY_STEPS[activeStep].accent}20`,
                    color: JOURNEY_STEPS[activeStep].accent,
                    borderColor: `${JOURNEY_STEPS[activeStep].accent}40`,
                    borderWidth: 1,
                  }}
                >
                  PHASE {JOURNEY_STEPS[activeStep].step} &bull; {JOURNEY_STEPS[activeStep].phase}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  {JOURNEY_STEPS[activeStep].telemetry}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white uppercase tracking-tight">
                {JOURNEY_STEPS[activeStep].title}
              </h3>

              <p className="text-sm sm:text-base text-zinc-300 font-sans leading-relaxed max-w-3xl">
                {JOURNEY_STEPS[activeStep].desc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Professional Pit Marshal Supervision
                </span>
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> Electronic Flag System
                </span>
              </div>
            </div>

            {/* Right Action & Progression */}
            <div className="lg:col-span-4 flex flex-col justify-center space-y-3 bg-black/40 p-6 rounded-2xl border border-white/10">
              <div className="text-xs font-mono uppercase text-zinc-400 font-bold">
                Ready to Experience This?
              </div>
              <button
                onClick={() => {
                  soundEngine.playClick(650);
                  openBookingModal("Full Race Day Journey");
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#ff3b14] hover:brightness-110 active:scale-95 text-white font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_35px_rgba(255,90,54,0.45)] transition-all flex items-center justify-center gap-2 border border-red-500/30"
              >
                <span>BOOK YOUR RACE DAY</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick(500);
                  setActiveStep((prev) => (prev + 1) % JOURNEY_STEPS.length);
                }}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-mono transition-all flex items-center justify-center gap-2"
              >
                <span>Explore Next Phase ({JOURNEY_STEPS[(activeStep + 1) % JOURNEY_STEPS.length].phase})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

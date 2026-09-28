"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Palette,
  Hash,
  Lightbulb,
  Sun,
  Moon,
  Sparkles,
  RotateCcw,
  Check,
  Calendar,
  Layers,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { soundEngine } from "@/lib/soundEngine";
import type { KartCustomizerOptions } from "@/components/3d/KartCustomizer3D";

const KartCustomizer3D = dynamic(() => import("@/components/3d/KartCustomizer3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-[#0a0d14]">
      <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-[#FF5A36] animate-spin" />
      <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
        Loading 3D Kart Specification...
      </span>
    </div>
  ),
});

const COLOR_PRESETS = [
  { name: "Racing Coral", hex: "#FF5A36" },
  { name: "Apex Crimson", hex: "#E10600" },
  { name: "Cyber Cyan", hex: "#00F0FF" },
  { name: "Championship Gold", hex: "#F59E0B" },
  { name: "Stealth Carbon", hex: "#18181b" },
  { name: "Electric Emerald", hex: "#10B981" },
];

const NUMBER_PRESETS = ["24", "07", "99", "01", "18", "77"];

const UNDERGLOW_COLORS = [
  { name: "Cyan Neon", hex: "#00F0FF" },
  { name: "Coral Flare", hex: "#FF5A36" },
  { name: "Acid Green", hex: "#10B981" },
  { name: "Ultraviolet", hex: "#A855F7" },
];

export default function KartCustomizerSection() {
  const { openBookingModal } = useBooking();

  const [options, setOptions] = useState<KartCustomizerOptions>({
    color: "#FF5A36",
    number: "24",
    underglow: true,
    underglowColor: "#00F0FF",
    headlights: true,
    environment: "night",
  });

  const handleColorChange = (hex: string) => {
    soundEngine.playClick(700);
    setOptions((prev) => ({ ...prev, color: hex }));
  };

  const handleNumberChange = (num: string) => {
    soundEngine.playClick(600);
    setOptions((prev) => ({ ...prev, number: num }));
  };

  const handleUnderglowToggle = () => {
    soundEngine.playClick(550);
    setOptions((prev) => ({ ...prev, underglow: !prev.underglow }));
  };

  const handleHeadlightsToggle = () => {
    soundEngine.playClick(500);
    setOptions((prev) => ({ ...prev, headlights: !prev.headlights }));
  };

  const handleEnvChange = (env: "night" | "sunset" | "studio") => {
    soundEngine.playClick(650);
    setOptions((prev) => ({ ...prev, environment: env }));
  };

  return (
    <section id="customizer" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#06080d] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[500px] bg-[#FF5A36]/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-[#FF5A36]/40 text-[#FF5A36] text-xs font-mono font-bold uppercase mb-4 shadow-[0_0_20px_rgba(255,90,54,0.2)]">
            <Palette className="w-3.5 h-3.5" />
            <span>INTERACTIVE 3D PADDOCK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
            CUSTOMIZE YOUR <span className="bg-gradient-to-r from-[#FF5A36] to-[#F59E0B] bg-clip-text text-transparent">RACE MACHINE</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-sans">
            Personalize your electric competition kart in full real-time 3D. Inspect livery reflections, race numbering, and night underglow before you arrive.
          </p>
        </div>

        {/* 3D Customizer Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* 3D Canvas Box (7 columns on desktop) */}
          <div className="lg:col-span-8 min-h-[420px] sm:min-h-[520px] rounded-3xl liquid-glass border border-white/10 bg-[#0a0d14]/90 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            
            {/* Top Canvas Badges */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-white backdrop-blur-md">
                KART #{options.number}
              </span>
              <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-emerald-400 backdrop-blur-md">
                60 FPS &bull; REALTIME PBR
              </span>
            </div>

            {/* Instruction tooltip */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-1.5 rounded-full bg-black/70 border border-white/10 text-zinc-300 text-[11px] font-mono tracking-wider backdrop-blur-md">
              DRAG TO ROTATE &bull; PINCH / SCROLL TO ZOOM
            </div>

            {/* 3D Canvas */}
            <KartCustomizer3D options={options} />
          </div>

          {/* Configuration Controls (4 columns on desktop) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-7 rounded-3xl liquid-glass border border-white/10 bg-[#0b0f17]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] space-y-6">
            
            {/* Control 1: Livery Color */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono uppercase text-zinc-300 mb-3 font-bold">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#FF5A36]" /> Livery Finish
                </span>
                <span className="text-[#FF5A36]">
                  {COLOR_PRESETS.find((c) => c.hex === options.color)?.name}
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => handleColorChange(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`h-10 rounded-xl relative transition-transform duration-200 hover:scale-105 ${
                      options.color === c.hex
                        ? "ring-2 ring-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    title={c.name}
                  >
                    {options.color === c.hex && (
                      <Check className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Race Number */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono uppercase text-zinc-300 mb-3 font-bold">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-400" /> Grid Racing Number
                </span>
                <span className="text-white">#{options.number}</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {NUMBER_PRESETS.map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumberChange(num)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      options.number === num
                        ? "bg-[#FF5A36] text-white shadow-[0_0_15px_rgba(255,90,54,0.4)]"
                        : "bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 3: Underglow & Headlights */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Neon Chassis Underglow</span>
                </div>
                <button
                  onClick={handleUnderglowToggle}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                    options.underglow
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                      : "bg-white/5 text-zinc-500 border border-white/10"
                  }`}
                >
                  {options.underglow ? "ACTIVE" : "OFF"}
                </button>
              </div>

              {options.underglow && (
                <div className="flex items-center gap-2 pt-1">
                  {UNDERGLOW_COLORS.map((ug) => (
                    <button
                      key={ug.hex}
                      onClick={() => {
                        soundEngine.playClick(600);
                        setOptions((prev) => ({ ...prev, underglowColor: ug.hex }));
                      }}
                      style={{ backgroundColor: ug.hex }}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        options.underglowColor === ug.hex
                          ? "ring-2 ring-white scale-110 shadow-lg"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      title={ug.name}
                    />
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Twin Projector Headlights</span>
                </div>
                <button
                  onClick={handleHeadlightsToggle}
                  className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                    options.headlights
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "bg-white/5 text-zinc-500 border border-white/10"
                  }`}
                >
                  {options.headlights ? "BEAMS ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* Control 4: Environment Lighting */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-xs font-mono uppercase text-zinc-300 mb-2 font-bold flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-blue-400" /> Environment Mood
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(["night", "sunset", "studio"] as const).map((env) => (
                  <button
                    key={env}
                    onClick={() => handleEnvChange(env)}
                    className={`py-2 rounded-xl text-[11px] font-mono font-bold uppercase transition-all ${
                      options.environment === env
                        ? "bg-white/20 text-white border border-white/40 shadow-md"
                        : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA to lock and book */}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  soundEngine.playClick(650);
                  openBookingModal(`Custom Kart #${options.number} (${COLOR_PRESETS.find(c => c.hex === options.color)?.name || 'Custom'})`);
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#ff3b14] hover:brightness-110 active:scale-95 text-white font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_35px_rgba(255,90,54,0.45)] transition-all flex items-center justify-center gap-2 border border-red-500/30"
              >
                <Calendar className="w-4 h-4" />
                <span>LOCK SPEC & BOOK KART</span>
              </button>
              <p className="text-[10px] text-center font-mono text-zinc-500 mt-2">
                Spec sent to pit marshals upon booking confirmation
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

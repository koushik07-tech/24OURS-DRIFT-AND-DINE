"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Gauge,
  Zap,
  Activity,
  Timer,
  Trophy,
  Flag,
  Flame,
  Radio,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useBooking } from "@/context/BookingContext";
import { soundEngine } from "@/lib/soundEngine";

export default function RaceDashboardSection() {
  const { openBookingModal } = useBooking();
  const [speed, setSpeed] = useState(82);
  const [rpm, setRpm] = useState(10800);
  const [gForce, setGForce] = useState({ x: 0.4, y: 1.6 });
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [lapTime, setLapTime] = useState(47.28);

  // Live simulation tick
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isBoostActive) {
        setSpeed((prev) => 78 + Math.floor(Math.random() * 8));
        setRpm((prev) => 10400 + Math.floor(Math.random() * 900));
        setGForce({
          x: Number((Math.random() * 0.8 - 0.4).toFixed(2)),
          y: Number((1.4 + Math.random() * 0.5).toFixed(2)),
        });
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isBoostActive]);

  const handleBoost = () => {
    if (isBoostActive) return;
    setIsBoostActive(true);
    soundEngine.playEngineRev();
    setSpeed(94);
    setRpm(12800);
    setGForce({ x: 0.85, y: 2.15 });

    setTimeout(() => {
      setIsBoostActive(false);
      setSpeed(84);
      setRpm(10900);
    }, 3200);
  };

  return (
    <section id="telemetry-dashboard" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#05070b] overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[400px] rounded-full blur-[170px] pointer-events-none transition-all duration-500 ${
          isBoostActive ? "bg-[#FF5A36]/30 scale-125" : "bg-[#FF5A36]/10"
        }`}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>REAL-TIME TELEMETRY SYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
            CIRCUIT PERFORMANCE <span className="bg-gradient-to-r from-[#FF5A36] to-[#F59E0B] bg-clip-text text-transparent">DASHBOARD</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-sans">
            Every session at 24OURS is instrumented with professional timing antennas, capturing millisecond sector splits, peak velocity, and cornering lateral loads.
          </p>
        </div>

        {/* Racing Telemetry Console HUD */}
        <div className="liquid-glass rounded-3xl border border-white/10 p-6 sm:p-10 bg-[#090c14]/90 backdrop-blur-2xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] relative overflow-hidden">
          
          {/* Top HUD Status bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10 text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-white font-bold tracking-wider">
                TRANSPONDER ID: #24-PRO-ALPHA
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-zinc-300 text-[10px]">
                DEMO BENCHMARK STREAM
              </span>
            </div>

            <div className="flex items-center gap-4 text-zinc-400">
              <span>TRACK TEMP: <strong className="text-white">32°C</strong></span>
              <span>BATTERY HEALTH: <strong className="text-emerald-400">96%</strong></span>
              <span>GRID POS: <strong className="text-[#FF5A36]">P1</strong></span>
            </div>
          </div>

          {/* Telemetry Main Gauges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8">
            
            {/* Gauge 1: Speedometer */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-[#FF5A36]" /> INSTANT VELOCITY
                </span>
                <span className="text-[10px] text-zinc-500">MAX: 95 KM/H</span>
              </div>

              <div className="my-4 text-center">
                <div className="text-5xl sm:text-6xl font-display font-black text-white tracking-tight flex items-baseline justify-center gap-2">
                  <span className={isBoostActive ? "text-[#FF5A36] animate-pulse" : "text-white"}>
                    {speed}
                  </span>
                  <span className="text-sm font-mono text-zinc-400 uppercase">KM/H</span>
                </div>
                {/* Visual Speed Bar */}
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-3">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#FF5A36]"
                    animate={{ width: `${(speed / 95) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              <div className="text-[11px] font-mono text-zinc-400 flex justify-between">
                <span>ELECTRIC RPM</span>
                <span className="text-white font-bold">{rpm.toLocaleString()} RPM</span>
              </div>
            </div>

            {/* Gauge 2: Lap Time & Sectors */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-amber-400" /> LAP 08 / 12
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">PURPLE LAP</span>
              </div>

              <div className="my-3 text-center">
                <div className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                  00:{lapTime.toFixed(2)}
                </div>
                <div className="text-[10px] font-mono text-zinc-400 mt-1 uppercase">
                  CIRCUIT RECORD: 46.15s
                </div>
              </div>

              {/* 3 Sectors breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">SECTOR 1 (CHICANE)</span>
                  <span className="text-purple-400 font-bold">14.82s (RECORD)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">SECTOR 2 (SWEEPER)</span>
                  <span className="text-emerald-400 font-bold">19.34s (P.B.)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">SECTOR 3 (STRAIGHT)</span>
                  <span className="text-amber-400 font-bold">13.12s</span>
                </div>
              </div>
            </div>

            {/* Gauge 3: Lateral G-Force Radar */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" /> LATERAL G-LOAD
                </span>
                <span className="text-white font-bold">{gForce.y}G PEAK</span>
              </div>

              {/* Crosshair G-Meter */}
              <div className="relative w-28 h-28 mx-auto my-2 rounded-full border border-white/20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-white/10 scale-75" />
                <div className="absolute inset-0 rounded-full border border-white/10 scale-50" />
                <div className="w-full h-px bg-white/15 absolute" />
                <div className="h-full w-px bg-white/15 absolute" />

                {/* Moving G-Force indicator dot */}
                <motion.div
                  className="w-3.5 h-3.5 rounded-full bg-[#FF5A36] shadow-[0_0_12px_rgba(255,90,54,0.9)] absolute"
                  animate={{
                    x: gForce.x * 25,
                    y: (gForce.y - 1.5) * 20,
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>

              <div className="text-[11px] font-mono text-zinc-400 flex justify-between">
                <span>TIRE CORNERING GRIP</span>
                <span className="text-emerald-400 font-bold">OPTIMAL 98%</span>
              </div>
            </div>

            {/* Gauge 4: Nitro / Boost Activation */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FF5A36]/15 via-black/40 to-black/40 border border-[#FF5A36]/40 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-mono text-[#FF5A36] font-bold">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> KERS OVERTAKE BOOST
                </span>
                <span>{isBoostActive ? "HOT LAP ON" : "READY"}</span>
              </div>

              <div className="py-2 text-center">
                <p className="text-xs text-zinc-300 font-sans mb-3">
                  Simulate high-output electric overtake boost on the main straightaway.
                </p>
                <button
                  onClick={handleBoost}
                  disabled={isBoostActive}
                  className={`w-full py-3.5 rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isBoostActive
                      ? "bg-amber-500 text-black shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-pulse"
                      : "bg-[#FF5A36] hover:bg-[#ff4721] text-white shadow-[0_0_20px_rgba(255,90,54,0.4)] active:scale-95"
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{isBoostActive ? "BOOST DEPLOYED!" : "DEPLOY BOOST"}</span>
                </button>
              </div>

              <div className="text-[10px] font-mono text-zinc-400 text-center">
                Instant electric power release &bull; Sound enabled
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Action Bar */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-zinc-400 text-center sm:text-left">
              Want your name and lap time printed on the official 24OURS Hall of Fame?
            </div>
            <button
              onClick={() => {
                soundEngine.playClick(650);
                openBookingModal("Time Trial Telemetry Session");
              }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF5A36] to-[#ff3b14] hover:brightness-110 active:scale-95 text-white font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(255,90,54,0.4)] transition-all flex items-center gap-2"
            >
              <span>SET YOUR CIRCUIT RECORD</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

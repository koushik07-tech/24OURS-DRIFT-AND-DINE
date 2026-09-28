"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, Sparkles, CheckCircle2, ChevronRight } from "lucide-react";
import { soundEngine } from "@/lib/soundEngine";

const LOADING_STATUSES = [
  "Initializing WebGL engine...",
  "Calibrating PBR asphalt textures...",
  "Aligning circuit telemetry transponders...",
  "Warming competition slick tires...",
  "Preparing the track...",
];

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [statusIndex, setStatusIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if already visited in this session
    const seen = sessionStorage.getItem("24ours_track_loaded");
    if (seen === "true") {
      setIsDone(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            sessionStorage.setItem("24ours_track_loaded", "true");
          }, 400);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 15) + 8;
        return Math.min(100, next);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 25) setStatusIndex(0);
    else if (progress < 50) setStatusIndex(1);
    else if (progress < 75) setStatusIndex(2);
    else if (progress < 95) setStatusIndex(3);
    else setStatusIndex(4);
  }, [progress]);

  const handleSkip = () => {
    soundEngine.playClick(600);
    setIsDone(true);
    sessionStorage.setItem("24ours_track_loaded", "true");
  };

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-50 bg-[#05070b] flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF5A36]/15 rounded-full blur-[140px] pointer-events-none" />

          {/* Central HUD Card */}
          <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
            
            {/* Spinning Telemetry Gauge */}
            <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-25" />
              
              {/* Spinning segmented ring */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="#FF5A36"
                  strokeWidth="4"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * progress) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-150 ease-out"
                />
              </svg>

              {/* Center digital percentage */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-display font-black text-white tracking-tight">
                  {progress}%
                </span>
                <span className="text-[9px] font-mono text-[#FF5A36] uppercase tracking-widest">
                  SYNC
                </span>
              </div>
            </div>

            {/* Brand Title */}
            <h2 className="text-xl font-display font-black tracking-widest text-white uppercase">
              24OURS <span className="text-[#FF5A36]">DRIFT & DINE</span>
            </h2>
            <div className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase mt-1 mb-6">
              CINEMATIC 3D MOTORSPORT
            </div>

            {/* Dynamic Status Text */}
            <div className="h-6 flex items-center justify-center gap-2 text-xs font-mono text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{LOADING_STATUSES[statusIndex]}</span>
            </div>

            {/* Progress Bar Line */}
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden mt-6 mb-8">
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF5A36] via-[#ff7352] to-[#F59E0B]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Skip Button */}
            <button
              onClick={handleSkip}
              className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white text-xs font-mono tracking-wider transition-all flex items-center gap-1"
            >
              <span>ENTER CIRCUIT DIRECTLY</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#FF5A36]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

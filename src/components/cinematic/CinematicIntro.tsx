"use client";

import React, { useState, useEffect, useRef } from "react";
import { soundEngine } from "@/lib/soundEngine";
import SmokeCanvas from "./SmokeCanvas";
import { mediaConfig } from "@/config/media";
import { Volume2, VolumeX, Sparkles, ChevronRight, Zap } from "lucide-react";

interface CinematicIntroProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export default function CinematicIntro({ onComplete, forceShow = false }: CinematicIntroProps) {
  // Stage 0: Black screen, waiting/start
  // Stage 1: Distant engine begins, subtle vibration, fog starts
  // Stage 2: Approaching high speed karting video & light streaks
  // Stage 3: Smoke covers screen
  // Stage 4: 24OURS logo emerges through smoke, illuminated & glowing
  // Stage 5: Transition into main site
  // Stage 6: Destroyed / complete
  const [stage, setStage] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Clear timers helper
  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const startSequence = (withAudio: boolean) => {
    if (hasStarted) return;
    setHasStarted(true);
    clearAllTimers();

    if (withAudio) {
      soundEngine.setMuted(false);
      setIsMuted(false);
      soundEngine.playCinematicIntroSequence();
    } else {
      soundEngine.setMuted(true);
      setIsMuted(true);
    }

    // Progression of choreographed cinematic phases
    // Stage 1 (0.2s): Distant rumble, vibration, fog begins
    const t1 = setTimeout(() => {
      setStage(1);
    }, 200);

    // Stage 2 (2.2s): High-speed approach video & light streak speedlines
    const t2 = setTimeout(() => {
      setStage(2);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 2200);

    // Stage 3 (4.2s): Smoke blast & drift coverage
    const t3 = setTimeout(() => {
      setStage(3);
    }, 4200);

    // Stage 4 (5.4s): 24OURS logo slowly emerges with illuminated glow
    const t4 = setTimeout(() => {
      setStage(4);
    }, 5400);

    // Stage 5 (8.2s): Cinematic pause ends, start transition to site
    const t5 = setTimeout(() => {
      setStage(5);
    }, 8200);

    // Stage 6 (9.4s): Fully complete and unmount
    const t6 = setTimeout(() => {
      setIsDismissed(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("24ours_intro_seen", "true");
      }
      if (onComplete) onComplete();
    }, 9400);

    timersRef.current = [t1, t2, t3, t4, t5, t6];
  };

  const skipIntro = () => {
    clearAllTimers();
    setStage(5);
    soundEngine.playClick(800);
    setTimeout(() => {
      setIsDismissed(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("24ours_intro_seen", "true");
      }
      if (onComplete) onComplete();
    }, 400);
  };

  useEffect(() => {
    // Check if user already saw intro in current session
    if (typeof window !== "undefined" && !forceShow) {
      const seen = sessionStorage.getItem("24ours_intro_seen");
      if (seen === "true") {
        setIsDismissed(true);
        if (onComplete) onComplete();
        return;
      }
    }

    // Listen for ESC key to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        skipIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearAllTimers();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [forceShow]);

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#000000] overflow-hidden select-none transition-opacity duration-1000 ${
        stage === 5 ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      } ${stage >= 1 && stage <= 3 ? "animate-cinematic-shake" : ""}`}
      style={{
        backgroundColor: "#000000",
      }}
    >
      {/* 1. Volumetric Smoke, Burnout & Particle Laser Canvas */}
      <SmokeCanvas stage={stage} intensity={stage === 3 ? 1.5 : 1.0} />

      {/* 2. Approaching Karting Video (Revealed through fog in Stage 2) */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none ${
          stage === 2
            ? "opacity-60 scale-110 filter contrast-125 brightness-110"
            : stage === 3
            ? "opacity-20 blur-md scale-125"
            : "opacity-0"
        }`}
        style={{
          transitionProperty: "opacity, transform, filter",
          transitionDuration: "1200ms",
        }}
      >
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          className="w-full h-full object-cover"
        >
          <source src={mediaConfig.videos.karting} type="video/mp4" />
        </video>
        {/* Cinematic Vignette and Scanlines */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      {/* 3. Speed Tunnel / Light Streak Overlay during Stage 2 & 3 */}
      {(stage === 2 || stage === 3) && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
          <div className="w-[150vw] h-[2px] bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-90 blur-[1px] -rotate-12 animate-pulse" />
          <div className="absolute w-[150vw] h-[3px] bg-gradient-to-r from-transparent via-white to-transparent opacity-70 blur-[2px] rotate-6" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-red/25 rounded-full blur-[140px]" />
        </div>
      )}

      {/* 4. Central Content: Stage 0 Action Prompt */}
      {stage === 0 && !hasStarted && (
        <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4 text-center animate-fadeIn">
          {/* Subtle Ambient Red Glow in center */}
          <div className="absolute w-[320px] h-[320px] bg-brand-red/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

          <div className="space-y-6 max-w-lg mx-auto relative">
            {/* Tiny Luxury Sub-header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-carbon-900/60 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-ping" />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-carbon-300 font-semibold">
                PREMIER MOTORSPORT & SKY DINING
              </span>
            </div>

            {/* Minimal Brand Monogram */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl font-display font-black tracking-tighter text-white uppercase">
                24<span className="text-brand-red">OURS</span>
              </h1>
              <p className="text-[11px] font-mono tracking-[0.4em] uppercase text-carbon-400 font-medium">
                DRIFT & DINE DESTINATION
              </p>
            </div>

            {/* Minimal Cinematic Start Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => startSequence(true)}
                className="group relative px-7 py-3.5 rounded-2xl bg-gradient-to-r from-brand-red to-red-600 text-white font-mono text-xs font-bold uppercase tracking-[0.2em] shadow-glow-red hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border border-red-500/30"
              >
                <Volume2 className="w-4 h-4 text-white animate-pulse" />
                <span>ENTER WITH SOUND</span>
                <ChevronRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => startSequence(false)}
                className="px-5 py-3.5 rounded-2xl bg-carbon-900/80 border border-white/15 text-carbon-300 hover:text-white hover:border-white/30 font-mono text-xs font-medium uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-2"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>ENTER MUTED</span>
              </button>
            </div>

            <p className="text-[10px] font-mono text-carbon-500 pt-2 tracking-widest">
              BEST EXPERIENCED WITH STEREO AUDIO • [ESC] TO SKIP
            </p>
          </div>
        </div>
      )}

      {/* 5. Central Illuminated Emerging Logo (Stage 4) */}
      {stage >= 4 && stage <= 5 && (
        <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4 text-center pointer-events-none">
          {/* Powerful Neon Backlight Flare */}
          <div className="absolute w-[500px] h-[350px] bg-brand-red/30 rounded-full blur-[150px] animate-pulse" />
          
          <div className="space-y-4 max-w-2xl mx-auto relative animate-cinematic-logo-emerge">
            
            {/* Speed Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-red/20 border border-brand-red/60 backdrop-blur-md shadow-glow-red">
              <Zap className="w-3.5 h-3.5 text-brand-red" />
              <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase text-white">
                MALUR • BENGALURU CORRIDOR
              </span>
            </div>

            {/* Glowing Chrome Logo Text */}
            <div className="space-y-2">
              <h1 className="text-6xl sm:text-8xl md:text-9xl font-display font-black tracking-tight text-white uppercase drop-shadow-[0_0_35px_rgba(225,6,0,0.85)]">
                24<span className="text-brand-red animate-pulse">OURS</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg font-mono tracking-[0.45em] sm:tracking-[0.6em] text-white/90 uppercase font-bold text-glow-red">
                DRIFT • DINE • EXPERIENCE
              </p>
            </div>

            {/* Sub-tagline */}
            <p className="text-xs font-mono tracking-[0.25em] text-carbon-300 uppercase pt-2">
              INTERNATIONAL MOTORSPORT & LUXURY ENTERTAINMENT
            </p>
          </div>
        </div>
      )}

      {/* 6. Discrete Skip Control (Top Right) */}
      <div className="absolute top-6 right-6 z-40">
        <button
          onClick={skipIntro}
          className="px-3.5 py-1.5 rounded-full bg-carbon-900/60 border border-white/10 hover:border-brand-red/50 text-[11px] font-mono uppercase tracking-widest text-carbon-400 hover:text-white backdrop-blur-md transition-all flex items-center gap-1.5"
          aria-label="Skip cinematic introduction"
        >
          <span>SKIP INTRO</span>
          <span className="text-[9px] text-carbon-500 hidden sm:inline">[ESC]</span>
        </button>
      </div>

      {/* 7. Bottom Telemetry Status during Sequence */}
      {hasStarted && stage < 5 && (
        <div className="absolute bottom-6 left-6 right-6 z-40 flex items-center justify-between text-[10px] font-mono text-carbon-400 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
            <span className="text-white uppercase font-bold">
              {stage === 1 && "IGNITION • INITIALIZING TELEMETRY"}
              {stage === 2 && "APEX ACCELERATION • HIGH SPEED PASS"}
              {stage === 3 && "CHICANE DRIFT • DEPLOYING VOLUMETRIC AERO"}
              {stage === 4 && "24OURS FLAGSHIP DESTINATION ENGAGED"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span>SOUND: {isMuted ? "MUTED" : "SYNTHESIS ACTIVE"}</span>
            <span>•</span>
            <span className="text-brand-red">RPM: {stage * 3200 + 1200}</span>
          </div>
        </div>
      )}
    </div>
  );
}

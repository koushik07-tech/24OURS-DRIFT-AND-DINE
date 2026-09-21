"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, Volume2, VolumeX, Flag, ArrowRight, Calendar, Compass, Play, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";
import { soundEngine } from "@/lib/soundEngine";
import CinematicIntro from "@/components/cinematic/CinematicIntro";

interface S1HeroProps {
  onReplayIntro?: () => void;
}

export default function S1_Hero({ onReplayIntro }: S1HeroProps) {
  const { openBookingModal } = useBooking();
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [activeSpeed, setActiveSpeed] = useState(84);
  const [showIntro, setShowIntro] = useState(true);
  const [introKey, setIntroKey] = useState(0);

  useEffect(() => {
    // Dynamic telemetry speed simulation
    const interval = setInterval(() => {
      setActiveSpeed((prev) => 78 + Math.floor(Math.random() * 12));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playClick(650);
    }
  };

  const handleReplay = () => {
    soundEngine.playClick(700);
    setIntroKey((prev) => prev + 1);
    setShowIntro(true);
    if (onReplayIntro) onReplayIntro();
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-32 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 bg-[#070709] overflow-hidden select-none"
    >
      {/* Cinematic Opening Sequence */}
      {showIntro && (
        <CinematicIntro
          key={introKey}
          forceShow={introKey > 0}
          onComplete={() => setShowIntro(false)}
        />
      )}

      {/* 1. Fullscreen Background Video & Motorsport Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={mediaConfig.posters.hero}
          className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000"
        >
          <source src={mediaConfig.videos.hero} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#070709]/95 via-[#070709]/60 to-[#070709]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/90 via-transparent to-[#070709]/90" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-red/15 rounded-full blur-[180px] pointer-events-none" />
      </div>

      {/* Top Floating Telemetry HUD Strip */}
      <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        
        {/* Track Live Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-carbon-900/80 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-400 font-bold uppercase tracking-wider">TRACK STATUS: GREEN FLAG</span>
          <span className="text-carbon-400 hidden sm:inline">• HOT LAP SESSION ACTIVE</span>
        </div>

        {/* Action Controls: Sound & Replay Intro */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            className="px-3 py-1.5 rounded-full bg-carbon-900/80 border border-white/10 hover:border-brand-red/60 text-carbon-300 hover:text-white backdrop-blur-md transition-all text-xs font-mono flex items-center gap-1.5"
            title="Watch cinematic movie opening sequence again"
          >
            <Play className="w-3.5 h-3.5 text-brand-red" />
            <span>REPLAY INTRO</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="px-3 py-1.5 rounded-full bg-carbon-900/80 border border-white/15 text-white hover:border-brand-red backdrop-blur-md transition-all text-xs font-mono flex items-center gap-2"
            aria-label="Toggle sound"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-carbon-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-brand-red animate-pulse" />
            )}
            <span className="text-[10px] uppercase text-carbon-300">{isMuted ? "MUTED" : "AUDIO ON"}</span>
          </button>
        </div>
      </div>

      {/* Hero Central Typography & Telemetry Center */}
      <div className="max-w-6xl mx-auto text-center my-auto relative z-10 w-full space-y-4 sm:space-y-6 md:space-y-7 py-4 sm:py-6">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-2 shadow-glow-red backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
            {siteConfig.location.city}, {siteConfig.location.state}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-carbon-300 bg-carbon-900/80 border border-white/10 backdrop-blur-md">
            <Zap className="w-3 h-3 text-amber-400" />
            TOP VELOCITY: {activeSpeed} KM/H
          </span>
        </div>

        {/* Cinematic Headline */}
        <div className="space-y-1 sm:space-y-2">
          <h1 className="font-display font-black tracking-tight text-white uppercase text-center mx-auto max-w-full">
            <span className="block text-[clamp(2.75rem,8.5vw,7.5rem)] leading-[0.95] tracking-tight drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              24OURS
            </span>
            <span className="block bg-gradient-to-r from-brand-red via-red-400 to-white bg-clip-text text-transparent text-[clamp(1.4rem,4.4vw,3.9rem)] leading-[1.12] tracking-normal sm:tracking-tight mt-1 sm:mt-2 text-glow-red">
              DRIFT. DINE. EXPERIENCE.
            </span>
          </h1>

          <p className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.2em] sm:tracking-[0.35em] md:tracking-[0.45em] text-brand-red uppercase font-semibold pt-1 sm:pt-2">
            {siteConfig.legalName}
          </p>
        </div>

        <p className="text-carbon-200 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-sans leading-relaxed px-2">
          South India’s premier entertainment sports hub. High-speed electric karting, suspended 360° horizon dining, competitive RC arena, and grand banquet architecture.
        </p>

        {/* Action Hooks (Strictly No Pricing) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4">
          <button
            onClick={() => {
              soundEngine.playClick(600);
              openBookingModal("Electric Go-Karting Grand Prix");
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-red to-red-600 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider hover:from-brand-redDark hover:to-red-700 shadow-glow-red transition-all flex items-center justify-center gap-2 border border-red-500/30"
          >
            <Calendar className="w-4 h-4" />
            <span>BOOK NOW</span>
          </button>

          <a
            href="#karting"
            onClick={() => soundEngine.playClick(500)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-carbon-900/90 border border-white/15 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider hover:border-brand-red hover:bg-carbon-850 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <span>EXPLORE EXPERIENCES</span>
            <ArrowRight className="w-4 h-4 text-brand-red" />
          </a>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="max-w-7xl mx-auto w-full pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-carbon-400 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white">
            <Compass className="w-4 h-4 text-brand-red" />
            GPS: {siteConfig.location.coordinates}
          </span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">{siteConfig.location.accessNote}</span>
        </div>

        <a
          href="#intro"
          onClick={() => soundEngine.playHover()}
          className="flex items-center gap-2 text-carbon-400 hover:text-brand-red transition-colors group py-1"
        >
          <span className="uppercase tracking-widest text-[11px] font-semibold">SCROLL TO DISCOVER</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-brand-red" />
        </a>
      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ChevronDown,
  Volume2,
  VolumeX,
  ArrowRight,
  Calendar,
  Compass,
  Play,
  Zap,
  Activity,
  Gauge,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";
import { soundEngine } from "@/lib/soundEngine";
import MagneticButton from "@/components/ui/MagneticButton";

const CinematicHeroKart = dynamic(() => import("@/components/3d/CinematicHeroKart"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] sm:h-[440px] flex flex-col items-center justify-center space-y-3">
      <div className="w-14 h-14 rounded-full border-2 border-white/20 border-t-[#FF5A36] animate-spin" />
      <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
        Preparing 3D Racing Experience...
      </span>
    </div>
  ),
});

export default function S1_Hero() {
  const { openBookingModal } = useBooking();
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [activeSpeed, setActiveSpeed] = useState(84);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const parallaxGridX = useSpring(useTransform(mouseX, [-1, 1], [-25, 25]), springConfig);
  const parallaxGridY = useSpring(useTransform(mouseY, [-1, 1], [-25, 25]), springConfig);
  const parallaxOrbX = useSpring(useTransform(mouseX, [-1, 1], [35, -35]), springConfig);
  const parallaxOrbY = useSpring(useTransform(mouseY, [-1, 1], [35, -35]), springConfig);

  useEffect(() => {
    // Dynamic telemetry speed simulation
    const interval = setInterval(() => {
      setActiveSpeed((prev) => 78 + Math.floor(Math.random() * 12));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playClick(650);
    }
  };


  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-28 sm:pt-32 pb-10 px-4 sm:px-6 lg:px-8 bg-[#060608] overflow-hidden select-none"
    >
      {/* 1. Mouse-Tracking Parallax Background Grid & Ambiance */}
      <motion.div
        style={{ x: parallaxGridX, y: parallaxGridY }}
        className="absolute -inset-10 z-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute inset-0 subtle-racing-grid opacity-70" />
      </motion.div>

      {/* Video Backdrop with Deep Obsidian Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={mediaConfig.posters.hero}
          className="w-full h-full object-cover opacity-25 scale-105 transition-transform duration-1000"
        >
          <source src={mediaConfig.videos.hero} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#060608] via-[#060608]/75 to-[#060608]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060608]/90 via-transparent to-[#060608]/90" />
      </div>

      {/* Dynamic Cursor-Reacting Crimson Glowing Orb */}
      <motion.div
        style={{ x: parallaxOrbX, y: parallaxOrbY }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-br from-brand-crimson/25 via-brand-red/15 to-transparent rounded-full blur-[160px] pointer-events-none z-0"
      />

      {/* Top Floating Telemetry HUD Strip */}
      <div className="max-w-7xl mx-auto w-full relative z-20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Track Live Status with neon pulsing beacon */}
        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full liquid-glass border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
            TRACK STATUS: GREEN FLAG
          </span>
          <span className="text-zinc-400 hidden sm:inline text-[11px]">&bull; HOT LAP SESSION ACTIVE</span>
        </div>

        {/* Action Controls: Replay Intro & Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.playClick(700);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-3.5 py-1.5 rounded-full liquid-glass hover:border-[#FF5A36]/60 text-zinc-300 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5 group shadow-lg"
            title="Watch camera telemetry boost"
          >
            <Play className="w-3.5 h-3.5 text-[#FF5A36] group-hover:scale-110 transition-transform fill-current" />
            <span className="tracking-wider">REPLAY INTRO</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="px-3.5 py-1.5 rounded-full liquid-glass hover:border-[#FF5A36]/60 text-white transition-all text-xs font-mono flex items-center gap-2 shadow-lg"
            aria-label="Toggle sound"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#FF5A36] animate-pulse" />
            )}
            <span className="text-[10px] uppercase text-zinc-300 tracking-wider">{isMuted ? "MUTED" : "AUDIO ON"}</span>
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Visual Stack with Centered 3D Kinetic Core & Futuristic Typography */}
      <div className="max-w-6xl mx-auto text-center my-auto relative z-10 w-full py-2 sm:py-4">
        
        {/* LOCATION & TELEMETRY CHIPS (Centered directly above main title) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-3 sm:mb-5"
        >
          <span className="px-3.5 py-1.5 rounded-full text-xs font-mono liquid-glass text-[#FF5A36] border border-[#FF5A36]/40 uppercase font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(255,90,54,0.3)]">
            <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-ping" />
            {siteConfig.location.city}, {siteConfig.location.state}
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono liquid-glass text-zinc-200 border border-white/10">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            TOP VELOCITY: <span className="text-white font-bold">{activeSpeed} KM/H</span>
          </span>
        </motion.div>

        {/* Centered 3D Interactive Canvas Feature: Realistic Cinematic Go-Kart */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="my-3 relative w-full max-w-4xl mx-auto h-[360px] sm:h-[450px] lg:h-[480px] rounded-3xl overflow-hidden liquid-glass border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
        >
          <CinematicHeroKart />
        </motion.div>

        {/* Futuristic Bold Typography */}
        <div className="space-y-1 sm:space-y-2 mt-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-display font-black tracking-tight text-white uppercase text-center mx-auto max-w-full"
          >
            <span className="block text-[clamp(3.5rem,11.5vw,9.5rem)] leading-[0.92] tracking-tight drop-shadow-[0_0_35px_rgba(255,255,255,0.25)] text-glow-white">
              24OURS
            </span>
            <span className="block bg-gradient-to-r from-[#FF5A36] via-[#ff7454] to-[#F59E0B] bg-clip-text text-transparent text-[clamp(1.35rem,4.4vw,3.8rem)] leading-[1.12] tracking-normal sm:tracking-tight mt-1 text-glow-coral font-orbitron font-extrabold">
              DRIFT. DINE. EXPERIENCE.
            </span>
          </motion.h1>

          <p className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.25em] sm:tracking-[0.4em] text-[#FF5A36] uppercase font-bold pt-1">
            {siteConfig.legalName}
          </p>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-zinc-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-sans leading-relaxed px-2 mt-4"
        >
          South India’s premier entertainment sports hub. High-speed electric karting, suspended 360° horizon dining, competitive RC arena, and grand banquet architecture.
        </motion.p>

        {/* Liquid Glass Hero CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 pt-6"
        >
          <button
            onClick={() => {
              soundEngine.playClick(600);
              openBookingModal("Electric Go-Karting Grand Prix");
            }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF5A36] to-[#ff3b14] hover:brightness-110 active:scale-95 text-white font-display font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(255,90,54,0.45)] transition-all flex items-center justify-center gap-2 border border-red-500/30"
          >
            <Calendar className="w-4 h-4" />
            <span>BOOK NOW</span>
          </button>

          <a
            href="#karting"
            onClick={() => soundEngine.playClick(500)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full liquid-glass hover:bg-white/10 active:scale-95 text-white font-display font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-white/20"
          >
            <span>EXPLORE EXPERIENCES</span>
            <ArrowRight className="w-4 h-4 text-[#FF5A36]" />
          </a>
        </motion.div>
      </div>

      {/* Telemetry Footer Strip */}
      <div className="max-w-7xl mx-auto w-full pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-white">
            <Compass className="w-4 h-4 text-[#FF5A36]" />
            GPS: <span className="text-zinc-200">{siteConfig.location.coordinates}</span>
          </span>
          <span className="hidden md:inline text-zinc-600">&bull;</span>
          <span className="hidden md:inline text-zinc-400">{siteConfig.location.accessNote}</span>
        </div>

        <a
          href="#intro"
          onClick={() => soundEngine.playHover()}
          className="flex items-center gap-2 text-zinc-400 hover:text-[#FF5A36] transition-colors group py-1"
        >
          <span className="uppercase tracking-widest text-[11px] font-semibold">SCROLL TO DISCOVER</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-[#FF5A36]" />
        </a>
      </div>
    </section>
  );
}

"use client";

import React, { useState } from "react";
import { Video, Radio, Tv, Instagram, Play, Sparkles, ExternalLink, Calendar } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { siteConfig } from "@/config/site";
import { useBooking } from "@/context/BookingContext";

export default function S9_LiveStreaming() {
  const { openBookingModal } = useBooking();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="live-stream" className="py-24 sm:py-32 bg-carbon-950 border-b border-white/10 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-brand-red/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
              Live Broadcasting & Stadium Screening
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              WATCH <span className="text-brand-red">LIVE.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              Catch multi-angle live streams of intense karting finals, RC buggy shootouts, and stadium broadcast screenings of global Formula 1 and MotoGP races.
            </p>
          </div>

          <a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 via-red-600 to-amber-500 text-white font-mono text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 self-start lg:self-auto shadow-lg"
          >
            <Instagram className="w-4 h-4" />
            <span>INSTAGRAM LIVE FEED</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Live Video Player / Broadcast Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* Main Video Stream Container */}
          <div className="lg:col-span-8 rounded-3xl bg-carbon-900 border border-white/15 overflow-hidden shadow-2xl relative group">
            <div className="relative aspect-video w-full bg-black">
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={mediaConfig.posters.karting}
                className="w-full h-full object-cover opacity-80"
              >
                <source src={mediaConfig.videos.liveStream || mediaConfig.videos.karting} type="video/mp4" />
              </video>

              {/* Stream Overlay HUD */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-brand-red text-white flex items-center gap-1.5 shadow-glow-red">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  LIVE ON AIR
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-black/70 text-white border border-white/10 backdrop-blur-md">
                  PADDOCK CAM 04 • MALUR, KOLAR, KARNATAKA
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4 text-brand-red" />
                  <span className="truncate">Current Session: Weekend Super Cup Heats</span>
                </div>
                <span className="text-emerald-400 font-bold hidden sm:inline">1080p 60FPS LOW LATENCY</span>
              </div>
            </div>
          </div>

          {/* Right: In-Venue Screening Highlights */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="p-6 rounded-3xl bg-carbon-900 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase">
                <Tv className="w-4 h-4 text-brand-red" />
                <span>Stadium Screening Schedule</span>
              </div>
              <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                Watch high-definition live screenings of international motorsport championships, Formula 1 Grand Prix races, and premier sporting events on stadium LED walls.
              </p>
              <div className="space-y-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 rounded-xl bg-carbon-950 border border-white/5 flex items-center justify-between text-carbon-300">
                  <span>Grand Prix Race Night</span>
                  <span className="text-brand-red font-bold">Every Sunday</span>
                </div>
                <div className="p-2.5 rounded-xl bg-carbon-950 border border-white/5 flex items-center justify-between text-carbon-300">
                  <span>RC Community Shootout</span>
                  <span className="text-brand-red font-bold">Every Saturday</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-carbon-900 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-white font-mono text-xs font-bold uppercase">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Stream Your Race Heat</span>
              </div>
              <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                Every driver receives an automated cloud telemetry link with their session lap highlights and podium telemetry.
              </p>
              <button
                onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
                className="w-full py-2.5 rounded-xl bg-carbon-850 hover:bg-brand-red text-white text-xs font-mono font-bold uppercase border border-white/10 transition-all"
              >
                BOOK TO GET RECORDED
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

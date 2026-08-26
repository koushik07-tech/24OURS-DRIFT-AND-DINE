"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Flame, Trophy, Video, Instagram, Award, Sparkles, ArrowRight, Share2, Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useBooking } from "@/context/BookingContext";

export default function S12_WeeklyContests() {
  const { openBookingModal } = useBooking();
  const [reelSubmitted, setReelSubmitted] = useState(false);
  const [reelLink, setReelLink] = useState("");

  const handleReelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reelLink) {
      setReelSubmitted(true);
    }
  };

  return (
    <section id="contests" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
              <Flame className="w-3.5 h-3.5" />
              Weekly Challenges & Creator Contests
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              WEEKLY CONTESTS & <span className="text-brand-red">REWARDS.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              Open-enrollment challenges for drivers, creators, and speed enthusiasts. Set the pace or capture the adrenaline on video to win exclusive passes!
            </p>
          </div>
        </div>

        {/* Winner Ticker Strip */}
        <div className="p-4 sm:p-5 rounded-2xl bg-carbon-950 border border-brand-red/40 shadow-glow-red flex flex-col sm:flex-row items-center justify-between gap-4 text-left font-mono">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-brand-red text-white text-xs font-bold uppercase">
              THIS WEEK'S WINNERS
            </span>
            <span className="text-xs text-white">
              👑 Karting P1: <strong className="text-brand-red">Vikram R. (31.428s)</strong> • 🎥 Best Reel Winner: <strong className="text-amber-400">@racer_drift_ka (4 Hrs Free Pass)</strong>
            </span>
          </div>
          <span className="text-[10px] text-carbon-400 uppercase hidden md:inline">
            Next Reset in: 3 Days 14 Hours
          </span>
        </div>

        {/* 3 Main Contest Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          {/* Card 1: Top 30 Free Karting */}
          <div className="p-8 rounded-3xl bg-carbon-950 border border-white/10 space-y-6 flex flex-col justify-between glass-panel-hover">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-red/20 text-brand-red border border-brand-red/40 flex items-center justify-center">
                <Trophy className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-brand-red uppercase font-bold tracking-wider">
                Telemetry Shootout
              </span>
              <h3 className="text-xl font-display font-bold text-white uppercase">
                TOP 30 FREE KARTING PROMO
              </h3>
              <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                Every customer lap time is automatically logged. The top 30 fastest lap times by Sunday midnight earn a free 15-minute Grand Prix pass!
              </p>
            </div>

            <button
              onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
              className="w-full py-3 rounded-xl bg-brand-red hover:bg-brand-redDark text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-glow-red"
            >
              <span>ENTER CIRCUIT NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Best Reel of the Week */}
          <div className="p-8 rounded-3xl bg-carbon-950 border border-pink-500/30 space-y-6 flex flex-col justify-between glass-panel-hover shadow-lg">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center">
                <Instagram className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-pink-400 uppercase font-bold tracking-wider">
                Creator Spotlight
              </span>
              <h3 className="text-xl font-display font-bold text-white uppercase">
                BEST REEL OF THE WEEK
              </h3>
              <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                Post your 24Ours drift or dining edit on Instagram tagging <strong className="text-white">#24OursDriftAndDine</strong>. Winner gets up to <strong>4 hours complimentary venue access</strong> (excludes food & beverages)!
              </p>
            </div>

            {reelSubmitted ? (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold text-center">
                ✓ REEL LINK SUBMITTED FOR REVIEW
              </div>
            ) : (
              <form onSubmit={handleReelSubmit} className="space-y-2">
                <input
                  type="url"
                  required
                  value={reelLink}
                  onChange={(e) => setReelLink(e.target.value)}
                  placeholder="Paste Instagram Reel Link..."
                  className="w-full px-3.5 py-2 bg-carbon-900 border border-white/10 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <span>SUBMIT REEL ENTRY</span>
                </button>
              </form>
            )}
          </div>

          {/* Card 3: Launch Inauguration Special */}
          <div className="p-8 rounded-3xl bg-carbon-950 border border-amber-500/30 space-y-6 flex flex-col justify-between glass-panel-hover">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                Inaugural Milestone
              </span>
              <h3 className="text-xl font-display font-bold text-white uppercase">
                FIRST 1,000 COLLECTOR REWARD
              </h3>
              <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                The first 1,000 registered drivers visiting 24Ours receive an exclusive, limited-edition 24Ours commemorative racing T-shirt and cap upon check-in.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-carbon-900 border border-white/10 text-center font-mono text-xs text-carbon-300">
              <span className="text-amber-400 font-bold">642 / 1,000 Claimed</span> • While Stocks Last
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

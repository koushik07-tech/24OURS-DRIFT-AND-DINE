"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Compass, Wine, Clock, Users, Calendar, Utensils, Check, Sparkles, Eye, Image as ImageIcon } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";
import { soundEngine } from "@/lib/soundEngine";

const DiningScene = dynamic(() => import("@/components/3d/DiningScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[380px] lg:h-[460px] rounded-3xl bg-carbon-950 border border-white/10 flex items-center justify-center text-carbon-400 font-mono text-xs animate-pulse">
      INITIALIZING 3D SKY DECK...
    </div>
  ),
});

export default function S5_Restaurant() {
  const { openBookingModal } = useBooking();
  const [viewMode, setViewMode] = useState<"3d" | "photo">("3d");

  const diningHighlights = [
    { title: "Floor-to-Ceiling Glass Architecture", desc: "Suspended 360° vantage deck overlooking the entire go-karting circuit and Malur, Kolar horizon." },
    { title: "Artisanal Global Gastronomy", desc: "Mastercrafted dry-aged steaks, firewood pizzas, delicate seafood, and signature desserts." },
    { title: "Craft Molecular Mocktail Lounge", desc: "Botanical infusions, nitrogen smoke presentation, and golden-hour sunset pairings." },
    { title: "Private VIP Dining Pods", desc: "Dedicated celebration booths with personalized service and horizon vantage seating." },
  ];

  return (
    <section id="restaurant" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      {/* Amber Warm Glow Backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-amber-500/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase font-bold flex items-center gap-1.5 w-fit">
              <Compass className="w-3.5 h-3.5" />
              Panoramic Sky Dining
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              360° SIGNATURE RESTAURANT.
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
              Dine suspended above the high-speed circuit while taking in sunset horizon views and artisanal global culinary creations.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-carbon-950 border border-white/15">
              <button
                onClick={() => {
                  setViewMode("3d");
                  soundEngine.playClick(650);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  viewMode === "3d" ? "bg-amber-400 text-black font-bold" : "text-carbon-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>3D Deck</span>
              </button>
              <button
                onClick={() => {
                  setViewMode("photo");
                  soundEngine.playClick(650);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  viewMode === "photo" ? "bg-amber-400 text-black font-bold" : "text-carbon-400 hover:text-white"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Gallery</span>
              </button>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick(600);
                openBookingModal("360° Panoramic Sky Restaurant");
              }}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-mono text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>RESERVE TABLE</span>
            </button>
          </div>
        </div>

        {/* Ambient 3D / Photo & Highlights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: 3D Scene or Atmospheric Photo Card */}
          <div className="lg:col-span-6">
            {viewMode === "3d" ? (
              <DiningScene />
            ) : (
              <div className="h-[380px] lg:h-[460px] rounded-3xl bg-carbon-950 border border-white/15 overflow-hidden shadow-card-elevated relative group">
                <img
                  src={mediaConfig.posters.restaurant}
                  alt="360 Sky Restaurant"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-left space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase">Golden Hour & Night Sky Deck</span>
                  <h4 className="text-lg font-display font-bold text-white uppercase">THE ELEVATED CULINARY DECK</h4>
                </div>
              </div>
            )}
          </div>

          {/* Right: Highlights List */}
          <div className="lg:col-span-6 space-y-4 text-left">
            {diningHighlights.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-carbon-950 border border-white/10 space-y-1 glass-panel-hover"
              >
                <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-carbon-400 font-sans pl-6 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

"use client";

import React from "react";
import { Compass, Wine, Clock, Users, Calendar, Utensils, Check } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S5_Restaurant() {
  const { openBookingModal } = useBooking();

  const diningHighlights = [
    { title: "Floor-to-Ceiling Glass Architecture", desc: "Suspended 360° vantage deck overlooking the entire go-karting circuit and Malur, Kolar horizon." },
    { title: "Artisanal Global Gastronomy", desc: "Mastercrafted dry-aged steaks, firewood pizzas, delicate seafood, and signature desserts." },
    { title: "Craft Molecular Mocktail Lounge", desc: "Botanical infusions, nitrogen smoke presentation, and golden-hour sunset pairings." },
    { title: "Private VIP Dining Pods", desc: "Dedicated celebration booths with personalized service and horizon vantage seating." },
  ];

  return (
    <section id="restaurant" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit">
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

          <button
            onClick={() => openBookingModal("360° Panoramic Sky Restaurant")}
            className="px-6 py-3.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2 self-start lg:self-auto"
          >
            <Calendar className="w-4 h-4" />
            <span>RESERVE TABLE</span>
          </button>
        </div>

        {/* Ambient Video & Culinary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Atmospheric Video Card */}
          <div className="lg:col-span-6 rounded-3xl bg-carbon-950 border border-white/15 overflow-hidden shadow-card-elevated relative group">
            <div className="h-96 relative overflow-hidden">
              <img
                src={mediaConfig.posters.restaurant}
                alt="360 Sky Restaurant"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/40 to-transparent" />
            </div>

            <div className="p-6 text-left space-y-2">
              <span className="text-[10px] font-mono text-brand-red uppercase">Golden Hour & Late Night Lounge</span>
              <h4 className="text-lg font-display font-bold text-white uppercase">
                THE ELEVATED CULINARY DECK
              </h4>
              <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                Watch karts battle below at the apex while savoring gourmet creations crafted by international culinary talent.
              </p>
            </div>
          </div>

          {/* Right: Highlights List */}
          <div className="lg:col-span-6 space-y-4 text-left">
            {diningHighlights.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-carbon-950 border border-white/10 space-y-1 glass-panel-hover"
              >
                <div className="flex items-center gap-2 text-white font-heading font-bold text-sm">
                  <Check className="w-4 h-4 text-brand-red shrink-0" />
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

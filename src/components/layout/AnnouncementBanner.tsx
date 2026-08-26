"use client";

import React, { useState } from "react";
import { Sparkles, GraduationCap, X, Flame, Clock } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-brand-redDark via-brand-red to-orange-600 text-white text-xs font-mono py-2 px-4 relative z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs">
        
        {/* Left item: Student Offer */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-black/30 rounded-md font-bold uppercase flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            STUDENT PERK
          </span>
          <span className="font-semibold tracking-wide">
            {siteConfig.promotions.studentOffer}
          </span>
        </div>

        {/* Center / Right item: Launch & 24hr note */}
        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center gap-1 text-white/90">
            <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            {siteConfig.promotions.launchOffer}
          </span>
          <span className="text-white/40">•</span>
          <span className="flex items-center gap-1 text-white/90">
            <Clock className="w-3.5 h-3.5" />
            Open 24/7 (Maintenance 4 AM – 7 AM)
          </span>
        </div>

        {/* Close banner */}
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-black/20 rounded text-white/80 hover:text-white transition-colors ml-auto sm:ml-0"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
}

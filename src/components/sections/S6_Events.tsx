"use client";

import React from "react";
import { Building2, Send, Check, Users, Award, Calendar } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S6_Events() {
  const { openEnquiryModal } = useBooking();

  const eventFormats = [
    {
      title: "Corporate Grand Prix & Summit",
      badge: "Team Building",
      desc: "Private track heats with live podium ceremonies followed by executive boardroom and banquet hall catering.",
    },
    {
      title: "Milestone Birthday Celebrations",
      badge: "Celebration",
      desc: "High-energy private karting tournament, reserved sky dining lounge, and thematic motorsport styling.",
    },
    {
      title: "Weddings, Sangeets & Receptions",
      badge: "Grand Occasion",
      desc: "Sprawling luxury banquet hall with stage production, concert lighting, and multi-course bespoke dining.",
    },
    {
      title: "Product Launches & Auto Meets",
      badge: "Showcase",
      desc: "Dedicated automotive staging paddocks, high-definition projection, and amphitheater screening zones.",
    },
  ];

  return (
    <section id="events" className="py-24 sm:py-32 bg-carbon-950 border-b border-white/10 subtle-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit">
              <Building2 className="w-3.5 h-3.5" />
              Grand Banquet Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              EVENT & BANQUET HALLS.
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
              Full-service turnkey event production with modular acoustic staging, concert sound, and world-class hospitality.
            </p>
          </div>

          <button
            onClick={() => openEnquiryModal()}
            className="px-6 py-3.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2 self-start lg:self-auto"
          >
            <Send className="w-4 h-4" />
            <span>ENQUIRE NOW</span>
          </button>
        </div>

        {/* 4 Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eventFormats.map((ev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-carbon-900 border border-white/10 glass-panel-hover text-left space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-carbon-850 text-brand-red border border-brand-red/30 uppercase font-bold">
                  {ev.badge}
                </span>
                <h3 className="text-xl font-display font-bold text-white uppercase">{ev.title}</h3>
                <p className="text-xs sm:text-sm text-carbon-400 font-sans leading-relaxed">{ev.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-mono text-carbon-500 uppercase">Turnkey Coordination Included</span>
                <button
                  onClick={() => openEnquiryModal()}
                  className="text-xs font-mono text-brand-red hover:text-white transition-colors"
                >
                  Request Quote →
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

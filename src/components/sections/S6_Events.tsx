"use client";

import React from "react";
import { Building2, Send, Check, Users, Award, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";
import Card3D from "@/components/ui/Card3D";
import MagneticButton from "@/components/ui/MagneticButton";
import MotionReveal from "@/components/ui/MotionReveal";

export default function S6_Events() {
  const { openEnquiryModal } = useBooking();

  const eventFormats = [
    {
      title: "Corporate Grand Prix & Summit",
      badge: "Team Building",
      desc: "Private track heats with live podium ceremonies followed by executive boardroom and banquet hall catering.",
      capacity: "Up to 250 Guests",
    },
    {
      title: "Milestone Birthday Celebrations",
      badge: "Celebration",
      desc: "High-energy private karting tournament, reserved sky dining lounge, and thematic motorsport styling.",
      capacity: "Bespoke Groups",
    },
    {
      title: "Weddings, Sangeets & Receptions",
      badge: "Grand Occasion",
      desc: "Sprawling luxury banquet hall with stage production, concert lighting, and multi-course bespoke dining.",
      capacity: "Grand Scale Ballrooms",
    },
    {
      title: "Product Launches & Auto Meets",
      badge: "Showcase",
      desc: "Dedicated automotive staging paddocks, high-definition projection, and amphitheater screening zones.",
      capacity: "Full Campus Access",
    },
  ];

  return (
    <section id="events" className="py-24 sm:py-32 bg-[#060608] border-b border-white/10 subtle-grid relative overflow-hidden">
      {/* Dynamic Crimson Radial Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[650px] h-[450px] bg-brand-crimson/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <MotionReveal direction="left" className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-[0_0_15px_rgba(255,46,0,0.35)]">
              <Building2 className="w-3.5 h-3.5" />
              Grand Banquet Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              EVENT & BANQUET <span className="text-brand-crimson font-orbitron text-glow-red">HALLS.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
              Full-service turnkey event production with modular acoustic staging, concert sound, and world-class hospitality.
            </p>
          </MotionReveal>

          <MotionReveal direction="right">
            <MagneticButton
              variant="primary"
              onClick={() => openEnquiryModal()}
              className="px-6 py-3.5 text-xs self-start lg:self-auto"
            >
              <Send className="w-4 h-4" />
              <span>ENQUIRE NOW</span>
            </MagneticButton>
          </MotionReveal>
        </div>

        {/* 4 Event Cards in 3D Perspective Scroll Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 perspective-1200">
          {eventFormats.map((ev, idx) => (
            <MotionReveal key={idx} delay={idx * 0.1} direction="up">
              <Card3D depth={20} className="bg-carbon-900/60 border border-white/10 backdrop-blur-xl h-full">
                <div className="p-8 text-left space-y-5 flex flex-col justify-between h-full">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-carbon-950 text-brand-crimson border border-brand-crimson/30 uppercase font-bold">
                        {ev.badge}
                      </span>
                      <span className="text-[10px] font-mono text-carbon-400 uppercase">
                        {ev.capacity}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-display font-bold text-white uppercase pt-1">
                      {ev.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-carbon-300 font-sans leading-relaxed">
                      {ev.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-carbon-500 uppercase flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-brand-crimson" />
                      Turnkey Production Included
                    </span>
                    <button
                      onClick={() => openEnquiryModal()}
                      className="text-xs font-mono text-brand-crimson hover:text-white transition-colors flex items-center gap-1 font-bold group"
                    >
                      <span>Request Proposal</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </Card3D>
            </MotionReveal>
          ))}
        </div>

      </div>
    </section>
  );
}

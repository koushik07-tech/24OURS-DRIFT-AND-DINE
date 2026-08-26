"use client";

import React from "react";
import { Briefcase, Building, Trophy, Users, Shield, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function S15_CorporateCCC() {
  const { openEnquiryModal } = useBooking();

  const cccHighlights = [
    { title: "Exclusive Circuit Takeover", desc: "Private access to the entire go-karting track with company telemetry branding on all stadium LED displays." },
    { title: "Team Relay Endurance Cup", desc: "Cohesive team-based endurance formats with driver changeovers, strategy pits, and trophy ceremonies." },
    { title: "Executive Meeting & Banquet Facilities", desc: "High-speed Wi-Fi, audio-visual projection, and boardroom configurations paired with gourmet catering." },
    { title: "Turnkey Corporate Concierge", desc: "Dedicated on-site event coordinator handling registration, timing printouts, custom merchandise, and transport." },
  ];

  return (
    <section id="corporate-ccc" className="py-24 sm:py-32 bg-carbon-950 border-b border-white/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-red/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
              <Briefcase className="w-3.5 h-3.5" />
              Corporate Company Collaboration (CCC)
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              CORPORATE <span className="text-brand-red">PARTNERSHIPS.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              Transform your corporate offsites, annual retreats, and product celebrations into unforgettable high-speed experiences along the Bengaluru–Chikkaballapura highway corridor.
            </p>
          </div>

          <button
            onClick={() => openEnquiryModal()}
            className="px-6 py-3.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2 self-start lg:self-auto"
          >
            <Send className="w-4 h-4" />
            <span>ENQUIRE FOR CORPORATE PACKAGES</span>
          </button>
        </div>

        {/* 4 Feature Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {cccHighlights.map((item, idx) => (
            <div
              key={idx}
              className="p-7 rounded-3xl bg-carbon-900 border border-white/10 space-y-3 flex flex-col justify-between glass-panel-hover"
            >
              <div className="space-y-2">
                <CheckCircle2 className="w-5 h-5 text-brand-red" />
                <h3 className="text-base font-display font-bold text-white uppercase">{item.title}</h3>
                <p className="text-xs text-carbon-400 font-sans leading-relaxed">{item.desc}</p>
              </div>
              <span className="text-[10px] font-mono text-carbon-500 uppercase pt-2 border-t border-white/5 block">
                CCC Enterprise Tier
              </span>
            </div>
          ))}
        </div>

        {/* Partnership Benefits Box */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-carbon-900 via-carbon-950 to-carbon-900 border border-white/15 text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-card-elevated">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase">
              LOOKING FOR ANNUAL CORPORATE RETREAT PARTNERSHIPS?
            </h3>
            <p className="text-xs sm:text-sm text-carbon-300 font-sans max-w-2xl leading-relaxed">
              We offer customized recurring corporate subscriptions with dedicated paddock slots, employee discount privileges, and executive banquet catering.
            </p>
          </div>

          <button
            onClick={() => openEnquiryModal()}
            className="px-8 py-4 rounded-xl bg-brand-red hover:bg-brand-redDark text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shrink-0 shadow-glow-red flex items-center gap-2"
          >
            <span>CONNECT WITH CCC DESK</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}

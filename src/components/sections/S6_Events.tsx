"use client";

import React from "react";
import { Building2, Send, Check, Users, Award, Calendar, Sparkles, Trophy, Rocket, GraduationCap, PartyPopper } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S6_Events() {
  const { openEnquiryModal } = useBooking();

  const eventFormats = [
    {
      title: "Corporate Summits & CCC Partnerships",
      badge: "Team Building & CCC",
      desc: "Private racetrack buyouts, telemetry grand prix heats, and catered ballroom summit setups for corporate organizations.",
      icon: Users,
    },
    {
      title: "Milestone Birthday Celebrations",
      badge: "Private Celebration",
      desc: "High-octane birthday grand prix tournaments, private lounge pods, custom motorsport cakes, and dedicated concierges.",
      icon: PartyPopper,
    },
    {
      title: "College & Student Fests",
      badge: "Youth & Campus",
      desc: "Specialized student festival packages featuring competitive esports championships, inter-college karting cups, and DJ soundstages.",
      icon: GraduationCap,
    },
    {
      title: "Automotive Product Launches",
      badge: "Brand Showcase",
      desc: "Showcase vehicles on illuminated turntables with HD LED video walls, stage acoustic production, and live stream broadcast capability.",
      icon: Rocket,
    },
    {
      title: "Private VIP Social Parties",
      badge: "Exclusive Access",
      desc: "Private access to 360° sky dining club, mocktail lounges, and closed-circuit racing for intimate celebrations.",
      icon: Sparkles,
    },
    {
      title: "Team Building Endurance Cups",
      badge: "Competitive Rally",
      desc: "Structured team relay karting races, pit stop tire-change challenges, and podium awards creating lasting workplace camaraderie.",
      icon: Trophy,
    },
  ];

  return (
    <section id="events" className="py-24 sm:py-32 bg-carbon-950 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
              <Building2 className="w-3.5 h-3.5" />
              Versatile Banquet & Venue Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              MAKE IT <span className="text-brand-red">AN EVENT.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              From corporate team-building championships and product launches to college festivals and milestone birthdays — we deliver end-to-end turnkey event production.
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

        {/* 6 Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventFormats.map((ev, idx) => {
            const Icon = ev.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-carbon-900 border border-white/10 glass-panel-hover text-left space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-carbon-950 text-brand-red border border-brand-red/30 uppercase font-bold">
                      {ev.badge}
                    </span>
                    <Icon className="w-4 h-4 text-carbon-400" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white uppercase">{ev.title}</h3>
                  <p className="text-xs text-carbon-400 font-sans leading-relaxed">{ev.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-carbon-500 uppercase">Turnkey Setup</span>
                  <button
                    onClick={() => openEnquiryModal()}
                    className="text-xs font-mono text-brand-red hover:text-white font-bold transition-colors"
                  >
                    Enquire Package →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}


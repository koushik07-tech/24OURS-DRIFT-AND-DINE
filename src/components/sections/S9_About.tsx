import React from "react";
import { Shield, Award, Users, Compass, Zap, Sparkles, CheckCircle2, Car, Clock, Building2, Radio } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function S9_About() {
  const distinctions = [
    {
      title: "High-Speed Motorsport",
      desc: "Multi-elevation indoor electric karting circuit with instant torque delivery and RFID transponder telemetry.",
      icon: Zap,
    },
    {
      title: "360° Non-Alcoholic Dining",
      desc: "Suspended panoramic horizon dining deck engineered as an upscale, family- and community-safe culinary space.",
      icon: Compass,
    },
    {
      title: "Advanced Automotive Culture",
      desc: "Engineering alliance with Flux Motors India, exhibiting high-performance electric powertrains and hypercar tech.",
      icon: Car,
    },
    {
      title: "Multi-Arena Scale RC Hub",
      desc: "Championship RC raceways, FPV headset cockpit buggies, tactical laser tanks, boat basins, and aero simulators.",
      icon: Radio,
    },
    {
      title: "Turnkey Luxury Banquets",
      desc: "Acoustically treated event ballrooms with stage production and turnkey hospitality for corporate summits and milestones.",
      icon: Building2,
    },
    {
      title: "24-Hour Entertainment Hub",
      desc: "Round-the-clock motorsport and dining access with dedicated 4 AM–7 AM daily maintenance and safety calibration.",
      icon: Clock,
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-left space-y-4 max-w-3xl">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
            <Users className="w-3.5 h-3.5" />
            Leadership & Vision
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
            ABOUT <span className="text-brand-red">24OURS.</span>
          </h2>
          <p className="text-sm sm:text-base text-carbon-300 font-sans leading-relaxed">
            {siteConfig.legalName} is founded on a shared obsession for motorsport performance, automotive culture, and elevated family-safe hospitality in Chikkaballapura, Karnataka.
          </p>
        </div>

        {/* Directors Attribution Card (Required) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-carbon-950 border border-white/15 shadow-card-elevated text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-mono text-brand-red uppercase tracking-wider font-bold">Board of Directors</span>
              <h3 className="text-2xl font-display font-bold text-white uppercase">
                COMPANY DIRECTORS
              </h3>
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-carbon-900 text-carbon-300 border border-white/10">
              {siteConfig.legalName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteConfig.directors.map((director, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-carbon-900 border border-white/10 space-y-2">
                <span className="text-xs font-mono text-brand-red font-bold uppercase">{director.role}</span>
                <h4 className="text-xl font-display font-bold text-white">{director.name}</h4>
                <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                  Directing the development, architectural design, and operational excellence of Karnataka's flagship motorsport and entertainment sports hub.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Distinction Pillars: WHY 24OURS? */}
        <div className="space-y-8 text-left">
          <div className="space-y-2">
            <span className="text-xs font-mono text-brand-red uppercase font-bold tracking-wider">The 24Ours Standard</span>
            <h3 className="text-2xl sm:text-4xl font-display font-bold text-white uppercase">
              WHY 24OURS?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {distinctions.map((d, idx) => {
              const Icon = d.icon;
              return (
                <div key={idx} className="p-6 sm:p-7 rounded-3xl bg-carbon-950 border border-white/10 space-y-3 glass-panel-hover group">
                  <div className="w-12 h-12 rounded-2xl bg-carbon-900 border border-white/10 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-display font-bold text-white uppercase">{d.title}</h4>
                  <p className="text-xs text-carbon-400 font-sans leading-relaxed">{d.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}


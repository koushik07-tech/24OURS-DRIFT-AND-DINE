import React from "react";
import { Shield, Award, Users, Compass, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function S9_About() {
  const distinctions = [
    {
      title: "Championship Circuit Design",
      desc: "Multi-elevation asphalt track equipped with instant electric torque karts and live RFID telemetry timing.",
      icon: Zap,
    },
    {
      title: "Suspended 360° Sky Dining",
      desc: "Panoramic dining deck featuring artisanal global gastronomy and craft mixology overlooking the raceway.",
      icon: Compass,
    },
    {
      title: "Next-Gen Scale & VR Arenas",
      desc: "Custom 1:8 competition RC raceway paired with 6-DOF hydraulic VR motion simulator rigs.",
      icon: Sparkles,
    },
    {
      title: "Turnkey Luxury Banquets",
      desc: "Acoustically treated event ballrooms with bespoke event coordination for corporate and milestone celebrations.",
      icon: Award,
    },
  ];

  return (
    <section id="about" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-left space-y-4 max-w-3xl">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit">
            <Users className="w-3.5 h-3.5" />
            Leadership & Vision
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
            ABOUT 24OURS.
          </h2>
          <p className="text-sm sm:text-base text-carbon-300 font-sans leading-relaxed">
            {siteConfig.legalName} is founded on a shared obsession for motorsport performance, architectural innovation, and elevated culinary craft in Malur, Kolar, Karnataka.
          </p>
        </div>

        {/* Directors Attribution Card (Required) */}
        <div className="p-8 sm:p-12 rounded-3xl bg-carbon-950 border border-white/15 shadow-card-elevated text-left space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-mono text-brand-red uppercase tracking-wider font-bold">Executive Board</span>
              <h3 className="text-2xl font-display font-bold text-white uppercase">
                DIRECTORS & CO-FOUNDERS
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-carbon-900 text-carbon-300 border border-white/10">
              {siteConfig.legalName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {siteConfig.directors.map((director, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-carbon-900 border border-white/10 space-y-2">
                <span className="text-xs font-mono text-brand-red font-bold uppercase">{director.role}</span>
                <h4 className="text-xl font-display font-bold text-white">{director.name}</h4>
                <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                  Leading the development and operational excellence of Karnataka's flagship entertainment sports destination.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Distinction Badges */}
        <div className="space-y-8 text-left">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase">
            WHY 24OURS?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {distinctions.map((d, idx) => {
              const Icon = d.icon;
              return (
                <div key={idx} className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-3 glass-panel-hover group">
                  <div className="w-10 h-10 rounded-xl bg-carbon-900 border border-white/10 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-display font-bold text-white uppercase">{d.title}</h4>
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

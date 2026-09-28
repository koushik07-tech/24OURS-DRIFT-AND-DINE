"use client";

import React from "react";
import { Shield, Award, Users, Compass, Zap, Sparkles, CheckCircle2, UserCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import Card3D from "@/components/ui/Card3D";
import MotionReveal from "@/components/ui/MotionReveal";

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
    <section id="about" className="py-24 sm:py-32 bg-[#060608] border-b border-white/10 relative overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[700px] h-[450px] bg-brand-crimson/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <MotionReveal direction="left" className="text-left space-y-4 max-w-3xl">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-[0_0_15px_rgba(255,46,0,0.35)]">
            <Users className="w-3.5 h-3.5" />
            Leadership & Vision
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
            ABOUT <span className="text-brand-crimson font-orbitron text-glow-red">24OURS.</span>
          </h2>
          <p className="text-sm sm:text-base text-carbon-300 font-sans leading-relaxed">
            {siteConfig.legalName} is founded on a shared obsession for motorsport performance, architectural innovation, and elevated culinary craft in Malur, Kolar, Karnataka.
          </p>
        </MotionReveal>

        {/* Directors Attribution Card (Required) */}
        <MotionReveal direction="up">
          <Card3D depth={15} className="bg-carbon-950/85 border border-white/15 backdrop-blur-2xl">
            <div className="p-8 sm:p-12 text-left space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <span className="text-[10px] font-mono text-brand-crimson uppercase tracking-wider font-bold">
                    Executive Board
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white uppercase mt-1">
                    DIRECTORS & CO-FOUNDERS
                  </h3>
                </div>
                <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-carbon-900 text-carbon-300 border border-white/10 w-fit">
                  {siteConfig.legalName}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {siteConfig.directors.map((director, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-carbon-900/80 border border-white/10 space-y-2 hover:border-brand-crimson/40 transition-colors">
                    <span className="text-xs font-mono text-brand-crimson font-bold uppercase">{director.role}</span>
                    <h4 className="text-xl font-display font-bold text-white">{director.name}</h4>
                    <p className="text-xs text-carbon-300 font-sans leading-relaxed">
                      Leading the development and operational excellence of Karnataka's flagship entertainment sports destination.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card3D>
        </MotionReveal>

        {/* 4 Distinction Badges in 3D Perspective Stack */}
        <div className="space-y-8 text-left">
          <MotionReveal direction="left">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase">
              WHY <span className="text-brand-crimson font-orbitron">24OURS?</span>
            </h3>
          </MotionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1200">
            {distinctions.map((d, idx) => {
              const Icon = d.icon;
              return (
                <MotionReveal key={idx} delay={idx * 0.1} direction="up">
                  <Card3D depth={18} className="bg-carbon-900/60 border border-white/10 backdrop-blur-xl h-full">
                    <div className="p-6 space-y-3 h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="w-10 h-10 rounded-xl bg-carbon-850 border border-white/10 flex items-center justify-center text-brand-crimson shadow-[0_0_15px_rgba(255,46,0,0.25)]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-display font-bold text-white uppercase">{d.title}</h4>
                        <p className="text-xs text-carbon-400 font-sans leading-relaxed">{d.desc}</p>
                      </div>
                    </div>
                  </Card3D>
                </MotionReveal>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

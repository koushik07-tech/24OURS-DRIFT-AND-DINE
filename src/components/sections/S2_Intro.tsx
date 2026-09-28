"use client";

import React from "react";
import { Gauge, Shield, Award, Users, Compass, Sparkles, Activity } from "lucide-react";
import Card3D from "@/components/ui/Card3D";
import MotionReveal from "@/components/ui/MotionReveal";

export default function S2_Intro() {
  const stats = [
    {
      label: "SIGNATURE EXPERIENCES",
      val: "10+",
      sub: "Motorsport, Dining & Arcade",
      icon: Sparkles,
      telemetry: "S-TIER",
      progress: 95,
    },
    {
      label: "ANNUAL DESTINATION CAPACITY",
      val: "50,000+",
      sub: "Malur, Kolar Corridor",
      icon: Users,
      telemetry: "EST. 2026",
      progress: 88,
    },
    {
      label: "PANORAMIC VANTAGE ANGLE",
      val: "360°",
      sub: "Elevated Sky Deck",
      icon: Compass,
      telemetry: "HORIZON",
      progress: 100,
    },
    {
      label: "BANQUET & RETREAT CAPACITY",
      val: "200+",
      sub: "Modular Event Ballrooms",
      icon: Award,
      telemetry: "ACOUSTIC",
      progress: 82,
    },
  ];

  return (
    <section id="intro" className="py-24 sm:py-32 bg-[#060608] border-b border-white/10 subtle-grid relative overflow-hidden">
      {/* Dynamic Ambient Crimson Radial Glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[400px] bg-brand-crimson/10 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Split Layout Header with MotionReveal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <MotionReveal direction="left" className="lg:col-span-7 space-y-4 text-left">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 uppercase font-bold flex items-center gap-2 w-fit shadow-[0_0_15px_rgba(255,46,0,0.3)]">
              <Activity className="w-3.5 h-3.5" />
              The 24Ours Vision
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight leading-tight">
              ONE DESTINATION.<br />
              <span className="text-brand-crimson font-orbitron text-glow-red">ENDLESS EXPERIENCES.</span>
            </h2>
          </MotionReveal>

          <MotionReveal direction="right" className="lg:col-span-5 text-left space-y-4 text-carbon-300 font-sans text-sm sm:text-base leading-relaxed">
            <p>
              Located along the scenic Bengaluru–Malur–Kolar highway corridor, 24OURS fuses high-octane motorsport precision with luxury hospitality, creating a world-class playground for drivers, food enthusiasts, and celebration seekers.
            </p>
          </MotionReveal>
        </div>

        {/* 3D Perspective Card Stacks for Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1200">
          {stats.map((st, idx) => {
            const Icon = st.icon;
            return (
              <MotionReveal key={idx} delay={idx * 0.1} direction="up">
                <Card3D depth={25} className="bg-carbon-900/60 border border-white/10 backdrop-blur-xl">
                  <div className="p-6 sm:p-8 text-left space-y-4 h-full flex flex-col justify-between">
                    
                    {/* Top Tag & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-carbon-400 bg-carbon-950/80 px-2.5 py-1 rounded-md border border-white/5">
                        {st.telemetry}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-carbon-850/80 border border-white/10 flex items-center justify-center text-brand-crimson shadow-[0_0_15px_rgba(255,46,0,0.25)]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Metric Value */}
                    <div className="space-y-1">
                      <p className="text-4xl sm:text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-carbon-300 tracking-tight">
                        {st.val}
                      </p>
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">{st.label}</h4>
                      <p className="text-[11px] font-mono text-carbon-400">{st.sub}</p>
                    </div>

                    {/* Segmented Racing Progress Indicator */}
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <div className="flex justify-between text-[10px] font-mono text-carbon-500">
                        <span>CAPACITY INDEX</span>
                        <span className="text-brand-crimson font-bold">{st.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-carbon-800/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brand-crimson to-red-500 shadow-[0_0_10px_rgba(255,46,0,0.8)]"
                          style={{ width: `${st.progress}%` }}
                        />
                      </div>
                    </div>

                  </div>
                </Card3D>
              </MotionReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}

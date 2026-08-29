import React from "react";
import { Gauge, Shield, Award, Users } from "lucide-react";

export default function S2_Intro() {
  const stats = [
    { label: "SIGNATURE EXPERIENCES", val: "10+", sub: "Motorsport, Dining & Arcade" },
    { label: "ANNUAL DESTINATION CAPACITY", val: "50,000+", sub: "Malur, Kolar Corridor" },
    { label: "PANORAMIC VANTAGE ANGLE", val: "360°", sub: "Elevated Sky Deck" },
    { label: "BANQUET & RETREAT CAPACITY", val: "200+", sub: "Modular Event Ballrooms" },
  ];

  return (
    <section id="intro" className="py-24 sm:py-32 bg-carbon-950 border-b border-white/10 subtle-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Split Layout Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7 space-y-4 text-left">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold">
              The 24Ours Vision
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight leading-tight">
              ONE DESTINATION.<br />
              <span className="text-brand-red">ENDLESS EXPERIENCES.</span>
            </h2>
          </div>

          <div className="lg:col-span-5 text-left space-y-4 text-carbon-300 font-sans text-sm sm:text-base leading-relaxed">
            <p>
              Located along the scenic Bengaluru–Malur–Kolar highway corridor, 24OURS fuses high-octane motorsport precision with luxury hospitality, creating a world-class playground for drivers, food enthusiasts, and celebration seekers.
            </p>
          </div>
        </div>

        {/* 4 Big Metrics HUD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-carbon-900 border border-white/10 text-left space-y-2 glass-panel-hover"
            >
              <p className="text-4xl sm:text-5xl font-display font-black text-brand-red">
                {st.val}
              </p>
              <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">{st.label}</h4>
              <p className="text-[11px] font-mono text-carbon-400">{st.sub}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

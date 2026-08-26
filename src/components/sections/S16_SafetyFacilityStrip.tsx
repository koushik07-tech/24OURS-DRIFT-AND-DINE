"use client";

import React from "react";
import { Clock, ShieldCheck, Lock, Car, HardHat, Leaf, Eye } from "lucide-react";
import { mediaConfig } from "@/config/media";

export default function S16_SafetyFacilityStrip() {
  const icons = [Clock, Eye, Lock, Car, HardHat, Leaf];

  return (
    <section id="safety" className="py-16 sm:py-20 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold inline-block">
            Safety & Infrastructure
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-black uppercase text-white tracking-tight">
            WORLD-CLASS FACILITY STANDARDS
          </h2>
          <p className="text-xs sm:text-sm text-carbon-400 font-sans">
            Engineered with uncompromising driver safety, continuous surveillance, and hospitality conveniences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {mediaConfig.safetyHighlights.map((item, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-2 flex items-start gap-4 glass-panel-hover"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-red/20 text-brand-red border border-brand-red/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-mono font-bold text-white uppercase">{item.title}</h4>
                  <p className="text-xs text-carbon-400 font-sans leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

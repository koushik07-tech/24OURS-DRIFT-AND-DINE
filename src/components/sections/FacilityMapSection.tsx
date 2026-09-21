"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Compass, Sparkles, MapPin, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { mediaRegistry } from "@/lib/media";

const FacilityMap = dynamic(() => import("@/components/3d/FacilityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-carbon-900 border border-white/10 flex items-center justify-center text-carbon-400 font-mono text-xs animate-pulse">
      INITIALIZING 3D CAMPUS TWIN...
    </div>
  ),
});

export default function FacilityMapSection() {
  const [activeZoneId, setActiveZoneId] = useState<string>(mediaRegistry.facilities[0].id);

  return (
    <section
      id="facility-map"
      className="py-24 sm:py-32 bg-[#070709] border-b border-white/10 relative overflow-hidden"
    >
      {/* Ambient Red & Cyan Underglow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-brand-red/10 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-2 w-fit shadow-glow-red">
              <MapPin className="w-3.5 h-3.5" />
              DESTINATION MASTERPLAN
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              3D FACILITY MAP & ZONES.
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              Explore all five signature zones across our world-class entertainment campus in Malur, Kolar. Tap any beacon to inspect telemetry and reserve your session.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-carbon-400 bg-carbon-900/80 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md self-start lg:self-auto">
            <Compass className="w-4 h-4 text-brand-red" />
            <span>GPS: {siteConfig.location.coordinates}</span>
          </div>
        </div>

        {/* 3D Interactive Facility Map */}
        <FacilityMap
          selectedZoneId={activeZoneId}
          onSelectZone={(id) => setActiveZoneId(id)}
        />

        {/* Zone Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {mediaRegistry.facilities.map((fac) => {
            const isSelected = fac.id === activeZoneId;
            return (
              <button
                key={fac.id}
                onClick={() => setActiveZoneId(fac.id)}
                className={`p-4 rounded-2xl text-left space-y-2 transition-all border ${
                  isSelected
                    ? "bg-carbon-900 border-brand-red shadow-glow-red scale-[1.02]"
                    : "bg-carbon-950/80 border-white/10 hover:border-white/20 hover:bg-carbon-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fac.color }} />
                  <span className="text-[10px] font-mono text-carbon-400 uppercase font-bold">{fac.category}</span>
                </div>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider line-clamp-1">{fac.name}</h4>
                <p className="text-[11px] font-sans text-carbon-300 line-clamp-2 leading-relaxed">{fac.tagline}</p>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}

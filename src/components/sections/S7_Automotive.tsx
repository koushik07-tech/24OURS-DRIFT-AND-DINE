"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Car, Gauge, Zap, Shield, ArrowRight, Sparkles, Cpu, Award } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { siteConfig } from "@/config/site";
import { AutomotiveVehicle } from "@/types";

export default function S7_Automotive() {
  const [selectedVehicle, setSelectedVehicle] = useState<AutomotiveVehicle>(mediaConfig.vehicles[0]);

  return (
    <section id="automotive" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-left space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
              <Car className="w-3.5 h-3.5" />
              Automotive Exhibition & Engineering
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase font-bold">
              In Association with Flux Motors India
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
            BUILT FOR <span className="text-brand-red">THE OBSESSED.</span>
          </h2>
          <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
            A celebration of high-performance automotive culture, electric powertrain innovation, chassis engineering, and bespoke racing telemetry.
          </p>
        </div>

        {/* Vehicle Fleet Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mediaConfig.vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => setSelectedVehicle(v)}
              className={`p-5 rounded-2xl text-left transition-all border ${
                selectedVehicle.id === v.id
                  ? "bg-carbon-850 border-brand-red shadow-glow-red"
                  : "bg-carbon-950 border-white/10 text-carbon-400 hover:border-white/20 hover:text-white"
              }`}
            >
              <span className="text-[10px] font-mono text-brand-red uppercase block font-semibold">{v.category}</span>
              <h4 className="text-sm sm:text-base font-display font-bold text-white mt-1 leading-tight">{v.name}</h4>
            </button>
          ))}
        </div>

        {/* Selected Vehicle Spec Card */}
        <div className="rounded-3xl bg-carbon-950 border border-white/15 p-6 sm:p-10 lg:p-12 shadow-card-elevated">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Specs Column */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold">
                  {selectedVehicle.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-2">
                  {selectedVehicle.name}
                </h3>
                <p className="text-xs sm:text-sm text-carbon-300 font-sans mt-2 leading-relaxed">
                  {selectedVehicle.desc}
                </p>
              </div>

              {/* 4 Technical Metrics (Strictly No Pricing) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-carbon-900 border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-carbon-500 uppercase block">Powertrain</span>
                  <span className="text-xs font-mono font-bold text-white block">{selectedVehicle.power}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-carbon-900 border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-carbon-500 uppercase block">Top Speed</span>
                  <span className="text-xs font-mono font-bold text-brand-red block">{selectedVehicle.topSpeed}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-carbon-900 border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-carbon-500 uppercase block">Acceleration</span>
                  <span className="text-xs font-mono font-bold text-white block">{selectedVehicle.acceleration}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-carbon-900 border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono text-carbon-500 uppercase block">Braking Tech</span>
                  <span className="text-xs font-mono font-bold text-white block">{selectedVehicle.brakes}</span>
                </div>
              </div>
            </div>

            {/* Image Showcase */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-white/10 relative h-72 sm:h-80">
                <Image
                  src={selectedVehicle.image}
                  alt={selectedVehicle.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                  <span className="px-2 py-1 bg-black/70 rounded-md">Precision Tuned Chassis</span>
                  <span className="text-brand-red font-bold">● ACTIVE EXHIBIT</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Flux Motors India Partnership Strip */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-carbon-950 via-carbon-900 to-carbon-950 border border-cyan-500/30 text-left flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-glow-cyan">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase text-cyan-400 tracking-wider">
                Official Engineering Partnership
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase">
              {siteConfig.partner.name}
            </h3>
            <p className="text-xs sm:text-sm text-carbon-300 font-sans max-w-2xl leading-relaxed">
              {siteConfig.partner.description}
            </p>
          </div>

          <div className="shrink-0">
            <span className="px-4 py-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono uppercase font-bold tracking-wider inline-block">
              ● Technology Showcase On-Site
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}


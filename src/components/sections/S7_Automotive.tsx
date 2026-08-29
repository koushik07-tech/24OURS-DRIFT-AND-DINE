"use client";

import React, { useState } from "react";
import { Car, Gauge, Zap, Shield, ArrowRight } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { AutomotiveVehicle } from "@/types";

export default function S7_Automotive() {
  const [selectedVehicle, setSelectedVehicle] = useState<AutomotiveVehicle>(mediaConfig.vehicles[0]);

  return (
    <section id="automotive" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-left space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit">
            <Car className="w-3.5 h-3.5" />
            Engineering Fleet Exhibition
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
            BUILT FOR THE OBSESSED.
          </h2>
          <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
            A permanent gallery celebrating the raw engineering, chassis rigidity, and aerodynamic telemetry of motorsport machines.
          </p>
        </div>

        {/* Vehicle Fleet Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <span className="text-[10px] font-mono text-brand-red uppercase">{v.category}</span>
              <h4 className="text-base font-display font-bold text-white mt-1">{v.name}</h4>
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
                <img
                  src={selectedVehicle.image}
                  alt={selectedVehicle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                  <span>3D Chassis Architecture</span>
                  <span className="text-brand-red font-bold">● ACTIVE EXHIBIT</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

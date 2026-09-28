"use client";

import React, { useState } from "react";
import { Car, Gauge, Zap, Shield, ArrowRight, Activity, Sparkles } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { AutomotiveVehicle } from "@/types";
import Card3D from "@/components/ui/Card3D";
import MotionReveal from "@/components/ui/MotionReveal";

export default function S7_Automotive() {
  const [selectedVehicle, setSelectedVehicle] = useState<AutomotiveVehicle>(mediaConfig.vehicles[0]);

  return (
    <section id="automotive" className="py-24 sm:py-32 bg-[#060608] border-b border-white/10 relative overflow-hidden">
      {/* Ambient Crimson Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[450px] bg-brand-crimson/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <MotionReveal direction="left" className="text-left space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-[0_0_15px_rgba(255,46,0,0.35)]">
            <Car className="w-3.5 h-3.5" />
            Engineering Fleet Exhibition
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
            BUILT FOR THE <span className="text-brand-crimson font-orbitron text-glow-red">OBSESSED.</span>
          </h2>
          <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
            A permanent gallery celebrating the raw engineering, chassis rigidity, and aerodynamic telemetry of motorsport machines.
          </p>
        </MotionReveal>

        {/* Vehicle Fleet Selector Tabs in 3D Perspective Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 perspective-1000">
          {mediaConfig.vehicles.map((v, idx) => (
            <MotionReveal key={v.id} delay={idx * 0.1} direction="up">
              <button
                type="button"
                onClick={() => setSelectedVehicle(v)}
                className={`w-full p-5 rounded-2xl text-left transition-all border ${
                  selectedVehicle.id === v.id
                    ? "bg-carbon-850/90 border-brand-crimson shadow-[0_0_30px_rgba(255,46,0,0.35)] scale-[1.02]"
                    : "bg-carbon-950/70 border-white/10 text-carbon-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-brand-crimson uppercase tracking-widest font-bold">
                    {v.category}
                  </span>
                  {selectedVehicle.id === v.id && (
                    <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
                  )}
                </div>
                <h4 className="text-base font-display font-bold text-white mt-1.5">{v.name}</h4>
              </button>
            </MotionReveal>
          ))}
        </div>

        {/* Selected Vehicle 3D Perspective Card Stack */}
        <MotionReveal direction="up">
          <Card3D depth={18} className="bg-carbon-950/85 border border-white/15 backdrop-blur-2xl">
            <div className="p-6 sm:p-10 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Specs Column */}
                <div className="lg:col-span-6 space-y-6 text-left">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full text-[10px] font-mono bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 uppercase font-bold">
                        {selectedVehicle.category}
                      </span>
                      <span className="text-[10px] font-mono text-carbon-400">TELEMETRY BENCHMARK</span>
                    </div>
                    <h3 className="text-2xl sm:text-4xl font-display font-black text-white mt-2">
                      {selectedVehicle.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-carbon-300 font-sans mt-2 leading-relaxed">
                      {selectedVehicle.desc}
                    </p>
                  </div>

                  {/* 4 Technical Telemetry Metric Cards */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-carbon-900/80 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-carbon-500 uppercase block tracking-wider">Powertrain</span>
                      <span className="text-sm font-mono font-bold text-white block">{selectedVehicle.power}</span>
                      <div className="w-full h-1 rounded-full bg-white/10 mt-2 overflow-hidden">
                        <div className="w-4/5 h-full bg-brand-crimson" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-carbon-900/80 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-carbon-500 uppercase block tracking-wider">Top Speed</span>
                      <span className="text-sm font-mono font-bold text-brand-crimson block">{selectedVehicle.topSpeed}</span>
                      <div className="w-full h-1 rounded-full bg-white/10 mt-2 overflow-hidden">
                        <div className="w-full h-full bg-brand-crimson shadow-[0_0_8px_rgba(255,46,0,0.8)]" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-carbon-900/80 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-carbon-500 uppercase block tracking-wider">Acceleration</span>
                      <span className="text-sm font-mono font-bold text-white block">{selectedVehicle.acceleration}</span>
                      <div className="w-full h-1 rounded-full bg-white/10 mt-2 overflow-hidden">
                        <div className="w-5/6 h-full bg-emerald-400" />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-carbon-900/80 border border-white/5 space-y-1">
                      <span className="text-[10px] font-mono text-carbon-500 uppercase block tracking-wider">Braking Tech</span>
                      <span className="text-sm font-mono font-bold text-white block">{selectedVehicle.brakes}</span>
                      <div className="w-full h-1 rounded-full bg-white/10 mt-2 overflow-hidden">
                        <div className="w-3/4 h-full bg-amber-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Showcase with Glare and Horizon Overlay */}
                <div className="lg:col-span-6">
                  <div className="rounded-3xl overflow-hidden border border-white/15 relative h-72 sm:h-96 shadow-[0_20px_50px_rgba(0,0,0,0.9)] group">
                    <img
                      src={selectedVehicle.image}
                      alt={selectedVehicle.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/20 to-transparent" />
                    
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-xs font-mono text-white">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-brand-crimson animate-pulse" />
                        <span>Chassis Rigid Architecture</span>
                      </div>
                      <span className="text-brand-crimson font-bold bg-carbon-950/80 px-3 py-1 rounded-full border border-brand-crimson/30">
                        ● ACTIVE EXHIBIT
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </Card3D>
        </MotionReveal>

      </div>
    </section>
  );
}

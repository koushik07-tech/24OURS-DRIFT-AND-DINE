"use client";

import React from "react";
import { PackageCheck, Check, Send, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S14_Packages() {
  const { openEnquiryModal } = useBooking();

  return (
    <section id="packages" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
              <PackageCheck className="w-3.5 h-3.5" />
              Curated Destination Bundles
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              DESTINATION <span className="text-brand-red">EXPERIENCE PACKAGES.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              Comprehensive experience itineraries combining electric karting heats, multi-scale RC battle arenas, and reserved table hospitality at our 360° sky dining club.
            </p>
          </div>

          <button
            onClick={() => openEnquiryModal()}
            className="px-6 py-3.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2 self-start lg:self-auto"
          >
            <Send className="w-4 h-4" />
            <span>CUSTOM PACKAGE ENQUIRY</span>
          </button>
        </div>

        {/* 5 Package Cards (Zero Pricing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {mediaConfig.packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-8 rounded-3xl bg-carbon-950 border border-white/10 flex flex-col justify-between glass-panel-hover space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-carbon-900 text-brand-red border border-brand-red/30">
                    {pkg.badge}
                  </span>
                  <span className="text-[10px] font-mono text-carbon-500 uppercase">ALL-INCLUSIVE</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold text-white uppercase">{pkg.name}</h3>
                  <p className="text-xs font-mono text-brand-red">{pkg.tagline}</p>
                </div>

                <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                  {pkg.description}
                </p>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-carbon-500 uppercase tracking-wider block font-bold">
                    What's Included:
                  </span>
                  <ul className="space-y-1.5">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-carbon-300 font-sans">
                        <Check className="w-3.5 h-3.5 text-brand-red shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Enquiry Button (Strictly No Pricing) */}
              <button
                onClick={() => openEnquiryModal()}
                className="w-full py-3 rounded-xl bg-carbon-900 hover:bg-brand-red hover:text-white border border-white/10 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span>ENQUIRE NOW</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import { Compass, Sparkles, Utensils, Wine, Eye, ArrowRight, Check } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function SkyDining({ onOpenJourneyModal }) {
  const skyFeatures = [
    {
      title: "360° Panoramic Horizon",
      description: "Elevated vantage point overlooking the racing circuits and the scenic skyline of Chikkaballapura.",
      icon: Eye,
    },
    {
      title: "Gourmet Global Gastronomy",
      description: "Artisanal multi-cuisine fusion menu crafted by master culinary chefs for lunch, sunset, and late-night dining.",
      icon: Utensils,
    },
    {
      title: "Sunset Mocktail Lounge",
      description: "Curated craft beverages, botanical mocktails, and artisanal brews served against golden-hour vistas.",
      icon: Wine,
    },
    {
      title: "VIP Paddock Pods",
      description: "Private suspended dining booths with ambient acoustic separation and direct track observation.",
      icon: Sparkles,
    },
  ];

  return (
    <SectionWrapper
      id="sky-dining"
      badge={
        <Badge variant="red" pulse={true}>
          Architectural Landmark
        </Badge>
      }
      subtitle="Suspended High Above The Circuit"
      title="DINE ABOVE THE ACTION."
      description="The crown jewel of 24OURS. A 360° panoramic dining destination suspended above the arena, where gourmet gastronomy meets high-octane motorsport energy."
      align="center"
      glowColor="red"
      hasGrid={true}
      className="border-y border-white/10"
    >
      {/* Sky Dining Hero Billboard Frame */}
      <div className="relative rounded-3xl bg-gradient-to-b from-carbon-850 via-carbon-900 to-carbon-950 border border-brand-red/40 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-glow-red mb-16">
        
        {/* Ambient background rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-red/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red text-white uppercase tracking-wider font-semibold">
                Signature Feature
              </span>
              <span className="text-xs font-mono text-carbon-400 uppercase tracking-widest">
                Menu & Architecture Coming Soon
              </span>
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight leading-tight">
              A Gastronomic Marvel in the Clouds.
            </h3>

            <p className="text-base sm:text-lg text-carbon-300 font-sans leading-relaxed">
              Designed as South India’s most dramatic dining experience, the 360° Sky Dining deck puts you directly above the adrenaline of the go-karting track while offering sweeping views of the surrounding Chikkaballapura landscape.
            </p>

            <div className="p-4 rounded-2xl bg-carbon-950/80 border border-white/10 text-xs font-mono text-carbon-300 space-y-2">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-carbon-400">Elevation:</span>
                <span className="text-white font-semibold">Overlooking Arena & Horizon</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-carbon-400">Atmosphere:</span>
                <span className="text-brand-red font-semibold">Panoramic • Sunset • Night Circuit</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-carbon-400">Curated Menu:</span>
                <span className="text-white">Global & Regional Fusion (In Development)</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={onOpenJourneyModal}
                icon={ArrowRight}
              >
                Get Menu & Opening Updates
              </Button>
            </div>
          </div>

          {/* Right Column: Architectural Schematic HUD */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-carbon-950 border border-white/10 p-6 sm:p-8 space-y-6 text-center">
              
              <div className="w-16 h-16 rounded-2xl bg-carbon-900 border border-brand-red/40 flex items-center justify-center mx-auto text-brand-red shadow-glow-red">
                <Compass className="w-8 h-8 animate-spin-slow" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-mono text-brand-red tracking-widest uppercase font-semibold">
                  360° Horizon Deck
                </p>
                <h4 className="text-xl font-display font-bold text-white uppercase">
                  Sky Dining Deck
                </h4>
                <p className="text-xs text-carbon-400 font-mono">
                  CHIKKABALLAPURA LEISURE CORRIDOR
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-left">
                <div className="p-3 rounded-xl bg-carbon-900 border border-white/5">
                  <p className="text-[10px] font-mono text-carbon-400 uppercase">View Angle</p>
                  <p className="text-sm font-bold text-white">360° Panoramic</p>
                </div>
                <div className="p-3 rounded-xl bg-carbon-900 border border-white/5">
                  <p className="text-[10px] font-mono text-carbon-400 uppercase">Ambience</p>
                  <p className="text-sm font-bold text-brand-red">Curated Lounge</p>
                </div>
              </div>

              <p className="text-[11px] font-mono text-carbon-500 italic">
                * Architectural rendering and curated menu concepts will be unveiled during the next development phase.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Core Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skyFeatures.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-carbon-900/80 border border-white/10 glass-panel-hover space-y-4 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-carbon-850 border border-white/10 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors duration-300">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="text-base font-heading font-bold text-white group-hover:text-white transition-colors">
                {item.title}
              </h4>
              <p className="text-xs sm:text-sm text-carbon-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

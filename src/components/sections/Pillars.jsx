import React, { useState } from 'react';
import { Zap, Compass, Sparkles, Trophy, Check, ArrowRight } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { pillarsData } from '../../data/pillars';

export default function Pillars({ onOpenJourneyModal }) {
  const [activePillarId, setActivePillarId] = useState('race');

  const activePillar = pillarsData.find((p) => p.id === activePillarId) || pillarsData[0];

  const pillarIcons = {
    race: Zap,
    play: Sparkles,
    dine: Compass,
    celebrate: Trophy,
  };

  return (
    <SectionWrapper
      id="pillars"
      badge={
        <Badge variant="red" pulse={true}>
          Interactive Experience Matrix
        </Badge>
      }
      subtitle="The 4 Core Dimensions"
      title="RACE. PLAY. DINE. CELEBRATE."
      description="Every visit to 24OURS is choreographed around four high-impact pillars. Select any dimension below to explore its energy."
      align="center"
      glowColor="red"
      hasGrid={true}
    >
      {/* 4 Pillars Interactive Tab Controls */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {pillarsData.map((pillar) => {
          const isActive = pillar.id === activePillarId;
          const Icon = pillarIcons[pillar.id] || Zap;

          return (
            <button
              key={pillar.id}
              onClick={() => setActivePillarId(pillar.id)}
              onMouseEnter={() => setActivePillarId(pillar.id)}
              className={`relative p-4 sm:p-6 rounded-2xl text-left transition-all duration-300 border flex flex-col justify-between h-28 sm:h-36 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red ${
                isActive
                  ? 'bg-carbon-850 border-brand-red shadow-glow-red'
                  : 'bg-carbon-900/60 border-white/10 hover:border-white/20 hover:bg-carbon-850/60'
              }`}
            >
              {/* Active top line */}
              {isActive && (
                <span className="absolute top-0 left-4 right-4 h-[2px] bg-brand-red" />
              )}

              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-mono text-carbon-400 group-hover:text-carbon-200">
                  {pillar.key}
                </span>
                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isActive ? 'text-brand-red' : 'text-carbon-500 group-hover:text-carbon-300'
                  }`}
                />
              </div>

              <div>
                <p className="text-xs font-mono tracking-widest text-carbon-400 uppercase">
                  {pillar.badge}
                </p>
                <h3 className={`text-xl sm:text-2xl font-display font-black tracking-wider uppercase transition-colors ${
                  isActive ? 'text-white' : 'text-carbon-300 group-hover:text-white'
                }`}>
                  {pillar.title}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dynamic Telemetry Stage for Active Pillar */}
      <div className="relative rounded-3xl bg-carbon-900 border border-white/15 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-card-elevated">
        
        {/* Dynamic Background Atmosphere */}
        <div className="absolute inset-0 bg-radial-fade opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

        {/* Interior Grid Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Pillar Title & Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase tracking-wider">
                Pillar {activePillar.key}
              </span>
              <span className="text-xs font-mono tracking-widest text-carbon-400 uppercase">
                {activePillar.badge}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                {activePillar.tagline}
              </h4>
              <p className="text-base sm:text-lg text-carbon-300 font-sans leading-relaxed pt-2">
                {activePillar.description}
              </p>
            </div>

            {/* Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {activePillar.highlights.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-carbon-950/70 border border-white/5 text-xs sm:text-sm text-carbon-200"
                >
                  <span className="w-5 h-5 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center text-brand-red shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span className="font-medium">{point}</span>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Button
                variant="primary"
                size="md"
                href="#attractions"
                icon={ArrowRight}
              >
                Explore {activePillar.title} Attractions
              </Button>
              
              {onOpenJourneyModal && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={onOpenJourneyModal}
                >
                  Get Milestone Updates
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Visual Telemetry HUD */}
          <div className="lg:col-span-5">
            <div className="relative p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 overflow-hidden space-y-6">
              
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-red animate-pulse" />
                  <span className="text-xs font-mono text-white uppercase tracking-wider font-semibold">
                    Dimension HUD
                  </span>
                </div>
                <span className="text-xs font-mono text-carbon-400">
                  REF: 24O-{activePillar.key}
                </span>
              </div>

              {/* Large Kinetic Number */}
              <div className="flex items-baseline justify-between py-2">
                <div>
                  <p className="text-xs font-mono text-carbon-400 uppercase">Sector Designation</p>
                  <p className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wider mt-1">
                    {activePillar.title}
                  </p>
                </div>
                <span className="text-5xl font-display font-black text-brand-red/40 select-none">
                  {activePillar.key}
                </span>
              </div>

              {/* Sector Features Preview */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-mono text-carbon-400 uppercase tracking-wider">
                  Development Stage
                </p>
                <div className="p-3 rounded-xl bg-carbon-900 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-carbon-300">Phase Status</span>
                  <span className="text-brand-red font-semibold uppercase">Under Construction</span>
                </div>
                <div className="p-3 rounded-xl bg-carbon-900 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-carbon-300">Target Region</span>
                  <span className="text-white">Malur, Kolar, Karnataka</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

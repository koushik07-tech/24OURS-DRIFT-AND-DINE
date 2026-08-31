import React from 'react';
import { Compass, Flame, Shield, Award, Sparkles, ArrowUpRight } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Badge from '../ui/Badge';
import { siteConfig } from '../../data/siteConfig';

export default function Intro() {
  const conceptHighlights = [
    {
      number: "01",
      title: "Motorsport & Precision Speed",
      description: "Championship-grade go-karting and micro-scale RC circuits engineered with real-time telemetry and pro barrier safety systems.",
      icon: Flame,
    },
    {
      number: "02",
      title: "360° Elevated Gastronomy",
      description: "A suspended architectural marvel offering panoramic horizon views of Malur, Kolar paired with curated global cuisine.",
      icon: Compass,
    },
    {
      number: "03",
      title: "Digital & Virtual Immersion",
      description: "6DOF full-motion hydraulic racing simulators, free-roam VR arenas, and a stadium-sized live sports screening amphitheater.",
      icon: Shield,
    },
    {
      number: "04",
      title: "Grand Gathering Architecture",
      description: "Sprawling climate-controlled banquet halls with turnkey décor, acoustic engineering, and full production services for milestones.",
      icon: Award,
    },
  ];

  return (
    <SectionWrapper
      id="intro"
      badge={
        <Badge variant="red" pulse={true}>
          The Concept & Vision
        </Badge>
      }
      subtitle="Malur, Kolar, Karnataka"
      title="A NEW DESTINATION IS TAKING SHAPE."
      description="Born at the intersection of high-speed motorsport adrenaline and luxury sky-dining hospitality, 24OURS is engineered to redefine how South India races, gathers, dines, and celebrates."
      align="left"
      glowColor="red"
      hasGrid={true}
    >
      {/* Editorial Narrative Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
        
        {/* Left Column: Vision Manifesto */}
        <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-carbon-300 font-sans leading-relaxed">
          <p className="text-white font-medium text-lg sm:text-xl leading-relaxed">
            Located along the scenic highway corridor of Malur, Kolar, Karnataka, <span className="text-white font-bold">24OURS — Drift and Dine</span> is being developed as an integrated, multi-experience entertainment ecosystem.
          </p>
          <p>
            Whether you are pushing the limits on precision hairpin racing circuits, dining high above the track on our suspended 360° Sky Deck, or hosting an unforgettable milestone in our grand banquet halls — every square foot is designed for uncompromised excitement and connection.
          </p>
          
          {/* Coordinate & Development Banner */}
          <div className="p-6 rounded-2xl bg-carbon-900/90 border border-white/10 glass-panel relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono tracking-widest text-brand-red uppercase">Strategic Location</p>
                <p className="text-base font-display font-bold text-white mt-1">{siteConfig.location.displayAddress}</p>
                <p className="text-xs text-carbon-400 font-mono mt-0.5">{siteConfig.location.coordinates}</p>
              </div>
              <div className="shrink-0">
                <a
                  href="#location"
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-brand-red hover:text-white transition-colors group"
                >
                  <span>View Connectivity</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Architectural Highlights HUD */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-carbon-900/80 border border-white/10 relative">
            <p className="text-xs font-mono tracking-widest text-carbon-400 uppercase mb-4">Core Ecosystem Dimensions</p>
            
            <div className="space-y-4 divide-y divide-white/10">
              <div className="pt-3 first:pt-0">
                <p className="text-xs font-mono text-brand-red uppercase">Adrenaline Zone</p>
                <p className="text-sm font-heading font-semibold text-white mt-0.5">High-Speed Karting & RC Racing Speedway</p>
              </div>
              <div className="pt-3">
                <p className="text-xs font-mono text-brand-red uppercase">Signature Dining</p>
                <p className="text-sm font-heading font-semibold text-white mt-0.5">360° Panoramic Elevated Sky Restaurant & Lounge</p>
              </div>
              <div className="pt-3">
                <p className="text-xs font-mono text-brand-red uppercase">Celebration Hub</p>
                <p className="text-sm font-heading font-semibold text-white mt-0.5">Acoustic Banquet Architecture & Turnkey Décor</p>
              </div>
              <div className="pt-3">
                <p className="text-xs font-mono text-brand-red uppercase">Next-Gen Arcade</p>
                <p className="text-sm font-heading font-semibold text-white mt-0.5">VR Motion Rigs, Cinema Screening & Family Play</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {conceptHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.number}
              className="p-6 sm:p-8 rounded-2xl bg-carbon-900/70 border border-white/10 glass-panel-hover flex flex-col justify-between space-y-6 group relative overflow-hidden"
            >
              {/* Subtle top red glow line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-red/0 group-hover:via-brand-red to-transparent transition-all duration-500" />
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-display font-black text-white/20 group-hover:text-brand-red transition-colors duration-300">
                  {item.number}
                </span>
                <div className="w-10 h-10 rounded-xl bg-carbon-850 border border-white/10 flex items-center justify-center text-carbon-400 group-hover:text-brand-red group-hover:border-brand-red/50 transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-heading font-bold text-white group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-carbon-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

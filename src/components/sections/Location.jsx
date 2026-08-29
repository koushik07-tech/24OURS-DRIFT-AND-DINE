import React from 'react';
import { MapPin, Compass, Navigation, Car, Plane, Building, ArrowRight } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Badge from '../ui/Badge';
import { siteConfig } from '../../data/siteConfig';

export default function Location({ onOpenJourneyModal }) {
  const connectivity = [
    {
      title: "Scenic Highway Access",
      desc: "Conveniently situated along the high-growth Bengaluru–Malur–Kolar leisure corridor.",
      icon: Car,
    },
    {
      title: "Kempegowda Int'l Airport Proximity",
      desc: "Direct, fast connectivity from North Bangalore and the international airport hub.",
      icon: Plane,
    },
    {
      title: "Destination Parking Paddock",
      desc: "Spacious dedicated parking infrastructure for supercars, superbikes, families, and tour buses.",
      icon: Navigation,
    },
  ];

  return (
    <SectionWrapper
      id="location"
      badge={
        <Badge variant="red" pulse={true} icon={MapPin}>
          Destination Coordinates
        </Badge>
      }
      subtitle="Karnataka, India"
      title="COMING TO MALUR, KOLAR, KARNATAKA."
      description="Strategically placed away from city congestion to deliver sprawling tracks, open sky views, and a dedicated motorsport sanctuary."
      align="center"
      glowColor="red"
      hasGrid={true}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12">
        
        {/* Left Column: Connectivity Highlights */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="p-6 rounded-2xl bg-carbon-900 border border-white/10 space-y-3">
            <span className="text-xs font-mono text-brand-red uppercase tracking-widest font-semibold">
              Region & Location
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
              {siteConfig.location.displayAddress}
            </h3>
            <p className="text-xs font-mono text-carbon-400">
              Coordinates: {siteConfig.location.coordinates}
            </p>
            <p className="text-sm text-carbon-300 pt-2 leading-relaxed font-sans">
              {siteConfig.location.accessNote}
            </p>
          </div>

          <div className="space-y-3">
            {connectivity.map((c, idx) => {
              const Icon = c.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-carbon-900/60 border border-white/5 flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-lg bg-carbon-850 border border-white/10 flex items-center justify-center text-brand-red shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-heading font-semibold text-white">{c.title}</h4>
                    <p className="text-xs text-carbon-400 mt-0.5">{c.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Geographic Concept Frame */}
        <div className="lg:col-span-6">
          <div className="relative rounded-3xl bg-carbon-950 border border-white/15 p-8 sm:p-12 text-center overflow-hidden min-h-[340px] flex flex-col justify-between shadow-card-elevated">
            
            {/* Background Radar Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div className="w-80 h-80 rounded-full border border-brand-red animate-ping" />
              <div className="w-60 h-60 rounded-full border border-white/30" />
            </div>

            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-white font-semibold uppercase">Location Matrix</span>
              <span className="text-xs font-mono text-brand-red uppercase">Pre-Launch Site</span>
            </div>

            <div className="relative z-10 py-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-brand-red/20 border border-brand-red flex items-center justify-center mx-auto text-brand-red shadow-glow-red">
                <Compass className="w-7 h-7" />
              </div>
              <h4 className="text-2xl font-display font-black text-white uppercase tracking-wider">
                MALUR, KOLAR
              </h4>
              <p className="text-xs font-mono text-carbon-400">
                13.0039° N • 77.9406° E
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-carbon-400">
              <span>EXACT ADDRESS</span>
              <span className="text-brand-red">Will Be Disclosed at Flag-off</span>
            </div>

          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}

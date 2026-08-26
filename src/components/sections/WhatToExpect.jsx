import React from 'react';
import { Zap, Sparkles, Utensils, Award, Compass, Eye } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Badge from '../ui/Badge';

export default function WhatToExpect() {
  const words = [
    { title: "RACE", subtitle: "High-octane asphalt combat & digital telemetry", icon: Zap },
    { title: "PLAY", subtitle: "Hyper-realistic VR & arcade precision", icon: Sparkles },
    { title: "DINE", subtitle: "360° panoramic sky-high culinary vistas", icon: Utensils },
    { title: "CELEBRATE", subtitle: "Grand acoustic banquets & milestone staging", icon: Award },
    { title: "EXPLORE", subtitle: "Exotic automotive showcases & gallery spaces", icon: Compass },
    { title: "EXPERIENCE", subtitle: "Unmatched memories under the evening sky", icon: Eye },
  ];

  return (
    <SectionWrapper
      id="what-to-expect"
      badge={
        <Badge variant="red" pulse={true}>
          The Sensory Experience
        </Badge>
      }
      subtitle="Visual Summary"
      title="WHAT TO EXPECT AT 24OURS."
      description="An ecosystem designed from the ground up for energy, taste, and connection."
      align="center"
      glowColor="red"
      hasGrid={true}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {words.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-carbon-900/70 border border-white/10 glass-panel-hover flex flex-col justify-between h-48 sm:h-56 group text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-carbon-400 group-hover:text-brand-red transition-colors">
                  0{idx + 1}
                </span>
                <Icon className="w-5 h-5 text-carbon-500 group-hover:text-brand-red group-hover:scale-110 transition-all duration-300" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-carbon-400 font-sans mt-1.5 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

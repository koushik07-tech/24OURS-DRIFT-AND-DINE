import React, { useState } from 'react';
import { 
  Zap, Radio, Utensils, Building2, ShieldAlert, Glasses, Tv, Sparkles, Smile,
  ArrowRight, Check, Compass, Layers, Shield
} from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { attractionsData } from '../../data/attractions';

export default function Attractions({ onOpenJourneyModal }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Motorsport & Speed', 'Culinary & Atmosphere', 'Virtual Reality', 'Gatherings & Celebrations', 'Live Entertainment', 'All-Ages Fun'];

  const filteredAttractions = activeCategory === 'All'
    ? attractionsData
    : attractionsData.filter((item) => item.category === activeCategory);

  const iconMap = {
    Zap,
    Radio,
    Utensils,
    Building2,
    ShieldAlert,
    Glasses,
    Tv,
    Sparkles,
    Smile,
  };

  return (
    <SectionWrapper
      id="attractions"
      badge={
        <Badge variant="red" pulse={true}>
          The Signature Fleet
        </Badge>
      }
      subtitle="01 — 09 Experiences"
      title="ENGINEERED FOR ANTICIPATION."
      description="Nine interconnected world-class entertainment, culinary, and celebration experiences currently taking shape in Chikkaballapura."
      align="center"
      glowColor="red"
      hasGrid={true}
    >
      {/* Category Filter Pill Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12 sm:mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 border ${
              activeCategory === cat
                ? 'bg-brand-red text-white border-brand-red shadow-glow-red font-semibold'
                : 'bg-carbon-900/80 text-carbon-300 border-white/10 hover:border-white/25 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Visual Storytelling Showcase Layout */}
      <div className="space-y-12 sm:space-y-16">
        {filteredAttractions.map((attraction, idx) => {
          const Icon = iconMap[attraction.iconName] || Zap;
          const isEven = idx % 2 === 0;

          return (
            <div
              key={attraction.id}
              className={`relative rounded-3xl bg-carbon-900/90 border border-white/10 p-6 sm:p-10 lg:p-12 overflow-hidden glass-panel-hover group ${
                attraction.id === 'sky-dining' ? 'border-brand-red/40 shadow-glow-red' : ''
              }`}
            >
              {/* Subtle top red glow line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-red/0 group-hover:via-brand-red to-transparent transition-all duration-500" />
              
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                !isEven ? 'lg:flex-row-reverse' : ''
              }`}>
                
                {/* Left/Content Column */}
                <div className={`space-y-6 ${isEven ? 'lg:col-span-7' : 'lg:col-span-7 lg:order-2'}`}>
                  
                  {/* Top Metadata Line */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-display font-black text-brand-red tracking-wider">
                      {attraction.number}
                    </span>
                    <span className="h-4 w-[1px] bg-white/20" />
                    <span className="text-xs font-mono tracking-widest text-carbon-400 uppercase">
                      {attraction.category}
                    </span>
                    <Badge variant="red" className="text-[10px]">
                      {attraction.statusBadge}
                    </Badge>
                  </div>

                  {/* Headline & Title */}
                  <div className="space-y-2">
                    <p className="text-xs font-mono tracking-[0.25em] text-carbon-400 uppercase font-semibold">
                      {attraction.name}
                    </p>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight leading-tight">
                      {attraction.headline}
                    </h3>
                    <p className="text-sm sm:text-base text-carbon-300 font-sans leading-relaxed pt-2">
                      {attraction.shortDesc}
                    </p>
                  </div>

                  {/* Features Bullets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {attraction.features.map((feature, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-start gap-2 text-xs sm:text-sm text-carbon-300"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-red mt-1.5 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="pt-2">
                    <button
                      onClick={onOpenJourneyModal}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-red hover:text-white transition-colors group/btn"
                    >
                      <span>Follow {attraction.name} Updates</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>

                {/* Right/Visual Stage Column (Conceptual Architectural Frame) */}
                <div className={`lg:col-span-5 ${!isEven ? 'lg:order-1' : ''}`}>
                  <div className="relative rounded-2xl bg-carbon-950 border border-white/10 p-6 sm:p-8 overflow-hidden group-hover:border-brand-red/30 transition-all duration-300 min-h-[220px] flex flex-col justify-between">
                    
                    {/* Background Conceptual Ambient Glow */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-red/10 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Visual Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-carbon-900 border border-white/10 flex items-center justify-center text-brand-red">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono text-white tracking-wider uppercase font-semibold">
                          Conceptual Visual
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-brand-red uppercase">
                        Coming Soon
                      </span>
                    </div>

                    {/* Visual Center Graphic & Conceptual Description */}
                    <div className="py-6 space-y-3 text-center">
                      <div className="inline-flex p-3 rounded-full bg-carbon-900 border border-white/10 text-brand-red group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8" />
                      </div>
                      <p className="text-xs font-mono text-carbon-400 italic max-w-xs mx-auto">
                        "{attraction.conceptualVisual.alt}"
                      </p>
                    </div>

                    {/* Visual Footer Telemetry */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-carbon-500 border-t border-white/5 pt-3">
                      <span>DESTINATION REF: 24O-{attraction.number}</span>
                      <span className="text-carbon-300">CHIKKABALLAPURA</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Milestone Callout */}
      <div className="mt-16 sm:mt-20 text-center p-8 rounded-3xl bg-carbon-900/80 border border-white/10 max-w-3xl mx-auto space-y-4">
        <p className="text-xs font-mono text-brand-red uppercase tracking-widest font-semibold">
          Want to receive behind-the-scenes build videos?
        </p>
        <h4 className="text-xl sm:text-2xl font-display font-bold text-white">
          Be the first to see the tracks and venues come to life.
        </h4>
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={onOpenJourneyModal}
            icon={ArrowRight}
          >
            Follow the Journey
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

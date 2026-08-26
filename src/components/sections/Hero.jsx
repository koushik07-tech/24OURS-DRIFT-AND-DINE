import React from 'react';
import { ChevronDown, ArrowRight, Compass, Sparkles, MapPin, Gauge } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { siteConfig } from '../../data/siteConfig';

export default function Hero({ onOpenJourneyModal }) {
  return (
    <section
      id="hero"
      className="relative min-h-[100vh] flex flex-col justify-between pt-32 sm:pt-36 pb-12 px-4 sm:px-6 lg:px-8 bg-brand-black overflow-hidden subtle-grid"
    >
      {/* Dynamic atmospheric ambient glow halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[600px] bg-brand-red/15 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-brand-red/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute -top-20 -right-20 w-[350px] h-[350px] bg-white/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Decorative Speedometer & Track Wireframe Accents in Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 -z-10 overflow-hidden flex items-center justify-center">
        <svg
          viewBox="0 0 1000 600"
          className="w-full max-w-5xl h-auto stroke-white/20 fill-none"
        >
          {/* Track geometry curves */}
          <path
            d="M 50 300 C 200 100, 350 450, 500 250 C 650 50, 800 400, 950 200"
            stroke="#E10600"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            className="animate-pulse-subtle"
          />
          {/* Radial radar circles */}
          <circle cx="500" cy="300" r="280" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="500" cy="300" r="420" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        </svg>
      </div>

      {/* Center Hero Content */}
      <div className="max-w-5xl mx-auto text-center my-auto relative z-10 w-full space-y-8">
        
        {/* Top Badges: Location & Status */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <Badge variant="red" pulse={true} icon={MapPin}>
            {siteConfig.location.city}, {siteConfig.location.state}
          </Badge>
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono tracking-wider text-carbon-400 bg-carbon-900/80 border border-white/10">
            <Compass className="w-3.5 h-3.5 text-brand-red" />
            <span>{siteConfig.location.coordinates}</span>
          </div>
          <Badge variant="white" className="text-[11px]">
            {siteConfig.badgeText}
          </Badge>
        </div>

        {/* Main Headline & Wordmark Display */}
        <div className="space-y-4">
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-display font-black tracking-tighter text-white uppercase leading-[0.88] select-none">
            24<span className="text-carbon-200">OURS</span>
          </h1>

          <div className="flex items-center justify-center gap-3 sm:gap-6 pt-2">
            <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-brand-red" />
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold tracking-[0.3em] sm:tracking-[0.4em] text-brand-red uppercase text-glow-red">
              {siteConfig.tagline}
            </p>
            <span className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-brand-red" />
          </div>

          <p className="text-xs sm:text-sm md:text-base font-mono tracking-[0.25em] text-carbon-300 uppercase pt-2 font-medium">
            {siteConfig.slogan}
          </p>
        </div>

        {/* Narrative Subtitle */}
        <p className="text-carbon-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
          Karnataka's upcoming premier entertainment arena combining high-speed go-karting, panoramic 360° sky dining, VR simulations, grand banquets, and immersive family experiences.
        </p>

        {/* Dual Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 sm:pt-6">
          <Button
            variant="primary"
            size="lg"
            href="#pillars"
            icon={ArrowRight}
            className="w-full sm:w-auto shadow-glow-red"
          >
            {siteConfig.cta.hero}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onOpenJourneyModal}
            icon={Sparkles}
            className="w-full sm:w-auto"
          >
            {siteConfig.cta.journey}
          </Button>
        </div>

        {/* Pre-launch Assurance Note */}
        <div className="pt-2">
          <p className="text-[11px] font-mono tracking-wider text-carbon-400 uppercase">
            ⚡ Facility Currently Under Development • Follow Along for Exclusive Milestone Previews
          </p>
        </div>
      </div>

      {/* Bottom Telemetry & Scroll Down Indicator */}
      <div className="max-w-7xl mx-auto w-full pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-carbon-400 border-t border-white/10 relative z-10">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-white">
            <Gauge className="w-4 h-4 text-brand-red" />
            Pre-Launch Phase
          </span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">{siteConfig.location.region}</span>
        </div>

        {/* Smooth Scroll Anchor Link */}
        <a
          href="#intro"
          className="flex items-center gap-2 text-carbon-400 hover:text-brand-red transition-colors group py-1"
          aria-label="Scroll to introduction"
        >
          <span className="uppercase tracking-widest text-[11px] font-semibold">Scroll to Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-brand-red" />
        </a>
      </div>
    </section>
  );
}

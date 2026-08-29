import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Mail, MapPin } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { siteConfig } from '../../data/siteConfig';

export default function PreLaunchCTA({ onOpenJourneyModal }) {
  return (
    <SectionWrapper
      id="pre-launch-cta"
      badge={
        <Badge variant="red" pulse={true}>
          Join the Paddock
        </Badge>
      }
      subtitle="Exclusive Pre-Opening Community"
      title="THE JOURNEY STARTS NOW."
      description="Be there from the beginning. Get early invitations to soft launches, track previews, and exclusive VIP dining events."
      align="center"
      glowColor="red"
      hasGrid={true}
    >
      <div className="relative rounded-3xl bg-gradient-to-b from-carbon-850 via-carbon-900 to-carbon-950 border border-brand-red/40 p-8 sm:p-14 lg:p-16 text-center max-w-4xl mx-auto shadow-glow-red overflow-hidden">
        
        {/* Glow ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-red/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 space-y-8">
          <div className="space-y-3">
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
              Be on the Grid Before Flag-Off.
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-carbon-300 font-sans max-w-2xl mx-auto leading-relaxed">
              We are building a community of motorsport enthusiasts, food lovers, and experience seekers across Karnataka.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenJourneyModal}
              icon={Sparkles}
              className="w-full sm:w-auto shadow-glow-red"
            >
              {siteConfig.cta.journey}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="#intro"
              className="w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-mono text-carbon-400 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-red" />
              Verified Construction Updates
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-red" />
              Early Access Passes
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-red" />
              Malur, Kolar, Karnataka
            </span>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}

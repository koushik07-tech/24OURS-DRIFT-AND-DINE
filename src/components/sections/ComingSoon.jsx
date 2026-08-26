import React from 'react';
import { Hammer, Sparkles, HardHat, Compass, Shield, ArrowRight } from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ComingSoon({ onOpenJourneyModal }) {
  const constructionMilestones = [
    {
      title: "Track Civil Engineering & Circuit Layout",
      status: "In Active Progress",
      description: "Grading high-speed curves, multi-level elevations, and safety barrier foundation walls.",
    },
    {
      title: "360° Sky Dining Architectural Structure",
      status: "Framing & Elevation",
      description: "Erecting the marquee elevated cantilever viewing deck overlooking the arena.",
    },
    {
      title: "Banquet & Event Complex Engineering",
      status: "Acoustic & Interior Design",
      description: "Developing modular luxury ballrooms, sound baffle isolation, and staging suites.",
    },
    {
      title: "Next-Gen Tech & VR Simulator Procurement",
      status: "Systems Configuration",
      description: "Configuring hydraulic motion simulators, digital lap telemetry, and 4K LED screening walls.",
    },
  ];

  return (
    <SectionWrapper
      id="coming-soon"
      badge={
        <Badge variant="red" pulse={true} icon={HardHat}>
          Development Story
        </Badge>
      }
      subtitle="Behind The Scenes"
      title="WE'RE BUILDING 24OURS."
      description="Every beam, curve, and kitchen station is being meticulously crafted to deliver Karnataka’s premier entertainment landmark. Follow our construction milestones as we move closer to flag-off."
      align="center"
      glowColor="red"
      hasGrid={true}
    >
      {/* Milestone Story Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {constructionMilestones.map((item, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-2xl bg-carbon-900/80 border border-white/10 glass-panel-hover space-y-3 text-left group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-brand-red uppercase tracking-wider font-semibold">
                Milestone 0{idx + 1}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/5 border border-white/10 text-carbon-300">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                {item.status}
              </span>
            </div>

            <h4 className="text-lg font-display font-bold text-white group-hover:text-white transition-colors">
              {item.title}
            </h4>

            <p className="text-xs sm:text-sm text-carbon-400 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Anticipation Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-carbon-900 via-carbon-850 to-carbon-900 border border-white/15 p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-card-elevated">
        <div className="inline-flex p-3 rounded-full bg-brand-red/10 border border-brand-red/30 text-brand-red">
          <Sparkles className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Want Behind-the-Scenes Access?
          </h3>
          <p className="text-sm sm:text-base text-carbon-300 max-w-xl mx-auto">
            Sign up for our developer updates. We will share track unveilings, early access passes, and invitation-only preview nights directly to your inbox.
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            size="lg"
            onClick={onOpenJourneyModal}
            icon={ArrowRight}
            className="shadow-glow-red"
          >
            Follow the Journey
          </Button>
        </div>
      </div>
    </SectionWrapper>
  );
}

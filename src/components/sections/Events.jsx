import React, { useState } from 'react';
import { 
  Building2, Users, Cake, Heart, Car, Sparkles, Check, ArrowRight, ShieldCheck 
} from 'lucide-react';
import SectionWrapper from '../ui/SectionWrapper';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { eventsData } from '../../data/events';

export default function Events({ onOpenJourneyModal }) {
  const [selectedEventId, setSelectedEventId] = useState('corporate');

  const activeEvent = eventsData.find((e) => e.id === selectedEventId) || eventsData[0];

  const eventPillars = [
    { title: "Turnkey Décor & Staging", desc: "Custom thematic lighting, floral artistry, stage fabrication, and concert AV." },
    { title: "Gourmet Catering", desc: "Artisanal multi-course banquets tailored for intimate gatherings or large galas." },
    { title: "Integrated Entertainment", desc: "Private go-kart tournaments, VR challenges, and Sky Deck celebrations." },
    { title: "Dedicated Event Producers", desc: "End-to-end planning consultants managing coordination, scheduling, and hospitality." },
  ];

  return (
    <SectionWrapper
      id="events"
      badge={
        <Badge variant="red" pulse={true}>
          Bespoke Celebrations & Banquets
        </Badge>
      }
      subtitle="Gatherings & Milestones"
      title="YOUR EVENT. OUR PLAYGROUND."
      description="From adrenaline-charged corporate Grand Prix tournaments to grand fairy-tale weddings and private milestone parties, 24OURS transforms every celebration into an unforgettable spectacle."
      align="center"
      glowColor="red"
      hasGrid={true}
    >
      {/* Event Categories Interactive Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {eventsData.map((ev) => {
          const isSelected = ev.id === selectedEventId;
          return (
            <button
              key={ev.id}
              onClick={() => setSelectedEventId(ev.id)}
              className={`p-5 rounded-2xl text-left transition-all duration-300 border space-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red ${
                isSelected
                  ? 'bg-carbon-850 border-brand-red shadow-glow-red'
                  : 'bg-carbon-900/60 border-white/10 hover:border-white/20 hover:bg-carbon-850/50'
              }`}
            >
              <span className="text-[10px] font-mono tracking-widest text-brand-red uppercase">
                {ev.badge}
              </span>
              <h4 className="text-base font-display font-bold text-white leading-snug">
                {ev.title}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Active Event Showcase Card */}
      <div className="rounded-3xl bg-carbon-900 border border-white/15 p-6 sm:p-10 lg:p-12 shadow-card-elevated relative overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-brand-red/15 text-brand-red border border-brand-red/40 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              {activeEvent.badge}
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white tracking-tight">
                {activeEvent.title}
              </h3>
              <p className="text-sm sm:text-base font-mono text-brand-red">
                "{activeEvent.tagline}"
              </p>
              <p className="text-sm sm:text-base text-carbon-300 font-sans leading-relaxed pt-2">
                {activeEvent.description}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2.5 pt-2">
              {activeEvent.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-carbon-200">
                  <span className="w-5 h-5 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center text-brand-red shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={onOpenJourneyModal}
                icon={ArrowRight}
              >
                Inquire for Pre-Opening Event Dates
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-carbon-950 border border-white/10 space-y-4 text-left">
              <p className="text-xs font-mono text-carbon-400 uppercase tracking-wider">
                Full-Service Event Infrastructure
              </p>
              
              <div className="space-y-3">
                {eventPillars.map((p, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-carbon-900 border border-white/5">
                    <p className="text-xs font-heading font-semibold text-white">{p.title}</p>
                    <p className="text-[11px] text-carbon-400 mt-0.5">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
}

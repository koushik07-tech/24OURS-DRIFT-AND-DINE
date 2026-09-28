"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Users,
  Trophy,
  Gauge,
  Clock,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Zap,
  Flame,
  Shield,
  Layers,
} from "lucide-react";
import { packagesData } from "@/data/packages";
import { useBooking } from "@/context/BookingContext";
import { soundEngine } from "@/lib/soundEngine";

interface StepOption {
  id: string;
  label: string;
  desc: string;
  icon: any;
}

const STEPS = [
  {
    key: "intent",
    title: "1. What is your primary track mission?",
    subtitle: "Select the atmosphere and style of your racing visit.",
    options: [
      { id: "speed", label: "Pure Track Adrenaline", desc: "Fastest laps, high speed, competitive heats", icon: Flame },
      { id: "family", label: "Family & All-Ages Fun", desc: "Kids & adults racing, arcade, dining together", icon: Users },
      { id: "tech", label: "Tech & VR Simulation", desc: "Asphalt karting + 6-DOF full motion VR pods", icon: Zap },
      { id: "corporate", label: "Corporate Team Grand Prix", desc: "Tournaments, podium, private banquets", icon: Trophy },
      { id: "birthday", label: "Milestone Celebration", desc: "Birthday heats, trophies, private party zone", icon: Sparkles },
    ],
  },
  {
    key: "groupSize",
    title: "2. How many racers in your crew?",
    subtitle: "We optimize grid capacity and heat scheduling.",
    options: [
      { id: "solo", label: "Solo Racer (1 Person)", desc: "Focus on personal telemetry & lap times", icon: Gauge },
      { id: "friends", label: "Small Group (2 – 4 Racers)", desc: "Head-to-head sprint racing heats", icon: Users },
      { id: "family", label: "Family Pack (4 – 6 Racers)", desc: "Junior + adult combined sessions", icon: Shield },
      { id: "squad", label: "Large Crew (10 – 50 Racers)", desc: "Exclusive track tournament & podium", icon: Trophy },
    ],
  },
  {
    key: "experience",
    title: "3. What is your driving experience?",
    subtitle: "Helps us configure the electronic speed governor mode.",
    options: [
      { id: "rookie", label: "Rookie / First Time", desc: "Guidance, safety briefing, easy handling", icon: Shield },
      { id: "intermediate", label: "Casual / Enthusiast", desc: "Comfortable with tight chicanes and passing", icon: Gauge },
      { id: "pro", label: "Track Master / Pro", desc: "Full throttle unrestricted electric motor output", icon: Flame },
    ],
  },
];

export default function AIPackageRecommendation() {
  const { openBookingModal } = useBooking();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({
    intent: "speed",
    groupSize: "friends",
    experience: "intermediate",
  });
  const [isCalculated, setIsCalculated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectOption = (key: string, value: string) => {
    soundEngine.playClick(620);
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      triggerAnalysis();
    }
  };

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    soundEngine.playEngineRev();
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsCalculated(true);
      soundEngine.playClick(800);
    }, 900);
  };

  const resetWizard = () => {
    soundEngine.playClick(450);
    setCurrentStep(0);
    setIsCalculated(false);
    setIsAnalyzing(false);
  };

  // Determine the best matched package from actual packagesData
  const getRecommendation = () => {
    let matchedId = "race-pack";
    let profileTitle = "APEX ADRENALINE RACER";
    let profileBadge = "🔥 PURE PERFORMANCE";

    if (answers.intent === "family" || answers.groupSize === "family") {
      matchedId = "family-pack";
      profileTitle = "ALL-STAR MOTORSPORT FAMILY";
      profileBadge = "👨‍👩‍👧‍👦 FAMILY ZONE";
    } else if (answers.intent === "corporate" || answers.groupSize === "squad") {
      matchedId = "corporate-pack";
      profileTitle = "EXECUTIVE GRAND PRIX SQUAD";
      profileBadge = "🏆 CHAMPIONSHIP CUP";
    } else if (answers.intent === "birthday") {
      matchedId = "birthday-pack";
      profileTitle = "CELEBRATION GRID CHAMPION";
      profileBadge = "🎉 BIRTHDAY SPECIAL";
    } else if (answers.intent === "tech") {
      matchedId = "adventure-pack";
      profileTitle = "CYBER SPEED & SIMULATOR PILOT";
      profileBadge = "⚡ 6-DOF VR + TRACK";
    } else {
      matchedId = "race-pack";
      profileTitle = "TELEMETRY ADRENALINE RACER";
      profileBadge = "🏁 2x HOT LAP HEATS";
    }

    const pkg = packagesData.find((p) => p.id === matchedId) || packagesData[0];
    return { pkg, profileTitle, profileBadge };
  };

  const { pkg, profileTitle, profileBadge } = getRecommendation();

  return (
    <section id="ai-recommendation" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#080b12] border-t border-b border-white/5 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#FF5A36]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-[#FF5A36]/40 text-[#FF5A36] text-xs font-mono font-bold uppercase mb-4 shadow-[0_0_20px_rgba(255,90,54,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI RACE CONFIGURATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
            FIND YOUR PERFECT <span className="bg-gradient-to-r from-[#FF5A36] to-[#F59E0B] bg-clip-text text-transparent">RACE PROFILE</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 font-sans">
            Answer 3 quick questions about your crew, and our AI track engine configures your optimal package with real verified pricing.
          </p>
        </div>

        {/* Wizard Card */}
        <div className="liquid-glass rounded-3xl border border-white/10 p-6 sm:p-10 bg-[#0b0f17]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] relative overflow-hidden">
          
          {/* Loading / Analyzing State */}
          {isAnalyzing && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative w-16 h-16">
                <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-[#FF5A36] animate-spin" />
                <Gauge className="w-6 h-6 text-[#FF5A36] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">
                Calculating Telemetry & Match...
              </h3>
              <p className="text-xs font-mono text-zinc-400">
                Cross-referencing track heats, minimum age, group size, and RFID timing...
              </p>
            </div>
          )}

          {/* Step by step questions */}
          {!isAnalyzing && !isCalculated && (
            <div>
              {/* Progress Steps Header */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {STEPS.map((s, idx) => (
                    <div
                      key={s.key}
                      onClick={() => {
                        soundEngine.playClick(400);
                        setCurrentStep(idx);
                      }}
                      className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                        idx === currentStep
                          ? "w-10 bg-[#FF5A36] shadow-[0_0_12px_rgba(255,90,54,0.6)]"
                          : idx < currentStep
                          ? "w-6 bg-emerald-500/80"
                          : "w-4 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono text-zinc-400">
                  Step {currentStep + 1} of {STEPS.length}
                </span>
              </div>

              {/* Step Content */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-1">
                  {STEPS[currentStep].title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mb-6 font-sans">
                  {STEPS[currentStep].subtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {STEPS[currentStep].options.map((opt) => {
                    const IconComponent = opt.icon;
                    const isSelected = answers[STEPS[currentStep].key] === opt.id;

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(STEPS[currentStep].key, opt.id)}
                        className={`text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 group ${
                          isSelected
                            ? "bg-[#FF5A36]/15 border-[#FF5A36] shadow-[0_0_25px_rgba(255,90,54,0.25)]"
                            : "bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-xl transition-colors ${
                            isSelected
                              ? "bg-[#FF5A36] text-white shadow-lg"
                              : "bg-black/40 text-zinc-400 group-hover:text-white"
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-display font-bold text-white group-hover:text-[#FF5A36] transition-colors">
                            {opt.label}
                          </div>
                          <div className="text-xs text-zinc-400 mt-1 leading-snug">{opt.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Step Navigation Controls */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  disabled={currentStep === 0}
                  onClick={() => {
                    soundEngine.playClick(400);
                    setCurrentStep((prev) => Math.max(0, prev - 1));
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
                >
                  &larr; Previous Question
                </button>

                {currentStep === STEPS.length - 1 ? (
                  <button
                    onClick={triggerAnalysis}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#ff3b14] hover:brightness-110 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(255,90,54,0.4)] transition-all"
                  >
                    <span>Generate Race Profile</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      soundEngine.playClick(500);
                      setCurrentStep((prev) => prev + 1);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Result Card: Verified Cinematic Recommendation */}
          {!isAnalyzing && isCalculated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/40 mb-2">
                    {profileBadge}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-tight">
                    {profileTitle}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-1">
                    AI telemetry score: 98% match with your racing requirements
                  </p>
                </div>

                <button
                  onClick={resetWizard}
                  className="self-start sm:self-auto px-3.5 py-1.5 rounded-full liquid-glass hover:bg-white/10 text-zinc-400 hover:text-white transition-all text-xs font-mono flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recalculate</span>
                </button>
              </div>

              {/* Package Details Showcase */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-display font-black text-white">
                      ₹{pkg.price ? pkg.price.toLocaleString("en-IN") : "Custom"}
                    </span>
                    <span className="text-xs font-mono text-zinc-400 uppercase">
                      / {pkg.duration} Experience
                    </span>
                  </div>

                  <p className="text-sm text-zinc-300 font-sans leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-mono uppercase text-[#FF5A36] font-bold tracking-wider">
                      Included in this Package:
                    </div>
                    {pkg.includes.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-zinc-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Action Column */}
                <div className="lg:col-span-5 flex flex-col justify-center p-6 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-3 border-b border-white/10">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#FF5A36]" /> Duration
                    </span>
                    <span className="text-white font-bold">{pkg.duration}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-3 border-b border-white/10">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" /> Guest Range
                    </span>
                    <span className="text-white font-bold">{pkg.minGuests} – {pkg.maxGuests} Racers</span>
                  </div>

                  <button
                    onClick={() => {
                      soundEngine.playClick(650);
                      openBookingModal(pkg.name);
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF5A36] to-[#ff3b14] hover:brightness-110 active:scale-95 text-white font-display font-bold text-sm uppercase tracking-wider shadow-[0_0_35px_rgba(255,90,54,0.45)] transition-all flex items-center justify-center gap-2 border border-red-500/30"
                  >
                    <span>BOOK THIS EXPERIENCE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center font-mono text-zinc-500">
                    Instant calendar lock &bull; Razorpay Secure &bull; No hidden fees
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

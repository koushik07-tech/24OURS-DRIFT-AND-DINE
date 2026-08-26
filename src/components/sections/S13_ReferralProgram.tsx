"use client";

import React, { useState } from "react";
import { Users, Gift, Share2, Copy, Check, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function S13_ReferralProgram() {
  const { isAuthenticated, user } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode = isAuthenticated && user?.email 
    ? `24O-${user.email.split("@")[0].toUpperCase()}`
    : "24O-SPEED-DRIFT";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://24oursdriftanddine.com?ref=${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="referral" className="py-24 sm:py-32 bg-carbon-950 border-b border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
              <Gift className="w-3.5 h-3.5" />
              Community Paddock Referral Program
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              BRING 10, <span className="text-brand-red">GET IN FREE.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              Introduce your crew to South India’s premier motorsport destination. Refer 10 verified visitors within 15 days and receive complimentary venue access!
            </p>
          </div>
        </div>

        {/* Interactive Referral Card & Tracker Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* Left: Tracker Demonstration */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-carbon-900 border border-white/15 space-y-6 shadow-card-elevated">
            <div className="space-y-2">
              <span className="text-xs font-mono text-brand-red uppercase font-bold tracking-wider">
                Rolling 15-Day Referral Window
              </span>
              <h3 className="text-xl font-display font-bold text-white uppercase">
                REFERRAL SQUAD PROGRESS
              </h3>
              <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                Share your personal driver invite link. When 10 friends complete check-in at 24Ours within 15 rolling days, your VIP access pass generates automatically.
              </p>
            </div>

            {/* Progress Gauge */}
            <div className="space-y-3 p-5 rounded-2xl bg-carbon-950 border border-white/10">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-white font-bold">Referred Friends Checked In</span>
                <span className="text-brand-red font-bold">4 / 10 Completed</span>
              </div>

              <div className="w-full h-3 rounded-full bg-carbon-850 overflow-hidden">
                <div className="h-full bg-brand-red transition-all duration-500" style={{ width: "40%" }} />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-carbon-400 pt-1">
                <span>Current Status: Active Streak</span>
                <span className="text-emerald-400">6 More Needed for Free Entry</span>
              </div>
            </div>

            {/* Code Generator & Copy Link */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-carbon-400 uppercase">Your Unique Referral Invite Link</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 px-4 py-3 bg-carbon-950 border border-white/10 rounded-xl font-mono text-xs text-white truncate flex items-center">
                  https://24oursdriftanddine.com?ref={referralCode}
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-6 py-3 rounded-xl bg-brand-red text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-brand-redDark transition-all flex items-center justify-center gap-2 shrink-0 shadow-glow-red"
                >
                  {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? "COPIED LINK!" : "COPY LINK"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: How It Works */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-carbon-900 border border-white/10 space-y-4">
              <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                How The 10-Driver Pass Works
              </h4>
              
              <div className="space-y-3 font-sans text-xs text-carbon-300">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-red/20 text-brand-red font-mono font-bold flex items-center justify-center text-xs shrink-0">1</span>
                  <p>Send your unique referral code to friends, colleagues, or college peers.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-red/20 text-brand-red font-mono font-bold flex items-center justify-center text-xs shrink-0">2</span>
                  <p>Each referred guest applies your code when booking online or at on-site check-in.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-red/20 text-brand-red font-mono font-bold flex items-center justify-center text-xs shrink-0">3</span>
                  <p>Once 10 unique visits log within 15 days, your digital pass voucher unlocks in your profile.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

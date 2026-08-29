import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen subtle-grid text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold inline-block">
            Terms of Service
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase">
            TERMS & VENUE GUIDELINES
          </h1>
          <p className="text-xs font-mono text-brand-red uppercase">
            {siteConfig.legalName} • Directors: {siteConfig.directors.map((d) => d.name).join(" & ")}
          </p>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-carbon-950 border border-white/10 space-y-6 shadow-card-elevated">
          <div className="space-y-2">
            <h3 className="text-lg font-heading font-bold text-white uppercase">1. Driver Eligibility & Safety Gear</h3>
            <p className="text-sm text-carbon-300 leading-relaxed font-sans">
              Drivers must be at least 12 years of age and meet the minimum height requirement of 4'6" (137 cm). Closed-toe footwear is strictly mandatory. Sanitized full-face helmets and race suits provided on-site must be worn at all times while in the pit lane and on circuit.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-heading font-bold text-white uppercase">2. Venue Protocols</h3>
            <p className="text-sm text-carbon-300 leading-relaxed font-sans">
              Reckless driving, intentional bumping, or disregard for track marshal flags will result in immediate electronic speed governance or disqualification without pass reimbursement.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-heading font-bold text-white uppercase">3. Corporate Entity</h3>
            <p className="text-sm text-carbon-300 leading-relaxed font-sans">
              All destination activities, bookings, and catering services are operated by {siteConfig.legalName} in Malur, Kolar, Karnataka.
            </p>
          </div>
        </div>

        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-carbon-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Destination Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

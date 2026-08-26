import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen subtle-grid text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold inline-block">
            Legal & Compliance
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase">
            PRIVACY POLICY
          </h1>
          <p className="text-xs font-mono text-brand-red uppercase">
            {siteConfig.legalName} • Directors: {siteConfig.directors.map((d) => d.name).join(" & ")}
          </p>
        </div>

        <div className="p-8 sm:p-12 rounded-3xl bg-carbon-950 border border-white/10 space-y-6 shadow-card-elevated">
          <div className="space-y-2">
            <h3 className="text-lg font-heading font-bold text-white uppercase">1. Information Collection</h3>
            <p className="text-sm text-carbon-300 leading-relaxed font-sans">
              We collect your name, email address, contact telephone, and racing telemetry statistics solely to generate digital passes, compute track lap timing, and provide concierge customer support.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-heading font-bold text-white uppercase">2. Telemetry & Media</h3>
            <p className="text-sm text-carbon-300 leading-relaxed font-sans">
              Trackside transponder lap timing data and leaderboard rankings may be displayed on venue monitors for competition purposes. You can request profile anonymization at any time.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-heading font-bold text-white uppercase">3. Contact & Inquiries</h3>
            <p className="text-sm text-carbon-300 leading-relaxed font-sans">
              For any privacy inquiries, please contact our compliance desk at <span className="text-brand-red font-mono">{siteConfig.contact.email}</span>.
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

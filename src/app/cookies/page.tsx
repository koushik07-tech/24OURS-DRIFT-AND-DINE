import React from "react";
import Link from "next/link";
import { Cookie, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function CookiesPage() {
  return (
    <div className="pt-36 pb-24 min-h-screen bg-brand-black text-white selection:bg-brand-red selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold">
            <Cookie className="w-3.5 h-3.5" />
            Cookie & Tracking Policy
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase">
            COOKIE POLICY
          </h1>
          <p className="text-xs font-mono text-carbon-400 uppercase">
            {siteConfig.legalName} • Directors: {siteConfig.directors.map((d) => d.name).join(" & ")}
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-carbon-950 border border-white/10 space-y-6 text-sm text-carbon-300 leading-relaxed font-sans">
          <div className="space-y-2">
            <h3 className="text-base font-heading font-bold text-white uppercase">1. How We Use Cookies</h3>
            <p>
              24Ours Drift and Dine Private Limited utilizes essential session cookies and local storage tokens strictly to maintain authenticated driver sessions, remember booking cart selections, and store telemetry user preferences.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-heading font-bold text-white uppercase">2. Analytics & Performance</h3>
            <p>
              We may utilize anonymized performance cookies to evaluate website traffic, optimize video streaming throughput, and ensure low latency for our interactive 3D elements.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-heading font-bold text-white uppercase">3. Managing Preferences</h3>
            <p>
              You can adjust your browser settings at any time to reject non-essential cookies. Disabling essential cookies may impact authentication and digital pass booking functionality.
            </p>
          </div>
        </div>

        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-brand-red hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Destination Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

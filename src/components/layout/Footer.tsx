"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, ArrowUp, Instagram, Youtube, Linkedin, Twitter } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-carbon-950 border-t border-white/10 pt-16 pb-12 text-carbon-400 font-sans text-xs select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Tier */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10 text-left">
          
          {/* Brand & Corporate Entity */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-red flex items-center justify-center text-white font-display font-black text-base shadow-glow-red">
                24
              </div>
              <div>
                <span className="text-sm font-display font-black tracking-tight text-white block">
                  24OURS
                </span>
                <span className="text-[8px] font-mono tracking-[0.2em] text-brand-red font-bold uppercase block">
                  DRIFT AND DINE
                </span>
              </div>
            </div>

            <p className="text-carbon-400 text-xs leading-relaxed">
              {siteConfig.legalName} — Karnataka’s flagship entertainment destination. Electric go-karting, 360° sky dining, RC racing, and luxury event architecture.
            </p>

            {/* Directors Credit (Required) */}
            <div className="p-3.5 rounded-xl bg-carbon-900 border border-white/5 space-y-1 text-[11px] font-mono">
              <span className="text-brand-red font-bold uppercase block">Executive Directors</span>
              <p className="text-white font-medium">
                {siteConfig.directors.map((d) => d.name).join(" & ")}
              </p>
            </div>
          </div>

          {/* Quick Destination Navigation */}
          <div className="lg:col-span-2 space-y-3 font-mono">
            <p className="text-xs uppercase tracking-widest text-white font-semibold">
              Destinations
            </p>
            <ul className="space-y-2 text-carbon-400">
              <li><a href="#karting" className="hover:text-brand-red transition-colors">Go-Karting Circuit</a></li>
              <li><a href="#rc-racing" className="hover:text-brand-red transition-colors">RC Racing Arena</a></li>
              <li><a href="#restaurant" className="hover:text-brand-red transition-colors">360° Sky Dining</a></li>
              <li><a href="#events" className="hover:text-brand-red transition-colors">Event & Banquets</a></li>
              <li><a href="#automotive" className="hover:text-brand-red transition-colors">Automotive Gallery</a></li>
              <li><a href="#gallery" className="hover:text-brand-red transition-colors">Visual Archive</a></li>
            </ul>
          </div>

          {/* Driver & Admin Portal */}
          <div className="lg:col-span-3 space-y-3 font-mono">
            <p className="text-xs uppercase tracking-widest text-white font-semibold">
              Portals & Services
            </p>
            <ul className="space-y-2 text-carbon-400">
              <li><Link href="/dashboard" className="hover:text-brand-red transition-colors">Driver Telemetry Portal</Link></li>
              <li><Link href="/login" className="hover:text-brand-red transition-colors">Customer & Staff Login</Link></li>
              <li><Link href="/admin" className="text-amber-400 hover:text-white transition-colors">Master Admin Console</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-red transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-red transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-brand-red transition-colors">Refund & Cancellation</Link></li>
            </ul>
          </div>

          {/* Contact Coordinates */}
          <div className="lg:col-span-3 space-y-3 font-mono">
            <p className="text-xs uppercase tracking-widest text-white font-semibold">
              Paddock Coordinates
            </p>
            <div className="space-y-2 text-[11px] text-carbon-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0 mt-0.5" />
                <span>{siteConfig.location.displayAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <span>{siteConfig.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <span>{siteConfig.contact.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-brand-red shrink-0" />
                <span>{siteConfig.contact.openingHours}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal Tier */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-carbon-500 font-mono text-[11px]">
          <div>
            <p>© {currentYear} {siteConfig.legalName}. All rights reserved. Directors: Nagarjun Lakshman & Uday Chandhan.</p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
            <Link href="/cancellation-policy" className="hover:text-white transition-colors">Cancellations</Link>
            
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-carbon-900 border border-white/10 text-carbon-400 hover:text-white hover:border-brand-red transition-all ml-2"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

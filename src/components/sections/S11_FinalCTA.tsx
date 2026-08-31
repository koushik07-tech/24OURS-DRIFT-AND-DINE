"use client";

import React from "react";
import { Calendar, Phone, Mail, MapPin, Send, Compass } from "lucide-react";
import { siteConfig } from "@/config/site";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S11_FinalCTA() {
  const { openBookingModal, openEnquiryModal } = useBooking();

  return (
    <section id="contact" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-brand-black overflow-hidden select-none">
      
      {/* Background Poster with Gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={mediaConfig.posters.destinationNight}
          alt="24OURS Destination Night"
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-black/85 to-brand-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-red/15 rounded-full blur-[180px] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
        
        <div className="space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold inline-block shadow-glow-red">
            Your Track Awaits
          </span>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase text-white tracking-tight leading-tight">
            ARE YOU READY TO<br />
            <span className="text-brand-red">TAKE THE APEX?</span>
          </h2>

          <p className="text-carbon-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Reserve your racing heat, lock in panoramic sky-dining reservations, or plan your next high-impact corporate Grand Prix offsite in Malur, Kolar, Karnataka.
          </p>
        </div>

        {/* Action Buttons (Strictly No Pricing) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-red text-white font-heading font-bold text-sm uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>BOOK NOW</span>
          </button>

          <button
            onClick={() => openEnquiryModal()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-carbon-900 border border-white/15 text-white font-heading font-bold text-sm uppercase tracking-wider hover:border-brand-red hover:bg-carbon-850 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-brand-red" />
            <span>ENQUIRE NOW</span>
          </button>
        </div>

        {/* Contact Info Pills */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-carbon-300 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-carbon-950/80 border border-white/5 space-y-1">
            <span className="text-brand-red font-bold block uppercase">Concierge Line</span>
            <p className="text-white">{siteConfig.contact.phone}</p>
          </div>
          <div className="p-4 rounded-2xl bg-carbon-950/80 border border-white/5 space-y-1">
            <span className="text-brand-red font-bold block uppercase">Email Inquiries</span>
            <p className="text-white">{siteConfig.contact.email}</p>
          </div>
          <div className="p-4 rounded-2xl bg-carbon-950/80 border border-white/5 space-y-1">
            <span className="text-brand-red font-bold block uppercase">Operating Hours</span>
            <p className="text-white">{siteConfig.contact.openingHours}</p>
          </div>
        </div>

      </div>
    </section>
  );
}

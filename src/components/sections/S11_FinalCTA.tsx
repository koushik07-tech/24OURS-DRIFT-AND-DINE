"use client";

import React from "react";
import { Calendar, Phone, Mail, MapPin, Send, Compass, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S11_FinalCTA() {
  const { openBookingModal, openEnquiryModal } = useBooking();

  return (
    <section id="contact" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-brand-black overflow-hidden select-none">
      
      {/* Full-screen Background Video with Dark & Gradient Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={mediaConfig.posters.destinationNight}
          className="w-full h-full object-cover opacity-40 scale-105"
        >
          <source src={mediaConfig.videos.destinationNight} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-black/95 via-brand-black/70 to-brand-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-red/20 rounded-full blur-[190px] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
        
        <div className="space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold inline-block shadow-glow-red">
            Chikkaballapura Highway Corridor
          </span>

          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black uppercase text-white tracking-tight leading-tight">
            YOUR NEXT EXPERIENCE<br />
            <span className="text-brand-red">STARTS HERE.</span>
          </h2>

          <p className="text-carbon-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Step onto South India’s premier motorsport, RC racing, and sky dining destination. Open 24 hours daily with instant digital pass ticketing.
          </p>
        </div>

        {/* Action Buttons (Strictly No Pricing) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-red text-white font-heading font-bold text-sm uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center justify-center gap-2 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>BOOK NOW</span>
          </button>

          <button
            onClick={() => openEnquiryModal()}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-carbon-900 border border-white/15 text-white font-heading font-bold text-sm uppercase tracking-wider hover:border-brand-red hover:bg-carbon-850 flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-4 h-4 text-brand-red" />
            <span>CONTACT US</span>
          </button>
        </div>

        {/* Contact Info Coordinates */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-carbon-300 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-carbon-950/80 border border-white/5 space-y-1">
            <span className="text-brand-red font-bold block uppercase">Concierge Paddock</span>
            <p className="text-white">{siteConfig.contact.phone}</p>
          </div>
          <div className="p-4 rounded-2xl bg-carbon-950/80 border border-white/5 space-y-1">
            <span className="text-brand-red font-bold block uppercase">Email Inquiries</span>
            <p className="text-white">{siteConfig.contact.email}</p>
          </div>
          <div className="p-4 rounded-2xl bg-carbon-950/80 border border-white/5 space-y-1">
            <span className="text-brand-red font-bold block uppercase">Operating Schedule</span>
            <p className="text-white">{siteConfig.contact.openingHours}</p>
          </div>
        </div>

      </div>
    </section>
  );
}


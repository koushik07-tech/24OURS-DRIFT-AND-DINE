"use client";

import React from "react";
import { Calendar, Phone, Mail, MapPin, Send, Compass, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";
import MagneticButton from "@/components/ui/MagneticButton";
import MotionReveal from "@/components/ui/MotionReveal";
import Card3D from "@/components/ui/Card3D";

export default function S11_FinalCTA() {
  const { openBookingModal, openEnquiryModal } = useBooking();

  return (
    <section id="contact" className="relative py-28 sm:py-36 px-4 sm:px-6 lg:px-8 bg-[#060608] overflow-hidden select-none">
      
      {/* Background Poster with Crimson Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={mediaConfig.posters.destinationNight}
          alt="24OURS Destination Night"
          className="w-full h-full object-cover opacity-20 scale-105"
        ></img>
        <div className="absolute inset-0 bg-gradient-to-b from-[#060608] via-[#060608]/85 to-[#060608]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-brand-crimson/20 rounded-full blur-[180px] pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
        
        <MotionReveal direction="up" className="space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 uppercase font-bold inline-block shadow-[0_0_20px_rgba(255,46,0,0.4)]">
            Your Track Awaits
          </span>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black uppercase text-white tracking-tight leading-tight">
            ARE YOU READY TO<br />
            <span className="text-brand-crimson font-orbitron text-glow-red">TAKE THE APEX?</span>
          </h2>

          <p className="text-carbon-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
            Reserve your racing heat, lock in panoramic sky-dining reservations, or plan your next high-impact corporate Grand Prix offsite in Malur, Kolar, Karnataka.
          </p>
        </MotionReveal>

        {/* Magnetic Action Buttons */}
        <MotionReveal direction="up" delay={0.2} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <MagneticButton
            variant="primary"
            onClick={() => openBookingModal("Electric Go-Karting Grand Prix")}
            className="w-full sm:w-auto px-8 py-4 text-sm"
          >
            <Calendar className="w-4 h-4" />
            <span>BOOK NOW</span>
          </MagneticButton>

          <MagneticButton
            variant="glass"
            onClick={() => openEnquiryModal()}
            className="w-full sm:w-auto px-8 py-4 text-sm"
          >
            <Send className="w-4 h-4 text-brand-crimson" />
            <span>ENQUIRE NOW</span>
          </MagneticButton>
        </MotionReveal>

        {/* Contact Info Pills in 3D Card Format */}
        <MotionReveal direction="up" delay={0.3} className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-carbon-300 max-w-4xl mx-auto perspective-1000">
          <Card3D depth={15} className="bg-carbon-950/80 border border-white/5 backdrop-blur-xl">
            <div className="p-5 space-y-1 text-center">
              <span className="text-brand-crimson font-bold block uppercase tracking-wider">Concierge Line</span>
              <p className="text-white text-sm font-bold">{siteConfig.contact.phone}</p>
            </div>
          </Card3D>

          <Card3D depth={15} className="bg-carbon-950/80 border border-white/5 backdrop-blur-xl">
            <div className="p-5 space-y-1 text-center">
              <span className="text-brand-crimson font-bold block uppercase tracking-wider">Email Inquiries</span>
              <p className="text-white text-sm font-bold">{siteConfig.contact.email}</p>
            </div>
          </Card3D>

          <Card3D depth={15} className="bg-carbon-950/80 border border-white/5 backdrop-blur-xl">
            <div className="p-5 space-y-1 text-center">
              <span className="text-brand-crimson font-bold block uppercase tracking-wider">Operating Hours</span>
              <p className="text-white text-sm font-bold">{siteConfig.contact.openingHours}</p>
            </div>
          </Card3D>
        </MotionReveal>

      </div>
    </section>
  );
}

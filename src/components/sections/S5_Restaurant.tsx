"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Compass, Clock, Users, Calendar, Utensils, Check, ShieldCheck, Sparkles, X, ChevronRight } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { useBooking } from "@/context/BookingContext";

export default function S5_Restaurant() {
  const { openBookingModal } = useBooking();
  const [menuModalOpen, setMenuModalOpen] = useState(false);

  const diningHighlights = [
    { title: "Strictly Non-Alcoholic Environment", desc: "Alcohol-free by design — established as an upscale, family- and community-safe social space for all generations." },
    { title: "Floor-to-Ceiling 360° Vantage Deck", desc: "Panoramic elevated seating overlooking the electric karting circuit, RC raceway, and horizon skyline." },
    { title: "Artisanal Global Gastronomy", desc: "Wood-fired artisanal pizzas, gourmet sliders, delicate wok specialties, sizzlers, and handcrafted desserts." },
    { title: "Signature Botanical Mocktail Bar", desc: "Zero-proof mixology featuring nitrogen smoke infusions, exotic fruit reductions, and fresh botanical coolers." },
    { title: "500-Capacity Dining & Private Pods", desc: "Spacious layout with a strict 250 daily reservation cap to guarantee panoramic comfort and dedicated concierge service." },
  ];

  const sampleMenu = [
    { cat: "Signature Starters", items: ["Smoked Burrata & Heirloom Bruschetta", "Crispy Paddock Firecracker Wings", "Truffle Parmesan Hand-Cut Wedges"] },
    { cat: "Gourmet Mains", items: ["Wood-Fired Quattro Formaggi Pizza", "Slow-Braised Herb Glazed Medallions", "Pan-Seared Citrus Atlantic Salmon"] },
    { cat: "Zero-Proof Mocktails", items: ["Apex Nitro Passionfruit Fizz", "Chikkaballapura Spiced Botanical Sour", "Midnight Berry Smoke Infusion"] },
    { cat: "Artisanal Desserts", items: ["Molten Belgian Dark Chocolate Dome", "Saffron Pistachio Tres Leches", "Madagascar Vanilla Bean Gelato"] },
  ];

  return (
    <section id="restaurant" className="py-24 sm:py-32 bg-carbon-900 border-b border-white/10 relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-glow-red">
                <Compass className="w-3.5 h-3.5" />
                Panoramic Gastronomy & Club
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                100% Non-Alcoholic • Family Safe
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              DINE ABOVE <span className="text-brand-red">THE ACTION.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-2xl leading-relaxed">
              Karnataka’s premier suspended 360° restaurant and club. Savor world-class cuisine with a panoramic bird’s-eye view of high-speed racing below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setMenuModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-carbon-850 hover:bg-carbon-800 border border-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Utensils className="w-4 h-4 text-brand-red" />
              <span>VIEW MENU</span>
            </button>

            <button
              onClick={() => openBookingModal("360° Signature Panoramic Dining (Non-Alcoholic)")}
              className="px-6 py-3.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>RESERVE TABLE</span>
            </button>
          </div>
        </div>

        {/* Ambient Video & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Atmospheric Poster / Visual Deck */}
          <div className="lg:col-span-6 rounded-3xl bg-carbon-950 border border-white/15 overflow-hidden shadow-card-elevated relative group">
            <div className="h-96 relative overflow-hidden">
              <Image
                src={mediaConfig.posters.restaurant}
                alt="360 Sky Restaurant & Non-Alcoholic Club"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/40 to-transparent" />
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-mono bg-black/80 text-white border border-white/10 backdrop-blur-md flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-brand-red" />
                <span>500 Capacity • 250 Daily Reservation Cap</span>
              </div>
            </div>

            <div className="p-6 text-left space-y-2">
              <span className="text-[10px] font-mono text-brand-red uppercase tracking-wider font-bold">
                Golden Hour & Late Night Dining
              </span>
              <h4 className="text-lg font-display font-bold text-white uppercase">
                THE 360° HORIZON CLUB EXPERIENCE
              </h4>
              <p className="text-xs text-carbon-400 font-sans leading-relaxed">
                Overlooking the apex turns with curated soundtrack vibes, warm ambient lighting, and bespoke mocktail service — strictly zero alcohol for a safe community environment.
              </p>
            </div>
          </div>

          {/* Right: Highlights List */}
          <div className="lg:col-span-6 space-y-3.5 text-left">
            {diningHighlights.map((item, idx) => (
              <div
                key={idx}
                className="p-4.5 sm:p-5 rounded-2xl bg-carbon-950 border border-white/10 space-y-1 glass-panel-hover"
              >
                <div className="flex items-center gap-2.5 text-white font-heading font-bold text-sm">
                  <Check className="w-4 h-4 text-brand-red shrink-0" />
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-carbon-400 font-sans pl-6.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Menu Preview Modal (Zero Pricing) */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
          <div className="relative max-w-3xl w-full bg-carbon-950 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl text-left max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setMenuModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-carbon-900 border border-white/10 text-carbon-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-6 border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-brand-red uppercase font-bold">360° Signature Menu Preview</span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
                GASTRONOMY SELECTIONS
              </h3>
              <p className="text-xs text-carbon-400 font-sans">
                Curated by international chefs • Strictly non-alcoholic zero-proof bar
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {sampleMenu.map((sec, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-carbon-900 border border-white/10 space-y-3">
                  <h4 className="text-sm font-mono font-bold text-brand-red uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    {sec.cat}
                  </h4>
                  <ul className="space-y-2 text-xs text-carbon-300 font-sans">
                    {sec.items.map((it, iIdx) => (
                      <li key={iIdx} className="flex items-center justify-between border-b border-white/5 pb-1">
                        <span>{it}</span>
                        <span className="text-[10px] font-mono text-carbon-500 uppercase">A LA CARTE</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-carbon-400">Reserve early to guarantee window seating.</span>
              <button
                onClick={() => {
                  setMenuModalOpen(false);
                  openBookingModal("360° Signature Panoramic Dining (Non-Alcoholic)");
                }}
                className="px-6 py-2.5 rounded-xl bg-brand-red text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red"
              >
                RESERVE TABLE NOW
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}


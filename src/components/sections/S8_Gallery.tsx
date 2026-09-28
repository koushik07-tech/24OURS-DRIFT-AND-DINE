"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Maximize2, X, Sparkles } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { GalleryItem } from "@/types";
import Card3D from "@/components/ui/Card3D";
import MotionReveal from "@/components/ui/MotionReveal";

const categories = ["ALL", "GO-KARTING", "RESTAURANT", "RC RACING", "EVENTS", "AUTOMOTIVE"];

export default function S8_Gallery() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filtered = activeCategory === "ALL"
    ? mediaConfig.gallery
    : mediaConfig.gallery.filter((g) => g.category === activeCategory);

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#060608] border-b border-white/10 subtle-grid relative overflow-hidden">
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand-crimson/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <MotionReveal direction="left" className="space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/40 uppercase font-bold flex items-center gap-1.5 w-fit shadow-[0_0_15px_rgba(255,46,0,0.35)]">
              <ImageIcon className="w-3.5 h-3.5" />
              Visual Archive
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              EXPERIENCE <span className="text-brand-crimson font-orbitron text-glow-red">GALLERY.</span>
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
              Motorsport telemetry moments, panoramic horizon views, and grand celebration memories captured at 24OURS.
            </p>
          </MotionReveal>

          {/* Filter Pills */}
          <MotionReveal direction="right" className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-brand-crimson to-red-600 text-white border-brand-crimson shadow-[0_0_20px_rgba(255,46,0,0.5)] font-bold scale-105"
                    : "bg-carbon-900/80 text-carbon-400 border-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </MotionReveal>
        </div>

        {/* Gallery Grid with 3D Perspective Tilt Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1200">
          {filtered.map((item, idx) => (
            <MotionReveal key={item.id} delay={idx * 0.08} direction="up">
              <Card3D depth={18} className="bg-carbon-900 border border-white/10 aspect-video sm:aspect-square lg:aspect-video group cursor-pointer">
                <div
                  onClick={() => setSelectedItem(item)}
                  className="relative w-full h-full"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  <div className="absolute top-4 right-4 p-2.5 rounded-full bg-carbon-950/80 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Maximize2 className="w-4 h-4 text-brand-crimson" />
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 text-left space-y-1">
                    <span className="text-[10px] font-mono text-brand-crimson uppercase tracking-wider font-bold">
                      {item.category}
                    </span>
                    <h4 className="text-base font-display font-bold text-white uppercase">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </Card3D>
            </MotionReveal>
          ))}
        </div>

      </div>

      {/* Lightbox Modal with Obsidian Glass Styling */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#0a0a0e]/95 border border-white/20 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-carbon-900 border border-white/10 text-carbon-400 hover:text-white hover:border-brand-crimson transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedItem.src}
              alt={selectedItem.alt}
              className="w-full max-h-[72vh] object-contain rounded-2xl"
            />

            <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-4 text-left">
              <div>
                <span className="text-xs font-mono text-brand-crimson uppercase font-bold tracking-widest">{selectedItem.category}</span>
                <h3 className="text-lg font-display font-bold text-white uppercase mt-0.5">{selectedItem.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

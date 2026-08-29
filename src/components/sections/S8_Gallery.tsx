"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Maximize2, X } from "lucide-react";
import { mediaConfig } from "@/config/media";
import { GalleryItem } from "@/types";

const categories = ["ALL", "GO-KARTING", "RESTAURANT", "RC RACING", "EVENTS", "AUTOMOTIVE"];

export default function S8_Gallery() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const filtered = activeCategory === "ALL"
    ? mediaConfig.gallery
    : mediaConfig.gallery.filter((g) => g.category === activeCategory);

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-carbon-950 border-b border-white/10 subtle-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
          <div className="space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 w-fit">
              <ImageIcon className="w-3.5 h-3.5" />
              Visual Archive
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase text-white tracking-tight">
              EXPERIENCE GALLERY.
            </h2>
            <p className="text-sm sm:text-base text-carbon-300 font-sans max-w-xl leading-relaxed">
              Motorsport telemetry moments, panoramic horizon views, and grand celebration memories captured at 24OURS.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                  activeCategory === cat
                    ? "bg-brand-red text-white border-brand-red shadow-glow-red font-bold"
                    : "bg-carbon-900 text-carbon-400 border-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="relative rounded-3xl bg-carbon-900 border border-white/10 overflow-hidden group cursor-pointer aspect-video sm:aspect-square lg:aspect-video"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-750"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-4 right-4 p-2.5 rounded-full bg-carbon-950/80 border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-brand-red" />
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-left space-y-1">
                <span className="text-[10px] font-mono text-brand-red uppercase tracking-wider font-bold">
                  {item.category}
                </span>
                <h4 className="text-base font-display font-bold text-white uppercase">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-carbon-950 border border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-carbon-900 border border-white/10 text-carbon-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedItem.src}
              alt={selectedItem.alt}
              className="w-full max-h-[70vh] object-contain rounded-2xl"
            />

            <div className="pt-4 flex items-center justify-between border-t border-white/10 mt-4 text-left">
              <div>
                <span className="text-xs font-mono text-brand-red uppercase">{selectedItem.category}</span>
                <h3 className="text-lg font-display font-bold text-white uppercase">{selectedItem.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

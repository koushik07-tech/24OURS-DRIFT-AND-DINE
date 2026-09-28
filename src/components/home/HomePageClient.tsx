"use client";

import React from "react";
import S1_Hero from "@/components/sections/S1_Hero";
import S2_Intro from "@/components/sections/S2_Intro";
import S3_Karting from "@/components/sections/S3_Karting";
import S4_RCRacing from "@/components/sections/S4_RCRacing";
import S10_Leaderboard from "@/components/sections/S10_Leaderboard";
import FacilityMapSection from "@/components/sections/FacilityMapSection";
import S5_Restaurant from "@/components/sections/S5_Restaurant";
import S6_Events from "@/components/sections/S6_Events";
import S7_Automotive from "@/components/sections/S7_Automotive";
import S8_Gallery from "@/components/sections/S8_Gallery";
import S9_About from "@/components/sections/S9_About";
import S11_FinalCTA from "@/components/sections/S11_FinalCTA";

export default function HomePageClient() {
  return (
    <main className="relative w-full overflow-x-hidden">
      {/* S1: Fullscreen Hero */}
      <S1_Hero />

      {/* S2: Introduction & Destination Stats */}
      <S2_Intro />

      {/* S3: Go-Karting Circuit with 3D Kart Canvas */}
      <S3_Karting />

      {/* S4: RC Racing Arena & Live Board */}
      <S4_RCRacing />

      {/* S10: Circuit Leaderboard & Hall of Fame Telemetry */}
      <S10_Leaderboard />

      {/* 3D Facility Map & Destination Masterplan */}
      <FacilityMapSection />

      {/* S5: 360° Panoramic Sky Restaurant with 3D Deck */}
      <S5_Restaurant />

      {/* S6: Event & Banquet Halls */}
      <S6_Events />

      {/* S7: Automotive Showcase HUD */}
      <S7_Automotive />

      {/* S8: Curated Experience Gallery */}
      <S8_Gallery />

      {/* S9: About & Directors Attribution (S10 Distinction Pillars inside S9_About) */}
      <S9_About />

      {/* S11: Final Night Destination CTA */}
      <S11_FinalCTA />
    </main>
  );
}

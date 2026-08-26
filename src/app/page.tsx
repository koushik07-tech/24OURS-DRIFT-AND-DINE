import React from "react";
import S1_Hero from "@/components/sections/S1_Hero";
import S2_Intro from "@/components/sections/S2_Intro";
import S3_Karting from "@/components/sections/S3_Karting";
import S4_RCRacing from "@/components/sections/S4_RCRacing";
import S5_KidzZone from "@/components/sections/S5_KidzZone";
import S5_Restaurant from "@/components/sections/S5_Restaurant";
import S6_Events from "@/components/sections/S6_Events";
import S7_Automotive from "@/components/sections/S7_Automotive";
import S9_LiveStreaming from "@/components/sections/S9_LiveStreaming";
import S8_Gallery from "@/components/sections/S8_Gallery";
import S10_Leaderboard from "@/components/sections/S10_Leaderboard";
import S11_ClubMembership from "@/components/sections/S11_ClubMembership";
import S12_WeeklyContests from "@/components/sections/S12_WeeklyContests";
import S13_ReferralProgram from "@/components/sections/S13_ReferralProgram";
import S14_Packages from "@/components/sections/S14_Packages";
import S15_CorporateCCC from "@/components/sections/S15_CorporateCCC";
import S16_SafetyFacilityStrip from "@/components/sections/S16_SafetyFacilityStrip";
import S9_About from "@/components/sections/S9_About";
import S11_FinalCTA from "@/components/sections/S11_FinalCTA";

export default function HomePage() {
  return (
    <div className="space-y-0 select-none">
      {/* 1. HERO — Full-screen background video & 3D styling */}
      <S1_Hero />

      {/* 2. INTRODUCTION — "ONE DESTINATION. ENDLESS EXPERIENCES." */}
      <S2_Intro />

      {/* 3. GO-KARTING — "HIGH SPEED. PURE ADRENALINE." with 3D Kart Canvas */}
      <S3_Karting />

      {/* 4. RC RACING & VIRTUAL ARENA — "SMALL CARS. SERIOUS RACING." (Tracks, Virtual, FPV, Boat, Tank, Plane) */}
      <S4_RCRacing />

      {/* 5. KIDZ ZONE — Dedicated Junior Cadet Karting & Anti-Collision Arena */}
      <S5_KidzZone />

      {/* 6. 360° SIGNATURE RESTAURANT & CLUB — Strictly Non-Alcoholic Sky Dining & Lounge */}
      <S5_Restaurant />

      {/* 7. EVENT HALLS — "MAKE IT AN EVENT." Turnkey Summits, Celebrations & Fests */}
      <S6_Events />

      {/* 8. AUTOMOTIVE SHOWCASE — "BUILT FOR THE OBSESSED." Fleet Specs & Flux Motors India Partner */}
      <S7_Automotive />

      {/* 9. LIVE STREAMING & STADIUM SCREENING — Instagram Live & Paddock Broadcast */}
      <S9_LiveStreaming />

      {/* 10. EXPERIENCE GALLERY — 7 Curated Filterable Visual Categories & Lightbox */}
      <S8_Gallery />

      {/* 11. LEADERBOARD / LAP RECORDS — Top 3 Podium & Top 30 Weekly Reset Standings */}
      <S10_Leaderboard />

      {/* 12. 24OURS CLUB / MEMBERSHIP — Dual Criteria (3 Visits + 30 Laps) Non-Alcoholic Club */}
      <S11_ClubMembership />

      {/* 13. WEEKLY EVENTS & CONTESTS — Top 30 Free Karting, Best Reel Contest, First 1,000 Rewards */}
      <S12_WeeklyContests />

      {/* 14. REFERRAL PROGRAM — "Bring 10, Get In Free" Streak Tracker & Code Share */}
      <S13_ReferralProgram />

      {/* 15. PACKAGES (Descriptive Only, Zero Public Pricing) */}
      <S14_Packages />

      {/* 16. CORPORATE COMPANY COLLABORATION (CCC) — Enterprise Retreats & Track Hire */}
      <S15_CorporateCCC />

      {/* 17. SAFETY & FACILITY INFO STRIP — 24hr Schedule, 4-7 AM Maintenance, CCTV, Lockers, Parking */}
      <S16_SafetyFacilityStrip />

      {/* 18. ABOUT 24OURS & WHY 24OURS — Directors Nagarjun Lakshman & Uday Chandhan + 6 Pillars */}
      <S9_About />

      {/* 19. FINAL CTA — "YOUR NEXT EXPERIENCE STARTS HERE." Destination Night Video */}
      <S11_FinalCTA />
    </div>
  );
}


import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Clock, Award, Users, AlertTriangle, Sparkles, Gift, Eye, Utensils, CheckCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function TermsPage() {
  return (
    <div className="pt-36 pb-24 min-h-screen bg-brand-black text-white selection:bg-brand-red selection:text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        
        {/* Header */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold">
            <Shield className="w-3.5 h-3.5" />
            Official Regulatory Document
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tight">
            TERMS & CONDITIONS
          </h1>
          <p className="text-xs sm:text-sm font-mono text-carbon-400 uppercase">
            {siteConfig.legalName} • Directors: {siteConfig.directors.map((d) => d.name).join(" & ")}
          </p>
        </div>

        {/* 12 Detailed Sections */}
        <div className="space-y-8 text-carbon-300 font-sans text-sm leading-relaxed">
          
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <Clock className="w-5 h-5 text-brand-red" />
              <h2>1. Operating Hours & Maintenance Window</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li>The facility operates 24 hours a day, 7 days a week.</li>
              <li>Daily mandatory maintenance window: <strong className="text-white">4:00 AM – 7:00 AM</strong>.</li>
              <li>No bookings, check-ins, or track activities are permitted during maintenance hours to ensure maximum circuit safety, sensor calibration, and battery charging.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <CheckCircle className="w-5 h-5 text-brand-red" />
              <h2>2. Booking, Check-In & Entry</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li>Pre-booking through our official portal is recommended; walk-ins are admitted strictly subject to slot availability.</li>
              <li>Digital check-in and check-out are monitored and logged for every visitor.</li>
              <li>A valid government-issued photo ID is mandatory at pit check-in.</li>
              <li>Free secure lockers are provided for every customer during their session.</li>
              <li>Customers must bring their own certified full-face helmet or rent sanitized helmets on-site.</li>
              <li>Free parking is provided for all visitors with EV charging facilities.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <Users className="w-5 h-5 text-brand-red" />
              <h2>3. Age & Pairing Rules</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li>Minimum age for solo electric go-karting: <strong className="text-white">14 years</strong>.</li>
              <li>Customers below 15 years of age must be accompanied by a parent/guardian (parent-assisted cadet karting available).</li>
              <li><strong className="text-white">"Couple/Pair Karting"</strong> is open to any two individuals regardless of relationship or gender (parent-child, spouses, friends, siblings, colleagues, etc.).</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <Sparkles className="w-5 h-5 text-brand-red" />
              <h2>4. Student Discount Policy</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li><strong className="text-white">50% discount for students</strong>, valid strictly during the afternoon window: <strong className="text-white">2:30 PM – 7:30 PM</strong>.</li>
              <li>Original physical/verified digital student ID is mandatory at check-in.</li>
              <li>Slot availability is subject to track capacity and management discretion.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-brand-red/30 space-y-3 shadow-glow-red">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <Award className="w-5 h-5 text-brand-red" />
              <h2>5. Membership / 24Ours Club Policy (Dual Criteria)</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li>24Ours operates a strictly <strong className="text-white">non-alcoholic restaurant and club experience</strong> — alcohol-free by design, established as a family- and community-safe space.</li>
              <li>Club membership is <strong className="text-white">earned, not purchased</strong>. Entry requires fulfilling the compulsory dual criteria:</li>
              <li className="pl-4 text-white">✓ Minimum <strong className="text-brand-red">3 separate verified visits</strong> to the facility, <strong className="text-brand-red">AND</strong></li>
              <li className="pl-4 text-white">✓ A cumulative minimum of <strong className="text-brand-red">30 laps</strong> completed (Go-Karting and/or RC Racing) across those visits.</li>
              <li>Both criteria are compulsory together — meeting only one does not qualify a customer.</li>
              <li>Laps and visits are tracked automatically against the customer’s verified profile/ID.</li>
              <li>Upon unlocking eligibility, customers receive an official Club Card granting priority booking, exclusive event invitations, and VIP lounge perks. Membership is non-transferable.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <Gift className="w-5 h-5 text-brand-red" />
              <h2>6. Coupons & Daily Offers</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li>Daily coupons are strictly numbered and limited (1–250) based on daily footfall capacity.</li>
              <li>Unclaimed daily coupons roll over to the subsequent day’s offer pool.</li>
              <li>Coupons cannot be combined with other promotional tiers unless explicitly specified.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <Users className="w-5 h-5 text-brand-red" />
              <h2>7. Referral Program</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li><strong className="text-white">Bring 10, Get In Free:</strong> Customers referring 10+ new verified visitors within a 15-day rolling window receive complimentary access pass privileges.</li>
              <li>Referral validity is subject to check-in verification of referred guests.</li>
            </ul>
          </div>

          {/* Section 8 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <Award className="w-5 h-5 text-brand-red" />
              <h2>8. Contests, Leaderboards & Prizes</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li>RFID transponder lap times are recorded for all heats for public leaderboard rankings.</li>
              <li><strong className="text-white">Top 30 Performers:</strong> Weekly leaderboard resets reward the Top 30 racers with free karting sessions and podium trophy goodies for the Top 3.</li>
              <li><strong className="text-white">Best Reel of the Week:</strong> Winning social media creator receives up to 4 hours complimentary access (excludes food and beverages).</li>
              <li><strong className="text-white">Launch Inauguration:</strong> First 1,000 customers receive a complimentary 24Ours collector T-shirt & cap (while stocks last).</li>
            </ul>
          </div>

          {/* Section 9 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <AlertTriangle className="w-5 h-5 text-brand-red" />
              <h2>9. Safety, Conduct & Surveillance</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li>The facility is under continuous 24-hour CCTV surveillance for safety, telemetry, and dispute resolution.</li>
              <li>Any aggressive, fighting, reckless, or abusive conduct results in immediate ejection and forfeiture of passes without compensation.</li>
              <li>Drivers must complete the mandatory safety briefing before mounting karts.</li>
              <li>Management reserves the unconditional right to refuse entry or service for safety violations.</li>
            </ul>
          </div>

          {/* Section 10 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <Utensils className="w-5 h-5 text-brand-red" />
              <h2>10. Dining Policy</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li>24Ours 360° Signature Restaurant & Club is strictly <strong className="text-white">non-alcoholic</strong> across all dining decks and private dining rooms.</li>
              <li>Total dining capacity: 500 seats. Daily table reservations are capped at 250 bookings to maintain panoramic comfort.</li>
              <li>Promotional activity hours or racing passes explicitly exclude food and beverage charges unless part of an inclusive corporate banquet package.</li>
            </ul>
          </div>

          {/* Section 11 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <Eye className="w-5 h-5 text-brand-red" />
              <h2>11. Liability & Disclaimers</h2>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-carbon-300">
              <li>Customers participate in high-speed motorsport and arena activities at their own discretion and risk after executing the safety waiver.</li>
              <li>24Ours is not liable for loss or damage to personal items left outside designated complimentary lockers.</li>
              <li>Management reserves the right to amend operating parameters, slot schedules, and promotional terms without prior individual notice.</li>
            </ul>
          </div>

          {/* Section 12 */}
          <div className="p-6 sm:p-8 rounded-2xl bg-carbon-950 border border-white/10 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-heading font-bold text-lg uppercase">
              <Shield className="w-5 h-5 text-brand-red" />
              <h2>12. General & Jurisdiction</h2>
            </div>
            <p className="text-carbon-300">
              These terms are governed by the applicable laws of Karnataka, India. By booking an experience, registering an account, or entering the destination premises, you acknowledge and agree to comply with all stated regulations.
            </p>
            <div className="pt-2 text-xs font-mono text-carbon-400">
              Contact: {siteConfig.contact.email} • {siteConfig.contact.phone} • {siteConfig.location.displayAddress}
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="pt-6 border-t border-white/10">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-brand-red hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Destination Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}


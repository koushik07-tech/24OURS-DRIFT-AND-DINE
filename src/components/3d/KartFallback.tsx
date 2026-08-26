import React from "react";
import { Zap, ShieldCheck, Flag } from "lucide-react";

export default function KartFallback() {
  return (
    <div className="relative w-full h-[400px] lg:h-[480px] rounded-3xl bg-gradient-to-b from-carbon-900 via-carbon-950 to-carbon-900 border border-white/15 p-8 flex flex-col justify-between overflow-hidden shadow-card-elevated group">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/15 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-red/25 transition-all duration-700" />

      {/* Top Telemetry */}
      <div className="flex items-center justify-between z-10">
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          APEX GT-X 3D MODEL
        </span>
        <span className="text-[11px] font-mono text-carbon-400">● 15kW DUAL AC</span>
      </div>

      {/* Center Visual Mockup */}
      <div className="my-auto text-center space-y-3 z-10">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-carbon-850 border border-white/10 flex items-center justify-center text-brand-red shadow-glow-red">
          <Flag className="w-12 h-12 animate-pulse" />
        </div>
        <h4 className="text-xl font-display font-bold text-white uppercase tracking-wider">
          APEX GT-X ELECTRIC KART
        </h4>
        <p className="text-xs text-carbon-300 font-sans max-w-sm mx-auto">
          Championship-grade chromoly chassis with active regenerative braking and live telemetry synchronization.
        </p>
      </div>

      {/* Bottom Specs HUD */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10 text-center font-mono z-10">
        <div>
          <span className="text-[10px] text-carbon-500 block uppercase">0-60 KM/H</span>
          <span className="text-xs font-bold text-white">2.9s</span>
        </div>
        <div>
          <span className="text-[10px] text-carbon-500 block uppercase">TOP SPEED</span>
          <span className="text-xs font-bold text-brand-red">85 KM/H</span>
        </div>
        <div>
          <span className="text-[10px] text-carbon-500 block uppercase">TELEMETRY</span>
          <span className="text-xs font-bold text-emerald-400">LIVE RFID</span>
        </div>
      </div>
    </div>
  );
}

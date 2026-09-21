"use client";

import React from "react";
import { soundEngine } from "@/lib/soundEngine";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "red" | "amber" | "cyan" | "purple" | "emerald";
  interactive?: boolean;
}

export default function GlassCard({
  children,
  className = "",
  glowColor = "red",
  interactive = true,
}: GlassCardProps) {
  const glowBorderClasses = {
    red: "hover:border-brand-red/50 hover:shadow-[0_0_25px_rgba(225,6,0,0.25)]",
    amber: "hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(255,184,0,0.25)]",
    cyan: "hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,229,255,0.25)]",
    purple: "hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]",
    emerald: "hover:border-emerald-400/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)]",
  };

  return (
    <div
      onMouseEnter={interactive ? () => soundEngine.playHover() : undefined}
      className={`relative rounded-3xl bg-carbon-900/80 backdrop-blur-xl border border-white/10 transition-all duration-300 ${
        interactive ? `${glowBorderClasses[glowColor]} hover:-translate-y-1` : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

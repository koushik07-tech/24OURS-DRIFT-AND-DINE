"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "glass" | "outline" | "amber";
  strength?: number;
  soundType?: "click" | "boost" | "none";
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  onClick,
  className = "",
  variant = "primary",
  strength = 0.25,
  soundType = "click",
  href,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 180 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!buttonRef.current || disabled) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseEnter = () => {
    if (disabled) return;
    setIsHovered(true);
    soundEngine.playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    if (soundType === "click") {
      soundEngine.playClick(650);
    } else if (soundType === "boost") {
      soundEngine.playBoostSound();
    }
    if (onClick) {
      onClick();
    }
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-brand-crimson via-brand-red to-red-600 text-white shadow-[0_0_25px_rgba(255,46,0,0.45)] hover:shadow-[0_0_40px_rgba(255,46,0,0.7)] border border-red-400/40",
    glass:
      "bg-carbon-900/80 hover:bg-carbon-850/90 text-white backdrop-blur-xl border border-white/15 hover:border-brand-crimson/50 hover:shadow-[0_0_30px_rgba(255,46,0,0.25)]",
    outline:
      "bg-transparent text-white border border-brand-crimson/50 hover:bg-brand-crimson/15 hover:border-brand-crimson hover:shadow-[0_0_30px_rgba(255,46,0,0.35)]",
    amber:
      "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-black shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] border border-amber-300/40",
  };

  const content = (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ x: smoothX, y: smoothY }}
      whileHover={{ scale: disabled ? 1 : 1.04 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      transition={{ duration: 0.2 }}
      className={`relative inline-flex items-center justify-center gap-2.5 rounded-2xl font-mono text-xs uppercase tracking-wider font-bold transition-colors select-none ${
        variantStyles[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {/* Animated Glowing Ring Border */}
      <span className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 ring-2 ring-brand-crimson/40" />

      {/* Radiant Glow Orb behind button */}
      <span
        className={`absolute -inset-1 rounded-2xl blur-md transition-opacity duration-300 pointer-events-none ${
          isHovered && !disabled ? "opacity-60" : "opacity-0"
        } ${variant === "amber" ? "bg-amber-400/40" : "bg-brand-crimson/40"}`}
      />

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} onClick={handleClick} className="inline-block group">
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className="inline-block group focus:outline-none"
    >
      {content}
    </button>
  );
}

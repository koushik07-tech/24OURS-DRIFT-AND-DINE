"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  glare?: boolean;
  glowOnHover?: boolean;
  onClick?: () => void;
}

export default function Card3D({
  children,
  className = "",
  depth = 20,
  glare = true,
  glowOnHover = true,
  onClick,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse coordinate values normalized between -0.5 and 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for rotation
  const springConfig = { damping: 25, stiffness: 260 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [depth * 0.8, -depth * 0.8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-depth * 0.8, depth * 0.8]), springConfig);

  // Glare position
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="w-full relative select-none"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`relative rounded-3xl overflow-hidden transition-shadow duration-500 ${
          glowOnHover && isHovered
            ? "shadow-[0_20px_50px_-10px_rgba(255,46,0,0.35),0_0_20px_0_rgba(255,46,0,0.2)] border-brand-crimson/50"
            : "shadow-2xl border-white/10"
        } ${className}`}
      >
        {/* Luminous Inner Border */}
        <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none z-30 transition-colors duration-300 group-hover:border-brand-crimson/40" />

        {/* Content Container (with preserve-3d) */}
        <div className="relative z-10 w-full h-full" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>

        {/* Dynamic Light Glare Highlight */}
        {glare && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 opacity-0 transition-opacity duration-300 rounded-3xl"
            style={{
              opacity: isHovered ? 0.15 : 0,
              background: `radial-gradient(circle 320px at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.8), transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}

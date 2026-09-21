"use client";

import React, { useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { soundEngine } from "@/lib/soundEngine";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  onClick,
  onMouseEnter,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || !buttonRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * strength;
    const y = (clientY - (top + height / 2)) * strength;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={(e) => {
        soundEngine.playHover();
        if (onMouseEnter) onMouseEnter(e);
      }}
      onClick={(e) => {
        soundEngine.playClick(650);
        if (onClick) onClick(e);
      }}
      style={{
        transform: prefersReducedMotion ? undefined : `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: "transform 0.15s ease-out",
      }}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

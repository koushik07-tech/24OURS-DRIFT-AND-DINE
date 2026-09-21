"use client";

import React, { useRef, useEffect } from "react";

interface SmokeCanvasProps {
  stage: number; // 0: idle, 1: distant rumble, 2: high speed pass, 3: smoke burst, 4: logo emerge, 5: complete
  intensity?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
  type: "smoke" | "streak" | "ember";
  length?: number;
}

export default function SmokeCanvas({ stage, intensity = 1.0 }: SmokeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles: Particle[] = [];
    const maxParticles = 200;

    const createParticle = (typeOverride?: "smoke" | "streak" | "ember"): Particle => {
      const isStreak = typeOverride === "streak" || (stage === 2 && Math.random() < 0.35);
      const isEmber = typeOverride === "ember" || Math.random() < 0.2;

      if (isStreak) {
        return {
          x: Math.random() < 0.5 ? -100 : width + 100,
          y: height * 0.4 + (Math.random() - 0.5) * (height * 0.45),
          vx: (Math.random() * 25 + 35) * (Math.random() < 0.5 ? 1 : -1),
          vy: (Math.random() - 0.5) * 4,
          size: Math.random() * 2.5 + 1.5,
          alpha: 0.9,
          maxAlpha: 0.95,
          decay: 0.03,
          color: Math.random() > 0.3 ? "#E10600" : "#FFFFFF",
          type: "streak",
          length: Math.random() * 180 + 120,
        };
      }

      if (isEmber) {
        return {
          x: Math.random() * width,
          y: height + 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 2.5 + 1.5),
          size: Math.random() * 3 + 1,
          alpha: 0.8,
          maxAlpha: 0.85,
          decay: 0.008,
          color: Math.random() > 0.4 ? "#FF3B30" : "#FF9500",
          type: "ember",
        };
      }

      // Volumetric smoke
      const spawnX = stage >= 3 ? Math.random() * width : width * 0.5 + (Math.random() - 0.5) * (width * 0.6);
      const spawnY = stage >= 3 ? Math.random() * height : height * 0.6 + (Math.random() - 0.5) * 150;

      return {
        x: spawnX,
        y: spawnY,
        vx: (Math.random() - 0.5) * (stage >= 2 ? 6.5 : 2.0),
        vy: -(Math.random() * 2.0 + 0.8),
        size: Math.random() * (stage >= 3 ? 120 : 60) + (stage >= 3 ? 80 : 40),
        alpha: 0.05,
        maxAlpha: stage >= 3 ? 0.38 : 0.22,
        decay: stage >= 4 ? 0.003 : 0.005,
        color: Math.random() > 0.7 ? "rgba(225, 6, 0, 0.15)" : "rgba(30, 30, 35, 0.25)",
        type: "smoke",
      };
    };

    // Pre-populate if stage is active
    if (stage >= 1) {
      for (let i = 0; i < 30; i++) {
        particles.push(createParticle());
      }
    }

    const render = () => {
      // Clear with slight trail for motion blur
      ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
      ctx.fillRect(0, 0, width, height);

      // Spawn rate based on stage
      let spawnCount = 0;
      if (stage === 1) spawnCount = 1;
      else if (stage === 2) spawnCount = 5;
      else if (stage === 3) spawnCount = 7;
      else if (stage === 4) spawnCount = 2;
      else if (stage === 5) spawnCount = 1;

      for (let s = 0; s < spawnCount * intensity; s++) {
        if (particles.length < maxParticles) {
          particles.push(createParticle());
        }
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.type === "smoke") {
          p.size += 0.8;
          if (p.alpha < p.maxAlpha) {
            p.alpha += 0.01;
          } else {
            p.alpha -= p.decay;
          }

          if (p.alpha <= 0 || p.size > 350) {
            particles.splice(i, 1);
            continue;
          }

          // Soft volumetric radial smoke puff
          const grad = ctx.createRadialGradient(p.x, p.y, p.size * 0.1, p.x, p.y, p.size);
          grad.addColorStop(0, p.color.replace(/[\d\.]+\)$/, `${p.alpha})`));
          grad.addColorStop(0.5, p.color.replace(/[\d\.]+\)$/, `${p.alpha * 0.5})`));
          grad.addColorStop(1, "rgba(0, 0, 0, 0)");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "streak") {
          p.alpha -= p.decay;
          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.lineWidth = p.size;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 15;

          const len = p.length || 100;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 3.5, p.y - p.vy * 3.5);
          ctx.stroke();
          ctx.restore();
        } else if (p.type === "ember") {
          p.alpha -= p.decay;
          if (p.alpha <= 0 || p.y < -20) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.shadowColor = "#FF3B30";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [stage, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

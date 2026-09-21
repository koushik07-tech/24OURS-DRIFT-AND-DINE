"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { Sparkles, UtensilsCrossed, Clock, Compass } from "lucide-react";

function SkyDeckArchitecture() {
  const deckRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (deckRef.current) {
      deckRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={deckRef} position={[0, 0, 0]}>
      {/* Central Suspended Turntable Floor */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[3.2, 3.4, 0.2, 32]} />
        <meshStandardMaterial color="#141418" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Amber Glowing Edge Light */}
      <mesh position={[0, 0.02, 0]}>
        <ringGeometry args={[3.1, 3.25, 32]} />
        <meshBasicMaterial color="#FFB800" side={THREE.DoubleSide} />
      </mesh>

      {/* Elevated Lounge Tables & Chairs (Procedural Ring) */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * Math.PI * 2) / 6;
        const radius = 2.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} position={[x, 0.1, z]}>
            {/* Table Top */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.35, 0.35, 0.05, 16]} />
              <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Table Leg */}
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.35, 8]} />
              <meshStandardMaterial color="#333333" metalness={0.95} />
            </mesh>
            {/* Tabletop Amber Ambient Candle Glow */}
            <pointLight position={[0, 0.45, 0]} color="#FFA500" intensity={1.5} distance={1.2} />
          </group>
        );
      })}

      {/* Atmospheric Central Chandelier */}
      <group position={[0, 2.2, 0]}>
        <mesh>
          <torusGeometry args={[1.2, 0.04, 16, 32]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
        <pointLight position={[0, 0, 0]} color="#FFB800" intensity={6} distance={6} />
      </group>
    </group>
  );
}

export default function DiningScene() {
  const { hasWebGL, maxDPR, isMobile } = useDeviceCapability();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !hasWebGL) {
    return (
      <div className="w-full h-full min-h-[360px] rounded-3xl bg-carbon-900 border border-white/10 flex items-center justify-center p-6 text-center">
        <div className="space-y-2">
          <UtensilsCrossed className="w-8 h-8 text-amber-400 mx-auto" />
          <h4 className="text-white font-display font-bold uppercase">360° Panoramic Sky Dining</h4>
          <p className="text-xs text-carbon-400">Suspended horizon gastronomy overlooking the destination</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[380px] lg:h-[460px] rounded-3xl bg-gradient-to-b from-[#09090E] via-[#0E0E14] to-[#09090E] border border-white/15 overflow-hidden shadow-2xl group select-none">
      
      {/* Top Ambient Badges */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase font-bold flex items-center gap-1.5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          360° SKY HORIZON VANTAGE
        </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between text-[11px] font-mono text-carbon-400 border-t border-white/10 pt-2 backdrop-blur-sm">
        <span className="text-amber-300 flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" /> DINING HOURS: 11:00 AM – 11:30 PM
        </span>
        <span className="hidden sm:inline">🖱️ Drag to Explore Horizon</span>
      </div>

      <Canvas dpr={[1, maxDPR]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 2.6, 5.2]} fov={48} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={2.0} color="#FFF2D6" />
        <directionalLight position={[-5, 4, -5]} intensity={1.2} color="#FFAA55" />

        <Suspense fallback={null}>
          <Stars radius={60} depth={30} count={isMobile ? 800 : 2500} factor={3} saturation={0.5} fade speed={0.8} />
          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
            <SkyDeckArchitecture />
          </Float>
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3.5}
          maxDistance={8.5}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

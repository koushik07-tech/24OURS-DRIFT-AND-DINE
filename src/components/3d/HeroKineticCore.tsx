"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

interface KineticCoreProps {
  mousePos: { x: number; y: number };
}

function KineticRacingWheel({ mousePos }: KineticCoreProps) {
  const outerRingRef = useRef<THREE.Group>(null);
  const midRingRef = useRef<THREE.Group>(null);
  const innerRotorRef = useRef<THREE.Group>(null);
  const centralOrbRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Procedural particles setup
  const particleCount = 75;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      pos[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Mouse responsiveness
    const targetRotX = mousePos.y * 0.45;
    const targetRotY = mousePos.x * 0.45;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.x = THREE.MathUtils.lerp(outerRingRef.current.rotation.x, targetRotX + t * 0.25, 0.05);
      outerRingRef.current.rotation.y = THREE.MathUtils.lerp(outerRingRef.current.rotation.y, targetRotY + t * 0.35, 0.05);
      outerRingRef.current.rotation.z += delta * 0.15;
    }

    if (midRingRef.current) {
      midRingRef.current.rotation.x = THREE.MathUtils.lerp(midRingRef.current.rotation.x, -targetRotX - t * 0.4, 0.05);
      midRingRef.current.rotation.y = THREE.MathUtils.lerp(midRingRef.current.rotation.y, -targetRotY + t * 0.5, 0.05);
    }

    if (innerRotorRef.current) {
      innerRotorRef.current.rotation.z += delta * 1.8;
    }

    if (centralOrbRef.current) {
      const pulse = 1 + Math.sin(t * 3.5) * 0.08;
      centralOrbRef.current.scale.set(pulse, pulse, pulse);
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.12;
      particlesRef.current.rotation.x += delta * 0.06;
    }
  });

  return (
    <group scale={1.15}>
      {/* 1. Outer Anodized Carbon Aero Ring */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[2.0, 0.07, 24, 64]} />
          <meshStandardMaterial
            color="#FF2E00"
            emissive="#FF2E00"
            emissiveIntensity={0.65}
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* 4 Peripheral Telemetry Nodes */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.cos(angle) * 2.0, Math.sin(angle) * 2.0, 0]}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.8} />
          </mesh>
        ))}
      </group>

      {/* 2. Middle Gimbal Gyro Ring */}
      <group ref={midRingRef}>
        <mesh>
          <torusGeometry args={[1.5, 0.055, 20, 48]} />
          <meshStandardMaterial
            color="#14141E"
            roughness={0.3}
            metalness={0.95}
          />
        </mesh>
        {/* Neon Crimson Segments on Mid Ring */}
        <mesh>
          <torusGeometry args={[1.51, 0.02, 16, 32, Math.PI * 0.75]} />
          <meshBasicMaterial color="#FF2E00" />
        </mesh>
      </group>

      {/* 3. High-Speed Turbine Rotor with 8 Aerodynamic Blades */}
      <group ref={innerRotorRef}>
        <mesh>
          <torusGeometry args={[0.95, 0.04, 16, 32]} />
          <meshStandardMaterial color="#E10600" emissive="#FF2E00" emissiveIntensity={0.5} />
        </mesh>

        {Array.from({ length: 8 }).map((_, idx) => {
          const rotZ = (idx * Math.PI * 2) / 8;
          return (
            <group key={idx} rotation={[0, 0, rotZ]}>
              <mesh position={[0.48, 0, 0]} rotation={[0.4, 0, 0]}>
                <boxGeometry args={[0.8, 0.06, 0.02]} />
                <meshStandardMaterial
                  color="#262635"
                  metalness={0.92}
                  roughness={0.25}
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 4. Central Glowing Tachometer Reactor Core */}
      <mesh ref={centralOrbRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#FF2E00"
          emissive="#FF2E00"
          emissiveIntensity={1.4}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* Core Halo Glow Disc */}
      <mesh>
        <ringGeometry args={[0.43, 0.65, 32]} />
        <meshBasicMaterial color="#FF5522" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 5. Telemetry Stardust Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#FF6B4A"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Dynamic Lights inside the Canvas */}
      <pointLight position={[0, 0, 0]} color="#FF2E00" intensity={9} distance={4} />
      <pointLight position={[2, 3, 2]} color="#FFFFFF" intensity={3} />
      <pointLight position={[-2, -2, -2]} color="#E10600" intensity={4} />
    </group>
  );
}

export default function HeroKineticCore() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] mx-auto flex items-center justify-center select-none pointer-events-auto">
      {/* Pulsating Crimson Radial Backlight */}
      <div className="absolute inset-0 bg-radial-gradient from-brand-crimson/35 via-brand-red/15 to-transparent rounded-full blur-[70px] pointer-events-none animate-glow-pulse" />
      <div className="absolute inset-8 bg-brand-crimson/20 rounded-full blur-[50px] pointer-events-none" />

      {/* Concentric Decorative HUD Rings */}
      <div className="absolute inset-2 rounded-full border border-white/5 pointer-events-none animate-[spin_60s_linear_infinite]" />
      <div className="absolute inset-10 rounded-full border border-dashed border-brand-crimson/25 pointer-events-none animate-[spin_40s_linear_infinite_reverse]" />
      <div className="absolute inset-20 rounded-full border border-white/5 pointer-events-none" />

      {hasWebGL ? (
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          camera={{ position: [0, 0, 4.8], fov: 45 }}
          className="relative z-10 w-full h-full"
        >
          <ambientLight intensity={0.9} />
          <Suspense fallback={null}>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.35}>
              <KineticRacingWheel mousePos={mousePos} />
            </Float>
          </Suspense>
        </Canvas>
      ) : (
        /* CSS 3D Fallback with High-Tech Rings */
        <div className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 rounded-full border-2 border-brand-crimson shadow-[0_0_50px_rgba(255,46,0,0.5)] flex items-center justify-center animate-spin-slow">
          <div className="w-32 h-32 rounded-full border border-white/20 border-t-brand-crimson animate-spin" />
          <div className="w-16 h-16 rounded-full bg-brand-crimson shadow-[0_0_30px_#FF2E00]" />
        </div>
      )}
    </div>
  );
}

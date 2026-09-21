"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { soundEngine } from "@/lib/soundEngine";
import KartFallback from "./KartFallback";
import { Zap, Eye, RotateCw, Sparkles } from "lucide-react";

interface KartProps {
  primaryColor: string;
  isBoostActive: boolean;
}

function ProceduralKart({ primaryColor, isBoostActive }: KartProps) {
  const kartRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (kartRef.current) {
      // Gentle idle yaw rotation if boost not full locked
      kartRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
    }
    if (flameRef.current && isBoostActive) {
      flameRef.current.scale.set(
        1 + Math.random() * 0.4,
        1 + Math.random() * 0.8,
        1.5 + Math.random() * 0.6
      );
    }
  });

  const secondaryColor = "#111114";
  const carbonColor = "#18181C";

  return (
    <group ref={kartRef} position={[0, -0.2, 0]} scale={1.25}>
      {/* 1. Main Chassis Carbon Floor & Frame */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.65, 0.1, 2.7]} />
        <meshStandardMaterial color={carbonColor} metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Front Splitter Carbon Fiber */}
      <mesh position={[0, 0.06, 1.45]}>
        <boxGeometry args={[1.75, 0.04, 0.35]} />
        <meshStandardMaterial color="#0A0A0C" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* 2. Aerodynamic Nosecone / Front Bumper */}
      <mesh position={[0, 0.16, 1.35]} rotation={[-0.12, 0, 0]}>
        <boxGeometry args={[1.5, 0.2, 0.65]} />
        <meshStandardMaterial color={primaryColor} metalness={0.75} roughness={0.25} />
      </mesh>

      {/* LED Headlight Strips (Left & Right) */}
      <mesh position={[-0.6, 0.18, 1.62]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.22, 0.04, 0.05]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.6, 0.18, 1.62]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.22, 0.04, 0.05]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Front Racing Number Plate */}
      <mesh position={[0, 0.32, 1.2]} rotation={[0.42, 0, 0]}>
        <boxGeometry args={[0.55, 0.38, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>

      {/* 3. Side Pods (Left & Right Aero Ducts) */}
      <mesh position={[-0.88, 0.22, 0.05]}>
        <boxGeometry args={[0.32, 0.3, 1.85]} />
        <meshStandardMaterial color={carbonColor} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Left Pod Livery Accent */}
      <mesh position={[-0.89, 0.22, 0.05]}>
        <boxGeometry args={[0.33, 0.07, 1.65]} />
        <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={0.3} />
      </mesh>

      <mesh position={[0.88, 0.22, 0.05]}>
        <boxGeometry args={[0.32, 0.3, 1.85]} />
        <meshStandardMaterial color={carbonColor} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Right Pod Livery Accent */}
      <mesh position={[0.89, 0.22, 0.05]}>
        <boxGeometry args={[0.33, 0.07, 1.65]} />
        <meshStandardMaterial color={primaryColor} emissive={primaryColor} emissiveIntensity={0.3} />
      </mesh>

      {/* 4. Racing Bucket Cockpit Seat */}
      <mesh position={[0, 0.46, -0.22]} rotation={[-0.28, 0, 0]}>
        <boxGeometry args={[0.72, 0.72, 0.4]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.85} />
      </mesh>

      {/* Steering Column & Digital Display Wheel */}
      <mesh position={[0, 0.52, 0.4]} rotation={[0.62, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.62, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.95} />
      </mesh>
      <mesh position={[0, 0.7, 0.26]} rotation={[0.62, 0, 0]}>
        <torusGeometry args={[0.23, 0.035, 16, 32]} />
        <meshStandardMaterial color={primaryColor} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Steering HUD Screen */}
      <mesh position={[0, 0.7, 0.27]} rotation={[0.62, 0, 0]}>
        <boxGeometry args={[0.16, 0.09, 0.02]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>

      {/* 5. Rear Motor Enclosure & Aero Diffuser */}
      <mesh position={[0, 0.36, -0.92]}>
        <boxGeometry args={[1.15, 0.38, 0.75]} />
        <meshStandardMaterial color={secondaryColor} metalness={0.92} roughness={0.2} />
      </mesh>

      {/* Rear Wing Struts */}
      <mesh position={[-0.42, 0.68, -1.12]}>
        <boxGeometry args={[0.04, 0.44, 0.08]} />
        <meshStandardMaterial color="#2E2E32" metalness={0.9} />
      </mesh>
      <mesh position={[0.42, 0.68, -1.12]}>
        <boxGeometry args={[0.04, 0.44, 0.08]} />
        <meshStandardMaterial color="#2E2E32" metalness={0.9} />
      </mesh>

      {/* Rear High-Downforce Carbon Wing */}
      <mesh position={[0, 0.9, -1.12]} rotation={[0.09, 0, 0]}>
        <boxGeometry args={[1.8, 0.06, 0.45]} />
        <meshStandardMaterial color={primaryColor} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* 6. Four High-Grip Racing Slicks & Alloy Rims with Brake Discs */}
      {/* Front Left */}
      <group position={[-0.98, 0.22, 1.02]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.27, 0.27, 0.34, 24]} />
          <meshStandardMaterial color="#0B0B0E" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.17, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
          <meshStandardMaterial color={primaryColor} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Front Right */}
      <group position={[0.98, 0.22, 1.02]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.27, 0.27, 0.34, 24]} />
          <meshStandardMaterial color="#0B0B0E" roughness={0.95} />
        </mesh>
        <mesh position={[0, -0.17, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
          <meshStandardMaterial color={primaryColor} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear Left (Extra Wide Competition Slick) */}
      <group position={[-1.04, 0.26, -0.88]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.31, 0.31, 0.44, 24]} />
          <meshStandardMaterial color="#0B0B0E" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.02, 16]} />
          <meshStandardMaterial color={primaryColor} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear Right (Extra Wide Competition Slick) */}
      <group position={[1.04, 0.26, -0.88]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.31, 0.31, 0.44, 24]} />
          <meshStandardMaterial color="#0B0B0E" roughness={0.95} />
        </mesh>
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.19, 0.19, 0.02, 16]} />
          <meshStandardMaterial color={primaryColor} metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 7. Turbo Boost Exhaust Flame Flare */}
      {isBoostActive && (
        <mesh ref={flameRef} position={[0, 0.24, -1.45]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.22, 0.9, 16]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.85} />
        </mesh>
      )}

      {/* 8. Dynamic Under-Glow Neon Accent Lighting */}
      <pointLight
        position={[0, 0.06, 0]}
        color={primaryColor}
        intensity={isBoostActive ? 16 : 8}
        distance={3.5}
      />
      <pointLight
        position={[0, 0.4, -1.35]}
        color={isBoostActive ? "#00E5FF" : primaryColor}
        intensity={isBoostActive ? 14 : 6}
        distance={2.5}
      />
    </group>
  );
}

export default function KartCanvas() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [liveryColor, setLiveryColor] = useState("#E10600");
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [cameraView, setCameraView] = useState<"orbit" | "cockpit" | "rear" | "top">("orbit");
  const controlsRef = useRef<any>(null);

  const liveries = [
    { name: "Apex Red", color: "#E10600" },
    { name: "Cyber Cyan", color: "#00E5FF" },
    { name: "Carbon Stealth", color: "#222225" },
    { name: "Podium Gold", color: "#FFD700" },
  ];

  useEffect(() => {
    setMounted(true);
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const triggerBoost = () => {
    setIsBoostActive(true);
    soundEngine.playBoostSound();
    setTimeout(() => {
      setIsBoostActive(false);
    }, 1200);
  };

  const setView = (view: "orbit" | "cockpit" | "rear" | "top") => {
    setCameraView(view);
    soundEngine.playClick(750);
  };

  if (!mounted || !hasWebGL) {
    return <KartFallback />;
  }

  // Camera positions based on view
  const cameraPosition: [number, number, number] =
    cameraView === "cockpit"
      ? [0, 0.9, 0.2]
      : cameraView === "rear"
      ? [0, 1.4, -3.2]
      : cameraView === "top"
      ? [0, 4.5, 0.1]
      : [3.4, 2.2, 3.8];

  return (
    <div className="relative w-full h-[450px] lg:h-[540px] rounded-3xl bg-gradient-to-b from-carbon-900/90 via-carbon-950/95 to-carbon-900/90 border border-white/15 overflow-hidden shadow-card-elevated group">
      
      {/* 3D Canvas HUD Info Overlay */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          3D MOTORSPORT DIGITAL SHOWROOM
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-carbon-300 bg-carbon-900/80 border border-white/10">
          APEX GT-X SPEC
        </span>
      </div>

      {/* Livery Color Switcher & Boost Button (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        {/* Liveries */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-carbon-900/85 border border-white/15 backdrop-blur-md">
          {liveries.map((l) => (
            <button
              key={l.name}
              onClick={() => {
                setLiveryColor(l.color);
                soundEngine.playClick(650);
              }}
              title={l.name}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                liveryColor === l.color ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: l.color }}
            />
          ))}
        </div>

        {/* Turbo Boost Button */}
        <button
          onClick={triggerBoost}
          disabled={isBoostActive}
          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all backdrop-blur-md ${
            isBoostActive
              ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/50 scale-105"
              : "bg-brand-red text-white hover:bg-brand-redDark shadow-glow-red"
          }`}
        >
          <Zap className={`w-3.5 h-3.5 ${isBoostActive ? "animate-spin" : ""}`} />
          <span>{isBoostActive ? "BOOSTED!" : "NITRO BOOST"}</span>
        </button>
      </div>

      {/* Camera View Switcher (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-carbon-900/85 border border-white/15 backdrop-blur-md">
        <span className="text-[10px] font-mono uppercase text-carbon-400 px-2 flex items-center gap-1">
          <Eye className="w-3 h-3" /> CAM:
        </span>
        {(["orbit", "cockpit", "rear", "top"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all ${
              cameraView === v
                ? "bg-brand-red text-white font-bold"
                : "text-carbon-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Interactive Drag & FPS indicator (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:flex items-center gap-3 text-xs font-mono text-carbon-400 bg-carbon-900/70 px-3 py-1 rounded-xl border border-white/10 backdrop-blur-md">
        <span>🖱️ Drag to Rotate 360°</span>
        <span>•</span>
        <span className="text-emerald-400 font-bold">● 60 FPS WEBGL</span>
      </div>

      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={45} />
        <ambientLight intensity={1.4} />
        <directionalLight position={[5, 9, 5]} intensity={2.8} castShadow />
        <directionalLight position={[-5, 4, -5]} intensity={1.8} color="#FF5555" />
        <spotLight position={[0, 10, 0]} intensity={2.5} angle={0.65} penumbra={0.8} />

        <Suspense fallback={null}>
          <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
            <ProceduralKart primaryColor={liveryColor} isBoostActive={isBoostActive} />
          </Float>
          <ContactShadows position={[0, -0.6, 0]} opacity={0.8} scale={8.5} blur={2.5} far={4} color="#000000" />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={2.2}
          maxDistance={7.5}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate={cameraView === "orbit"}
          autoRotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}

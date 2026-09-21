"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera, ContactShadows, Text, Html } from "@react-three/drei";
import * as THREE from "three";
import { mediaRegistry } from "@/lib/media";
import { useDeviceCapability } from "@/hooks/useDeviceCapability";
import { useBooking } from "@/context/BookingContext";
import { soundEngine } from "@/lib/soundEngine";
import { Compass, Calendar, ArrowRight, Sparkles, Flag, Eye } from "lucide-react";

interface FacilityMapProps {
  selectedZoneId?: string;
  onSelectZone?: (id: string) => void;
}

function MiniatureCircuit() {
  const linePoints = [
    new THREE.Vector3(-3.2, 0.05, 0.5),
    new THREE.Vector3(-3.0, 0.05, 1.8),
    new THREE.Vector3(-1.8, 0.05, 2.2),
    new THREE.Vector3(-1.2, 0.05, 1.0),
    new THREE.Vector3(-1.8, 0.05, -0.2),
    new THREE.Vector3(-3.2, 0.05, 0.5),
  ];
  const curve = new THREE.CatmullRomCurve3(linePoints, true);
  const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.12, 8, true);

  return (
    <group position={[0, 0, 0]}>
      {/* Asphalt Track Surface */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial color="#141418" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Glowing Apex Neon Line */}
      <mesh geometry={new THREE.TubeGeometry(curve, 64, 0.03, 6, true)} position={[0, 0.04, 0]}>
        <meshBasicMaterial color="#E10600" />
      </mesh>
      {/* Track Infield Pad */}
      <mesh position={[-2.2, 0.01, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.5, 2.5]} />
        <meshStandardMaterial color="#0B0B0E" roughness={0.9} />
      </mesh>
    </group>
  );
}

function MiniatureSkyTower() {
  const pillarRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pillarRef.current) {
      pillarRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group position={[0, 0, -1.5]}>
      {/* Tower Base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 0.4, 16]} />
        <meshStandardMaterial color="#18181C" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Central Support Pillar */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.6, 16]} />
        <meshStandardMaterial color="#2A2A30" metalness={0.95} />
      </mesh>
      {/* 360 Elevated Dining Pod */}
      <group ref={pillarRef} position={[0, 1.7, 0]}>
        <mesh>
          <cylinderGeometry args={[1.1, 0.9, 0.35, 24]} />
          <meshStandardMaterial color="#FFB800" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Glass Panoramic Ring */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[1.08, 1.08, 0.18, 24]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} metalness={0.1} roughness={0.1} />
        </mesh>
        <pointLight position={[0, 0.2, 0]} color="#FFB800" intensity={4} distance={3} />
      </group>
    </group>
  );
}

function MiniatureRCArena() {
  return (
    <group position={[2.6, 0.1, 1.5]}>
      {/* Arena Base Wall */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[2.2, 0.24, 2.0]} />
        <meshStandardMaterial color="#121216" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Multi-tier Raceway Platform */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[1.9, 0.08, 1.7]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={0.2} metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Crossover Jump Ramp */}
      <mesh position={[0, 0.38, 0]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.6, 0.05, 0.7]} />
        <meshStandardMaterial color="#E10600" />
      </mesh>
    </group>
  );
}

function MiniatureVRDome() {
  return (
    <group position={[2.2, 0.25, -1.8]}>
      {/* Geodesic VR Dome */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.75, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#A855F7" metalness={0.85} roughness={0.25} wireframe={false} />
      </mesh>
      {/* Base Ring */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.8, 0.85, 0.1, 24]} />
        <meshStandardMaterial color="#1C1C22" metalness={0.9} />
      </mesh>
      <pointLight position={[0, 0.5, 0]} color="#A855F7" intensity={5} distance={2.5} />
    </group>
  );
}

function MiniatureBanquetHall() {
  return (
    <group position={[-2.2, 0.25, -1.9]}>
      {/* Grand Hall Main Pavilion */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[1.8, 0.5, 1.4]} />
        <meshStandardMaterial color="#181820" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* Curved Modern Roof Architecture */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[2.0, 0.08, 1.5]} />
        <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.2} metalness={0.7} />
      </mesh>
      <pointLight position={[0, 0.3, 0]} color="#10B981" intensity={4} distance={2.5} />
    </group>
  );
}

function ZonePin({
  position,
  color,
  label,
  isSelected,
  onClick,
}: {
  position: [number, number, number];
  color: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  const pinRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (pinRef.current) {
      pinRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 3 + position[0]) * 0.08;
    }
  });

  return (
    <group
      ref={pinRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={() => {
        if (typeof document !== "undefined") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (typeof document !== "undefined") document.body.style.cursor = "auto";
      }}
    >
      {/* Glowing Beacon Diamond */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.22, 0.22, 0.22]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.9 : 0.4}
          metalness={0.9}
        />
      </mesh>
      {/* Vertical Laser Beam */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      {/* Interactive Tag */}
      <Html position={[0, 0.95, 0]} center distanceFactor={10}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
            isSelected
              ? "bg-white text-black border-white shadow-lg scale-110"
              : "bg-black/85 text-white/90 border-white/20 hover:border-white/60 hover:scale-105"
          }`}
          style={{ borderColor: isSelected ? "#FFFFFF" : color }}
        >
          {label}
        </button>
      </Html>
    </group>
  );
}

export default function FacilityMap({ selectedZoneId, onSelectZone }: FacilityMapProps) {
  const { openBookingModal } = useBooking();
  const { hasWebGL, isMobile, maxDPR } = useDeviceCapability();
  const [activeZone, setActiveZone] = useState(selectedZoneId || mediaRegistry.facilities[0].id);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (selectedZoneId) {
      setActiveZone(selectedZoneId);
    }
  }, [selectedZoneId]);

  const handleSelect = (id: string) => {
    setActiveZone(id);
    soundEngine.playClick(750);
    if (onSelectZone) onSelectZone(id);
  };

  const currentFacility = mediaRegistry.facilities.find((f) => f.id === activeZone) || mediaRegistry.facilities[0];

  if (!hasWebGL) {
    return (
      <div className="p-8 rounded-3xl bg-carbon-900 border border-white/10 text-center space-y-4">
        <h3 className="text-xl font-display font-bold text-white uppercase">24OURS DESTINATION CAMPUS</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaRegistry.facilities.map((fac) => (
            <div key={fac.id} className="p-4 rounded-2xl bg-carbon-950 border border-white/10 text-left space-y-2">
              <span className="text-xs font-mono font-bold" style={{ color: fac.color }}>
                {fac.name}
              </span>
              <p className="text-xs text-carbon-300">{fac.description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[520px] lg:h-[620px] rounded-3xl bg-gradient-to-b from-[#070709] via-carbon-950 to-[#070709] border border-white/15 overflow-hidden shadow-2xl group select-none">
      
      {/* Map HUD Top Banner */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold flex items-center gap-1.5 backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-brand-red" />
          INTERACTIVE 3D CAMPUS TWIN
        </span>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-carbon-300 bg-carbon-900/80 border border-white/10 hidden sm:inline">
          5 SIGNATURE ZONES • MALUR, KOLAR
        </span>
      </div>

      {/* Zone Quick-Tabs (Top Right) */}
      <div className="absolute top-4 right-4 z-20 hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-carbon-900/85 border border-white/15 backdrop-blur-md">
        {mediaRegistry.facilities.map((fac) => (
          <button
            key={fac.id}
            onClick={() => handleSelect(fac.id)}
            className={`px-3 py-1 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all ${
              activeZone === fac.id
                ? "bg-white text-black font-bold shadow-md"
                : "text-carbon-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {fac.category}
          </button>
        ))}
      </div>

      {/* Selected Zone Telemetry Card (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 max-w-sm w-[calc(100%-2rem)] sm:w-auto p-5 rounded-2xl bg-carbon-900/90 border border-white/15 backdrop-blur-xl space-y-3 shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: currentFacility.color }} />
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">{currentFacility.name}</h4>
          </div>
          <span className="text-[10px] font-mono text-carbon-400 uppercase">{currentFacility.category}</span>
        </div>

        <p className="text-xs text-carbon-300 font-sans leading-relaxed">{currentFacility.description}</p>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            onClick={() => {
              soundEngine.playClick(600);
              openBookingModal(currentFacility.name);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-red to-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-1.5 shadow-glow-red"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>BOOK THIS ZONE</span>
          </button>

          <span className="text-[10px] font-mono text-carbon-400 hidden sm:inline">🖱️ Drag to Orbit</span>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Canvas shadows dpr={[1, maxDPR]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 6.5, 6.5]} fov={45} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[6, 12, 6]} intensity={2.8} castShadow />
        <directionalLight position={[-6, 8, -6]} intensity={1.5} color="#FF6666" />
        <spotLight position={[0, 10, 0]} intensity={2.2} angle={0.8} penumbra={0.7} />

        <Suspense fallback={null}>
          <group position={[0, -0.3, 0]}>
            {/* Campus Ground Plane with Telemetry Grid */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <planeGeometry args={[12, 10]} />
              <meshStandardMaterial color="#08080B" roughness={0.9} metalness={0.2} />
            </mesh>

            {/* Five 3D Signature Facility Nodes */}
            <MiniatureCircuit />
            <MiniatureSkyTower />
            <MiniatureRCArena />
            <MiniatureVRDome />
            <MiniatureBanquetHall />

            {/* Interactive 3D Pins */}
            {mediaRegistry.facilities.map((fac) => (
              <ZonePin
                key={fac.id}
                position={fac.position}
                color={fac.color}
                label={fac.category}
                isSelected={activeZone === fac.id}
                onClick={() => handleSelect(fac.id)}
              />
            ))}

            <ContactShadows position={[0, 0.01, 0]} opacity={0.85} scale={12} blur={2.5} far={4} color="#000000" />
          </group>
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={4.0}
          maxDistance={12.0}
          maxPolarAngle={Math.PI / 2 - 0.1}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

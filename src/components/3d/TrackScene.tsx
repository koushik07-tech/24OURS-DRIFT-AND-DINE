"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import { Camera, Eye, Flag, Gauge, Play, RotateCcw, Video } from "lucide-react";

interface TrackSceneProps {
  interactive?: boolean;
}

// =========================================================================
// PROCEDURAL REALISTIC RACE TRACK ASSETS
// =========================================================================
function TrackEnvironment() {
  const kartPacerRef = useRef<THREE.Group>(null);
  const [activeCamMode, setActiveCamMode] = useState<"aerial" | "chase">("aerial");

  // Track Curve Definition (Circuit shape)
  const trackCurve = useMemo(() => {
    const points = [
      new THREE.Vector3(-14, 0, -10),
      new THREE.Vector3(-4, 0, -14),
      new THREE.Vector3(12, 0, -10),
      new THREE.Vector3(16, 0, 0),
      new THREE.Vector3(14, 0, 10),
      new THREE.Vector3(2, 0, 14),
      new THREE.Vector3(-8, 0, 8),
      new THREE.Vector3(-16, 0, 0),
    ];
    return new THREE.CatmullRomCurve3(points, true, "centripetal");
  }, []);

  // Track Asphalt Ribbon Geometry
  const trackGeometry = useMemo(() => {
    return new THREE.TubeGeometry(trackCurve, 120, 2.4, 8, true);
  }, [trackCurve]);

  // Materials
  const asphaltMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x181a20,
        roughness: 0.85,
        metalness: 0.15,
      }),
    []
  );

  const curbRedMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xd92d20,
        roughness: 0.6,
      }),
    []
  );

  const curbWhiteMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.5,
      }),
    []
  );

  const barrierMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.8,
        metalness: 0.4,
      }),
    []
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.9,
        roughness: 0.2,
      }),
    []
  );

  // Animated Pacer Kart circulating the track
  useFrame((state) => {
    const t = (state.clock.getElapsedTime() * 0.06) % 1;
    if (kartPacerRef.current) {
      const pos = trackCurve.getPointAt(t);
      const tangent = trackCurve.getTangentAt(t);
      kartPacerRef.current.position.set(pos.x, pos.y + 0.15, pos.z);
      kartPacerRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tangent);
    }
  });

  return (
    <group>
      {/* Ground Infield Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#090d14" roughness={0.95} />
      </mesh>

      {/* Main Asphalt Circuit Tube / Ribbon */}
      <mesh geometry={trackGeometry} material={asphaltMat} receiveShadow />

      {/* Checkered Start / Finish Line Gantry at Z = -10, X = 0 */}
      <group position={[0, 0, -13.5]}>
        {/* Checkered Line Marker */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.8, 1.2]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Starting Gantry Pylons */}
        <mesh position={[-3.2, 2.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 4.4, 8]} />
          <primitive object={chromeMat} attach="material" />
        </mesh>
        <mesh position={[3.2, 2.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 4.4, 8]} />
          <primitive object={chromeMat} attach="material" />
        </mesh>
        {/* Overhead Gantry Box */}
        <mesh position={[0, 4.2, 0]}>
          <boxGeometry args={[6.8, 0.6, 0.8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.8} />
        </mesh>
        {/* Digital Signboard Display */}
        <mesh position={[0, 4.2, 0.42]}>
          <planeGeometry args={[5.2, 0.45]} />
          <meshBasicMaterial color="#10B981" />
        </mesh>
      </group>

      {/* Starting Grid Slots */}
      {[-2, -4, -6, -8].map((offsetZ, idx) => (
        <mesh
          key={idx}
          position={[idx % 2 === 0 ? -1.0 : 1.0, 0.02, -13.5 - offsetZ]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[1.4, 0.15]} />
          <meshBasicMaterial color="#FF5A36" />
        </mesh>
      ))}

      {/* Grandstand Spectator Pavilion (North Ridge) */}
      <group position={[0, 0, -18]}>
        {/* Grandstand Foundation Steps */}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[18, 2.4, 4.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.7} />
        </mesh>
        {/* Grandstand Canopy Roof */}
        <mesh position={[0, 3.8, -0.5]} rotation={[0.15, 0, 0]}>
          <boxGeometry args={[19, 0.15, 5.5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.7} />
        </mesh>
        {/* Support Truss Pillars */}
        <mesh position={[-8.5, 2.2, 1.8]}>
          <cylinderGeometry args={[0.06, 0.06, 3.8, 8]} />
          <primitive object={chromeMat} attach="material" />
        </mesh>
        <mesh position={[8.5, 2.2, 1.8]}>
          <cylinderGeometry args={[0.06, 0.06, 3.8, 8]} />
          <primitive object={chromeMat} attach="material" />
        </mesh>
      </group>

      {/* Pit Lane Garages (West Straight) */}
      <group position={[-16, 0, -5]}>
        <mesh position={[0, 1.4, 0]}>
          <boxGeometry args={[3.5, 2.8, 12]} />
          <meshStandardMaterial color="#111827" metalness={0.6} />
        </mesh>
        {/* Garage Bay Doors with Coral Headers */}
        <mesh position={[1.78, 1.1, 0]}>
          <boxGeometry args={[0.05, 2.2, 10.5]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      </group>

      {/* Trackside Floodlight Lighting Gantries (4 corners) */}
      {[
        [-14, 8, -14],
        [14, 8, -14],
        [16, 8, 12],
        [-16, 8, 12],
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x, 0, z]}>
          {/* Mast Pole */}
          <mesh position={[0, y / 2, 0]}>
            <cylinderGeometry args={[0.1, 0.18, y, 8]} />
            <primitive object={chromeMat} attach="material" />
          </mesh>
          {/* Light Fixture Head */}
          <mesh position={[0, y, 0]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[1.2, 0.5, 0.4]} />
            <meshStandardMaterial color="#0f172a" metalness={0.8} />
          </mesh>
          {/* SpotLight Cones */}
          <spotLight
            position={[0, y, 0]}
            target-position={[x > 0 ? x - 6 : x + 6, 0, z > 0 ? z - 6 : z + 6]}
            angle={0.65}
            penumbra={0.7}
            intensity={2.8}
            color="#dbeafe"
            distance={25}
          />
        </group>
      ))}

      {/* Tire Safety Barriers lining the Hairpin Apex (East Curve) */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const angle = -Math.PI / 3 + (i * Math.PI) / 6;
        const radius = 17.2;
        const bx = Math.sin(angle) * radius;
        const bz = Math.cos(angle) * radius;
        return (
          <group key={i} position={[bx, 0.3, bz]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 0.6, 12]} />
              <primitive object={i % 2 === 0 ? curbRedMat : curbWhiteMat} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* Animated Racing Go-Kart moving dynamically around circuit */}
      <group ref={kartPacerRef}>
        {/* Kart Body */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.95, 0.22, 1.8]} />
          <meshStandardMaterial color="#FF5A36" metalness={0.6} roughness={0.25} />
        </mesh>
        {/* Kart Nose */}
        <mesh position={[0, 0.12, 0.85]}>
          <coneGeometry args={[0.4, 0.7, 12]} />
          <meshStandardMaterial color="#FF5A36" metalness={0.7} />
        </mesh>
        {/* Cockpit Bucket */}
        <mesh position={[0, 0.32, -0.2]}>
          <boxGeometry args={[0.48, 0.4, 0.35]} />
          <meshStandardMaterial color="#111827" />
        </mesh>
        {/* Rear Wing */}
        <mesh position={[0, 0.45, -0.85]}>
          <boxGeometry args={[1.2, 0.04, 0.3]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        {/* Glowing Headlights */}
        <pointLight position={[0, 0.25, 1.2]} intensity={2.2} color="#ffffff" distance={6} />
      </group>
    </group>
  );
}

// =========================================================================
// TRACK SCENE CANVAS WRAPPER
// =========================================================================
export default function TrackScene({ interactive = true }: TrackSceneProps) {
  const [camPreset, setCamPreset] = useState<"panoramic" | "infield" | "gantry">("panoramic");

  return (
    <div className="relative w-full h-[420px] sm:h-[500px] lg:h-[580px] rounded-3xl overflow-hidden liquid-glass border border-white/10 select-none">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
      >
        <PerspectiveCamera
          makeDefault
          position={
            camPreset === "panoramic"
              ? [0, 24, 28]
              : camPreset === "infield"
              ? [0, 6, 12]
              : [0, 8, -8]
          }
          fov={42}
        />

        {/* Atmospheric Ambient & Twilight Lighting */}
        <ambientLight intensity={0.75} />
        <directionalLight position={[10, 20, 15]} intensity={2.2} color="#FF5A36" castShadow />
        <directionalLight position={[-15, 12, -10]} intensity={1.5} color="#38bdf8" />

        {/* 3D Track Components */}
        <TrackEnvironment />

        {/* User Orbit Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.08}
          minPolarAngle={Math.PI / 6}
          autoRotate={camPreset === "panoramic"}
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Floating Track Telemetry Overlay Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass border border-emerald-500/30 text-xs font-mono text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>CIRCUIT: 1.2 KM ASPHALT LOOP ACTIVE</span>
        </div>

        {/* Camera Preset Switcher */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setCamPreset("panoramic")}
            className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase font-bold transition-all ${
              camPreset === "panoramic"
                ? "bg-coral text-white shadow-coral-glow"
                : "liquid-glass text-zinc-300 hover:text-white"
            }`}
          >
            AERIAL CAM
          </button>
          <button
            onClick={() => setCamPreset("infield")}
            className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase font-bold transition-all ${
              camPreset === "infield"
                ? "bg-coral text-white shadow-coral-glow"
                : "liquid-glass text-zinc-300 hover:text-white"
            }`}
          >
            APEX CAM
          </button>
          <button
            onClick={() => setCamPreset("gantry")}
            className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase font-bold transition-all ${
              camPreset === "gantry"
                ? "bg-coral text-white shadow-coral-glow"
                : "liquid-glass text-zinc-300 hover:text-white"
            }`}
          >
            GRID CAM
          </button>
        </div>
      </div>
    </div>
  );
}

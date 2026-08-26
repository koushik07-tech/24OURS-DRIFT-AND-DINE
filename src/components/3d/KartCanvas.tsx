"use client";

import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import KartFallback from "./KartFallback";

function ProceduralKart() {
  const kartRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (kartRef.current) {
      // Gentle idle yaw rotation
      kartRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group ref={kartRef} position={[0, -0.2, 0]} scale={1.2}>
      {/* 1. Main Chassis Floor & Frame */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.6, 0.1, 2.6]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 2. Aerodynamic Nosecone / Front Bumper */}
      <mesh position={[0, 0.15, 1.4]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[1.5, 0.18, 0.6]} />
        <meshStandardMaterial color="#E10600" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Front Number Plate */}
      <mesh position={[0, 0.28, 1.25]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.5, 0.35, 0.05]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
      </mesh>

      {/* 3. Side Pods (Left & Right Aero Ducts) */}
      <mesh position={[-0.85, 0.22, 0.1]}>
        <boxGeometry args={[0.3, 0.28, 1.8]} />
        <meshStandardMaterial color="#181818" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Left Pod Red Stripe */}
      <mesh position={[-0.86, 0.22, 0.1]}>
        <boxGeometry args={[0.31, 0.06, 1.6]} />
        <meshStandardMaterial color="#E10600" emissive="#E10600" emissiveIntensity={0.2} />
      </mesh>

      <mesh position={[0.85, 0.22, 0.1]}>
        <boxGeometry args={[0.3, 0.28, 1.8]} />
        <meshStandardMaterial color="#181818" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Right Pod Red Stripe */}
      <mesh position={[0.86, 0.22, 0.1]}>
        <boxGeometry args={[0.31, 0.06, 1.6]} />
        <meshStandardMaterial color="#E10600" emissive="#E10600" emissiveIntensity={0.2} />
      </mesh>

      {/* 4. Racing Bucket Cockpit Seat */}
      <mesh position={[0, 0.45, -0.2]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.4]} />
        <meshStandardMaterial color="#0A0A0A" roughness={0.8} />
      </mesh>

      {/* Steering Column & Wheel */}
      <mesh position={[0, 0.5, 0.4]} rotation={[0.6, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
        <meshStandardMaterial color="#888888" metalness={0.9} />
      </mesh>
      <mesh position={[0, 0.68, 0.28]} rotation={[0.6, 0, 0]}>
        <torusGeometry args={[0.22, 0.035, 16, 32]} />
        <meshStandardMaterial color="#E10600" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* 5. Rear Engine Cover & Downforce Wing */}
      <mesh position={[0, 0.35, -0.9]}>
        <boxGeometry args={[1.1, 0.35, 0.7]} />
        <meshStandardMaterial color="#151515" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Wing Struts */}
      <mesh position={[-0.4, 0.65, -1.1]}>
        <boxGeometry args={[0.04, 0.4, 0.08]} />
        <meshStandardMaterial color="#333333" metalness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.65, -1.1]}>
        <boxGeometry args={[0.04, 0.4, 0.08]} />
        <meshStandardMaterial color="#333333" metalness={0.9} />
      </mesh>

      {/* Rear High-Downforce Wing */}
      <mesh position={[0, 0.85, -1.1]} rotation={[0.08, 0, 0]}>
        <boxGeometry args={[1.7, 0.06, 0.4]} />
        <meshStandardMaterial color="#E10600" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* 6. Four High-Grip Wheels & Chrome Rims */}
      {/* Front Left */}
      <group position={[-0.95, 0.22, 1.0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 0.32, 24]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial color="#E10600" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Front Right */}
      <group position={[0.95, 0.22, 1.0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.26, 0.26, 0.32, 24]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.16, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial color="#E10600" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear Left (Wider Tire) */}
      <group position={[-1.0, 0.26, -0.85]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.42, 24]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.21, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
          <meshStandardMaterial color="#E10600" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Rear Right (Wider Tire) */}
      <group position={[1.0, 0.26, -0.85]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.42, 24]} />
          <meshStandardMaterial color="#0A0A0A" roughness={0.9} />
        </mesh>
        <mesh position={[0, -0.21, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 16]} />
          <meshStandardMaterial color="#E10600" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* 7. Under-Glow Neon Accent Lighting */}
      <pointLight position={[0, 0.05, 0]} color="#E10600" intensity={8} distance={3} />
      <pointLight position={[0, 0.4, -1.3]} color="#FF2200" intensity={6} distance={2} />
    </group>
  );
}

export default function KartCanvas() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

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

  if (!mounted || !hasWebGL) {
    return <KartFallback />;
  }

  return (
    <div className="relative w-full h-[420px] lg:h-[500px] rounded-3xl bg-gradient-to-b from-carbon-900/90 via-carbon-950/95 to-carbon-900/90 border border-white/15 overflow-hidden shadow-card-elevated group">
      
      {/* 3D Canvas HUD Info Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-brand-red/20 text-brand-red border border-brand-red/40 uppercase font-bold">
          INTERACTIVE 3D KART SIMULATOR
        </span>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none flex items-center justify-between text-xs font-mono text-carbon-400 border-t border-white/10 pt-2">
        <span className="text-white">🖱️ Drag to Orbit 360° • Scroll to Zoom</span>
        <span className="text-brand-red font-bold animate-pulse">● 60 FPS WEBGL</span>
      </div>

      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[3.2, 2.2, 3.8]} fov={45} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow />
        <directionalLight position={[-5, 4, -5]} intensity={1.5} color="#FF6666" />
        <spotLight position={[0, 10, 0]} intensity={2.0} angle={0.6} penumbra={0.8} />

        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.2} floatIntensity={0.4}>
            <ProceduralKart />
          </Float>
          <ContactShadows position={[0, -0.6, 0]} opacity={0.75} scale={8} blur={2.5} far={4} color="#000000" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2.5}
          maxDistance={7.0}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

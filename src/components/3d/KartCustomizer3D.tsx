"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";

export interface KartCustomizerOptions {
  color: string;
  number: string;
  underglow: boolean;
  underglowColor: string;
  headlights: boolean;
  environment: "night" | "sunset" | "studio";
}

interface CustomKartProps {
  options: KartCustomizerOptions;
}

function CustomizableKartModel({ options }: CustomKartProps) {
  const kartRef = useRef<THREE.Group>(null);
  const wheelsRef = useRef<THREE.Group[]>([]);
  const steeringWheelRef = useRef<THREE.Group>(null);

  // Materials based on options
  const liveryMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: options.color,
        roughness: 0.25,
        metalness: 0.85,
        envMapIntensity: 1.5,
      }),
    [options.color]
  );

  const carbonMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.5,
        metalness: 0.3,
      }),
    []
  );

  const chromeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#f4f4f5",
        roughness: 0.1,
        metalness: 0.95,
      }),
    []
  );

  const rubberMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0f0f12",
        roughness: 0.85,
        metalness: 0.1,
      }),
    []
  );

  const rotorMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#a1a1aa",
        roughness: 0.3,
        metalness: 0.9,
      }),
    []
  );

  const brakeCaliperMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ef4444",
        roughness: 0.3,
        metalness: 0.6,
      }),
    []
  );

  // Subtle floating idle motion
  useFrame((state, delta) => {
    if (kartRef.current) {
      kartRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <group ref={kartRef} position={[0, 0.45, 0]}>
      {/* 1. Main Tubular Chassis (Steel Spaceframe) */}
      <group>
        {/* Left Long Rail */}
        <mesh position={[-0.55, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMaterial}>
          <cylinderGeometry args={[0.032, 0.032, 2.5, 16]} />
        </mesh>
        {/* Right Long Rail */}
        <mesh position={[0.55, 0.05, 0]} rotation={[0, 0, Math.PI / 2]} material={chromeMaterial}>
          <cylinderGeometry args={[0.032, 0.032, 2.5, 16]} />
        </mesh>
        {/* Front Cross Member */}
        <mesh position={[0, 0.05, 1.15]} rotation={[0, 0, 0]} material={chromeMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 1.1, 16]} />
        </mesh>
        {/* Rear Axle Cross Member */}
        <mesh position={[0, 0.05, -1.15]} rotation={[0, 0, 0]} material={chromeMaterial}>
          <cylinderGeometry args={[0.03, 0.03, 1.1, 16]} />
        </mesh>
        {/* Floor Pan */}
        <mesh position={[0, 0.04, 0]} material={carbonMaterial}>
          <boxGeometry args={[1.05, 0.015, 2.3]} />
        </mesh>
      </group>

      {/* 2. Aerodynamic Body Panels (Colored by Customizer) */}
      <group>
        {/* Front Nosecone */}
        <mesh position={[0, 0.22, 1.35]} material={liveryMaterial} castShadow>
          <boxGeometry args={[1.0, 0.2, 0.65]} />
        </mesh>
        {/* Nosecone Race Number */}
        <group position={[0, 0.33, 1.45]} rotation={[-Math.PI / 4, 0, 0]}>
          <mesh>
            <circleGeometry args={[0.16, 32]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
          </mesh>
          <Text
            position={[0, 0, 0.005]}
            fontSize={0.22}
            color="#000000"
            font="https://fonts.gstatic.com/s/orbitron/v31/yMJRMIlzdpvBhQQL_Qq7dys.woff"
            anchorX="center"
            anchorY="middle"
          >
            {options.number}
          </Text>
        </group>

        {/* Left Side Pod */}
        <mesh position={[-0.78, 0.18, 0]} material={liveryMaterial} castShadow>
          <boxGeometry args={[0.34, 0.24, 1.7]} />
        </mesh>
        {/* Right Side Pod */}
        <mesh position={[0.78, 0.18, 0]} material={liveryMaterial} castShadow>
          <boxGeometry args={[0.34, 0.24, 1.7]} />
        </mesh>

        {/* Side Pod Numbers */}
        <group position={[-0.96, 0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <Text
            fontSize={0.16}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            #{options.number}
          </Text>
        </group>
        <group position={[0.96, 0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
          <Text
            fontSize={0.16}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            #{options.number}
          </Text>
        </group>

        {/* Rear High-Downforce Carbon Wing */}
        <group position={[0, 0.68, -1.35]}>
          {/* Main Plane */}
          <mesh material={liveryMaterial} castShadow>
            <boxGeometry args={[1.4, 0.04, 0.36]} />
          </mesh>
          {/* Endplates */}
          <mesh position={[-0.71, 0, 0]} material={carbonMaterial}>
            <boxGeometry args={[0.02, 0.2, 0.42]} />
          </mesh>
          <mesh position={[0.71, 0, 0]} material={carbonMaterial}>
            <boxGeometry args={[0.02, 0.2, 0.42]} />
          </mesh>
          {/* Struts */}
          <mesh position={[-0.35, -0.28, 0.02]} rotation={[0.2, 0, 0]} material={chromeMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.55, 12]} />
          </mesh>
          <mesh position={[0.35, -0.28, 0.02]} rotation={[0.2, 0, 0]} material={chromeMaterial}>
            <cylinderGeometry args={[0.015, 0.015, 0.55, 12]} />
          </mesh>
        </group>
      </group>

      {/* 3. Cockpit & Racing Bucket Seat */}
      <group position={[0, 0.25, -0.25]}>
        <mesh material={carbonMaterial} rotation={[-0.35, 0, 0]} castShadow>
          <boxGeometry args={[0.55, 0.75, 0.12]} />
        </mesh>
        <mesh position={[0, -0.15, 0.2]} material={carbonMaterial}>
          <boxGeometry args={[0.55, 0.12, 0.5]} />
        </mesh>
      </group>

      {/* 4. Steering Column & F1 Steering Wheel */}
      <group position={[0, 0.42, 0.38]} rotation={[-0.6, 0, 0]}>
        <mesh material={chromeMaterial}>
          <cylinderGeometry args={[0.02, 0.02, 0.75, 16]} />
        </mesh>
        <group position={[0, 0.38, 0]}>
          <mesh material={carbonMaterial}>
            <boxGeometry args={[0.32, 0.18, 0.04]} />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <boxGeometry args={[0.12, 0.06, 0.01]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>
        </group>
      </group>

      {/* 5. Four Detailed Racing Wheels & Calipers */}
      {[
        { pos: [-0.85, 0.02, 0.95], name: "Front Left", isFront: true },
        { pos: [0.85, 0.02, 0.95], name: "Front Right", isFront: true },
        { pos: [-0.95, 0.08, -0.95], name: "Rear Left", isFront: false },
        { pos: [0.95, 0.08, -0.95], name: "Rear Right", isFront: false },
      ].map((wheel, idx) => (
        <group key={idx} position={wheel.pos as [number, number, number]}>
          {/* Slick Rubber Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={rubberMaterial} castShadow>
            <cylinderGeometry
              args={[
                wheel.isFront ? 0.26 : 0.31,
                wheel.isFront ? 0.26 : 0.31,
                wheel.isFront ? 0.22 : 0.35,
                32
              ]}
            />
          </mesh>
          {/* Wheel Rim / Spokes */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={chromeMaterial}>
            <cylinderGeometry
              args={[
                wheel.isFront ? 0.16 : 0.18,
                wheel.isFront ? 0.16 : 0.18,
                wheel.isFront ? 0.225 : 0.355,
                16
              ]}
            />
          </mesh>
          {/* Drilled Brake Disc */}
          <mesh rotation={[0, 0, Math.PI / 2]} material={rotorMaterial}>
            <cylinderGeometry args={[0.18, 0.18, 0.02, 24]} />
          </mesh>
          {/* Red Brembo Caliper */}
          <mesh position={[0, 0.12, 0]} material={brakeCaliperMaterial}>
            <boxGeometry args={[0.07, 0.08, 0.05]} />
          </mesh>
        </group>
      ))}

      {/* 6. Front Headlights with Light Cones */}
      {options.headlights && (
        <group position={[0, 0.22, 1.68]}>
          <mesh position={[-0.35, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial emissive="#ffffff" emissiveIntensity={3} color="#ffffff" />
          </mesh>
          <mesh position={[0.35, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial emissive="#ffffff" emissiveIntensity={3} color="#ffffff" />
          </mesh>
          <pointLight position={[-0.35, 0, 0.2]} intensity={2.5} distance={7} color="#ffffff" />
          <pointLight position={[0.35, 0, 0.2]} intensity={2.5} distance={7} color="#ffffff" />
        </group>
      )}

      {/* 7. Neon Chassis Underglow */}
      {options.underglow && (
        <group position={[0, -0.15, 0]}>
          <pointLight intensity={3.5} distance={3.5} color={options.underglowColor} />
          {/* Floor Underglow Plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
            <planeGeometry args={[1.8, 2.8]} />
            <meshBasicMaterial
              color={options.underglowColor}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}

      {/* Ground Contact Shadow */}
      <ContactShadows position={[0, -0.22, 0]} opacity={0.75} scale={4} blur={1.5} far={2} />
    </group>
  );
}

export default function KartCustomizer3D({ options }: { options: KartCustomizerOptions }) {
  // Environmental lighting presets
  const renderLighting = () => {
    switch (options.environment) {
      case "sunset":
        return (
          <>
            <ambientLight intensity={0.4} color="#f97316" />
            <directionalLight position={[6, 4, 6]} intensity={1.8} color="#fdba74" castShadow />
            <directionalLight position={[-6, 2, -6]} intensity={0.8} color="#ec4899" />
          </>
        );
      case "studio":
        return (
          <>
            <ambientLight intensity={0.8} color="#ffffff" />
            <directionalLight position={[5, 8, 5]} intensity={2.2} color="#ffffff" castShadow />
            <directionalLight position={[-5, 5, -5]} intensity={1.0} color="#94a3b8" />
          </>
        );
      case "night":
      default:
        return (
          <>
            <ambientLight intensity={0.2} color="#38bdf8" />
            <spotLight
              position={[0, 6, 2]}
              intensity={2.8}
              angle={0.6}
              penumbra={0.8}
              color="#ffffff"
              castShadow
            />
            <pointLight position={[3, 2, -3]} intensity={1.2} color="#FF5A36" />
            <pointLight position={[-3, 2, 3]} intensity={1.2} color="#00F0FF" />
          </>
        );
    }
  };

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [2.6, 1.8, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {renderLighting()}
        <CustomizableKartModel options={options} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2.2}
          maxDistance={5.5}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={0.2}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

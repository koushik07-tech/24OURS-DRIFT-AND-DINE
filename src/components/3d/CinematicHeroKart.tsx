"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { soundEngine } from "@/lib/soundEngine";
import { Zap, Sun, Moon, Sunset, RotateCw, Volume2, VolumeX, FastForward, Play, ShieldAlert } from "lucide-react";

export type EnvironmentMode = "day" | "sunset" | "night";
export type QualityLevel = "low" | "medium" | "high";

interface CinematicKartProps {
  envMode?: EnvironmentMode;
  quality?: QualityLevel;
  primaryColor?: string;
  isCinemaPlaying?: boolean;
  onCinemaComplete?: () => void;
  onCinemaSkip?: () => void;
  interactive?: boolean;
}

// =========================================================================
// REALISTIC 3D GO-KART MESH WITH DETAILED TIRES, COCKPIT & SUSPENSION
// =========================================================================
interface KartMeshProps {
  primaryColor: string;
  envMode: EnvironmentMode;
  quality: QualityLevel;
  steeringAngle: number;
  wheelSpeed: number;
  engineRev: number;
  headlightsOn: boolean;
  underglowColor: string;
}

function RealisticKartMesh({
  primaryColor,
  envMode,
  quality,
  steeringAngle,
  wheelSpeed,
  engineRev,
  headlightsOn,
  underglowColor,
}: KartMeshProps) {
  const kartRootRef = useRef<THREE.Group>(null);
  const frontLeftWheelRef = useRef<THREE.Group>(null);
  const frontRightWheelRef = useRef<THREE.Group>(null);
  const rearLeftWheelRef = useRef<THREE.Group>(null);
  const rearRightWheelRef = useRef<THREE.Group>(null);
  const steeringYokeRef = useRef<THREE.Group>(null);
  const exhaustGlowRef = useRef<THREE.Mesh>(null);

  // PBR Materials
  const materials = useMemo(() => {
    const isNight = envMode === "night";
    return {
      chassisCarbon: new THREE.MeshStandardMaterial({
        color: 0x14161d,
        roughness: 0.28,
        metalness: 0.85,
      }),
      bodyPaint: new THREE.MeshStandardMaterial({
        color: primaryColor,
        roughness: 0.18,
        metalness: 0.65,
      }),
      chromeMetal: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.1,
        metalness: 0.98,
      }),
      caliperMat: new THREE.MeshStandardMaterial({
        color: 0xff3b14,
        roughness: 0.25,
        metalness: 0.5,
        emissive: 0x4a1208,
      }),
      slickRubber: new THREE.MeshStandardMaterial({
        color: 0x161821,
        roughness: 0.75,
        metalness: 0.12,
      }),
      glassShield: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.92,
        opacity: 1,
        transparent: true,
        roughness: 0.08,
        ior: 1.52,
        reflectivity: 0.9,
      }),
      headlightGlow: new THREE.MeshBasicMaterial({
        color: headlightsOn ? (isNight ? 0xd0f0ff : 0xffffff) : 0x334155,
      }),
      brakeLightGlow: new THREE.MeshBasicMaterial({
        color: 0xff1e00,
      }),
      underglowMat: new THREE.MeshBasicMaterial({
        color: underglowColor,
      }),
      displayLED: new THREE.MeshBasicMaterial({
        color: 0x10b981,
      }),
    };
  }, [primaryColor, envMode, headlightsOn, underglowColor]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle engine vibration & suspension breathing
    if (kartRootRef.current) {
      const vibration = Math.sin(t * (30 + engineRev * 40)) * (0.002 + engineRev * 0.005);
      kartRootRef.current.position.y = -0.22 + vibration;
    }

    // Spin wheels
    if (rearLeftWheelRef.current && rearRightWheelRef.current) {
      rearLeftWheelRef.current.rotation.x += delta * wheelSpeed;
      rearRightWheelRef.current.rotation.x += delta * wheelSpeed;
    }
    if (frontLeftWheelRef.current && frontRightWheelRef.current) {
      frontLeftWheelRef.current.children[0].rotation.x += delta * wheelSpeed;
      frontRightWheelRef.current.children[0].rotation.x += delta * wheelSpeed;

      // Realistic Ackerman steering angle
      frontLeftWheelRef.current.rotation.y = THREE.MathUtils.lerp(
        frontLeftWheelRef.current.rotation.y,
        steeringAngle * 0.7,
        0.1
      );
      frontRightWheelRef.current.rotation.y = THREE.MathUtils.lerp(
        frontRightWheelRef.current.rotation.y,
        steeringAngle * 0.7,
        0.1
      );
    }

    // Steering yoke rotates with steering angle
    if (steeringYokeRef.current) {
      steeringYokeRef.current.rotation.z = THREE.MathUtils.lerp(
        steeringYokeRef.current.rotation.z,
        -steeringAngle * 1.4,
        0.12
      );
    }

    // Exhaust pulsing
    if (exhaustGlowRef.current) {
      const pulse = 1 + Math.sin(t * 18) * 0.15 * engineRev;
      exhaustGlowRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group ref={kartRootRef} position={[0, -0.22, 0]} scale={1.2}>
      {/* 1. MAIN CHASSIS FLOOR & TUB */}
      <mesh position={[0, 0.08, 0]} castShadow={quality !== "low"}>
        <boxGeometry args={[1.55, 0.08, 3.2]} />
        <primitive object={materials.chassisCarbon} attach="material" />
      </mesh>

      {/* Underglow LED Tube */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[1.1, 0.02, 2.5]} />
        <primitive object={materials.underglowMat} attach="material" />
      </mesh>

      {/* Tubular Chromoly Outer Perimeter Nerf Bumper */}
      <mesh position={[0, 0.18, 0]}>
        <torusGeometry args={[1.45, 0.045, 12, 36]} />
        <primitive object={materials.chromeMetal} attach="material" />
      </mesh>

      {/* 2. AERODYNAMIC FRONT NOSE CONE & SPLITTER */}
      <mesh position={[0, 0.15, 1.4]} rotation={[0.15, 0, 0]} castShadow={quality !== "low"}>
        <cylinderGeometry args={[0.38, 0.75, 1.3, 16]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>

      {/* Front Racing Splitter Wing */}
      <mesh position={[0, 0.06, 1.95]} castShadow={quality !== "low"}>
        <boxGeometry args={[2.35, 0.05, 0.45]} />
        <primitive object={materials.chassisCarbon} attach="material" />
      </mesh>
      {/* Endplates */}
      <mesh position={[-1.18, 0.16, 1.95]}>
        <boxGeometry args={[0.04, 0.26, 0.45]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>
      <mesh position={[1.18, 0.16, 1.95]}>
        <boxGeometry args={[0.04, 0.26, 0.45]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>

      {/* 3. SIDE PODS (LEFT & RIGHT AIR INTAKES) */}
      <mesh position={[-0.88, 0.18, 0.05]} castShadow={quality !== "low"}>
        <boxGeometry args={[0.38, 0.28, 1.8]} />
        <primitive object={materials.chassisCarbon} attach="material" />
      </mesh>
      <mesh position={[0.88, 0.18, 0.05]} castShadow={quality !== "low"}>
        <boxGeometry args={[0.38, 0.28, 1.8]} />
        <primitive object={materials.chassisCarbon} attach="material" />
      </mesh>
      {/* Pod Livery Decals */}
      <mesh position={[-1.08, 0.18, 0.05]}>
        <boxGeometry args={[0.03, 0.12, 1.6]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>
      <mesh position={[1.08, 0.18, 0.05]}>
        <boxGeometry args={[0.03, 0.12, 1.6]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>

      {/* 4. COCKPIT: BUCKET SEAT & TITANIUM ROLL HOOP */}
      <mesh position={[0, 0.42, -0.32]} rotation={[-0.25, 0, 0]} castShadow={quality !== "low"}>
        <boxGeometry args={[0.68, 0.72, 0.45]} />
        <primitive object={materials.chassisCarbon} attach="material" />
      </mesh>
      {/* Roll Hoop Bar */}
      <mesh position={[0, 0.78, -0.58]} castShadow={quality !== "low"}>
        <torusGeometry args={[0.32, 0.04, 12, 24]} />
        <primitive object={materials.chromeMetal} attach="material" />
      </mesh>

      {/* Steering Column & Formula Yoke */}
      <group position={[0, 0.32, 0.4]} rotation={[0.48, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.65, 12]} />
          <primitive object={materials.chassisCarbon} attach="material" />
        </mesh>
        <group ref={steeringYokeRef} position={[0, 0.32, 0]}>
          {/* Steering Yoke Body */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.2, 0.03, 8, 16, Math.PI * 1.6]} />
            <primitive object={materials.bodyPaint} attach="material" />
          </mesh>
          {/* Center Digital Telemetry Display */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[0.18, 0.1, 0.02]} />
            <primitive object={materials.chassisCarbon} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.035]}>
            <boxGeometry args={[0.14, 0.06, 0.01]} />
            <primitive object={materials.displayLED} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Liquid Glass Aero Windshield */}
      <mesh position={[0, 0.42, 0.72]} rotation={[-0.32, 0, 0]}>
        <cylinderGeometry args={[0.55, 0.65, 0.48, 24, 1, true, -Math.PI * 0.42, Math.PI * 0.84]} />
        <primitive object={materials.glassShield} attach="material" />
      </mesh>

      {/* 5. SUSPENSION WISHBONES (Visible Front Left & Right) */}
      <mesh position={[-0.6, 0.1, 1.25]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <primitive object={materials.chromeMetal} attach="material" />
      </mesh>
      <mesh position={[0.6, 0.1, 1.25]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <primitive object={materials.chromeMetal} attach="material" />
      </mesh>

      {/* 6. WHEELS & DRIFT BRAKES */}
      {/* Front Left */}
      <group ref={frontLeftWheelRef} position={[-0.98, 0.12, 1.25]}>
        <group>
          {/* Tire */}
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow={quality !== "low"}>
            <torusGeometry args={[0.38, 0.18, 16, 28]} />
            <primitive object={materials.slickRubber} attach="material" />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.34, 0.34, 0.28, 20]} />
            <primitive object={materials.chassisCarbon} attach="material" />
          </mesh>
          {/* Drilled Chrome Brake Rotor */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.02, 24]} />
            <primitive object={materials.chromeMetal} attach="material" />
          </mesh>
          {/* Racing Caliper */}
          <mesh position={[-0.05, 0.16, 0]}>
            <boxGeometry args={[0.1, 0.18, 0.15]} />
            <primitive object={materials.caliperMat} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Front Right */}
      <group ref={frontRightWheelRef} position={[0.98, 0.12, 1.25]}>
        <group>
          <mesh rotation={[0, Math.PI / 2, 0]} castShadow={quality !== "low"}>
            <torusGeometry args={[0.38, 0.18, 16, 28]} />
            <primitive object={materials.slickRubber} attach="material" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.34, 0.34, 0.28, 20]} />
            <primitive object={materials.chassisCarbon} attach="material" />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.02, 24]} />
            <primitive object={materials.chromeMetal} attach="material" />
          </mesh>
          <mesh position={[0.05, 0.16, 0]}>
            <boxGeometry args={[0.1, 0.18, 0.15]} />
            <primitive object={materials.caliperMat} attach="material" />
          </mesh>
        </group>
      </group>

      {/* Rear Left (Wider Track) */}
      <group ref={rearLeftWheelRef} position={[-1.08, 0.14, -0.95]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow={quality !== "low"}>
          <torusGeometry args={[0.42, 0.22, 16, 28]} />
          <primitive object={materials.slickRubber} attach="material" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.35, 20]} />
          <primitive object={materials.chassisCarbon} attach="material" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />
          <primitive object={materials.chromeMetal} attach="material" />
        </mesh>
        <mesh position={[-0.05, 0.18, 0]}>
          <boxGeometry args={[0.12, 0.2, 0.16]} />
          <primitive object={materials.caliperMat} attach="material" />
        </mesh>
      </group>

      {/* Rear Right */}
      <group ref={rearRightWheelRef} position={[1.08, 0.14, -0.95]}>
        <mesh rotation={[0, Math.PI / 2, 0]} castShadow={quality !== "low"}>
          <torusGeometry args={[0.42, 0.22, 16, 28]} />
          <primitive object={materials.slickRubber} attach="material" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.35, 20]} />
          <primitive object={materials.chassisCarbon} attach="material" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 24]} />
          <primitive object={materials.chromeMetal} attach="material" />
        </mesh>
        <mesh position={[0.05, 0.18, 0]}>
          <boxGeometry args={[0.12, 0.2, 0.16]} />
          <primitive object={materials.caliperMat} attach="material" />
        </mesh>
      </group>

      {/* 7. REAR HIGH-DOWNFORCE WING & DIFFUSER */}
      <mesh position={[-0.55, 0.52, -1.35]}>
        <boxGeometry args={[0.04, 0.45, 0.15]} />
        <primitive object={materials.chassisCarbon} attach="material" />
      </mesh>
      <mesh position={[0.55, 0.52, -1.35]}>
        <boxGeometry args={[0.04, 0.45, 0.15]} />
        <primitive object={materials.chassisCarbon} attach="material" />
      </mesh>
      <mesh position={[0, 0.74, -1.35]} castShadow={quality !== "low"}>
        <boxGeometry args={[2.1, 0.05, 0.45]} />
        <primitive object={materials.bodyPaint} attach="material" />
      </mesh>

      {/* Rear Diffuser Vanes */}
      <mesh position={[0, 0.05, -1.35]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[1.3, 0.18, 0.6]} />
        <primitive object={materials.chassisCarbon} attach="material" />
      </mesh>

      {/* Dual Thruster Exhausts */}
      <mesh position={[-0.28, 0.15, -1.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
        <primitive object={materials.chromeMetal} attach="material" />
      </mesh>
      <mesh position={[0.28, 0.15, -1.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
        <primitive object={materials.chromeMetal} attach="material" />
      </mesh>

      {/* Pulsing Exhaust Glow Rings */}
      <mesh ref={exhaustGlowRef} position={[-0.28, 0.15, -1.71]}>
        <ringGeometry args={[0.04, 0.11, 16]} />
        <primitive object={materials.brakeLightGlow} attach="material" />
      </mesh>
      <mesh position={[0.28, 0.15, -1.71]}>
        <ringGeometry args={[0.04, 0.11, 16]} />
        <primitive object={materials.brakeLightGlow} attach="material" />
      </mesh>

      {/* 8. LIGHTING: PROJECTOR HEADLIGHTS & BRAKE LIGHTS */}
      <mesh position={[-0.65, 0.22, 1.75]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <primitive object={materials.headlightGlow} attach="material" />
      </mesh>
      <mesh position={[0.65, 0.22, 1.75]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <primitive object={materials.headlightGlow} attach="material" />
      </mesh>

      {headlightsOn && (
        <>
          <spotLight
            position={[-0.65, 0.25, 1.8]}
            target-position={[-0.65, 0, 8]}
            angle={0.4}
            penumbra={0.6}
            intensity={envMode === "night" ? 5.5 : 2.5}
            color={0xd0f0ff}
            distance={18}
          />
          <spotLight
            position={[0.65, 0.25, 1.8]}
            target-position={[0.65, 0, 8]}
            angle={0.4}
            penumbra={0.6}
            intensity={envMode === "night" ? 5.5 : 2.5}
            color={0xd0f0ff}
            distance={18}
          />
        </>
      )}

      {/* Rear Brake Light Bar */}
      <mesh position={[0, 0.26, -1.6]}>
        <boxGeometry args={[0.85, 0.04, 0.04]} />
        <primitive object={materials.brakeLightGlow} attach="material" />
      </mesh>
    </group>
  );
}

// =========================================================================
// CINEMATIC RACING COMMERCIAL CAMERA CONTROLLER
// 0-1s: Dark
// 1-2s: Headlights illuminate
// 2-4s: Front low-angle push-in
// 4-6s: Orbital pan over cockpit
// 6-8s: Engine starts with vibration & wheel spin
// 8-10s: Camera follows kart towards track
// =========================================================================
interface CameraDirectorProps {
  isCinemaPlaying: boolean;
  onCinemaComplete?: () => void;
  mousePos: { x: number; y: number };
  interactive: boolean;
}

function CameraDirector({
  isCinemaPlaying,
  onCinemaComplete,
  mousePos,
  interactive,
}: CameraDirectorProps) {
  const { camera } = useThree();
  const startTimeRef = useRef<number | null>(null);

  useFrame((state) => {
    if (!startTimeRef.current && isCinemaPlaying) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    if (isCinemaPlaying && startTimeRef.current !== null) {
      const elapsed = state.clock.getElapsedTime() - startTimeRef.current;

      if (elapsed < 1.0) {
        // Phase 1 (0-1s): Low far distance dark screen
        camera.position.set(0, 0.2, 12);
        camera.lookAt(0, 0, 0);
      } else if (elapsed < 3.5) {
        // Phase 2 (1-3.5s): Camera approaches front fascia
        const p = (elapsed - 1.0) / 2.5;
        const easeP = p * p * (3 - 2 * p); // smoothstep
        camera.position.set(
          THREE.MathUtils.lerp(0, -1.2, easeP),
          THREE.MathUtils.lerp(0.2, 0.45, easeP),
          THREE.MathUtils.lerp(12, 5.2, easeP)
        );
        camera.lookAt(0, 0.1, 0);
      } else if (elapsed < 6.5) {
        // Phase 3 (3.5-6.5s): Sweeping orbital pan around side pod to cockpit
        const p = (elapsed - 3.5) / 3.0;
        const angle = -0.3 + p * 1.8;
        const dist = 6.2;
        camera.position.set(
          Math.sin(angle) * dist,
          1.2 + Math.sin(p * Math.PI) * 0.4,
          Math.cos(angle) * dist
        );
        camera.lookAt(0, 0.2, 0);
      } else if (elapsed < 8.5) {
        // Phase 4 (6.5-8.5s): Rear low-angle track camera following kart acceleration
        const p = (elapsed - 6.5) / 2.0;
        camera.position.set(
          Math.sin(p * 0.5) * 0.4,
          0.85,
          THREE.MathUtils.lerp(-4.5, -6.8, p)
        );
        camera.lookAt(0, 0.3, 2.5);
      } else if (elapsed < 10.0) {
        // Phase 5 (8.5-10s): Smooth transition into final interactive hero pose
        const p = (elapsed - 8.5) / 1.5;
        const easeP = p * p * (3 - 2 * p);
        camera.position.set(
          THREE.MathUtils.lerp(0, 0, easeP),
          THREE.MathUtils.lerp(0.85, 0.6, easeP),
          THREE.MathUtils.lerp(-6.8, 8.8, easeP)
        );
        camera.lookAt(0, 0.1, 0);
      } else {
        // Cinema complete!
        if (onCinemaComplete) onCinemaComplete();
      }
    } else if (interactive) {
      // Interactive Parallax mouse tracking
      const targetCamX = mousePos.x * 1.4;
      const targetCamY = 0.6 + -mousePos.y * 0.8;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamY, 0.05);
      camera.lookAt(0, 0.05, 0);
    }
  });

  return null;
}

// =========================================================================
// MAIN EXPORTED COMPONENT: CINEMATIC HERO KART
// =========================================================================
export default function CinematicHeroKart({
  envMode = "sunset",
  quality = "high",
  primaryColor = "#FF5A36",
  isCinemaPlaying = false,
  onCinemaComplete,
  onCinemaSkip,
  interactive = true,
}: CinematicKartProps) {
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [steeringAngle, setSteeringAngle] = useState(0);
  const [wheelSpeed, setWheelSpeed] = useState(6);
  const [engineRev, setEngineRev] = useState(0.2);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAudioEnabled, setIsAudioEnabled] = useState(!soundEngine.getMuted());
  const [cinemaActive, setCinemaActive] = useState(isCinemaPlaying);
  const [underglow, setUnderglow] = useState("#FF5A36");

  useEffect(() => {
    setCinemaActive(isCinemaPlaying);
  }, [isCinemaPlaying]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    setMousePos({ x, y });
    setSteeringAngle(x * 0.45);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((touch.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePos({ x, y });
      setSteeringAngle(x * 0.45);
    }
  };

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsAudioEnabled(!muted);
    if (!muted) {
      soundEngine.playEngineRev(550);
    }
  };

  const triggerBoost = () => {
    soundEngine.playBoostSound();
    setEngineRev(1.0);
    setWheelSpeed(24);
    setTimeout(() => {
      setEngineRev(0.2);
      setWheelSpeed(6);
    }, 1200);
  };

  const handleSkipCinema = () => {
    setCinemaActive(false);
    if (onCinemaSkip) onCinemaSkip();
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] lg:h-[600px] select-none"
    >
      <Canvas
        shadows={quality !== "low"}
        gl={{
          antialias: quality !== "low",
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={quality === "low" ? 1 : Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 2, 2)}
      >
        <PerspectiveCamera makeDefault position={[0, 0.6, 8.8]} fov={40} />

        {/* Ambient & Studio Directional Lighting */}
        <ambientLight intensity={envMode === "day" ? 1.2 : envMode === "sunset" ? 0.8 : 0.4} />

        {/* Key Lighting according to Environment Mode */}
        {envMode === "day" && (
          <>
            <directionalLight position={[6, 8, 5]} intensity={2.8} castShadow={quality !== "low"} />
            <directionalLight position={[-6, 4, -4]} intensity={1.2} color="#94a3b8" />
          </>
        )}
        {envMode === "sunset" && (
          <>
            <directionalLight position={[-7, 5, 4]} intensity={3.5} color="#FF5A36" castShadow={quality !== "low"} />
            <directionalLight position={[7, 3, 3]} intensity={2.5} color="#F59E0B" />
            <pointLight position={[0, 4, 0]} intensity={1.5} color="#f97316" />
          </>
        )}
        {envMode === "night" && (
          <>
            <directionalLight position={[0, 10, 0]} intensity={1.4} color="#38bdf8" />
            <pointLight position={[-4, 2, 3]} intensity={2.8} color="#FF5A36" />
            <pointLight position={[4, 2, 3]} intensity={2.2} color="#00f0ff" />
          </>
        )}

        {/* Floor Contact Shadow */}
        <ContactShadows
          position={[0, -0.23, 0]}
          opacity={quality === "low" ? 0.4 : 0.75}
          scale={10}
          blur={1.8}
          far={4}
        />

        {/* 3D Realistic Kart */}
        <Suspense fallback={null}>
          <RealisticKartMesh
            primaryColor={primaryColor}
            envMode={envMode}
            quality={quality}
            steeringAngle={steeringAngle}
            wheelSpeed={wheelSpeed}
            engineRev={engineRev}
            headlightsOn={headlightsOn}
            underglowColor={underglow}
          />
        </Suspense>

        {/* Cinematic Director or Orbit Controls */}
        <CameraDirector
          isCinemaPlaying={cinemaActive}
          onCinemaComplete={() => {
            setCinemaActive(false);
            if (onCinemaComplete) onCinemaComplete();
          }}
          mousePos={mousePos}
          interactive={interactive && !cinemaActive}
        />

        {/* Orbit Drag Controls enabled in interactive mode */}
        {interactive && !cinemaActive && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={Math.PI / 3}
            maxAzimuthAngle={Math.PI * 0.45}
            minAzimuthAngle={-Math.PI * 0.45}
            dampingFactor={0.05}
          />
        )}
      </Canvas>

      {/* Floating 3D Interactive Telemetry Controls */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-2 pointer-events-auto">
        {/* Skip Cinema Button */}
        {cinemaActive && (
          <button
            onClick={handleSkipCinema}
            className="px-4 py-1.5 rounded-full liquid-glass text-white text-xs font-mono font-bold flex items-center gap-1.5 border border-white/20 hover:border-coral transition-all shadow-lg animate-pulse"
          >
            <FastForward className="w-3.5 h-3.5 text-coral" />
            <span>SKIP INTRO</span>
          </button>
        )}

        {/* Boost Nitro Button */}
        <button
          onClick={triggerBoost}
          className="px-3.5 py-1.5 rounded-full liquid-glass hover:border-coral/60 text-xs font-mono font-bold text-white flex items-center gap-1.5 transition-all shadow-lg group"
          title="Push to Pass Boost"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-125 transition-transform" />
          <span>NITRO BOOST</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="px-3 py-1.5 rounded-full liquid-glass hover:border-coral/60 text-xs font-mono text-zinc-300 hover:text-white transition-all shadow-lg flex items-center gap-1"
          aria-label="Toggle 3D Audio"
        >
          {isAudioEnabled ? (
            <Volume2 className="w-3.5 h-3.5 text-coral animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span className="text-[10px] hidden sm:inline">{isAudioEnabled ? "AUDIO ON" : "AUDIO MUTED"}</span>
        </button>
      </div>
    </div>
  );
}

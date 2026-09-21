"use client";

import { useState, useEffect } from "react";

export type DeviceTier = "high" | "medium" | "low";

export interface DeviceCapability {
  hasWebGL: boolean;
  hasWebGL2: boolean;
  isMobile: boolean;
  tier: DeviceTier;
  maxDPR: number;
  particleMultiplier: number;
  recommendedFps: number;
}

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>({
    hasWebGL: true,
    hasWebGL2: true,
    isMobile: false,
    tier: "high",
    maxDPR: 2,
    particleMultiplier: 1.0,
    recommendedFps: 60,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let webgl = false;
    let webgl2 = false;

    try {
      const canvas = document.createElement("canvas");
      webgl2 = !!canvas.getContext("webgl2");
      webgl = webgl2 || !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      webgl = false;
      webgl2 = false;
    }

    const isMobile = window.innerWidth < 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;

    let tier: DeviceTier = "high";
    let maxDPR = window.devicePixelRatio || 1;
    let particleMultiplier = 1.0;
    let recommendedFps = 60;

    if (!webgl) {
      tier = "low";
      particleMultiplier = 0.25;
      recommendedFps = 30;
      maxDPR = 1;
    } else if (isMobile || cores <= 4) {
      tier = "medium";
      particleMultiplier = 0.55;
      recommendedFps = 45;
      maxDPR = Math.min(maxDPR, 1.5);
    } else {
      tier = "high";
      particleMultiplier = 1.0;
      recommendedFps = 60;
      maxDPR = Math.min(maxDPR, 2);
    }

    setCapability({
      hasWebGL: webgl,
      hasWebGL2: webgl2,
      isMobile,
      tier,
      maxDPR,
      particleMultiplier,
      recommendedFps,
    });
  }, []);

  return capability;
}

export default useDeviceCapability;

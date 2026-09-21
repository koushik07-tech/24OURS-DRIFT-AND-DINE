import { mediaConfig } from "@/config/media";

export const mediaRegistry = {
  ...mediaConfig,
  facilities: [
    {
      id: "karting-circuit",
      name: "Electric Grand Prix Circuit",
      category: "Motorsport",
      position: [-2.5, 0.2, 1.2] as [number, number, number],
      tagline: "High-Speed Electric Go-Karting",
      description: "Dual-motor electric racing karts with 85 km/h top velocity, RFID telemetry, and spring-absorption barrier walls.",
      color: "#E10600",
      accent: "rgba(225, 6, 0, 0.4)",
    },
    {
      id: "sky-dining",
      name: "360° Sky Dining Tower",
      category: "Hospitality",
      position: [0, 1.8, -1.5] as [number, number, number],
      tagline: "Suspended Horizon Restaurant & Lounge",
      description: "Elevated 360-degree panoramic vantage point overlooking the Bengaluru-Malur corridor with curated global gastronomy.",
      color: "#FFB800",
      accent: "rgba(255, 184, 0, 0.4)",
    },
    {
      id: "rc-arena",
      name: "Pro-Scale RC Arena",
      category: "Racing",
      position: [2.6, 0.1, 1.5] as [number, number, number],
      tagline: "1:8 & 1:16 Off-Road Competition Raceway",
      description: "Championship multi-surface clay and asphalt raceway with elevated crossover jumps and laser transponders.",
      color: "#00E5FF",
      accent: "rgba(0, 229, 255, 0.4)",
    },
    {
      id: "vr-simulators",
      name: "VR Full-Motion Racing Dome",
      category: "Virtual Reality",
      position: [2.2, 0.3, -1.8] as [number, number, number],
      tagline: "6-DOF Hexapod Hydraulic Racing Pods",
      description: "FIA-certified bucket cockpits with 2.5G surge force and zero-latency haptic force feedback.",
      color: "#A855F7",
      accent: "rgba(168, 85, 247, 0.4)",
    },
    {
      id: "banquet-halls",
      name: "Grand Banquet & Event Ballrooms",
      category: "Celebration",
      position: [-2.2, 0.4, -1.9] as [number, number, number],
      tagline: "Modular Celebration & Corporate Architecture",
      description: "Sprawling luxury halls for corporate offsites, automotive launches, retreats, and weddings.",
      color: "#10B981",
      accent: "rgba(16, 185, 129, 0.4)",
    },
  ],
};

export default mediaRegistry;

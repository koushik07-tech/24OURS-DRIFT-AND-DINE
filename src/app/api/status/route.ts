import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    project: "24OURS — Drift and Dine",
    tagline: "RACE. PLAY. DINE. CELEBRATE.",
    phase: "Pre-Launch & Construction",
    location: {
      city: "Chikkaballapura",
      state: "Karnataka",
      country: "India",
      coordinates: "13.4325° N, 77.7275° E",
    },
    status: "Healthy",
    timestamp: new Date().toISOString(),
  });
}

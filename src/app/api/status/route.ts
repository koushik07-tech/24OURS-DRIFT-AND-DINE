import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    project: "24OURS — Drift and Dine",
    tagline: "RACE. PLAY. DINE. CELEBRATE.",
    phase: "Pre-Launch & Construction",
    location: {
      city: "Malur, Kolar",
      state: "Karnataka",
      country: "India",
      coordinates: "13.0039° N, 77.9406° E",
    },
    status: "Healthy",
    timestamp: new Date().toISOString(),
  });
}

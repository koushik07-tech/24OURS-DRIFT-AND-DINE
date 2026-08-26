export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res.status(200).json({
    project: "24OURS — Drift and Dine",
    tagline: "RACE. PLAY. DINE. CELEBRATE.",
    phase: "Pre-Launch & Construction",
    location: {
      city: "Chikkaballapura",
      state: "Karnataka",
      country: "India",
      coordinates: "13.4325° N, 77.7275° E",
    },
    platform: "Vercel Serverless Edge",
    status: "Healthy",
    timestamp: new Date().toISOString(),
  });
}

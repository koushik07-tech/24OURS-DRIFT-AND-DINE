import { Router } from 'express';

const router = Router();

// GET /api/status - Returns destination pre-launch state & API health
router.get('/', (req, res) => {
  res.status(200).json({
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
});

export default router;

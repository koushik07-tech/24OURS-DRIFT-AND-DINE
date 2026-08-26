import express from 'express';
import cors from 'cors';
import subscribeRoutes from './routes/subscribe.js';
import statusRoutes from './routes/status.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/subscribe', subscribeRoutes);
app.use('/api/status', statusRoutes);

// Fallback route
app.get('/', (req, res) => {
  res.json({
    message: "24OURS — Drift and Dine API Service",
    status: "Active",
    endpoints: [
      "GET  /api/status",
      "POST /api/subscribe",
      "GET  /api/subscribe/count",
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🏁 24OURS Backend running on http://localhost:${PORT}`);
});

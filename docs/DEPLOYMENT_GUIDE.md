# Production Deployment Guide — 24OURS Drift & Dine

This document provides deployment guidelines for hosting the **24OURS — Drift & Dine** Next.js platform.

---

## 1. Prerequisites

- **Node.js**: `v18.x` or `v20.x` LTS.
- **PostgreSQL**: PostgreSQL 14+ database instance (Supabase, Neon, AWS RDS, or self-hosted).
- **Package Manager**: `npm` (v9+).

---

## 2. Standard Deployment Steps

### Step 1: Install Dependencies
```bash
npm ci --legacy-peer-deps
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` or set environment variables in your deployment platform settings (Vercel, AWS Amplify, Docker, Railway, etc.).

### Step 3: Run Database Migrations
```bash
npx prisma migrate deploy
```
*(Or `npx prisma db push` for new schema initialization)*

### Step 4: Generate Prisma Client
```bash
npx prisma generate
```

### Step 5: Build Next.js Application
```bash
npm run build
```

### Step 6: Start Production Server
```bash
npm start
```

---

## 3. Post-Deployment Verification Checklist

1. Access `GET /api/health` — confirm `"status": "ok"` and `"database": "connected"`.
2. Access `GET /admin` with Admin credentials — confirm dashboard KPIs load.
3. Perform a test reservation booking and confirm pass generation.
4. Scan the generated QR code — confirm `GET /verify/<CODE>` returns authenticated status.
5. Verify Razorpay webhook delivery in Razorpay Dashboard.

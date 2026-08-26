# Staging Deployment Runbook — 24OURS Drift & Dine

This document details the configuration and deployment sequence for the **Staging Environment** on Vercel with a managed PostgreSQL database (Supabase / Neon) and Razorpay Test Mode.

---

## 1. Staging Environment Variables

Configure these in **Vercel → Project Settings → Environment Variables** (Scope: `Preview` & `Production` for Staging branch):

```bash
# ------------------------------------------------------------------------------
# Core Runtime & URLs
# ------------------------------------------------------------------------------
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://staging.24oursdriftanddine.com" # Or your vercel.app preview domain

# ------------------------------------------------------------------------------
# PostgreSQL Database (Staging Database - Server-Only)
# ------------------------------------------------------------------------------
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/[DB]?schema=public&sslmode=require"

# ------------------------------------------------------------------------------
# Authentication & JWT Secrets (Server-Only, Min 32 characters)
# ------------------------------------------------------------------------------
AUTH_SECRET="staging_auth_secret_minimum_32_characters_long_random_key"
AUTH_EXPIRES_IN="7d"

# ------------------------------------------------------------------------------
# Razorpay Test Mode Credentials (STAGING / TEST KEYS ONLY)
# ------------------------------------------------------------------------------
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_test_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_test_webhook_secret"

# ------------------------------------------------------------------------------
# Resend Transactional Email (Server-Only)
# ------------------------------------------------------------------------------
RESEND_API_KEY="re_staging_test_key"
EMAIL_FROM="24OURS Staging <bookings@24oursdriftanddine.com>"
MANAGER_EMAIL="manager-staging@24oursdriftanddine.com"
```

> **IMPORTANT**:
> - Use **Razorpay Test Mode keys** (`rzp_test_...`) for staging verification.
> - Never use live banking or live secret keys in staging environments.

---

## 2. Remote Database Setup & Migration (Fresh Database)

Execute these commands from your terminal pointing `DATABASE_URL` to your staging database:

```bash
# 1. Apply all Prisma schema migrations to the fresh PostgreSQL instance
npx prisma migrate deploy

# 2. Seed initial experiences, packages, vehicle telemetry, and sample offers
npx tsx prisma/seed.ts
```

---

## 3. Vercel Project Configuration

1. **Framework Preset**: Next.js
2. **Root Directory**: `24OURS-DRIFT-AND-DINE-main` (the nested project folder)
3. **Build Command**: `prisma generate && next build` (Configured automatically via `package.json`)
4. **Output Directory**: `.next`
5. **Install Command**: `npm ci --legacy-peer-deps`

---

## 4. Razorpay Test Webhook Configuration

1. In [Razorpay Dashboard](https://dashboard.razorpay.com/) (Ensure **Test Mode** toggle is ON):
2. Navigate to **Settings → Webhooks → Add New Webhook**.
3. **Webhook URL**:
   ```text
   https://staging.24oursdriftanddine.com/api/payments/webhook
   ```
4. **Secret**: Enter your `RAZORPAY_WEBHOOK_SECRET`.
5. **Active Events**:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`

---

## 5. Staging Verification Checklist

- [ ] `GET /api/health` returns HTTP 200 with `status: "ok"` and `database: "connected"`.
- [ ] Header renders the 28-minute countdown timer without hydration errors.
- [ ] Razorpay Checkout modal loads with test card/UPI simulator.
- [ ] Successful test payment marks booking `CONFIRMED` and payment `SUCCESS`.
- [ ] Digital boarding pass displays with valid QR code pointing to `/verify/[bookingCode]`.
- [ ] Public QR verification page confirms `AUTHENTICATED & VALID FOR ENTRY`.
- [ ] Admin console (`/admin`) displays test booking and aggregated revenue KPIs.

# Production Deployment & Live Operations Runbook — 24OURS Drift & Dine

This document serves as the single source of truth for deploying, configuring, and verifying the **24OURS — Drift & Dine** platform in a live production environment.

---

## 1. Required Production Environment Variables

Configure these variables in your hosting provider's secret manager (e.g. Vercel, AWS Secrets Manager, Render, Docker):

```bash
# ------------------------------------------------------------------------------
# Core Runtime & URLs
# ------------------------------------------------------------------------------
NODE_ENV="production"
PORT=3000
NEXT_PUBLIC_APP_URL="https://24oursdriftanddine.com"

# ------------------------------------------------------------------------------
# PostgreSQL Database (Server-Only)
# ------------------------------------------------------------------------------
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<database>?schema=public&sslmode=require"

# ------------------------------------------------------------------------------
# Authentication & JWT Secrets (Server-Only, Min 32 characters)
# ------------------------------------------------------------------------------
AUTH_SECRET="<generate-random-32-to-64-character-hex-or-base64-secret>"
AUTH_EXPIRES_IN="7d"

# ------------------------------------------------------------------------------
# Razorpay India Payment Gateway (Live Credentials, Server-Only)
# ------------------------------------------------------------------------------
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="<your-live-razorpay-key-secret>"
RAZORPAY_WEBHOOK_SECRET="<your-configured-webhook-secret>"

# ------------------------------------------------------------------------------
# Resend Transactional Email Service (Server-Only)
# ------------------------------------------------------------------------------
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
EMAIL_FROM="24OURS Concierge <bookings@24oursdriftanddine.com>"
MANAGER_EMAIL="manager@24oursdriftanddine.com"
```

> **SECURITY DIRECTIVE**:
> - Never prefix `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `AUTH_SECRET`, or `DATABASE_URL` with `NEXT_PUBLIC_`.
> - Never commit `.env` containing real production secrets to Git.

---

## 2. Database Migration Commands

To safely apply Prisma migrations to the production database without resetting or deleting historical data:

```bash
# 1. Validate Prisma schema syntax and model relations
npx prisma validate

# 2. Deploy all pending migration files cleanly
npx prisma migrate deploy

# 3. Generate the latest Prisma Client binaries
npx prisma generate
```

---

## 3. Razorpay Live Configuration & Webhooks

### Live Credentials
1. Switch your Razorpay Dashboard toggle to **Live Mode**.
2. Navigate to **Settings → API Keys** and generate a live Key ID and Secret.
3. Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to production environment variables.

### Webhook Configuration
1. Navigate to **Settings → Webhooks → Add New Webhook**.
2. Set Webhook URL:
   ```text
   https://24oursdriftanddine.com/api/payments/webhook
   ```
3. Set a strong secret and store in `RAZORPAY_WEBHOOK_SECRET`.
4. Enable events:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`

---

## 4. Build and Start Sequence

```bash
# Clean dependency install
npm ci --legacy-peer-deps

# Build production Next.js optimized artifacts
npm run build

# Start production Node.js cluster
npm start
```

---

## 5. Post-Deployment Verification Checklist

Execute this checklist immediately after deploying:

1. **System Health**:
   - `GET https://24oursdriftanddine.com/api/health`
   - Verify: HTTP 200 with `{"status": "ok", "database": "connected"}`.
2. **Live Payment Smoke Test**:
   - Create a test reservation for 1 guest on an open attraction slot.
   - Complete checkout with a live UPI / Card payment (₹1299).
   - Verify digital boarding pass is rendered with valid QR code.
3. **QR Pass Kiosk Scan**:
   - Open `https://24oursdriftanddine.com/verify/<BOOKING_CODE>`.
   - Verify: Displays `AUTHENTICATED & VALID FOR ENTRY`.
4. **Email Dispatch**:
   - Confirm customer receipt is delivered to test email.
   - Confirm manager dispatch is delivered to `manager@24oursdriftanddine.com`.
5. **Admin Operations**:
   - Log into `https://24oursdriftanddine.com/admin` with Admin account.
   - Verify live payment appears in the Pass Ledger with `CONFIRMED / SUCCESS`.

---

## 6. Rollback Guidance

If a deployment anomaly occurs:
1. Revert to previous Git deployment release tag in hosting dashboard.
2. If database migration needs rollback, run:
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```
3. Verify `/api/health` reports status `ok`.

---

## 7. Production Security Checklist

- [x] Zero secrets exposed via client bundles or `NEXT_PUBLIC_` variables.
- [x] Server-side price calculation enforced from database entity pricing.
- [x] HMAC-SHA256 signature verification for payments and webhooks.
- [x] Idempotent payment verification and deduplication protection.
- [x] Role-based access control protecting all `/api/admin/*` endpoints.
- [x] Customer booking isolation preventing unauthorized access.
- [x] Public ticket validation (`/verify/[code]`) with privacy redaction.

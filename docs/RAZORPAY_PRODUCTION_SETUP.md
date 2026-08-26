# Razorpay Production Payment Gateway & Webhook Configuration Guide

This guide details the step-by-step procedure for configuring Razorpay India payment processing for the **24OURS — Drift & Dine** production environment.

---

## 1. Razorpay Account Setup & API Credentials

1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Switch to **Live Mode** (top toggle).
3. Navigate to **Settings → API Keys**.
4. Click **Generate Key** to generate:
   - **Key Id** (e.g. `rzp_live_xxxxxxxxxxxxxx`)
   - **Key Secret** (e.g. `xxxxxxxxxxxxxxxxxxxxxxxx`)
5. Store the `Key Secret` in a secure secret manager (e.g. Vercel Secrets, AWS Secrets Manager).

---

## 2. Webhook Endpoint Configuration

1. In the Razorpay Dashboard, navigate to **Settings → Webhooks**.
2. Click **+ Add New Webhook**.
3. Enter your live production endpoint:
   ```text
   https://<YOUR_PRODUCTION_DOMAIN>/api/payments/webhook
   ```
4. Enter a strong secret in the **Secret** field. Save this as `RAZORPAY_WEBHOOK_SECRET`.
5. Under **Active Events**, select:
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
6. Click **Save Webhook**.

---

## 3. Environment Variables Configuration

In your production host (e.g. Vercel, AWS, Render, VPS), configure the following environment variables:

```bash
NODE_ENV="production"
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
AUTH_SECRET="<generate-random-32-char-string>"
RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="<your-live-key-secret>"
RAZORPAY_WEBHOOK_SECRET="<your-live-webhook-secret>"
NEXT_PUBLIC_APP_URL="https://<YOUR_PRODUCTION_DOMAIN>"
RESEND_API_KEY="re_xxxxxxxxxxxxxx"
EMAIL_FROM="24OURS Concierge <bookings@24oursdriftanddine.com>"
MANAGER_EMAIL="manager@24oursdriftanddine.com"
```

> **IMPORTANT**: `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are strictly server-only variables. They must never have a `NEXT_PUBLIC_` prefix and are never sent to the browser.

---

## 4. End-to-End Verification Sequence

After deploying your production application:

1. **Health Verification**:
   - Access `GET https://<YOUR_DOMAIN>/api/health` to confirm database connectivity (`"status": "ok"`).
2. **End-to-End Test Transaction**:
   - Make a test booking for a minimal attraction slot.
   - Proceed to Step 3 and click "Pay & Confirm Pass".
   - Complete payment with a live UPI / Card transaction.
3. **Database & Pass Audit**:
   - Verify `Booking.bookingStatus = CONFIRMED` and `Booking.paymentStatus = SUCCESS`.
   - Verify `Payment.status = SUCCESS` with populated `razorpayOrderId` and `razorpayPaymentId`.
   - Verify that the digital boarding pass displays with its QR code.
4. **Public Pass Verification**:
   - Navigate to `https://<YOUR_DOMAIN>/verify/<BOOKING_CODE>` to ensure the pass passes pit-lane kiosk authentication.
5. **Email Dispatches**:
   - Check customer inbox and manager notification inbox for confirmation receipts.

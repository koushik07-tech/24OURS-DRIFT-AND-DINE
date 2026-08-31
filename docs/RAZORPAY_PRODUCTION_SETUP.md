# Razorpay Production Payment Gateway & Webhook Configuration Guide

This guide details the step-by-step procedure for configuring **Razorpay India Live and Test payment processing** and **Resend transactional emails** for the **24OURS — Drift & Dine** production and staging environments on Vercel.

---

## 1. Razorpay Architecture Overview

The payment lifecycle is designed with strict server-side authority, idempotency, and defense-in-depth:

```
[User Browser]
      │
      │ 1. Create Booking (PENDING state in DB)
      ▼
[Next.js Server: POST /api/bookings]
      │
      │ 2. Create Razorpay Order (POST /api/payments/create-order)
      ▼
[Razorpay API: POST https://api.razorpay.com/v1/orders]
      │
      │ 3. Return orderId & keyId to Browser
      ▼
[Razorpay Standard Checkout Modal (checkout.js)]
      │
      │ 4. Customer Completes Payment (UPI / Card / NetBanking)
      ▼
[Razorpay Callback to Client: { razorpay_order_id, razorpay_payment_id, razorpay_signature }]
      │
      │ 5. Client Calls POST /api/payments/verify
      ▼
[Next.js Server Verification]
      │
      ├── 6. Verify HMAC-SHA256 signature using timingSafeEqual(expected, received)
      ├── 7. Guard against duplicate razorpayPaymentId reuse
      ├── 8. Atomic Prisma Transaction:
      │       - Booking: bookingStatus = CONFIRMED, paymentStatus = SUCCESS
      │       - Payment: status = SUCCESS, razorpayPaymentId, razorpayOrderId, razorpaySignature
      └── 9. Asynchronous Transactional Email:
              - Customer: Boarding pass with QR Code & receipt
              - Concierge / Manager: Booking notification alert
```

Additionally, **Razorpay Webhooks** (`POST /api/payments/webhook`) listen for asynchronous gateway events (`payment.captured`, `order.paid`, `payment.failed`, `refund.processed`) to handle edge cases (e.g., if a user closes the browser before the client verification callback completes).

---

## 2. Setting Up Razorpay API Credentials (Test vs Live)

1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Select your operating mode using the toggle in the header:
   - **Test Mode**: For local development and staging verification.
   - **Live Mode**: For real production customer transactions.
3. Navigate to **Settings → API Keys**.
4. Click **Generate Key**:
   - **Key ID**: Starts with `rzp_test_...` (Test) or `rzp_live_...` (Live).
   - **Key Secret**: 24+ character secret key.
5. Save these securely. **Never commit the `Key Secret` to source control.**

---

## 3. Configuring Razorpay Webhook Endpoint

1. In the Razorpay Dashboard, navigate to **Settings → Webhooks**.
2. Click **+ Add New Webhook**.
3. In **Webhook URL**, enter your public production or staging URL:
   ```text
   https://<YOUR_DOMAIN>/api/payments/webhook
   ```
4. Enter a strong secret in **Secret** (e.g. 32-character random string) and save this as `RAZORPAY_WEBHOOK_SECRET`.
5. Under **Active Events**, select the following events:
   - `payment.captured`
   - `order.paid`
   - `payment.failed`
   - `refund.processed`
   - `refund.created`
6. Click **Save Webhook**.

---

## 4. Configuring Transactional Emails (Resend)

1. Create a free account at [Resend](https://resend.com/).
2. Navigate to **API Keys** and generate an API key (`re_...`).
3. (For production) Add and verify your custom sending domain in **Domains** (e.g., `24oursdriftanddine.com`).
4. Configure DNS records (SPF, DKIM, DMARC) in your domain registrar.
5. Set `EMAIL_FROM` to an address on your verified domain (e.g., `24OURS Concierge <bookings@24oursdriftanddine.com>`).
6. Set `MANAGER_EMAIL` to your management / concierge inbox.

---

## 5. Vercel Environment Variables Configuration

In the **Vercel Dashboard → Project → Settings → Environment Variables**, add the following:

| Variable Name | Environment(s) | Sample / Recommended Value | Description |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Production, Preview | `production` | Enables production optimizations & strict gateway checks |
| `DATABASE_URL` | Production, Preview | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true` | Supabase Session Pooler URI |
| `DIRECT_URL` | Production, Preview | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres` | Supabase Direct Connection URI |
| `AUTH_SECRET` | Production, Preview | `min_32_chars_random_secret_here` | JWT authentication signing secret |
| `AUTH_EXPIRES_IN` | Production, Preview | `7d` | Token session validity |
| `RAZORPAY_KEY_ID` | Production | `rzp_live_xxxxxxxxxxxxxx` | Live Public Key ID |
| `RAZORPAY_KEY_ID` | Preview / Staging | `rzp_test_xxxxxxxxxxxxxx` | Test Public Key ID |
| `RAZORPAY_KEY_SECRET` | Production | `<live_secret>` | Strictly server-side Live Key Secret |
| `RAZORPAY_KEY_SECRET` | Preview / Staging | `<test_secret>` | Strictly server-side Test Key Secret |
| `RAZORPAY_WEBHOOK_SECRET`| Production, Preview | `<webhook_secret>` | Webhook HMAC verification secret |
| `NEXT_PUBLIC_APP_URL` | Production | `https://yourdomain.com` | Base URL for QR pass links & emails |
| `RESEND_API_KEY` | Production, Preview | `re_xxxxxxxxxxxxxx` | Resend transactional email API key |
| `EMAIL_FROM` | Production, Preview | `24OURS Concierge <bookings@yourdomain.com>` | Verified sender email address |
| `MANAGER_EMAIL` | Production, Preview | `manager@yourdomain.com` | Notification recipient for concierge desk |

---

## 6. End-to-End Live Verification Checklist

Once deployed to Vercel:

1. **Health Verification**:
   - Access `GET https://<YOUR_DOMAIN>/api/health` — confirm `"status": "ok"` and `"database": "connected"`.
2. **Catalog Verification**:
   - Access `GET https://<YOUR_DOMAIN>/api/experiences` — confirm all experiences & pricing load.
3. **Live Booking & Checkout**:
   - Select an experience on the homepage and open the booking modal.
   - Enter guest details and click **Pay & Confirm Pass**.
   - Verify that the official Razorpay Checkout modal appears with the branded `#e11d48` theme.
   - Complete a payment using UPI or Card.
4. **Pass & Ledger Confirmation**:
   - Confirm step 4 modal shows the generated **Boarding Pass** with QR code.
   - Check customer inbox for the **Confirmation & QR Pass Email**.
   - Check concierge inbox for the **Manager Dispatch Notification**.
5. **Kiosk Scan Verification**:
   - Open `https://<YOUR_DOMAIN>/verify/<BOOKING_CODE>` on a phone/browser to confirm the pass is authenticated (`"AUTHENTICATED & VALID FOR ENTRY"`).

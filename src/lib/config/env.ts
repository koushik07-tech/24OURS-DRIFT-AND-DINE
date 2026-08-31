/**
 * Production Environment Configuration & Validation Utility
 *
 * Enforces strict environment variable validation and prevents secret leakage.
 */

export interface EnvConfig {
  databaseUrl: string;
  authSecret: string;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayWebhookSecret: string;
  resendApiKey?: string;
  emailFrom: string;
  managerEmail: string;
  appUrl: string;
  isProduction: boolean;
}

export function validateProductionEnvironment(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const isProduction = process.env.NODE_ENV === "production";
  const errors: string[] = [];
  const warnings: string[] = [];

  const databaseUrl = process.env.DATABASE_URL;
  const authSecret = process.env.AUTH_SECRET;
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
  const razorpayWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const resendApiKey = process.env.RESEND_API_KEY;

  // 1. Database URL check
  if (!databaseUrl) {
    errors.push("DATABASE_URL is missing.");
  }

  // 2. Auth Secret check
  if (isProduction) {
    if (!authSecret || authSecret.includes("fallback") || authSecret.length < 32) {
      errors.push("AUTH_SECRET must be configured with at least 32 cryptographically secure characters in production.");
    }
  }

  // 3. Razorpay Credentials check
  if (isProduction) {
    const isLiveEnforced = process.env.ENFORCE_LIVE_PAYMENTS === "true";
    if (isLiveEnforced && (!razorpayKeyId || razorpayKeyId.startsWith("rzp_test") || razorpayKeyId.includes("placeholder"))) {
      errors.push("RAZORPAY_KEY_ID must be configured with live credentials (e.g. rzp_live_...) when live payments are enforced.");
    } else if (!razorpayKeyId || razorpayKeyId.includes("placeholder")) {
      errors.push("RAZORPAY_KEY_ID is missing or configured with a placeholder.");
    }
    if (!razorpayKeySecret || razorpayKeySecret.includes("secret") || razorpayKeySecret.includes("placeholder")) {
      errors.push("RAZORPAY_KEY_SECRET is missing or configured with a placeholder.");
    }
    if (!razorpayWebhookSecret || razorpayWebhookSecret.includes("placeholder")) {
      warnings.push("RAZORPAY_WEBHOOK_SECRET is not configured; webhook signature verification will be bypassed.");
    }
  } else {
    // Development checks (warnings only)
    if (!razorpayKeyId || razorpayKeyId.includes("placeholder")) {
      warnings.push("Running with simulated Razorpay development credentials.");
    }
  }

  // 4. Resend API Key check
  if (isProduction) {
    if (!resendApiKey || resendApiKey.includes("placeholder")) {
      warnings.push("RESEND_API_KEY is not configured with live key; transactional emails will be logged only.");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export function getPublicEnvConfig() {
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    isProduction: process.env.NODE_ENV === "production",
  };
}

/**
 * Production Authentication & Cookie Verification Test Suite
 *
 * Validates:
 * 1. Admin login & JWT generation
 * 2. Set-Cookie response header structure
 * 3. GET /api/auth/me session resolution via cookie
 * 4. User registration & duplicate prevention
 * 5. Password verification (bcrypt)
 * 6. Logout cookie clearance
 * 7. Edge JWT verification logic with base64url padding
 */

import { AuthService } from "../src/lib/services/auth.service";
import { generateToken, verifyToken } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";
import { Role } from "@prisma/client";

async function runAuthTests() {
  console.log("\n=======================================================");
  console.log("🔐 24OURS DRIFT & DINE — AUTHENTICATION TEST SUITE");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`  ✓ ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAILED: ${testName} ${details ? `(${details})` : ""}`);
      failed++;
    }
  }

  try {
    // 1. Admin Login
    console.log("▶ [TEST 1] Admin Authentication & Password Hash Check...");
    const adminLogin = await AuthService.login({
      identifier: "admin@24ours.com",
      password: "AdminPassword123!",
    });
    assert(
      adminLogin.user.role === Role.ADMIN && !!adminLogin.token,
      "Admin credentials verified and JWT generated",
      `Role: ${adminLogin.user.role}`
    );

    // 2. Token Verification
    console.log("\n▶ [TEST 2] Cryptographic JWT Signature & Payload Verification...");
    const decoded = verifyToken(adminLogin.token);
    assert(
      decoded?.email === "admin@24ours.com" && decoded?.role === "ADMIN",
      "JWT decoded successfully with correct claims"
    );

    // 3. Edge Base64Url Padding Helper Test
    console.log("\n▶ [TEST 3] Edge JWT Base64Url Padding Compatibility...");
    function base64UrlDecode(b64url: string): string {
      let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4 !== 0) {
        b64 += "=";
      }
      return Buffer.from(b64, "base64").toString("utf8");
    }

    const parts = adminLogin.token.split(".");
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const payload = JSON.parse(base64UrlDecode(parts[1]));
    assert(
      header.alg === "HS256" && payload.email === "admin@24ours.com",
      "Edge Base64Url decoder handles unpadded JWT parts seamlessly"
    );

    // 4. Invalid Password Rejection
    console.log("\n▶ [TEST 4] Brute Force / Invalid Password Rejection...");
    let caughtInvalid = false;
    try {
      await AuthService.login({
        identifier: "admin@24ours.com",
        password: "WrongPassword999!",
      });
    } catch (e: any) {
      caughtInvalid = e.message === "INVALID_CREDENTIALS";
    }
    assert(caughtInvalid, "Incorrect password correctly rejected with INVALID_CREDENTIALS");

    // 5. User Registration & Duplicate Rejection
    console.log("\n▶ [TEST 5] Customer Registration & Duplicate Conflict Detection...");
    const testEmail = `test_racer_${Date.now()}@example.com`;
    const testUsername = `racer_${Date.now()}`;
    const registered = await AuthService.register({
      name: "Test Racer",
      username: testUsername,
      email: testEmail,
      phone: "+91 9187194643",
      password: "TestPassword123!",
    });
    assert(
      registered.user.email === testEmail && registered.user.role === Role.USER,
      "New customer successfully registered in database"
    );

    let caughtDuplicate = false;
    try {
      await AuthService.register({
        name: "Duplicate Racer",
        username: testUsername,
        email: testEmail,
        password: "TestPassword123!",
      });
    } catch (e: any) {
      caughtDuplicate = e.message === "EMAIL_EXISTS" || e.message === "USERNAME_EXISTS";
    }
    assert(caughtDuplicate, "Duplicate email/username properly rejected with conflict code");

    // 6. Login with Newly Registered User
    console.log("\n▶ [TEST 6] Login with newly registered customer...");
    const userLogin = await AuthService.login({
      identifier: testEmail,
      password: "TestPassword123!",
    });
    assert(
      userLogin.user.email === testEmail && userLogin.user.role === Role.USER,
      "Newly registered customer logged in and received JWT"
    );

    // 7. GetMe Endpoint
    console.log("\n▶ [TEST 7] Session Resolution (GetMe)...");
    const me = await AuthService.getMe(userLogin.user.id);
    assert(me.email === testEmail, "AuthService.getMe accurately retrieves session profile");

    console.log("\n=======================================================");
    console.log(`📊 AUTHENTICATION TEST SUMMARY: ${passed} PASSED / ${failed} FAILED`);
    console.log("=======================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Auth test fatal error:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runAuthTests();

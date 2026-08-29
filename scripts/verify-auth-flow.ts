import { prisma } from "../src/lib/prisma";
import { Role, BookingStatus, PaymentStatus } from "@prisma/client";
import nodeCrypto from "crypto";
import bcrypt from "bcryptjs";

const BASE_URL = "http://localhost:3000";

interface TestReport {
  name: string;
  category: "REGISTRATION" | "LOGIN" | "PROTECTION" | "REGRESSION";
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function record(name: string, category: "REGISTRATION" | "LOGIN" | "PROTECTION" | "REGRESSION", passed: boolean, details: string) {
  reports.push({ name, category, passed, details });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} [${category}] ${name}: ${details}`);
}

async function runAuthVerification() {
  console.log("\n==========================================================");
  console.log("🔐 STARTING PRODUCTION AUTHENTICATION & SECURITY TEST SUITE");
  console.log("==========================================================\n");

  const timestamp = Date.now();
  const testUsername = `driver_${timestamp.toString().slice(-6)}`;
  const testEmail = `driver_${timestamp.toString().slice(-6)}@24ours.test`;
  const testPassword = "SecurePassword123!";
  const testName = "Siddharth Verma";

  // ---------------------------------------------------------
  // SECTION 1: REGISTRATION TESTS
  // ---------------------------------------------------------
  console.log("--- 1. NEW USER REGISTRATION ---");

  // Test 1.1: Successful registration with all 5 required fields
  const resReg = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: testName,
      username: testUsername,
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    }),
  });
  const jsonReg = await resReg.json();

  if (resReg.status === 201 && jsonReg.success && jsonReg.data?.user?.email === testEmail) {
    record("New User Registration", "REGISTRATION", true, `User '${testUsername}' registered successfully. Message: '${jsonReg.message}'`);
  } else {
    record("New User Registration", "REGISTRATION", false, `Failed to register: ${JSON.stringify(jsonReg)}`);
  }

  // Test 1.2: Verify database storage & password hashing
  const dbUser = await prisma.user.findUnique({
    where: { email: testEmail },
  });
  if (dbUser && dbUser.passwordHash && dbUser.passwordHash !== testPassword) {
    const isBcrypt = await bcrypt.compare(testPassword, dbUser.passwordHash);
    if (isBcrypt) {
      record("Database Password Hashing", "REGISTRATION", true, `Password verified strongly hashed with bcrypt (starts with '${dbUser.passwordHash.slice(0, 7)}')`);
    } else {
      record("Database Password Hashing", "REGISTRATION", false, "bcrypt.compare failed on stored hash");
    }
  } else {
    record("Database Password Hashing", "REGISTRATION", false, "User not found or plaintext password stored");
  }

  // Test 1.3: Reject duplicate username
  const resDupUser = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Another Driver",
      username: testUsername, // Duplicate username
      email: `unique_${timestamp}@24ours.test`,
      password: testPassword,
      confirmPassword: testPassword,
    }),
  });
  const jsonDupUser = await resDupUser.json();
  if (resDupUser.status === 409 && jsonDupUser.error?.code === "USERNAME_EXISTS") {
    record("Duplicate Username Rejection", "REGISTRATION", true, `Rejected with 409 USERNAME_EXISTS: '${jsonDupUser.error.message}'`);
  } else {
    record("Duplicate Username Rejection", "REGISTRATION", false, `Expected 409 USERNAME_EXISTS, got ${resDupUser.status}: ${JSON.stringify(jsonDupUser)}`);
  }

  // Test 1.4: Reject duplicate email
  const resDupEmail = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Another Driver",
      username: `unique_user_${timestamp}`,
      email: testEmail, // Duplicate email
      password: testPassword,
      confirmPassword: testPassword,
    }),
  });
  const jsonDupEmail = await resDupEmail.json();
  if (resDupEmail.status === 409 && jsonDupEmail.error?.code === "EMAIL_EXISTS") {
    record("Duplicate Email Rejection", "REGISTRATION", true, `Rejected with 409 EMAIL_EXISTS: '${jsonDupEmail.error.message}'`);
  } else {
    record("Duplicate Email Rejection", "REGISTRATION", false, `Expected 409 EMAIL_EXISTS, got ${resDupEmail.status}: ${JSON.stringify(jsonDupEmail)}`);
  }

  // Test 1.5: Reject password mismatch
  const resMismatch = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Driver Mismatch",
      username: `mismatch_${timestamp}`,
      email: `mismatch_${timestamp}@24ours.test`,
      password: "Password123!",
      confirmPassword: "DifferentPassword123!",
    }),
  });
  const jsonMismatch = await resMismatch.json();
  if (resMismatch.status === 400 && jsonMismatch.error?.code === "VALIDATION_ERROR") {
    record("Password Mismatch Rejection", "REGISTRATION", true, `Rejected with 400 VALIDATION_ERROR: '${jsonMismatch.error.message}'`);
  } else {
    record("Password Mismatch Rejection", "REGISTRATION", false, `Expected 400 VALIDATION_ERROR, got ${resMismatch.status}`);
  }

  // ---------------------------------------------------------
  // SECTION 2: LOGIN TESTS
  // ---------------------------------------------------------
  console.log("\n--- 2. LOGIN & AUTHENTICATION ---");

  let sessionCookie = "";

  // Test 2.1: Login with Email + Correct Password
  const resLoginEmail = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: testEmail,
      password: testPassword,
    }),
  });
  const jsonLoginEmail = await resLoginEmail.json();
  const emailSetCookie = resLoginEmail.headers.get("set-cookie");

  if (resLoginEmail.status === 200 && jsonLoginEmail.success && emailSetCookie?.includes("24ours_auth_token=")) {
    const match = emailSetCookie.match(/24ours_auth_token=([^;]+)/);
    if (match) sessionCookie = match[1];
    record("Login with Email", "LOGIN", true, `Authenticated user '${jsonLoginEmail.data?.user?.email}' via email. Set-Cookie received.`);
  } else {
    record("Login with Email", "LOGIN", false, `Email login failed: ${JSON.stringify(jsonLoginEmail)}`);
  }

  // Test 2.2: Login with Username + Correct Password
  const resLoginUsername = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: testUsername,
      password: testPassword,
    }),
  });
  const jsonLoginUsername = await resLoginUsername.json();
  if (resLoginUsername.status === 200 && jsonLoginUsername.success && jsonLoginUsername.data?.user?.username === testUsername) {
    record("Login with Username", "LOGIN", true, `Authenticated user '${jsonLoginUsername.data?.user?.username}' via username identifier.`);
  } else {
    record("Login with Username", "LOGIN", false, `Username login failed: ${JSON.stringify(jsonLoginUsername)}`);
  }

  // Test 2.3: Reject registered user + wrong password
  const resWrongPass = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: testEmail,
      password: "WrongPassword999!",
    }),
  });
  const jsonWrongPass = await resWrongPass.json();
  if (resWrongPass.status === 401 && jsonWrongPass.error?.message?.includes("Invalid username or password")) {
    record("Wrong Password Rejection", "LOGIN", true, `Rejected with 401: '${jsonWrongPass.error.message}'`);
  } else {
    record("Wrong Password Rejection", "LOGIN", false, `Expected 401 Invalid username or password, got ${resWrongPass.status}: ${JSON.stringify(jsonWrongPass)}`);
  }

  // Test 2.4: Reject unknown/unregistered user
  const resUnknownUser = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: "nonexistent_driver_xyz@24ours.test",
      password: "SomePassword123!",
    }),
  });
  const jsonUnknownUser = await resUnknownUser.json();
  if (resUnknownUser.status === 401 && jsonUnknownUser.error?.message?.includes("Invalid username or password")) {
    record("Unknown User Rejection", "LOGIN", true, `Rejected unseeded user with 401: '${jsonUnknownUser.error.message}'`);
  } else {
    record("Unknown User Rejection", "LOGIN", false, `Expected 401, got ${resUnknownUser.status}`);
  }

  // ---------------------------------------------------------
  // SECTION 3: ROUTE PROTECTION & SESSIONS
  // ---------------------------------------------------------
  console.log("\n--- 3. ROUTE PROTECTION & ACCESS CONTROL ---");

  // Test 3.1: Logged-out access to /dashboard redirects to /login?redirect=/dashboard
  const resLoggedOutDash = await fetch(`${BASE_URL}/dashboard`, { redirect: "manual" });
  if (resLoggedOutDash.status === 307 && resLoggedOutDash.headers.get("location")?.includes("/login?redirect=%2Fdashboard")) {
    record("Logged-Out Dashboard Gate", "PROTECTION", true, "Unauthenticated /dashboard redirected to /login?redirect=%2Fdashboard (307)");
  } else {
    record("Logged-Out Dashboard Gate", "PROTECTION", false, `Expected redirect to /login, got ${resLoggedOutDash.status}`);
  }

  // Test 3.2: Logged-in access to /dashboard returns 200 OK
  const resLoggedInDash = await fetch(`${BASE_URL}/dashboard`, {
    headers: { Cookie: `24ours_auth_token=${sessionCookie}` },
  });
  if (resLoggedInDash.status === 200) {
    record("Logged-In Dashboard Access", "PROTECTION", true, "Authenticated user accessed /dashboard with HTTP 200 OK");
  } else {
    record("Logged-In Dashboard Access", "PROTECTION", false, `Expected 200, got ${resLoggedInDash.status}`);
  }

  // Test 3.3: Logged-out access to /login renders login page (200 OK)
  const resLoggedOutLogin = await fetch(`${BASE_URL}/login`, { redirect: "manual" });
  if (resLoggedOutLogin.status === 200) {
    record("Logged-Out Login Page Access", "PROTECTION", true, "Unauthenticated user received 200 OK rendering standalone /login");
  } else {
    record("Logged-Out Login Page Access", "PROTECTION", false, `Expected 200, got ${resLoggedOutLogin.status}`);
  }

  // Test 3.4: Logged-out access to /signup renders signup page (200 OK)
  const resLoggedOutSignup = await fetch(`${BASE_URL}/signup`, { redirect: "manual" });
  if (resLoggedOutSignup.status === 200) {
    record("Logged-Out Signup Page Access", "PROTECTION", true, "Unauthenticated user received 200 OK rendering standalone /signup");
  } else {
    record("Logged-Out Signup Page Access", "PROTECTION", false, `Expected 200, got ${resLoggedOutSignup.status}`);
  }

  // Test 3.5: Logged-in access to /login redirects away
  const resLoggedInLogin = await fetch(`${BASE_URL}/login`, {
    headers: { Cookie: `24ours_auth_token=${sessionCookie}` },
    redirect: "manual",
  });
  if (resLoggedInLogin.status === 307) {
    record("Logged-In Login Redirection", "PROTECTION", true, `Authenticated user on /login redirected to ${resLoggedInLogin.headers.get("location")} (307)`);
  } else {
    record("Logged-In Login Redirection", "PROTECTION", false, `Expected 307 redirect, got ${resLoggedInLogin.status}`);
  }

  // Test 3.6: Logout endpoint clears cookie
  const resLogout = await fetch(`${BASE_URL}/api/auth/logout`, { method: "POST" });
  const logoutCookie = resLogout.headers.get("set-cookie");
  if (resLogout.status === 200 && logoutCookie?.includes("24ours_auth_token=;")) {
    record("Logout Session Invalidation", "PROTECTION", true, "Logout endpoint properly cleared HTTP-only auth cookie");
  } else {
    record("Logout Session Invalidation", "PROTECTION", false, `Logout failed: Set-Cookie: ${logoutCookie}`);
  }

  // ---------------------------------------------------------
  // SECTION 4: PAYMENT & BOOKING REGRESSION TESTS
  // ---------------------------------------------------------
  console.log("\n--- 4. RAZORPAY & BOOKING FLOW REGRESSION ---");

  // Create booking with newly registered driver
  const resExp = await fetch(`${BASE_URL}/api/experiences`);
  const jsonExp = await resExp.json();
  const experiences = Array.isArray(jsonExp.data) ? jsonExp.data : jsonExp.data?.experiences || [];
  const experience = experiences[0] || (await prisma.experience.findFirst());

  const bookingDate = new Date();
  bookingDate.setDate(bookingDate.getDate() + 25);
  const bookingDateStr = bookingDate.toISOString().split("T")[0];

  const resBk = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${sessionCookie}`,
    },
    body: JSON.stringify({
      experienceId: experience.id,
      experienceName: experience.name,
      date: bookingDateStr,
      timeSlot: "08:30 PM – 09:30 PM (Night Lights Grand Prix)",
      guests: 1,
      customerName: testName,
      customerEmail: testEmail,
      customerPhone: "+91 9187194643",
    }),
  });
  const jsonBk = await resBk.json();
  const bookingId = jsonBk.data?.id;
  const bookingCode = jsonBk.data?.bookingCode;

  if (resBk.status === 201 && bookingId) {
    record("Booking Creation", "REGRESSION", true, `Created booking '${bookingCode}' for registered driver '${testUsername}'`);
  } else {
    record("Booking Creation", "REGRESSION", false, `Booking creation failed: ${JSON.stringify(jsonBk)}`);
  }

  // Create Razorpay Order
  const resOrder = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${sessionCookie}`,
    },
    body: JSON.stringify({ bookingId }),
  });
  const jsonOrder = await resOrder.json();
  const rzpOrderId = jsonOrder.data?.orderId;

  if (resOrder.status === 200 && rzpOrderId?.startsWith("order_")) {
    record("Razorpay Order Creation", "REGRESSION", true, `Real Razorpay test order generated: '${rzpOrderId}', Amount: ₹${jsonOrder.data.amount}`);
  } else {
    record("Razorpay Order Creation", "REGRESSION", false, `Order creation failed: ${JSON.stringify(jsonOrder)}`);
  }

  // Payment Verification with HMAC
  const paymentId = `pay_test_${Date.now()}`;
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
  const signature = rzpSecret
    ? nodeCrypto.createHmac("sha256", rzpSecret).update(`${rzpOrderId}|${paymentId}`).digest("hex")
    : "simulated_sig";

  const resVerify = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${sessionCookie}`,
    },
    body: JSON.stringify({
      bookingId,
      razorpayOrderId: rzpOrderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    }),
  });
  const jsonVerify = await resVerify.json();

  if (resVerify.status === 200 && jsonVerify.success && jsonVerify.data?.booking?.bookingStatus === "CONFIRMED") {
    record("Payment HMAC Verification", "REGRESSION", true, "Payment cryptographically verified with HMAC-SHA256, booking marked CONFIRMED");
  } else {
    record("Payment HMAC Verification", "REGRESSION", false, `Payment verification failed: ${JSON.stringify(jsonVerify)}`);
  }

  // Verify QR Pass
  const resPass = await fetch(`${BASE_URL}/api/verify/${bookingCode}`);
  const jsonPass = await resPass.json();
  if (resPass.status === 200 && jsonPass.data?.isValidPass === true) {
    record("QR Boarding Pass Verification", "REGRESSION", true, `Pass '${bookingCode}' validated as '${jsonPass.data.statusDescription}'`);
  } else {
    record("QR Boarding Pass Verification", "REGRESSION", false, `Pass verification failed: ${JSON.stringify(jsonPass)}`);
  }

  // Summary
  console.log("\n==========================================================");
  console.log("🏁 SUMMARY OF AUTHENTICATION & SECURITY TEST SUITE");
  console.log("==========================================================");
  const passedCount = reports.filter((r) => r.passed).length;
  const totalCount = reports.length;
  console.log(`TOTAL SCORE: ${passedCount}/${totalCount} TESTS PASSED`);
  console.log("==========================================================\n");

  if (passedCount < totalCount) {
    process.exit(1);
  }
}

runAuthVerification()
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

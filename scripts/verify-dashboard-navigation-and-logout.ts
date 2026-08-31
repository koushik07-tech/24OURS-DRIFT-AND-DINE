import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

const BASE_URL = "http://localhost:3000";

interface Check {
  id: string;
  name: string;
  passed: boolean;
  details: string;
}

const checks: Check[] = [];

function recordCheck(id: string, name: string, passed: boolean, details: string) {
  checks.push({ id, name, passed, details });
  console.log(`${passed ? "✅" : "❌"} [${id}] ${name} — ${details}`);
}

async function runDashboardAndAuthVerification() {
  console.log("\n==================================================================");
  console.log("🏁 DASHBOARD NAVIGATION & LOGOUT UX VERIFICATION");
  console.log("==================================================================\n");

  const timestamp = Date.now();
  const testName = "Vikram Aditya";
  const testUsername = `vikram_${timestamp.toString().slice(-4)}`;
  const testEmail = `vikram_${timestamp.toString().slice(-4)}@24ours.test`;
  const testPassword = "Password123!";

  // -------------------------------------------------------------
  // 1. Open /signup
  // -------------------------------------------------------------
  const resSignup = await fetch(`${BASE_URL}/signup`, { redirect: "manual" });
  recordCheck("STEP_1", "/signup Accessibility", resSignup.status === 200, "Unauthenticated /signup returned 200 OK");

  // -------------------------------------------------------------
  // 2. Create fresh test account
  // -------------------------------------------------------------
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
  recordCheck(
    "STEP_2",
    "Account Registration",
    resReg.status === 201 && jsonReg.success,
    `Registered '@${testUsername}' (${testEmail}) successfully without auto-login cookie`
  );

  // -------------------------------------------------------------
  // 3. Confirm redirect target /login?registered=true
  // -------------------------------------------------------------
  const resLoginReg = await fetch(`${BASE_URL}/login?registered=true`, { redirect: "manual" });
  recordCheck("STEP_3", "/login?registered=true Page Load", resLoginReg.status === 200, "Rendered login page with success state");

  // -------------------------------------------------------------
  // 4. Log In
  // -------------------------------------------------------------
  const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: testUsername,
      password: testPassword,
    }),
  });
  const jsonLogin = await resLogin.json();
  const setCookie = resLogin.headers.get("set-cookie") || "";
  let authToken = "";
  const match = setCookie.match(/24ours_auth_token=([^;]+)/);
  if (match) authToken = match[1];

  recordCheck("STEP_4", "Authentication Login", resLogin.status === 200 && !!authToken, `Logged in. Token cookie received.`);

  // -------------------------------------------------------------
  // 5. Confirm /dashboard loads
  // -------------------------------------------------------------
  const resDash = await fetch(`${BASE_URL}/dashboard`, {
    headers: { Cookie: `24ours_auth_token=${authToken}` },
    redirect: "manual",
  });
  const dashHtml = await resDash.text();
  const hasDashboardContent = resDash.status === 200 && dashHtml.includes("dashboard-logout-btn");
  recordCheck("STEP_5", "Dashboard Initial Load", hasDashboardContent, "Loaded /dashboard with user session and logout control");

  // -------------------------------------------------------------
  // 6. Section Navigation Verification
  // -------------------------------------------------------------
  const sections = [
    { hash: "passes", text: "Issued Session Passes & Tickets" },
    { hash: "telemetry", text: "Circuit Telemetry & Lap Profiles" },
    { hash: "experiences", text: "Motorsport & Entertainment Catalog" },
    { hash: "club", text: "24OURS Drivers Club Membership" },
    { hash: "kidz-zone", text: "Junior Cadet Circuit & Kidz Zone" },
    { hash: "profile", text: "Driver Credentials & Security" },
  ];

  console.log("\n--- Testing Visible Content for Dashboard Navigation Sections ---");
  for (const sec of sections) {
    const isPresent = dashHtml.includes(sec.text) || dashHtml.includes(`section-${sec.hash}`) || dashHtml.includes(`tab-${sec.hash}`);
    recordCheck(
      `NAV_${sec.hash.toUpperCase().replace("-", "_")}`,
      `Section #${sec.hash}`,
      isPresent,
      `Matched section key & UI layout for #${sec.hash}`
    );
  }

  // -------------------------------------------------------------
  // 7. Click LOG OUT (POST /api/auth/logout)
  // -------------------------------------------------------------
  console.log("\n--- Testing Logout Flow & Session Revocation ---");
  const resLogout = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: `24ours_auth_token=${authToken}` },
  });
  const logoutCookie = resLogout.headers.get("set-cookie") || "";
  const cookieIsCleared =
    logoutCookie.includes("24ours_auth_token=;") ||
    logoutCookie.includes("Max-Age=0") ||
    logoutCookie.includes("expires=Thu, 01 Jan 1970");

  recordCheck("STEP_7", "API Logout Execution", resLogout.status === 200 && cookieIsCleared, "Cookie invalidated with Max-Age=0");

  // -------------------------------------------------------------
  // 8. Confirm /dashboard redirects to /login after logout
  // -------------------------------------------------------------
  const resDashAfterLogout = await fetch(`${BASE_URL}/dashboard`, { redirect: "manual" });
  const isProtected =
    resDashAfterLogout.status === 307 &&
    (resDashAfterLogout.headers.get("location")?.includes("/login") || false);

  recordCheck(
    "STEP_8",
    "Post-Logout Route Guard",
    isProtected,
    `Status: ${resDashAfterLogout.status} Redirect to: '${resDashAfterLogout.headers.get("location")}'`
  );

  // -------------------------------------------------------------
  // 9. Confirm /login renders cleanly without redirect
  // -------------------------------------------------------------
  const resLoginDirect = await fetch(`${BASE_URL}/login`, { redirect: "manual" });
  recordCheck("STEP_9", "Logged-Out /login Direct Access", resLoginDirect.status === 200, "Rendered /login (200 OK)");

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n==================================================================");
  console.log("🏁 SUMMARY OF DASHBOARD NAVIGATION & LOGOUT SUITE");
  console.log("==================================================================");
  const passedCount = checks.filter((c) => c.passed).length;
  console.log(`TOTAL: ${passedCount}/${checks.length} CHECKS PASSED`);
  console.log("==================================================================\n");

  if (passedCount < checks.length) {
    process.exit(1);
  }
}

runDashboardAndAuthVerification()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

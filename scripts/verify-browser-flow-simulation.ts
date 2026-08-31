import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";

const BASE_URL = "http://localhost:3000";

interface StepResult {
  step: number;
  name: string;
  status: "PASS" | "FAIL";
  details: string;
}

const results: StepResult[] = [];

function logStep(step: number, name: string, pass: boolean, details: string) {
  results.push({ step, name, status: pass ? "PASS" : "FAIL", details });
  console.log(`${pass ? "✅" : "❌"} Step ${step}: ${name} — ${details}`);
}

async function verifyCompleteBrowserAuthCycle() {
  console.log("\n==================================================================");
  console.log("🌐 LIVE BROWSER HTTP & AUTH CYCLE VERIFICATION");
  console.log("==================================================================\n");

  const timestamp = Date.now();
  const testName = "Aarav Mehta";
  const testUsername = `aarav_speed_${timestamp.toString().slice(-4)}`;
  const testEmail = `aarav_${timestamp.toString().slice(-4)}@24ours.test`;
  const testPassword = "Password123!";

  // -------------------------------------------------------------
  // Step 1: /signup must always be accessible to unauthenticated users
  // -------------------------------------------------------------
  const resSignupPage = await fetch(`${BASE_URL}/signup`, { redirect: "manual" });
  logStep(
    1,
    "/signup Page Access (Unauthenticated)",
    resSignupPage.status === 200,
    `Status: ${resSignupPage.status} OK (Rendered registration form)`
  );

  // -------------------------------------------------------------
  // Step 2: Register new user with 5 fields
  // -------------------------------------------------------------
  const resRegister = await fetch(`${BASE_URL}/api/auth/register`, {
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
  const jsonRegister = await resRegister.json();
  const registerSetCookie = resRegister.headers.get("set-cookie");

  const noAutoLogin = !registerSetCookie || !registerSetCookie.includes("24ours_auth_token=");
  logStep(
    2,
    "New User Registration (5 Fields & No Auto-Login)",
    resRegister.status === 201 && jsonRegister.success && noAutoLogin,
    `User '${testUsername}' created. Message: '${jsonRegister.message}'. Auto-login cookie prevented: ${noAutoLogin}`
  );

  // -------------------------------------------------------------
  // Step 3: Verify user in PostgreSQL / Supabase with bcrypt hash
  // -------------------------------------------------------------
  const dbUser = await prisma.user.findUnique({ where: { email: testEmail } });
  const isBcrypt = dbUser?.passwordHash ? await bcrypt.compare(testPassword, dbUser.passwordHash) : false;
  logStep(
    3,
    "Database Persistence & Bcrypt Verification",
    !!dbUser && isBcrypt,
    `Stored in DB with ID '${dbUser?.id}', username '@${dbUser?.username}'. Bcrypt hash validated.`
  );

  // -------------------------------------------------------------
  // Step 4: /login?registered=true page accessible
  // -------------------------------------------------------------
  const resLoginPage = await fetch(`${BASE_URL}/login?registered=true`, { redirect: "manual" });
  logStep(
    4,
    "/login?registered=true Access",
    resLoginPage.status === 200,
    `Status: ${resLoginPage.status} OK (Ready to display 'Account created successfully. Please log in.')`
  );

  // -------------------------------------------------------------
  // Step 5: Login with Username + Correct Password
  // -------------------------------------------------------------
  const resLoginUser = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: testUsername,
      password: testPassword,
    }),
  });
  const jsonLoginUser = await resLoginUser.json();
  const setCookieHeader = resLoginUser.headers.get("set-cookie") || "";
  let authToken = "";
  const match = setCookieHeader.match(/24ours_auth_token=([^;]+)/);
  if (match) authToken = match[1];

  logStep(
    5,
    "Login with Username Identifier",
    resLoginUser.status === 200 && jsonLoginUser.success && !!authToken,
    `Authenticated as '@${jsonLoginUser.data?.user?.username}'. Received HTTP-only session cookie.`
  );

  // -------------------------------------------------------------
  // Step 6: Authenticated access to /dashboard
  // -------------------------------------------------------------
  const resDashboardAuth = await fetch(`${BASE_URL}/dashboard`, {
    headers: { Cookie: `24ours_auth_token=${authToken}` },
    redirect: "manual",
  });
  logStep(
    6,
    "Authenticated /dashboard Access",
    resDashboardAuth.status === 200,
    `Status: ${resDashboardAuth.status} OK (Dashboard loaded with active session)`
  );

  // -------------------------------------------------------------
  // Step 7: Logout from /dashboard calls /api/auth/logout
  // -------------------------------------------------------------
  const resLogout = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: `24ours_auth_token=${authToken}` },
  });
  const logoutCookieHeader = resLogout.headers.get("set-cookie") || "";
  const cookieCleared =
    logoutCookieHeader.includes("24ours_auth_token=;") ||
    logoutCookieHeader.includes("Max-Age=0") ||
    logoutCookieHeader.includes("expires=Thu, 01 Jan 1970");

  logStep(
    7,
    "Dashboard Logout & Cookie Invalidation",
    resLogout.status === 200 && cookieCleared,
    `Status: ${resLogout.status}. Cookie header properly set to clear: '${logoutCookieHeader.split(";")[0]}'`
  );

  // -------------------------------------------------------------
  // Step 8: Direct /dashboard access AFTER logout must redirect to /login
  // -------------------------------------------------------------
  const resDashboardLoggedOut = await fetch(`${BASE_URL}/dashboard`, { redirect: "manual" });
  const isRedirectToLogin =
    resDashboardLoggedOut.status === 307 &&
    (resDashboardLoggedOut.headers.get("location")?.includes("/login") || false);
  logStep(
    8,
    "Logged-Out Direct /dashboard Gate",
    isRedirectToLogin,
    `Status: ${resDashboardLoggedOut.status} Redirect to '${resDashboardLoggedOut.headers.get("location")}'`
  );

  // -------------------------------------------------------------
  // Step 9: Login with Wrong Password
  // -------------------------------------------------------------
  const resWrongPass = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: testEmail,
      password: "WrongPassword999!",
    }),
  });
  const jsonWrongPass = await resWrongPass.json();
  const wrongPassCookie = resWrongPass.headers.get("set-cookie");
  const noCookieOnFailure = !wrongPassCookie || !wrongPassCookie.includes("24ours_auth_token=");

  logStep(
    9,
    "Wrong Password Handling",
    resWrongPass.status === 401 &&
      jsonWrongPass.error?.message === "Invalid username or password." &&
      noCookieOnFailure,
    `Rejected with 401: '${jsonWrongPass.error?.message}'. No auth cookie created.`
  );

  // -------------------------------------------------------------
  // Step 10: Direct /login access while logged out
  // -------------------------------------------------------------
  const resDirectLogin = await fetch(`${BASE_URL}/login`, { redirect: "manual" });
  logStep(
    10,
    "Direct /login Access (Logged Out)",
    resDirectLogin.status === 200,
    `Status: ${resDirectLogin.status} OK (Stayed on /login, did NOT redirect to homepage)`
  );

  // -------------------------------------------------------------
  // Step 11: /login with Malformed / Tampered / Stale JWT Cookie
  // -------------------------------------------------------------
  const resMalformedLogin = await fetch(`${BASE_URL}/login`, {
    headers: { Cookie: "24ours_auth_token=malformed.fake.token123" },
    redirect: "manual",
  });
  logStep(
    11,
    "Malformed / Stale JWT on /login",
    resMalformedLogin.status === 200,
    `Status: ${resMalformedLogin.status} OK (Rejected fake JWT and stayed on /login)`
  );

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n==================================================================");
  console.log("🏁 SUMMARY OF BROWSER FLOW SIMULATION");
  console.log("==================================================================");
  const passCount = results.filter((r) => r.status === "PASS").length;
  console.log(`TOTAL RESULT: ${passCount}/${results.length} CHECKS PASSED`);
  console.log("==================================================================\n");

  if (passCount < results.length) {
    process.exit(1);
  }
}

verifyCompleteBrowserAuthCycle()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

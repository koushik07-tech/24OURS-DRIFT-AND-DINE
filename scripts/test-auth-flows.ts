import { Role } from "@prisma/client";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=================================================");
  console.log("🏎️  RUNNING COMPREHENSIVE AUTH & ROUTE TEST SUITE");
  console.log("=================================================");

  let passed = 0;
  let total = 7;

  // TEST 1: Open http://localhost:3000/signup
  console.log("\n[TEST 1] Visiting '/signup' page...");
  const res1 = await fetch(`${BASE_URL}/signup`);
  const text1 = await res1.text();
  if (res1.status === 200 && text1.includes("Driver Registration") && text1.includes("24OURS")) {
    console.log("✅ TEST 1 PASSED: Registration page renders with 200 OK and registration form.");
    passed++;
  } else {
    console.error("❌ TEST 1 FAILED: /signup did not render properly.");
  }

  // TEST 2: Register a new account
  const testUsername = `user_${Date.now().toString().slice(-6)}`;
  const testEmail = `${testUsername}@example.com`;
  const testPassword = "Password123!";
  console.log(`\n[TEST 2] Registering new user (${testUsername})...`);
  const res2 = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test Driver",
      username: testUsername,
      email: testEmail,
      password: testPassword,
      confirmPassword: testPassword,
    }),
  });
  const json2 = await res2.json();
  if (res2.status === 201 && json2.success) {
    console.log("✅ TEST 2 PASSED: Account created successfully via API.");
    passed++;
  } else {
    console.error("❌ TEST 2 FAILED: Registration returned error:", json2);
  }

  // TEST 3: Login with newly created user
  console.log(`\n[TEST 3] Logging in as ${testUsername}...`);
  const res3 = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: testUsername,
      password: testPassword,
    }),
  });
  const json3 = await res3.json();
  const setCookieHeader = res3.headers.get("set-cookie");
  let authToken = "";
  if (setCookieHeader) {
    const match = setCookieHeader.match(/24ours_auth_token=([^;]+)/);
    if (match) authToken = match[1];
  }
  if (res3.status === 200 && json3.success && authToken) {
    console.log("✅ TEST 3 PASSED: Login succeeded and valid JWT session cookie issued.");
    passed++;
  } else {
    console.error("❌ TEST 3 FAILED: Login failed:", json3);
  }

  // TEST 4: Access main website '/' with auth cookie
  console.log("\n[TEST 4] Accessing '/' with authentication cookie...");
  const res4 = await fetch(`${BASE_URL}/`, {
    headers: { Cookie: `24ours_auth_token=${authToken}` },
  });
  const text4 = await res4.text();
  const hasNavbarLinks = text4.includes("EXPERIENCES") || text4.includes("Experiences");
  if (res4.status === 200 && hasNavbarLinks) {
    console.log("✅ TEST 4 PASSED: Main website loads successfully with clean Navbar.");
    passed++;
  } else {
    console.error("❌ TEST 4 FAILED: Could not load main website with auth cookie.");
  }

  // TEST 5: Access protected '/dashboard' with auth cookie
  console.log("\n[TEST 5] Accessing '/dashboard' with authenticated user...");
  const res5 = await fetch(`${BASE_URL}/dashboard`, {
    headers: { Cookie: `24ours_auth_token=${authToken}` },
  });
  const text5 = await res5.text();
  const noFakeTelemetry =
    !text5.includes("31.890s PB") &&
    !text5.includes("78.4 km/h") &&
    !text5.includes("42 Laps") &&
    !text5.includes("24O-LIC-88219");
  if (res5.status === 200 && noFakeTelemetry) {
    console.log("✅ TEST 5 PASSED: Streamlined /dashboard loads with 200 OK and NO fake telemetry.");
    passed++;
  } else {
    console.error("❌ TEST 5 FAILED: /dashboard returned error or contained fake telemetry.");
  }

  // TEST 6: Sign Out flow
  console.log("\n[TEST 6] Triggering Sign Out (/api/auth/logout)...");
  const res6 = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: `24ours_auth_token=${authToken}` },
  });
  const logoutCookie = res6.headers.get("set-cookie");
  if (res6.status === 200 && logoutCookie?.includes("24ours_auth_token=;")) {
    console.log("✅ TEST 6 PASSED: Sign Out endpoint executed and cleared session cookie.");
    passed++;
  } else {
    console.error("❌ TEST 6 FAILED: Logout did not clear cookie.");
  }

  // TEST 7: Access /dashboard while unauthenticated (expect redirect to login with redirect param)
  console.log("\n[TEST 7] Accessing '/dashboard' while unauthenticated...");
  const res7 = await fetch(`${BASE_URL}/dashboard`, {
    redirect: "manual",
  });
  const location7 = res7.headers.get("location");
  if (res7.status === 307 && location7?.includes("/login?redirect=%2Fdashboard")) {
    console.log("✅ TEST 7 PASSED: Protected /dashboard redirects to /login?redirect=%2Fdashboard.");
    passed++;
  } else {
    console.error(`❌ TEST 7 FAILED: Expected redirect to /login?redirect=%2Fdashboard, got: ${location7}`);
  }

  console.log("\n=================================================");
  console.log(`🏁 TEST RESULTS: ${passed}/${total} PASSED`);
  console.log("=================================================");

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});

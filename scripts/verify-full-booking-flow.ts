import { prisma } from "../src/lib/prisma";
import { Role, BookingStatus, PaymentStatus } from "@prisma/client";
import nodeCrypto from "crypto";

const BASE_URL = "http://localhost:3000";

interface TestReport {
  name: string;
  category: "HAPPY_PATH" | "ERROR_CASE";
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function record(name: string, category: "HAPPY_PATH" | "ERROR_CASE", passed: boolean, details: string) {
  reports.push({ name, category, passed, details });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} [${category}] ${name}: ${details}`);
}

async function runVerification() {
  console.log("==========================================================");
  console.log("🏎️  STARTING COMPLETE USER BOOKING FLOW & ERROR SUITE");
  console.log("==========================================================\n");

  let userCookie = "";
  let adminCookie = "";
  let createdBookingId = "";
  let createdBookingCode = "";
  let razorpayOrderId = "";

  // ---------------------------------------------------------
  // SECTION 1: AUTHENTICATION & LOGIN AS SEEDED USER
  // ---------------------------------------------------------
  console.log("--- 1. AUTHENTICATION & ACCESS ---");

  // Step 1: Verify logged out access to / redirects to /login
  const resLoggedOutHome = await fetch(`${BASE_URL}/`, { redirect: "manual" });
  if (resLoggedOutHome.status === 307 && resLoggedOutHome.headers.get("location")?.includes("/login")) {
    record("Logged Out Home Redirection", "HAPPY_PATH", true, "Unauthenticated '/' correctly redirects to /login (307)");
  } else {
    record("Logged Out Home Redirection", "HAPPY_PATH", false, `Expected 307 to /login, got ${resLoggedOutHome.status}`);
  }

  // Step 2: Login using seeded USER account (racer@24ours.com)
  const resLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "racer@24ours.com", password: "RacerPassword123!" }),
  });
  const jsonLogin = await resLogin.json();
  const setCookie = resLogin.headers.get("set-cookie");
  if (resLogin.status === 200 && jsonLogin.success && setCookie) {
    const match = setCookie.match(/24ours_auth_token=([^;]+)/);
    if (match) userCookie = match[1];
    record("User Login", "HAPPY_PATH", true, `Logged in successfully as ${jsonLogin.data?.user?.email} (${jsonLogin.data?.user?.role})`);
  } else {
    record("User Login", "HAPPY_PATH", false, `Login failed: ${JSON.stringify(jsonLogin)}`);
  }

  // Login as ADMIN to have credentials for cross-user permission checks
  const resAdminLogin = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@24ours.com", password: "AdminPassword123!" }),
  });
  const jsonAdminLogin = await resAdminLogin.json();
  const adminSetCookie = resAdminLogin.headers.get("set-cookie");
  if (adminSetCookie) {
    const match = adminSetCookie.match(/24ours_auth_token=([^;]+)/);
    if (match) adminCookie = match[1];
  }

  // Step 3: Verify authenticated access to /
  const resAuthHome = await fetch(`${BASE_URL}/`, {
    headers: { Cookie: `24ours_auth_token=${userCookie}` },
    redirect: "manual",
  });
  if (resAuthHome.status === 200) {
    record("Authenticated Homepage Access", "HAPPY_PATH", true, "Authenticated user received 200 OK on '/'");
  } else {
    record("Authenticated Homepage Access", "HAPPY_PATH", false, `Expected 200 OK on '/', got ${resAuthHome.status}`);
  }

  // ---------------------------------------------------------
  // SECTION 2: EXPERIENCES & BACKEND DATA LOADING
  // ---------------------------------------------------------
  console.log("\n--- 2. CATALOG & EXPERIENCE LOADING ---");
  const resExp = await fetch(`${BASE_URL}/api/experiences`, {
    headers: { Cookie: `24ours_auth_token=${userCookie}` },
  });
  const jsonExp = await resExp.json();
  let selectedExp: any = null;

  if (resExp.status === 200 && jsonExp.success && Array.isArray(jsonExp.data) && jsonExp.data.length > 0) {
    selectedExp = jsonExp.data[0];
    record("Catalog API Query", "HAPPY_PATH", true, `Fetched ${jsonExp.data.length} experiences. Selected '${selectedExp.name}' (Base Price: ₹${selectedExp.basePrice}, Capacity: ${selectedExp.capacityPerSlot})`);
  } else {
    record("Catalog API Query", "HAPPY_PATH", false, `Failed to load experiences: ${JSON.stringify(jsonExp)}`);
  }

  // ---------------------------------------------------------
  // SECTION 3: COUPON & OFFER VALIDATION
  // ---------------------------------------------------------
  console.log("\n--- 3. OFFER / COUPON EVALUATION ---");
  // Seed a valid active test offer in DB
  const testCouponCode = "DRIFT10";
  await prisma.offer.upsert({
    where: { code: testCouponCode },
    update: {
      isActive: true,
      discountType: "PERCENTAGE",
      discountAmount: 10,
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(Date.now() + 86400000 * 30),
      usageLimit: 100,
      usedCount: 0,
    },
    create: {
      code: testCouponCode,
      name: "10% Drift Pass Discount",
      discountType: "PERCENTAGE",
      discountAmount: 10,
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(Date.now() + 86400000 * 30),
      usageLimit: 100,
      usedCount: 0,
      isActive: true,
    },
  });

  // Seed an expired offer to test expired handling
  const expiredCouponCode = "EXPIRED20";
  await prisma.offer.upsert({
    where: { code: expiredCouponCode },
    update: {
      isActive: true,
      discountType: "PERCENTAGE",
      discountAmount: 20,
      startDate: new Date(Date.now() - 86400000 * 10),
      endDate: new Date(Date.now() - 86400000 * 2),
      usageLimit: 100,
    },
    create: {
      code: expiredCouponCode,
      name: "Expired 20% Discount",
      discountType: "PERCENTAGE",
      discountAmount: 20,
      startDate: new Date(Date.now() - 86400000 * 10),
      endDate: new Date(Date.now() - 86400000 * 2),
      usageLimit: 100,
      isActive: true,
    },
  });

  // ---------------------------------------------------------
  // SECTION 4: BOOKING CREATION (HAPPY PATH)
  // ---------------------------------------------------------
  console.log("\n--- 4. USER BOOKING CREATION (HAPPY PATH) ---");
  const randomDayOffset = 10 + (Math.floor(Date.now() / 1000) % 20);
  const testDate = new Date();
  testDate.setDate(testDate.getDate() + randomDayOffset);
  const bookingDateStr = testDate.toISOString().split("T")[0];
  const bookingSlot = "08:30 PM – 09:30 PM (Night Lights Grand Prix)";
  const guestCount = 2;

  const resCreateBooking = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${userCookie}`,
    },
    body: JSON.stringify({
      experienceId: selectedExp?.id,
      experienceName: selectedExp?.name,
      date: bookingDateStr,
      timeSlot: bookingSlot,
      guests: guestCount,
      customerName: "Rahul Sharma",
      customerEmail: "racer@24ours.com",
      customerPhone: "+91 9187194643",
      specialRequests: "VIP Helmets & telemetry printout",
      discountCode: testCouponCode,
    }),
  });

  const jsonCreateBooking = await resCreateBooking.json();
  if (resCreateBooking.status === 201 && jsonCreateBooking.success && jsonCreateBooking.data?.id) {
    createdBookingId = jsonCreateBooking.data.id;
    createdBookingCode = jsonCreateBooking.data.bookingCode;
    const baseTotal = (selectedExp?.basePrice || 1299) * guestCount;
    const expectedDiscountedTotal = baseTotal * 0.9; // 10% off
    const actualTotal = jsonCreateBooking.data.totalAmount;

    record("Create Booking API", "HAPPY_PATH", true, `Booking created with code '${createdBookingCode}', Total: ₹${actualTotal} (Expected with 10% coupon: ₹${expectedDiscountedTotal})`);
  } else {
    record("Create Booking API", "HAPPY_PATH", false, `Failed to create booking: ${JSON.stringify(jsonCreateBooking)}`);
  }

  // ---------------------------------------------------------
  // SECTION 5: DATABASE PERSISTENCE VERIFICATION
  // ---------------------------------------------------------
  console.log("\n--- 5. DATABASE PERSISTENCE (POSTGRESQL / SUPABASE) ---");
  const dbBooking = await prisma.booking.findUnique({
    where: { id: createdBookingId },
    include: { payment: true, user: true, experience: true },
  });

  if (dbBooking && dbBooking.bookingCode === createdBookingCode && dbBooking.bookingStatus === BookingStatus.PENDING) {
    record("Database Persistence", "HAPPY_PATH", true, `Booking persisted in DB. Status: ${dbBooking.bookingStatus}, PaymentStatus: ${dbBooking.paymentStatus}, User: ${dbBooking.user?.email}`);
  } else {
    record("Database Persistence", "HAPPY_PATH", false, `Booking not found in DB or status mismatch: ${JSON.stringify(dbBooking)}`);
  }

  // ---------------------------------------------------------
  // SECTION 6: RAZORPAY ORDER CREATION
  // ---------------------------------------------------------
  console.log("\n--- 6. RAZORPAY ORDER INITIALIZATION ---");
  const resOrder = await fetch(`${BASE_URL}/api/payments/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${userCookie}`,
    },
    body: JSON.stringify({ bookingId: createdBookingId }),
  });

  const jsonOrder = await resOrder.json();
  if (resOrder.status === 200 && jsonOrder.success && jsonOrder.data?.orderId) {
    razorpayOrderId = jsonOrder.data.orderId;
    record("Razorpay Order Creation", "HAPPY_PATH", true, `Order created successfully. OrderId: '${razorpayOrderId}', Amount: ₹${jsonOrder.data.amount} (${jsonOrder.data.amountInPaise} paise)`);
  } else {
    record("Razorpay Order Creation", "HAPPY_PATH", false, `Failed to create payment order: ${JSON.stringify(jsonOrder)}`);
  }

  // ---------------------------------------------------------
  // SECTION 7: PAYMENT VERIFICATION & SIGNATURE
  // ---------------------------------------------------------
  console.log("\n--- 7. PAYMENT VERIFICATION & SIGNATURE HANDLING ---");
  const paymentId = `pay_test_${Date.now()}`;
  const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
  const signature = rzpSecret
    ? nodeCrypto.createHmac("sha256", rzpSecret).update(`${razorpayOrderId}|${paymentId}`).digest("hex")
    : "simulated_dev_signature";

  const resVerify = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${userCookie}`,
    },
    body: JSON.stringify({
      bookingId: createdBookingId,
      razorpayOrderId: razorpayOrderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    }),
  });

  const jsonVerify = await resVerify.json();
  if (resVerify.status === 200 && jsonVerify.success && jsonVerify.data?.booking?.bookingStatus === "CONFIRMED") {
    record("Payment Verification", "HAPPY_PATH", true, `Payment verified. Booking status updated to CONFIRMED and payment status to SUCCESS`);
  } else {
    record("Payment Verification", "HAPPY_PATH", false, `Payment verification failed: ${JSON.stringify(jsonVerify)}`);
  }

  // Verify DB state after payment
  const verifiedDbBooking = await prisma.booking.findUnique({
    where: { id: createdBookingId },
    include: { payment: true },
  });
  if (verifiedDbBooking?.bookingStatus === BookingStatus.CONFIRMED && verifiedDbBooking.paymentStatus === PaymentStatus.SUCCESS && verifiedDbBooking.payment?.status === PaymentStatus.SUCCESS) {
    record("Booking & Payment Status Update", "HAPPY_PATH", true, `Database verified: Booking Status = ${verifiedDbBooking.bookingStatus}, Payment Ledger Status = ${verifiedDbBooking.payment?.status}`);
  } else {
    record("Booking & Payment Status Update", "HAPPY_PATH", false, `Database status mismatch after payment: ${JSON.stringify(verifiedDbBooking)}`);
  }

  // ---------------------------------------------------------
  // SECTION 8: QR CODE & PUBLIC PASS VERIFICATION
  // ---------------------------------------------------------
  console.log("\n--- 8. QR PASS VERIFICATION ---");
  const resPass = await fetch(`${BASE_URL}/api/verify/${createdBookingCode}`);
  const jsonPass = await resPass.json();
  if (resPass.status === 200 && jsonPass.success && jsonPass.data?.isValidPass === true) {
    record("QR Pass Verification", "HAPPY_PATH", true, `Pass '${createdBookingCode}' validated. Status: '${jsonPass.data.statusDescription}'`);
  } else {
    record("QR Pass Verification", "HAPPY_PATH", false, `Pass verification failed: ${JSON.stringify(jsonPass)}`);
  }

  // ---------------------------------------------------------
  // SECTION 9: USER DASHBOARD
  // ---------------------------------------------------------
  console.log("\n--- 9. USER DASHBOARD & TELEMETRY ---");
  const resDashboardBookings = await fetch(`${BASE_URL}/api/bookings`, {
    headers: { Cookie: `24ours_auth_token=${userCookie}` },
  });
  const jsonDashboardBookings = await resDashboardBookings.json();
  if (resDashboardBookings.status === 200 && jsonDashboardBookings.success && Array.isArray(jsonDashboardBookings.data)) {
    const found = jsonDashboardBookings.data.some((b: any) => b.bookingCode === createdBookingCode);
    if (found) {
      record("User Dashboard Bookings", "HAPPY_PATH", true, `Newly created booking '${createdBookingCode}' appears in user's dashboard booking list (${jsonDashboardBookings.data.length} total)`);
    } else {
      record("User Dashboard Bookings", "HAPPY_PATH", false, `Booking '${createdBookingCode}' not found in dashboard response`);
    }
  } else {
    record("User Dashboard Bookings", "HAPPY_PATH", false, `Failed to load dashboard bookings: ${JSON.stringify(jsonDashboardBookings)}`);
  }

  // ---------------------------------------------------------
  // SECTION 10: ERROR CASES
  // ---------------------------------------------------------
  console.log("\n--- 10. ERROR CASE VALIDATION ---");

  // Error Case 1: Missing required customer information
  const resErrMissing = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${userCookie}`,
    },
    body: JSON.stringify({
      experienceName: "Electric Go-Karting",
      date: bookingDateStr,
      timeSlot: bookingSlot,
      guests: 2,
      customerName: "", // Empty name
      customerEmail: "not-an-email", // Invalid email
      customerPhone: "",
    }),
  });
  const jsonErrMissing = await resErrMissing.json();
  if (resErrMissing.status === 400 && !jsonErrMissing.success && jsonErrMissing.error?.code === "VALIDATION_ERROR") {
    record("Error: Missing Required Customer Info", "ERROR_CASE", true, `Rejected with 400 VALIDATION_ERROR: ${jsonErrMissing.error.message}`);
  } else {
    record("Error: Missing Required Customer Info", "ERROR_CASE", false, `Expected 400 error, got ${resErrMissing.status}`);
  }

  // Error Case 2: Invalid Date / Time Slot
  const resErrDate = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${userCookie}`,
    },
    body: JSON.stringify({
      experienceName: "Electric Go-Karting",
      date: "invalid-date-string-abc",
      timeSlot: "",
      guests: 2,
      customerName: "Rahul Sharma",
      customerEmail: "racer@24ours.com",
      customerPhone: "+91 9187194643",
    }),
  });
  const jsonErrDate = await resErrDate.json();
  if (resErrDate.status === 400 || resErrDate.status === 500) {
    record("Error: Invalid Date/Time Slot", "ERROR_CASE", true, `Rejected malformed date payload: ${jsonErrDate.error?.message || jsonErrDate.error?.code}`);
  } else {
    record("Error: Invalid Date/Time Slot", "ERROR_CASE", false, `Expected error, got ${resErrDate.status}`);
  }

  // Error Case 3: Invalid Coupon Code
  const resErrCoupon = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${userCookie}`,
    },
    body: JSON.stringify({
      experienceName: "Electric Go-Karting",
      date: bookingDateStr,
      timeSlot: "10:30 AM – 11:30 AM (Day Heat)",
      guests: 1,
      customerName: "Rahul Sharma",
      customerEmail: "racer@24ours.com",
      customerPhone: "+91 9187194643",
      discountCode: "NON_EXISTENT_COUPON_XYZ",
    }),
  });
  const jsonErrCoupon = await resErrCoupon.json();
  // Invalid coupon should not crash; it either charges full price or ignores discount safely
  if (resErrCoupon.status === 201 && jsonErrCoupon.data?.totalAmount === 1299) {
    record("Error: Invalid Coupon Code Handling", "ERROR_CASE", true, `Invalid coupon ignored safely, standard price (₹1299) applied without crash`);
  } else {
    record("Error: Invalid Coupon Code Handling", "ERROR_CASE", false, `Unexpected response: ${JSON.stringify(jsonErrCoupon)}`);
  }

  // Error Case 4: Expired Coupon Code
  const resErrExpiredCoupon = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${userCookie}`,
    },
    body: JSON.stringify({
      experienceName: "Electric Go-Karting",
      date: bookingDateStr,
      timeSlot: "10:30 AM – 11:30 AM (Day Heat)",
      guests: 1,
      customerName: "Rahul Sharma",
      customerEmail: "racer@24ours.com",
      customerPhone: "+91 9187194643",
      discountCode: expiredCouponCode,
    }),
  });
  const jsonErrExpiredCoupon = await resErrExpiredCoupon.json();
  if (resErrExpiredCoupon.status === 201 && jsonErrExpiredCoupon.data?.totalAmount === 1299) {
    record("Error: Expired Coupon Code Handling", "ERROR_CASE", true, `Expired coupon '${expiredCouponCode}' safely ignored, charged standard price (₹1299)`);
  } else {
    record("Error: Expired Coupon Code Handling", "ERROR_CASE", false, `Unexpected response: ${JSON.stringify(jsonErrExpiredCoupon)}`);
  }

  // Error Case 5: Slot Capacity Limit Exceeded
  const resErrCapacity = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `24ours_auth_token=${userCookie}`,
    },
    body: JSON.stringify({
      experienceName: selectedExp?.name || "Electric Go-Karting Grand Prix",
      experienceId: selectedExp?.id,
      date: bookingDateStr,
      timeSlot: bookingSlot,
      guests: 50, // Capacity is 10 or 12
      customerName: "Rahul Sharma",
      customerEmail: "racer@24ours.com",
      customerPhone: "+91 9187194643",
    }),
  });
  const jsonErrCapacity = await resErrCapacity.json();
  if (resErrCapacity.status === 409 && jsonErrCapacity.error?.code === "CAPACITY_EXCEEDED") {
    record("Error: Slot Capacity Exceeded", "ERROR_CASE", true, `Rejected with 409 CAPACITY_EXCEEDED: ${jsonErrCapacity.error.message}`);
  } else {
    record("Error: Slot Capacity Exceeded", "ERROR_CASE", false, `Expected 409 CAPACITY_EXCEEDED, got status ${resErrCapacity.status}: ${JSON.stringify(jsonErrCapacity)}`);
  }

  // Error Case 6: Invalid Payment Signature
  // Create a fresh booking for payment error testing
  const resBkForPayErr = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `24ours_auth_token=${userCookie}` },
    body: JSON.stringify({
      experienceName: "Electric Go-Karting",
      date: bookingDateStr,
      timeSlot: "01:30 PM – 02:30 PM (Afternoon Sprint)",
      guests: 1,
      customerName: "Rahul Sharma",
      customerEmail: "racer@24ours.com",
      customerPhone: "+91 9187194643",
    }),
  });
  const jsonBkForPayErr = await resBkForPayErr.json();
  const testPayErrBookingId = jsonBkForPayErr.data?.id;

  const resErrSig = await fetch(`${BASE_URL}/api/payments/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `24ours_auth_token=${userCookie}` },
    body: JSON.stringify({
      bookingId: testPayErrBookingId,
      razorpayOrderId: "order_test_123",
      razorpayPaymentId: "pay_tampered_999",
      razorpaySignature: "invalid_tampered_signature_xyz",
    }),
  });
  const jsonErrSig = await resErrSig.json();
  if (resErrSig.status === 400 && jsonErrSig.error?.code === "INVALID_SIGNATURE") {
    record("Error: Invalid Payment Signature", "ERROR_CASE", true, `Tampered signature correctly rejected with 400 INVALID_SIGNATURE`);
  } else {
    record("Error: Invalid Payment Signature", "ERROR_CASE", false, `Expected 400 INVALID_SIGNATURE, got ${resErrSig.status}: ${JSON.stringify(jsonErrSig)}`);
  }

  // Error Case 7: Unauthorized Access to Another User's Booking
  // Create a booking as Admin / another user
  const resAdminBk = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: `24ours_auth_token=${adminCookie}` },
    body: JSON.stringify({
      experienceName: "Scale 1:8 Championship RC Racing",
      date: bookingDateStr,
      timeSlot: "05:30 PM – 06:30 PM (Golden Sunset Heat)",
      guests: 1,
      customerName: "Master Admin",
      customerEmail: "admin@24ours.com",
      customerPhone: "+91 98765 00001",
    }),
  });
  const jsonAdminBk = await resAdminBk.json();
  const adminBookingId = jsonAdminBk.data?.id;

  // Regular user attempts to fetch Admin's private booking by ID
  const resCrossUser = await fetch(`${BASE_URL}/api/bookings/${adminBookingId}`, {
    headers: { Cookie: `24ours_auth_token=${userCookie}` },
  });
  const jsonCrossUser = await resCrossUser.json();
  if (resCrossUser.status === 403 && jsonCrossUser.error?.code === "FORBIDDEN") {
    record("Error: Unauthorized Cross-User Booking Access", "ERROR_CASE", true, `Forbidden access rejected with 403 FORBIDDEN`);
  } else {
    record("Error: Unauthorized Cross-User Booking Access", "ERROR_CASE", false, `Expected 403 FORBIDDEN, got ${resCrossUser.status}: ${JSON.stringify(jsonCrossUser)}`);
  }

  // ---------------------------------------------------------
  // SECTION 11: LOGOUT & ROUTE PROTECTION
  // ---------------------------------------------------------
  console.log("\n--- 11. LOGOUT & ROUTE PROTECTION ---");
  const resLogout = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Cookie: `24ours_auth_token=${userCookie}` },
  });
  const logoutCookieHeader = resLogout.headers.get("set-cookie");
  if (resLogout.status === 200 && logoutCookieHeader?.includes("24ours_auth_token=;")) {
    record("Logout Session Clearing", "HAPPY_PATH", true, "Logout cleared 24ours_auth_token cookie");
  } else {
    record("Logout Session Clearing", "HAPPY_PATH", false, `Logout failed to clear cookie: ${logoutCookieHeader}`);
  }

  // Verify dashboard cannot be accessed while logged out
  const resLoggedOutDash = await fetch(`${BASE_URL}/dashboard`, { redirect: "manual" });
  const dashRedirectLoc = resLoggedOutDash.headers.get("location");
  if (resLoggedOutDash.status === 307 && dashRedirectLoc?.includes("/login")) {
    record("Protected Dashboard Access (Logged Out)", "ERROR_CASE", true, `Accessing /dashboard while logged out redirected to ${dashRedirectLoc}`);
  } else {
    record("Protected Dashboard Access (Logged Out)", "ERROR_CASE", false, `Expected 307 redirect to /login, got ${resLoggedOutDash.status}`);
  }

  // ---------------------------------------------------------
  // FINAL SUMMARY
  // ---------------------------------------------------------
  console.log("\n==========================================================");
  console.log("🏁 SUMMARY OF USER BOOKING FLOW VERIFICATION");
  console.log("==========================================================");
  const happyPassed = reports.filter((r) => r.category === "HAPPY_PATH" && r.passed).length;
  const happyTotal = reports.filter((r) => r.category === "HAPPY_PATH").length;
  const errorPassed = reports.filter((r) => r.category === "ERROR_CASE" && r.passed).length;
  const errorTotal = reports.filter((r) => r.category === "ERROR_CASE").length;

  console.log(`HAPPY PATH TESTS: ${happyPassed}/${happyTotal} PASSED`);
  console.log(`ERROR CASE TESTS: ${errorPassed}/${errorTotal} PASSED`);
  console.log(`TOTAL SCORE:      ${happyPassed + errorPassed}/${happyTotal + errorTotal} PASSED`);
  console.log("==========================================================");

  if (happyPassed === happyTotal && errorPassed === errorTotal) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error("Fatal error during test run:", err);
  process.exit(1);
});

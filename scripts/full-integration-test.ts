import { prisma } from "../src/lib/prisma";
import { BookingStatus, PaymentStatus, Role } from "@prisma/client";
import { EmailService } from "../src/lib/services/email.service";

interface TestReport {
  name: string;
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];
const createdRecords: Record<string, any[]> = {
  users: [],
  bookings: [],
  payments: [],
};

const BASE_URL = "http://localhost:3000";

async function runTest(name: string, fn: () => Promise<string>) {
  try {
    const details = await fn();
    reports.push({ name, passed: true, details });
    console.log(`✅ [PASS] ${name}: ${details}`);
  } catch (error: any) {
    reports.push({ name, passed: false, details: error.message });
    console.error(`❌ [FAIL] ${name}: ${error.message}`);
  }
}

async function main() {
  console.log("\n=======================================================");
  console.log("🏁 24OURS DRIFT & DINE — PRODUCTION INTEGRATION TEST SUITE");
  console.log("=======================================================\n");

  // Step 2: GET /api/health
  await runTest("Step 2: GET /api/health", async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    const json = await res.json();
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(json)}`);
    if (json.status !== "ok" || json.database !== "connected") {
      throw new Error(`Expected status='ok' & database='connected', got: ${JSON.stringify(json)}`);
    }
    return `status=${json.status}, database=${json.database}`;
  });

  // Step 3: GET /api/experiences
  let seededExperienceSlug = "";
  let seededExperienceName = "";
  await runTest("Step 3: GET /api/experiences", async () => {
    const res = await fetch(`${BASE_URL}/api/experiences`);
    const json = await res.json();
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(json)}`);
    if (!json.success || !Array.isArray(json.data) || json.data.length < 4) {
      throw new Error(`Expected at least 4 experiences, received: ${json.data?.length}`);
    }
    const names = json.data.map((e: any) => `${e.name} (₹${e.basePrice})`);
    seededExperienceSlug = json.data[0].slug;
    seededExperienceName = json.data[0].name;
    return `Found ${json.data.length} experiences: [${names.join(", ")}]`;
  });

  // Step 4: Authentication & Role-Based Access
  let testUserToken = "";
  let adminToken = "";
  const testUserEmail = `driver_${Date.now()}@integration-test.com`;

  await runTest("Step 4a: User Registration", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test Driver",
        email: testUserEmail,
        phone: "+91 99999 88888",
        password: "TestPassword123!",
      }),
    });
    const json = await res.json();
    if (res.status !== 200 && res.status !== 201) throw new Error(`Status ${res.status}: ${JSON.stringify(json)}`);
    if (!json.success || !json.data.token) throw new Error(`Failed to get auth token: ${JSON.stringify(json)}`);
    testUserToken = json.data.token;
    createdRecords.users.push(json.data.user);
    return `User registered: ${json.data.user.email} (Role: ${json.data.user.role})`;
  });

  await runTest("Step 4b: User Login & Session (/api/auth/me)", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUserEmail,
        password: "TestPassword123!",
      }),
    });
    const json = await res.json();
    if (!json.success || !json.data.token) throw new Error(`Login failed: ${JSON.stringify(json)}`);
    testUserToken = json.data.token;

    // Verify /api/auth/me
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const meJson = await meRes.json();
    const userRole = meJson.data?.user?.role || meJson.data?.role;
    if (!meJson.success || userRole !== "USER") {
      throw new Error(`Expected role USER from /api/auth/me, got: ${JSON.stringify(meJson)}`);
    }
    return `Logged in successfully: ${meJson.data.user.name} (${userRole})`;
  });

  await runTest("Step 4c: Admin Login & Role Protection", async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@24ours.com",
        password: "AdminPassword123!",
      }),
    });
    const json = await res.json();
    if (!json.success || !json.data.token) throw new Error(`Admin login failed: ${JSON.stringify(json)}`);
    adminToken = json.data.token;

    // Verify admin endpoint access by Admin
    const adminCheck = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminJson = await adminCheck.json();
    if (adminCheck.status !== 200 || !adminJson.success) {
      throw new Error(`Admin dashboard access failed for ADMIN: ${JSON.stringify(adminJson)}`);
    }

    // Verify admin endpoint blocked for regular USER
    const userCheck = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    if (userCheck.status !== 403) {
      throw new Error(`Expected 403 Forbidden for USER on /api/admin/dashboard, got status: ${userCheck.status}`);
    }

    return `Admin authenticated. Role-based protection confirmed (Admin: 200 OK, User: 403 Forbidden)`;
  });

  // Step 5: Booking flow - Create initial PENDING booking
  let testBookingId = "";
  let testBookingCode = "";
  await runTest("Step 5: Create Booking & Verify PENDING Status", async () => {
    const res = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        experienceName: seededExperienceName,
        date: "2026-11-15",
        timeSlot: "04:00 PM - 05:00 PM",
        guests: 2,
        customerName: "Test Driver",
        customerEmail: testUserEmail,
        customerPhone: "+91 99999 88888",
        specialRequests: "Simulated integration test pass",
      }),
    });
    const json = await res.json();
    if (!json.success || !json.data) throw new Error(`Create booking failed: ${JSON.stringify(json)}`);
    testBookingId = json.data.id;
    testBookingCode = json.data.bookingCode;
    createdRecords.bookings.push({ id: testBookingId, code: testBookingCode, status: json.data.bookingStatus });

    // Verify DB state directly
    const dbBooking = await prisma.booking.findUnique({
      where: { id: testBookingId },
      include: { payment: true },
    });
    if (!dbBooking) throw new Error("Booking not found in Supabase DB");
    if (dbBooking.bookingStatus !== BookingStatus.PENDING || dbBooking.paymentStatus !== PaymentStatus.PENDING) {
      throw new Error(`Expected PENDING/PENDING, got ${dbBooking.bookingStatus}/${dbBooking.paymentStatus}`);
    }

    return `Created booking ${testBookingCode} with status: ${dbBooking.bookingStatus}, total: ₹${dbBooking.totalAmount}`;
  });

  // Step 6: Payment flow - Create Razorpay order & Simulated payment verification
  await runTest("Step 6: Razorpay Order Creation & Payment Verification", async () => {
    // 6a: Create Order
    const orderRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({ bookingId: testBookingId }),
    });
    const orderJson = await orderRes.json();
    if (!orderJson.success || !orderJson.data.orderId) {
      throw new Error(`Failed to create payment order: ${JSON.stringify(orderJson)}`);
    }
    const orderId = orderJson.data.orderId;

    // Verify payment ledger in DB is PENDING with orderId
    const dbPaymentBefore = await prisma.payment.findUnique({ where: { bookingId: testBookingId } });
    if (!dbPaymentBefore || dbPaymentBefore.status !== PaymentStatus.PENDING) {
      throw new Error(`Expected Payment.status=PENDING, got: ${dbPaymentBefore?.status}`);
    }

    // 6b: Verify payment
    const verifyRes = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        bookingId: testBookingId,
        razorpayOrderId: orderId,
        razorpayPaymentId: `pay_sim_${Date.now()}`,
        razorpaySignature: "simulated_dev_signature",
      }),
    });
    const verifyJson = await verifyRes.json();
    if (!verifyJson.success) throw new Error(`Verify payment failed: ${JSON.stringify(verifyJson)}`);

    // Verify DB states
    const dbBookingAfter = await prisma.booking.findUnique({
      where: { id: testBookingId },
      include: { payment: true },
    });
    if (!dbBookingAfter) throw new Error("Booking record missing after payment");
    if (dbBookingAfter.bookingStatus !== BookingStatus.CONFIRMED) {
      throw new Error(`Expected bookingStatus=CONFIRMED, got ${dbBookingAfter.bookingStatus}`);
    }
    if (dbBookingAfter.paymentStatus !== PaymentStatus.SUCCESS) {
      throw new Error(`Expected paymentStatus=SUCCESS, got ${dbBookingAfter.paymentStatus}`);
    }
    if (dbBookingAfter.payment?.status !== PaymentStatus.SUCCESS) {
      throw new Error(`Expected Payment.status=SUCCESS, got ${dbBookingAfter.payment?.status}`);
    }
    if (!dbBookingAfter.payment?.razorpayOrderId || !dbBookingAfter.payment?.razorpayPaymentId) {
      throw new Error("Missing razorpay payment identifiers in ledger");
    }

    createdRecords.payments.push(dbBookingAfter.payment);
    return `Payment verified! Booking: ${dbBookingAfter.bookingStatus}, Payment: ${dbBookingAfter.paymentStatus}, OrderID: ${dbBookingAfter.payment.razorpayOrderId}`;
  });

  // Step 7: Digital Pass & QR Code Generation
  await runTest("Step 7: Digital Pass & QR Code Generation Check", async () => {
    const dbBooking = await prisma.booking.findUnique({ where: { id: testBookingId } });
    if (!dbBooking?.qrCodeUrl) throw new Error("QR Code URL was not generated on confirmed pass");
    return `Confirmed pass QR Code: "${dbBooking.qrCodeUrl}"`;
  });

  // Step 8: Payment Cancellation & Retry flow
  let retryBookingId = "";
  let retryBookingCode = "";
  await runTest("Step 8: Payment Cancellation & Retry Flow", async () => {
    // Create new booking
    const bRes = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${testUserToken}`,
      },
      body: JSON.stringify({
        experienceName: seededExperienceName,
        date: "2026-11-20",
        timeSlot: "07:00 PM - 08:00 PM",
        guests: 1,
        customerName: "Retry Tester",
        customerEmail: testUserEmail,
        customerPhone: "+91 99999 77777",
      }),
    });
    const bJson = await bRes.json();
    retryBookingId = bJson.data.id;
    retryBookingCode = bJson.data.bookingCode;
    createdRecords.bookings.push({ id: retryBookingId, code: retryBookingCode, status: "RETRY_FLOW" });

    // Simulate order generation then cancellation / abandoning
    const ordRes = await fetch(`${BASE_URL}/api/payments/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${testUserToken}` },
      body: JSON.stringify({ bookingId: retryBookingId }),
    });
    const ordJson = await ordRes.json();
    const firstOrderId = ordJson.data.orderId;

    // Confirm booking is still PENDING (not confirmed)
    let bCheck = await prisma.booking.findUnique({ where: { id: retryBookingId } });
    if (bCheck?.bookingStatus !== BookingStatus.PENDING) throw new Error("Booking should still be PENDING");

    // Retry payment with a fresh order / attempt
    const retryVerify = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${testUserToken}` },
      body: JSON.stringify({
        bookingId: retryBookingId,
        razorpayOrderId: firstOrderId,
        razorpayPaymentId: `pay_retry_${Date.now()}`,
        razorpaySignature: "simulated_retry_signature",
      }),
    });
    const retryJson = await retryVerify.json();
    if (!retryJson.success) throw new Error(`Retry verification failed: ${JSON.stringify(retryJson)}`);

    // Verify booking is now CONFIRMED
    bCheck = await prisma.booking.findUnique({ where: { id: retryBookingId } });
    if (bCheck?.bookingStatus !== BookingStatus.CONFIRMED) {
      throw new Error(`Expected CONFIRMED after retry, got: ${bCheck?.bookingStatus}`);
    }

    return `Payment retry succeeded for ${retryBookingCode}: status updated to ${bCheck.bookingStatus}`;
  });

  // Step 9: Test Failed / Invalid Payment Handling
  let failedBookingId = "";
  let failedBookingCode = "";
  await runTest("Step 9: Failed / Signature Mismatch Payment Handling", async () => {
    // Create new booking
    const bRes = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${testUserToken}` },
      body: JSON.stringify({
        experienceName: seededExperienceName,
        date: "2026-11-25",
        timeSlot: "02:00 PM - 03:00 PM",
        guests: 1,
        customerName: "Failed Payment Tester",
        customerEmail: testUserEmail,
        customerPhone: "+91 99999 66666",
      }),
    });
    const bJson = await bRes.json();
    failedBookingId = bJson.data.id;
    failedBookingCode = bJson.data.bookingCode;
    createdRecords.bookings.push({ id: failedBookingId, code: failedBookingCode, status: "FAILED_TEST" });

    // Attempt verification with invalid signature
    const failVerify = await fetch(`${BASE_URL}/api/payments/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${testUserToken}` },
      body: JSON.stringify({
        bookingId: failedBookingId,
        razorpayOrderId: "order_failed_test",
        razorpayPaymentId: "pay_failed_test",
        razorpaySignature: "invalid_mismatch_signature",
      }),
    });
    const failJson = await failVerify.json();
    if (failVerify.status !== 400 || failJson.success !== false) {
      throw new Error(`Expected 400 rejection for invalid signature, got: ${failVerify.status} ${JSON.stringify(failJson)}`);
    }

    // Verify booking is NOT confirmed
    const dbAfter = await prisma.booking.findUnique({ where: { id: failedBookingId } });
    if (dbAfter?.bookingStatus === BookingStatus.CONFIRMED) {
      throw new Error("Booking must not be confirmed after signature failure");
    }

    return `Invalid signature rejected with 400 (${failJson.error?.code}). Booking ${failedBookingCode} paymentStatus set to ${dbAfter?.paymentStatus}`;
  });

  // Step 10: QR Pass Verification API (/api/verify/[code])
  await runTest("Step 10: QR Pass Verification Endpoint (/api/verify/[code])", async () => {
    // 10a: Valid Confirmed Booking
    const validRes = await fetch(`${BASE_URL}/api/verify/${testBookingCode}`);
    const validJson = await validRes.json();
    if (!validJson.success || !validJson.data.isValidPass) {
      throw new Error(`Expected isValidPass=true for confirmed booking, got: ${JSON.stringify(validJson)}`);
    }

    // 10b: Pending/Failed Booking (failedBookingCode)
    const pendingRes = await fetch(`${BASE_URL}/api/verify/${failedBookingCode}`);
    const pendingJson = await pendingRes.json();
    if (!pendingJson.success || pendingJson.data.isValidPass !== false) {
      throw new Error(`Expected isValidPass=false for unconfirmed booking, got: ${JSON.stringify(pendingJson)}`);
    }

    // 10c: Cancelled Booking
    await prisma.booking.update({
      where: { id: failedBookingId },
      data: { bookingStatus: BookingStatus.CANCELLED },
    });
    const cancelledRes = await fetch(`${BASE_URL}/api/verify/${failedBookingCode}`);
    const cancelledJson = await cancelledRes.json();
    if (!cancelledJson.success || cancelledJson.data.isValidPass !== false || !cancelledJson.data.statusDescription.includes("CANCELLED")) {
      throw new Error(`Expected CANCELLED rejection, got: ${JSON.stringify(cancelledJson)}`);
    }

    return `QR Verification: Confirmed Pass -> ACCEPTED (${validJson.data.statusDescription}), Unconfirmed -> REJECTED (${pendingJson.data.statusDescription}), Cancelled -> REJECTED (${cancelledJson.data.statusDescription})`;
  });

  // Step 11: Transactional Emails & Booking Cancellation Endpoint
  await runTest("Step 11: Booking Cancellation & Transactional Email Dispatches", async () => {
    // 11a: Test confirmation email dispatch
    const emailResult = await EmailService.sendBookingNotificationEmails(testBookingId);
    console.log("  Email service confirmation dispatch result:", emailResult);

    // 11b: Cancel retryBookingId via user API endpoint
    const cancelRes = await fetch(`${BASE_URL}/api/bookings/${retryBookingId}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${testUserToken}` },
    });
    const cancelJson = await cancelRes.json();
    if (!cancelJson.success) {
      throw new Error(`Failed to cancel booking via endpoint: ${JSON.stringify(cancelJson)}`);
    }

    const dbCancelled = await prisma.booking.findUnique({ where: { id: retryBookingId } });
    if (dbCancelled?.bookingStatus !== BookingStatus.CANCELLED) {
      throw new Error(`Expected bookingStatus=CANCELLED, got: ${dbCancelled?.bookingStatus}`);
    }

    return `Cancellation completed for ${retryBookingCode}: bookingStatus updated to CANCELLED and email dispatched`;
  });

  // Step 12: Razorpay Webhook Endpoint Handling
  await runTest("Step 12: Razorpay Webhook Event Handling", async () => {
    // 12a: Webhook payment.captured event
    const webhookRes = await fetch(`${BASE_URL}/api/payments/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "payment.captured",
        payload: {
          payment: {
            entity: {
              id: `pay_webhook_${Date.now()}`,
              order_id: `order_webhook_sim`,
              amount: 259800,
              currency: "INR",
              status: "captured",
            },
          },
        },
      }),
    });
    const webhookJson = await webhookRes.json();
    if (webhookRes.status !== 200 || !webhookJson.success) {
      throw new Error(`Webhook handling failed: ${JSON.stringify(webhookJson)}`);
    }

    return `Webhook handler acknowledged event successfully: ${webhookJson.message}`;
  });

  // Step 13: Admin Dashboard Features & Ledger
  await runTest("Step 13: Admin Dashboard KPIs, Bookings & Payment Ledger", async () => {
    // 13a: Dashboard KPIs
    const kpiRes = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const kpiJson = await kpiRes.json();
    if (!kpiJson.success || typeof kpiJson.data.totalBookings !== "number") {
      throw new Error(`Failed to load admin KPIs: ${JSON.stringify(kpiJson)}`);
    }

    // 13b: Bookings List
    const bListRes = await fetch(`${BASE_URL}/api/admin/bookings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const bListJson = await bListRes.json();
    if (!bListJson.success || !Array.isArray(bListJson.data)) {
      throw new Error(`Failed to load admin bookings: ${JSON.stringify(bListJson)}`);
    }

    // 13c: Users List
    const uListRes = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const uListJson = await uListRes.json();
    if (!uListJson.success || !Array.isArray(uListJson.data)) {
      throw new Error(`Failed to load admin users: ${JSON.stringify(uListJson)}`);
    }

    // 13d: Payments List
    const pListRes = await fetch(`${BASE_URL}/api/admin/payments`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const pListJson = await pListRes.json();
    if (!pListJson.success || !Array.isArray(pListJson.data)) {
      throw new Error(`Failed to load admin payments: ${JSON.stringify(pListJson)}`);
    }

    return `Admin Dashboard: ${kpiJson.data.totalBookings} Total Bookings, ${kpiJson.data.totalUsers} Users, ${kpiJson.data.confirmedBookings} Confirmed Passes, ₹${kpiJson.data.totalRevenue} Ledger Revenue`;
  });

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n=======================================================");
  console.log("📊 FULL INTEGRATION TEST SUMMARY");
  console.log("=======================================================");
  console.table(reports);

  const allPassed = reports.every((r) => r.passed);
  if (!allPassed) {
    console.error("\n❌ Some tests failed. Please review errors above.");
    process.exit(1);
  } else {
    console.log("\n🎉 ALL INTEGRATION TESTS PASSED 100%!");
  }
}

main()
  .catch((err) => {
    console.error("Fatal test error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { AuthService } from "../src/lib/services/auth.service";
import { BookingService } from "../src/lib/services/booking.service";
import { AdminService } from "../src/lib/services/admin.service";
import { EnquiryService } from "../src/lib/services/enquiry.service";
import { ContactService } from "../src/lib/services/contact.service";
import { SubscribeService } from "../src/lib/services/subscribe.service";
import { ReviewService } from "../src/lib/services/review.service";
import { PaymentService } from "../src/lib/services/payment.service";
import { generateToken, verifyToken } from "../src/lib/auth";
import { Role, BookingStatus, PaymentStatus } from "@prisma/client";

async function runStagingE2ETestSuite() {
  console.log("\n=======================================================");
  console.log("🏁 24OURS DRIFT & DINE — STAGING E2E AUDIT & VERIFICATION");
  console.log("=======================================================\n");

  const results: Record<string, boolean> = {};

  // 1. Auth Flow: Registration & Login
  console.log("▶ [1. AUTHENTICATION & SESSIONS]");
  try {
    const testEmail = `racer_${Date.now()}@test.com`;
    const regResult = await AuthService.register({
      name: "Staging Test Racer",
      email: testEmail,
      phone: "+91 9187194643",
      password: "TestPassword123!",
    });
    console.log(`  ✓ Registered new driver: ${regResult.user.email} (ID: ${regResult.user.id})`);

    const loginResult = await AuthService.login({
      email: testEmail,
      password: "TestPassword123!",
    });
    console.log(`  ✓ Authenticated session token issued: ${loginResult.token ? "OK (JWT)" : "FAIL"}`);

    const meResult = await AuthService.getMe(regResult.user.id);
    console.log(`  ✓ Session profile loaded: ${meResult.name} (${meResult.role})`);

    results["Authentication & Session"] = true;
  } catch (err: any) {
    console.error("  ❌ Auth failed:", err.message);
    results["Authentication & Session"] = false;
  }

  // 2. Booking Flow & Server-Side Pricing
  console.log("\n▶ [2. BOOKING ENGINE & CAPACITY GUARDS]");
  let createdBookingId = "";
  let createdBookingCode = "";
  try {
    const booking = await BookingService.createBooking({
      experienceName: "Electric Go-Karting Grand Prix",
      date: "2026-12-10",
      timeSlot: "06:00 PM - 07:00 PM",
      guests: 2,
      customerName: "Staging Test Racer",
      customerEmail: "racer_staging@test.com",
      customerPhone: "+91 98765 00000",
      specialRequests: "Trackside helmet sizing",
    });

    createdBookingId = booking.id;
    createdBookingCode = booking.bookingCode;
    console.log(`  ✓ Booking created with code: ${booking.bookingCode}`);
    console.log(`  ✓ Total amount computed server-side: ₹${booking.totalAmount} (Strictly 2 x ₹1299)`);
    console.log(`  ✓ QR Pass Data: ${booking.qrCodeUrl}`);

    results["Booking Engine & Pricing"] = booking.totalAmount === 2598;
  } catch (err: any) {
    console.error("  ❌ Booking failed:", err.message);
    results["Booking Engine & Pricing"] = false;
  }

  // 3. Persistence & Customer Isolation
  console.log("\n▶ [3. DATA PERSISTENCE & CUSTOMER ISOLATION]");
  try {
    const fetchedBooking = await BookingService.getBookingByCode(createdBookingCode);
    console.log(`  ✓ Booking persisted and looked up by code: ${fetchedBooking.bookingCode}`);

    // Verify cross-customer isolation
    try {
      await BookingService.getBookingById(createdBookingId, "unauthorized-user-id", Role.USER);
      console.error("  ❌ Isolation FAILED: Cross-customer access was not blocked!");
      results["Data Persistence & Isolation"] = false;
    } catch (isolationErr: any) {
      console.log(`  ✓ Cross-customer access blocked with: ${isolationErr.message}`);
      results["Data Persistence & Isolation"] = true;
    }
  } catch (err: any) {
    console.error("  ❌ Persistence check failed:", err.message);
    results["Data Persistence & Isolation"] = false;
  }

  // 4. Admin Dashboard KPIs & Management
  console.log("\n▶ [4. MASTER ADMIN KPIS & WORKFLOW]");
  try {
    const kpis = await AdminService.getDashboardKPIs();
    console.log(`  ✓ Total Bookings in DB: ${kpis.totalBookings}`);
    console.log(`  ✓ Total Confirmed Passes: ${kpis.confirmedBookings}`);
    console.log(`  ✓ Total Registered Drivers: ${kpis.totalUsers}`);
    console.log(`  ✓ Total Ledger Revenue: ₹${kpis.totalRevenue}`);

    // Update status as Admin
    const updated = await BookingService.updateBooking(createdBookingId, {
      bookingStatus: BookingStatus.COMPLETED,
      paymentStatus: PaymentStatus.SUCCESS,
    });
    console.log(`  ✓ Admin status update: ${updated.bookingCode} -> ${updated.bookingStatus} / ${updated.paymentStatus}`);

    results["Admin Dashboard & Queue"] = true;
  } catch (err: any) {
    console.error("  ❌ Admin KPI failed:", err.message);
    results["Admin Dashboard & Queue"] = false;
  }

  // 5. Event Enquiries Pipeline
  console.log("\n▶ [5. EVENT ENQUIRIES PIPELINE]");
  try {
    const enquiry = await EnquiryService.createEnquiry({
      name: "Corporate VIP Planner",
      email: "corporate@techsummit.com",
      phone: "+91 98888 77777",
      eventType: "Corporate Grand Prix & Offsite",
      expectedGuests: 75,
      preferredDate: "2026-12-20",
      requirements: "Full track buyout and sky dining catering",
    });
    console.log(`  ✓ Event enquiry submitted: ${enquiry.eventType} for ${enquiry.expectedGuests} guests`);

    const allEnquiries = await EnquiryService.getAllEnquiries();
    console.log(`  ✓ Enquiries pipeline count: ${allEnquiries.length}`);

    const updatedEnq = await EnquiryService.updateEnquiry(enquiry.id, { status: "CONTACTED" });
    console.log(`  ✓ Enquiry status transitioned to: ${updatedEnq.status}`);

    results["Event Enquiries Pipeline"] = true;
  } catch (err: any) {
    console.error("  ❌ Enquiry pipeline failed:", err.message);
    results["Event Enquiries Pipeline"] = false;
  }

  // 6. Concierge Contact & Newsletter
  console.log("\n▶ [6. CONCIERGE MESSAGES & VIP NEWSLETTER]");
  try {
    const msg = await ContactService.createMessage({
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 91234 56789",
      subject: "Paddock Tour",
      message: "Interested in private garage access for supercar club meet.",
    });
    console.log(`  ✓ Concierge message recorded: "${msg.subject}"`);

    const sub = await SubscribeService.subscribe({
      email: "vip_subscriber@test.com",
      name: "VIP Fan",
      interests: ["Electric Karting", "360 Sky Dining"],
    });
    console.log(`  ✓ Newsletter subscription recorded: ${sub.email}`);

    // Duplicate subscription update test
    const subDuplicate = await SubscribeService.subscribe({
      email: "vip_subscriber@test.com",
      name: "VIP Fan Updated",
    });
    console.log(`  ✓ Duplicate subscription updated gracefully: ${subDuplicate.name}`);

    results["Contact & Newsletter"] = true;
  } catch (err: any) {
    console.error("  ❌ Contact/Newsletter failed:", err.message);
    results["Contact & Newsletter"] = false;
  }

  // 7. Customer Reviews
  console.log("\n▶ [7. CUSTOMER REVIEWS]");
  try {
    const review = await ReviewService.createReview({
      authorName: "Kavya Menon",
      rating: 5,
      experience: "Electric Go-Karting Grand Prix",
      comment: "Super smooth torque and amazing track layout! Best destination in Karnataka.",
    });
    console.log(`  ✓ Review published: ${review.authorName} (${review.rating} Stars)`);

    const reviews = await ReviewService.getAllReviews(true);
    console.log(`  ✓ Approved reviews loaded: ${reviews.length}`);

    results["Customer Reviews"] = true;
  } catch (err: any) {
    console.error("  ❌ Review failed:", err.message);
    results["Customer Reviews"] = false;
  }

  // 8. Payment Gateway Architecture (Razorpay Test Mode)
  console.log("\n▶ [8. PAYMENT ARCHITECTURE (RAZORPAY TEST MODE)]");
  try {
    const order = await PaymentService.createOrder(createdBookingId);
    console.log(`  ✓ Razorpay Order generated: ${order.orderId} for ₹${order.amount}`);

    const verifyResult = await PaymentService.verifyPayment({
      bookingId: createdBookingId,
      razorpayOrderId: order.orderId,
      razorpayPaymentId: "pay_test_staging_001",
    });
    console.log(`  ✓ Payment verified and booking updated: ${verifyResult.bookingCode}`);

    results["Payment Architecture"] = true;
  } catch (err: any) {
    console.error("  ❌ Payment failed:", err.message);
    results["Payment Architecture"] = false;
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log("\n=======================================================");
  console.log("📊 STAGING E2E VERIFICATION SUMMARY");
  console.log("=======================================================");
  console.table(results);

  const allPassed = Object.values(results).every(Boolean);
  if (allPassed) {
    console.log("\n🎉 ALL STAGING E2E FLOWS VERIFIED SUCCESSFULLY WITH 100% PASS RATE!\n");
    process.exit(0);
  } else {
    console.error("\n❌ SOME STAGING FLOWS ENCOUNTERED ISSUES.\n");
    process.exit(1);
  }
}

runStagingE2ETestSuite().catch((e) => {
  console.error("Fatal Staging Test Runner Error:", e);
  process.exit(1);
});

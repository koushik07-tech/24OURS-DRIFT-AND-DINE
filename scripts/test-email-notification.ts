import { EmailService } from "../src/lib/services/email.service";

async function testEmailNotifications() {
  console.log("\n=======================================================");
  console.log("🏁 24OURS DRIFT & DINE — EMAIL NOTIFICATION TEST SUITE");
  console.log("=======================================================\n");

  const results: Record<string, boolean> = {};

  // Mock booking object
  const sampleBooking = {
    id: "booking-test-001",
    bookingCode: "TORQ-24O-98214",
    customerName: "Surya Narayana C K",
    customerEmail: "surya.test@example.com",
    customerPhone: "+91 98765 43210",
    experienceName: "Electric Go-Karting Grand Prix",
    date: new Date("2026-08-25T14:00:00Z"),
    timeSlot: "02:00 PM - 03:00 PM",
    guestCount: 4,
    totalAmount: 5196,
    bookingStatus: "CONFIRMED",
    paymentStatus: "SUCCESS",
    qrCodeUrl: "24OURS-PASS:TORQ-24O-98214:2026-08-25:02:00 PM - 03:00 PM",
    notes: "VIP Birthday Celebration with trackside helmet sizing",
    createdAt: new Date(),
    managerEmailSentAt: null,
    customerEmailSentAt: null,
  };

  // Test 1: Manager Email HTML & Text Template Generation
  console.log("▶ [TEST 1] Manager Email Template Content Validation...");
  const managerHtml = (EmailService as any).generateManagerEmailHtml(sampleBooking, "25 August 2026");
  const managerText = (EmailService as any).generateManagerEmailText(sampleBooking, "25 August 2026");

  const hasManagerCode = managerHtml.includes("TORQ-24O-98214");
  const hasManagerName = managerHtml.includes("Surya Narayana C K");
  const hasManagerAmount = managerHtml.includes("5,196");
  const hasManagerNotes = managerHtml.includes("VIP Birthday Celebration");
  const hasManagerPhone = managerHtml.includes("+91 98765 43210");

  if (hasManagerCode && hasManagerName && hasManagerAmount && hasManagerNotes && hasManagerPhone) {
    console.log("  ✓ Manager email template contains all customer, session, financial, and notes fields.");
    results["Manager Template Verification"] = true;
  } else {
    console.error("  ❌ Manager email template missing required fields.");
    results["Manager Template Verification"] = false;
  }

  // Test 2: Customer Email Template Validation
  console.log("\n▶ [TEST 2] Customer Email Template Content Validation...");
  const customerHtml = (EmailService as any).generateCustomerEmailHtml(sampleBooking, "25 August 2026");
  const hasCustomerPass = customerHtml.includes("TORQ-24O-98214");
  const hasCustomerInstructions = customerHtml.includes("Arrival & Trackside Instructions");
  const hasCustomerLocation = customerHtml.includes("Chikkaballapura, Karnataka");

  if (hasCustomerPass && hasCustomerInstructions && hasCustomerLocation) {
    console.log("  ✓ Customer confirmation email contains digital pass code, arrival instructions, and venue address.");
    results["Customer Template Verification"] = true;
  } else {
    console.error("  ❌ Customer email template missing pass code or instructions.");
    results["Customer Template Verification"] = false;
  }

  // Test 3: Environment Variable & Recipient Configuration Check
  console.log("\n▶ [TEST 3] Server Environment Recipient Check...");
  const managerAddress = (EmailService as any).getManagerAddress();
  const fromAddress = (EmailService as any).getFromAddress();
  console.log(`  ✓ Configured Manager Recipient: ${managerAddress}`);
  console.log(`  ✓ Configured From Address:     ${fromAddress}`);

  if (managerAddress && fromAddress) {
    results["Environment Recipient Config"] = true;
  }

  // Test 4: Failure Isolation & Non-Fatal Execution
  console.log("\n▶ [TEST 4] Failure Isolation (Non-Existent Booking ID)...");
  try {
    const outcome = await EmailService.sendBookingNotificationEmails("non-existent-booking-id");
    console.log(`  ✓ Gracefully handled missing/failed booking query without throwing:`, outcome);
    results["Failure Isolation"] = true;
  } catch (err: any) {
    console.error("  ❌ Unexpected crash during email failure handling:", err);
    results["Failure Isolation"] = false;
  }

  // Summary
  console.log("\n=======================================================");
  console.log("📊 EMAIL NOTIFICATION TEST SUMMARY");
  console.log("=======================================================");
  console.table(results);

  const allPassed = Object.values(results).every(Boolean);
  if (allPassed) {
    console.log("\n🎉 ALL EMAIL NOTIFICATION TESTS PASSED SUCCESSFULLY!\n");
    process.exit(0);
  } else {
    console.error("\n❌ SOME TESTS ENCOUNTERED ISSUES.\n");
    process.exit(1);
  }
}

testEmailNotifications().catch((e) => {
  console.error("Fatal Email Test Runner Error:", e);
  process.exit(1);
});

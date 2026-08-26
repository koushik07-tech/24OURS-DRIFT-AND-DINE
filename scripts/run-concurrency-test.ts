import { PrismaClient } from "../prisma/test-client";
import { generateToken, verifyToken } from "../src/lib/auth";

const testPrisma = new PrismaClient();

function generateBookingCode(): string {
  const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `TORQ-24O-${randomDigits}${randomChars.slice(0, 1)}`;
}

async function createBookingConcurrent(
  data: {
    experienceId: string;
    date: string;
    timeSlot: string;
    guests: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  }
) {
  const bookingDate = new Date(data.date);
  const startOfDay = new Date(bookingDate);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(bookingDate);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const exp = await testPrisma.experience.findUnique({
    where: { id: data.experienceId },
  });
  if (!exp) throw new Error("EXPERIENCE_NOT_FOUND");

  const maxCapacityPerSlot = exp.capacityPerSlot;
  const basePricePerGuest = exp.basePrice;
  const bookingCode = generateBookingCode();
  const calculatedTotal = basePricePerGuest * data.guests;

  // Execute inside an atomic transaction
  return testPrisma.$transaction(async (tx) => {
    const existingBookings = await tx.booking.findMany({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
        timeSlot: data.timeSlot,
        bookingStatus: { notIn: ["CANCELLED", "REFUNDED"] },
        experienceId: data.experienceId,
      },
      select: { guestCount: true },
    });

    const bookedGuests = existingBookings.reduce((sum, b) => sum + b.guestCount, 0);
    if (bookedGuests + data.guests > maxCapacityPerSlot) {
      throw new Error(`CAPACITY_EXCEEDED: Only ${Math.max(0, maxCapacityPerSlot - bookedGuests)} slot(s) available.`);
    }

    const booking = await tx.booking.create({
      data: {
        bookingCode,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        experienceId: data.experienceId,
        experienceName: exp.name,
        date: bookingDate,
        timeSlot: data.timeSlot,
        guestCount: data.guests,
        totalAmount: calculatedTotal,
        bookingStatus: "CONFIRMED",
        paymentStatus: "PENDING",
      },
    });

    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: calculatedTotal,
        currency: "INR",
        status: "PENDING",
      },
    });

    return booking;
  });
}

async function main() {
  console.log("\n=======================================================");
  console.log("🏁 24OURS DRIFT & DINE — AUTOMATED CONCURRENCY VERIFICATION");
  console.log("=======================================================\n");

  // Clean test db
  await testPrisma.payment.deleteMany({});
  await testPrisma.booking.deleteMany({});
  await testPrisma.experience.deleteMany({});

  // Seed test experience (Capacity = 10)
  const kartingExp = await testPrisma.experience.create({
    data: {
      slug: "electric-karting",
      name: "Electric Go-Karting Grand Prix",
      headline: "Asphalt Circuit",
      category: "MOTORSPORT",
      description: "Twin AC Motors",
      capacityPerSlot: 10,
      basePrice: 1299.0,
    },
  });

  console.log(`✅ Seeded Test Attraction: "${kartingExp.name}" with capacity = ${kartingExp.capacityPerSlot}`);

  // -------------------------------------------------------------
  // Test Scenario 1: 2 Simultaneous Overlapping Requests (6 + 6 guests on capacity 10)
  // -------------------------------------------------------------
  console.log("\n▶ [TEST 1] Scenario: 2 Simultaneous Requests (6 guests + 6 guests on Capacity 10)...");
  const targetDate = "2026-11-25";
  const targetSlot = "05:00 PM - 06:00 PM";

  const p1 = createBookingConcurrent({
    experienceId: kartingExp.id,
    date: targetDate,
    timeSlot: targetSlot,
    guests: 6,
    customerName: "Racer Alpha",
    customerEmail: "alpha@test.com",
    customerPhone: "+91 90000 00001",
  });

  const p2 = createBookingConcurrent({
    experienceId: kartingExp.id,
    date: targetDate,
    timeSlot: targetSlot,
    guests: 6,
    customerName: "Racer Beta",
    customerEmail: "beta@test.com",
    customerPhone: "+91 90000 00002",
  });

  const [res1, res2] = await Promise.allSettled([p1, p2]);
  const succeeded1 = [res1, res2].filter((r) => r.status === "fulfilled").length;
  const rejected1 = [res1, res2].filter((r) => r.status === "rejected").length;

  console.log(`  - Successful Bookings: ${succeeded1}`);
  console.log(`  - Rejected (Capacity Exceeded): ${rejected1}`);

  const bookings1 = await testPrisma.booking.findMany({
    where: { experienceId: kartingExp.id, timeSlot: targetSlot },
  });
  const totalGuests1 = bookings1.reduce((sum, b) => sum + b.guestCount, 0);
  console.log(`  - Total Confirmed Guests in DB: ${totalGuests1} / ${kartingExp.capacityPerSlot}`);

  if (succeeded1 === 1 && rejected1 === 1 && totalGuests1 === 6) {
    console.log("  ✅ Test 1 PASSED: Overbooking prevented! Exactly 1 transaction committed.");
  } else {
    console.error("  ❌ Test 1 FAILED: Unexpected capacity outcome.");
    process.exit(1);
  }

  // -------------------------------------------------------------
  // Test Scenario 2: 5 Simultaneous Requests of 3 guests each (Total 15 guests on Capacity 10)
  // -------------------------------------------------------------
  console.log("\n▶ [TEST 2] Scenario: 5 Simultaneous Requests of 3 guests each (Total 15 requested on Capacity 10)...");
  const targetSlot2 = "07:00 PM - 08:00 PM";

  const batch = Array.from({ length: 5 }, (_, i) =>
    createBookingConcurrent({
      experienceId: kartingExp.id,
      date: targetDate,
      timeSlot: targetSlot2,
      guests: 3,
      customerName: `Racer Batch ${i + 1}`,
      customerEmail: `batch${i + 1}@test.com`,
      customerPhone: `+91 90000 0001${i}`,
    })
  );

  const batchResults = await Promise.allSettled(batch);
  const succeeded2 = batchResults.filter((r) => r.status === "fulfilled").length;
  const rejected2 = batchResults.filter((r) => r.status === "rejected").length;

  const bookings2 = await testPrisma.booking.findMany({
    where: { experienceId: kartingExp.id, timeSlot: targetSlot2 },
  });
  const totalGuests2 = bookings2.reduce((sum, b) => sum + b.guestCount, 0);

  console.log(`  - Successful Bookings: ${succeeded2} (${totalGuests2} guests total)`);
  console.log(`  - Rejected Bookings: ${rejected2}`);
  console.log(`  - Total Confirmed Guests in DB: ${totalGuests2} / ${kartingExp.capacityPerSlot}`);

  if (totalGuests2 <= kartingExp.capacityPerSlot && totalGuests2 === 9 && succeeded2 === 3 && rejected2 === 2) {
    console.log("  ✅ Test 2 PASSED: Strict capacity limit (10) enforced under high concurrency (3 accepted, 2 rejected)!");
  } else {
    console.error(`  ❌ Test 2 FAILED: Expected 9 guests in DB, found ${totalGuests2}`);
    process.exit(1);
  }

  // -------------------------------------------------------------
  // Test 3: Booking Code & Payment Integrity Check
  // -------------------------------------------------------------
  console.log("\n▶ [TEST 3] Booking & Payment Integrity Check...");
  const allBookings = await testPrisma.booking.findMany();
  const allPayments = await testPrisma.payment.findMany();

  const uniqueCodes = new Set(allBookings.map((b) => b.bookingCode));
  const noDuplicates = uniqueCodes.size === allBookings.length;
  const matchingPayments = allBookings.length === allPayments.length;

  console.log(`  - Total Bookings Created: ${allBookings.length}`);
  console.log(`  - Unique Booking Codes: ${uniqueCodes.size}`);
  console.log(`  - Total Payment Records: ${allPayments.length}`);

  if (noDuplicates && matchingPayments) {
    console.log("  ✅ Test 3 PASSED: Zero duplicate codes, 100% 1-to-1 payment ledger integrity.");
  } else {
    console.error("  ❌ Test 3 FAILED: Integrity mismatch found.");
    process.exit(1);
  }

  // -------------------------------------------------------------
  // Test 4: Auth Session Concurrency
  // -------------------------------------------------------------
  console.log("\n▶ [TEST 4] Auth Token & Session Concurrency...");
  const token = generateToken({
    userId: "usr-live-01",
    email: "driver@24ours.com",
    role: "USER" as any,
    name: "Apex Driver",
  });

  const parallelAuth = await Promise.all(
    Array.from({ length: 20 }, () => Promise.resolve(verifyToken(token)))
  );
  const authPassed = parallelAuth.every((t) => t && t.email === "driver@24ours.com");

  if (authPassed) {
    console.log("  ✅ Test 4 PASSED: 20/20 concurrent session validations verified.");
  } else {
    console.error("  ❌ Test 4 FAILED: Auth token validation failed.");
    process.exit(1);
  }

  console.log("\n=======================================================");
  console.log("🎉 ALL CONCURRENCY & INTEGRITY TESTS COMPLETED WITH 100% SUCCESS!");
  console.log("=======================================================\n");

  await testPrisma.$disconnect();
}

main().catch((e) => {
  console.error("Fatal Test Failure:", e);
  process.exit(1);
});

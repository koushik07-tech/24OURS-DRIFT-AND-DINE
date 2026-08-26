import { prisma } from "../src/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export interface AuditReport {
  timestamp: string;
  totalBookings: number;
  totalPayments: number;
  validRecords: Array<{
    bookingId: string;
    bookingCode: string;
    bookingStatus: string;
    paymentStatus: string;
    paymentLedgerStatus?: string;
    razorpayPaymentId?: string | null;
  }>;
  inconsistentRecords: Array<{
    bookingId: string;
    bookingCode: string;
    bookingStatus: string;
    paymentStatus: string;
    paymentLedgerStatus?: string;
    razorpayPaymentId?: string | null;
    issues: string[];
  }>;
  legacyRecords: Array<{
    bookingId: string;
    bookingCode: string;
    bookingStatus: string;
    paymentStatus: string;
    paymentLedgerStatus?: string;
    issues: string[];
  }>;
}

export async function auditDatabaseState(): Promise<AuditReport> {
  const bookings = await prisma.booking.findMany({
    include: { payment: true },
    orderBy: { createdAt: "asc" },
  });

  const totalPayments = await prisma.payment.count();

  const validRecords: AuditReport["validRecords"] = [];
  const inconsistentRecords: AuditReport["inconsistentRecords"] = [];
  const legacyRecords: AuditReport["legacyRecords"] = [];

  for (const b of bookings) {
    const issues: string[] = [];
    const payment = b.payment;

    // Rule 1: Missing payment record
    if (!payment) {
      issues.push("Missing Payment ledger record");
    }

    // Rule 2: Booking CONFIRMED but payment PENDING or FAILED
    if (b.bookingStatus === BookingStatus.CONFIRMED && b.paymentStatus !== PaymentStatus.SUCCESS) {
      issues.push(`Booking is CONFIRMED but booking.paymentStatus is ${b.paymentStatus}`);
    }
    if (b.bookingStatus === BookingStatus.CONFIRMED && payment && payment.status !== PaymentStatus.SUCCESS) {
      issues.push(`Booking is CONFIRMED but payment.status is ${payment.status}`);
    }

    // Rule 3: Payment status mismatch between Booking and Payment
    if (payment && b.paymentStatus !== payment.status) {
      issues.push(`Payment status mismatch: Booking has ${b.paymentStatus} while Payment ledger has ${payment.status}`);
    }

    // Rule 4: Payment SUCCESS without razorpayPaymentId or razorpayOrderId
    if (payment && payment.status === PaymentStatus.SUCCESS) {
      if (!payment.razorpayPaymentId) {
        issues.push("Payment is SUCCESS but razorpayPaymentId is null");
      }
      if (!payment.razorpayOrderId) {
        issues.push("Payment is SUCCESS but razorpayOrderId is null");
      }
    }

    // Rule 5: Legacy checks (e.g. initial seeded or early test bookings where CONFIRMED occurred with PENDING payment)
    const isLegacy = b.bookingStatus === BookingStatus.CONFIRMED && b.paymentStatus === PaymentStatus.PENDING && (!payment || payment.status === PaymentStatus.PENDING);

    const recordSummary = {
      bookingId: b.id,
      bookingCode: b.bookingCode,
      bookingStatus: b.bookingStatus,
      paymentStatus: b.paymentStatus,
      paymentLedgerStatus: payment?.status,
      razorpayPaymentId: payment?.razorpayPaymentId || null,
    };

    if (issues.length === 0) {
      validRecords.push(recordSummary);
    } else if (isLegacy) {
      legacyRecords.push({ ...recordSummary, issues });
    } else {
      inconsistentRecords.push({ ...recordSummary, issues });
    }
  }

  return {
    timestamp: new Date().toISOString(),
    totalBookings: bookings.length,
    totalPayments,
    validRecords,
    inconsistentRecords,
    legacyRecords,
  };
}

async function main() {
  console.log("=== 24OURS DATABASE STATE AUDIT & RECONCILIATION ===");
  const report = await auditDatabaseState();

  console.log(`\nAudit Timestamp: ${report.timestamp}`);
  console.log(`Total Bookings: ${report.totalBookings}`);
  console.log(`Total Payments: ${report.totalPayments}`);
  console.log(`✓ Valid Records: ${report.validRecords.length}`);
  console.log(`⚠ Inconsistent Records: ${report.inconsistentRecords.length}`);
  console.log(`📁 Legacy Pre-Fix Records: ${report.legacyRecords.length}`);

  if (report.validRecords.length > 0) {
    console.log("\n--- Sample Valid Records ---");
    report.validRecords.slice(-5).forEach((r) => {
      console.log(`  [${r.bookingCode}] Status: ${r.bookingStatus} / Payment: ${r.paymentStatus} / Ledger: ${r.paymentLedgerStatus} / PayId: ${r.razorpayPaymentId}`);
    });
  }

  if (report.legacyRecords.length > 0) {
    console.log("\n--- Legacy Records (Pre-Fix Creation) ---");
    report.legacyRecords.forEach((r) => {
      console.log(`  [${r.bookingCode}] Status: ${r.bookingStatus} / Payment: ${r.paymentStatus} | Issues: ${r.issues.join("; ")}`);
    });
  }

  if (report.inconsistentRecords.length > 0) {
    console.log("\n--- Inconsistent Records ---");
    report.inconsistentRecords.forEach((r) => {
      console.log(`  [${r.bookingCode}] Issues: ${r.issues.join("; ")}`);
    });
  } else {
    console.log("\n✓ No new inconsistent records detected!");
  }
}

if (require.main === module) {
  main()
    .catch((err) => {
      console.error("Audit failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

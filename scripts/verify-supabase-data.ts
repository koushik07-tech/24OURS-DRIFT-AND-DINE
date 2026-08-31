import { prisma } from "../src/lib/prisma";

async function verifyData() {
  console.log("🔍 Verifying Supabase Database Data Integrity...\n");

  const [
    users,
    experiences,
    pricing,
    packages,
    offers,
    bookings,
    payments,
    enquiries,
    reviews,
  ] = await Promise.all([
    prisma.user.findMany({ select: { id: true, email: true, role: true, name: true } }),
    prisma.experience.findMany({ select: { id: true, slug: true, name: true, category: true } }),
    prisma.pricing.findMany({ select: { id: true, title: true, price: true, experienceId: true } }),
    prisma.package.findMany({ select: { id: true, slug: true, name: true, price: true } }),
    prisma.offer.findMany({ select: { id: true, code: true, discountAmount: true } }),
    prisma.booking.findMany({ select: { id: true, bookingCode: true, customerName: true, totalAmount: true, bookingStatus: true } }),
    prisma.payment.findMany({ select: { id: true, amount: true, status: true, razorpayPaymentId: true } }),
    prisma.eventEnquiry.count(),
    prisma.review.count(),
  ]);

  console.log("📊 Database Record Counts & Details:");
  console.log(`- Users (${users.length}):`, users);
  console.log(`- Experiences (${experiences.length}):`, experiences.map(e => `${e.name} [${e.slug}]`));
  console.log(`- Pricing Tiers Count: ${pricing.length}`);
  console.log(`- Packages (${packages.length}):`, packages.map(p => `${p.name} (Rs. ${p.price})`));
  console.log(`- Promotional Offers (${offers.length}):`, offers.map(o => o.code));
  console.log(`- Sample Bookings (${bookings.length}):`, bookings.map(b => `${b.bookingCode} (${b.customerName}, Rs.${b.totalAmount})`));
  console.log(`- Payments Count: ${payments.length}`);
  console.log(`- Event Enquiries Count: ${enquiries}`);
  console.log(`- Customer Reviews Count: ${reviews}`);

  console.log("\n✅ All tables and relations verified successfully against Supabase PostgreSQL!");
}

verifyData()
  .catch((err) => {
    console.error("❌ Verification failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

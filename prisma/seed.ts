import { PrismaClient, Role, BookingStatus, PaymentStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_PRODUCTION_SEED !== "true") {
    console.warn("⚠️  PRODUCTION SAFETY GUARD: Database seeding is blocked in production to prevent overwriting live credentials.");
    console.warn("If you intentionally want to seed initial catalog data in production, run with ALLOW_PRODUCTION_SEED=true");
    return;
  }

  console.log("🌱 Starting 24OURS Drift & Dine Database Seeding...");

  // 1. Seed Users (Development / Staging Only)
  const adminPasswordHash = await bcrypt.hash("AdminPassword123!", 10);
  const racerPasswordHash = await bcrypt.hash("RacerPassword123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@24ours.com" },
    update: {
      name: "Master Admin",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
    create: {
      name: "Master Admin",
      email: "admin@24ours.com",
      phone: "+91 98765 00001",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
  });

  const racer = await prisma.user.upsert({
    where: { email: "racer@24ours.com" },
    update: {
      name: "Rahul Sharma",
      role: Role.USER,
      passwordHash: racerPasswordHash,
    },
    create: {
      name: "Rahul Sharma",
      email: "racer@24ours.com",
      phone: "+91 98765 43210",
      role: Role.USER,
      passwordHash: racerPasswordHash,
    },
  });

  console.log(`✅ Seeded Users: ${admin.email} (ADMIN), ${racer.email} (USER)`);

  // 2. Seed Experiences
  const experiences = [
    {
      slug: "electric-karting",
      name: "Electric Go-Karting Grand Prix",
      headline: "Multi-Level Championship Asphalt Circuit",
      category: "MOTORSPORT",
      description: "Experience 15kW instantaneous torque with twin AC motors, active regenerative braking, and live transponder lap telemetry.",
      durationMinutes: 30,
      minAge: 12,
      capacityPerSlot: 12,
      basePrice: 1299.0,
      posterImageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
      pricing: {
        create: [
          { title: "Single Heat (10 Mins)", price: 699, duration: "10 Mins", features: ["1x Kart Heat", "Gear Included", "Telemetry Report"] },
          { title: "Grand Prix Sprint (25 Mins)", price: 1299, duration: "25 Mins", features: ["2x Racing Heats", "Podium Medal", "Full Telemetry"], isPopular: true },
          { title: "Pro Championship (45 Mins)", price: 2199, duration: "45 Mins", features: ["Qualifying + 2 Heats", "Telemetry Analysis", "Sky Deck Mocktail"] },
        ],
      },
    },
    {
      slug: "rc-racing-arena",
      name: "Scale 1:8 RC Racing Arena",
      headline: "Clay & Turf Professional Off-Road Track",
      category: "COMPETITION",
      description: "High-spec 1:8 scale brushless RC buggies and trophy trucks racing on a dedicated all-weather stadium course.",
      durationMinutes: 30,
      minAge: 8,
      capacityPerSlot: 8,
      basePrice: 599.0,
      posterImageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      pricing: {
        create: [
          { title: "RC Rookie Session", price: 399, duration: "15 Mins", features: ["1x Scale Buggy", "Practice Track"] },
          { title: "RC Master Tournament", price: 799, duration: "30 Mins", features: ["Pro Brushless Car", "Live Lap Scoring", "Tournament Entry"], isPopular: true },
        ],
      },
    },
    {
      slug: "sky-dining",
      name: "360° Panoramic Sky Restaurant",
      headline: "Suspended 50-Meter Horizon Vantage Dining",
      category: "HOSPITALITY",
      description: "Fine dining overlooking the Chikkaballapura countryside hills and racing circuit below with curated international gourmet menus.",
      durationMinutes: 90,
      minAge: 0,
      capacityPerSlot: 30,
      basePrice: 1899.0,
      posterImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      pricing: {
        create: [
          { title: "Sunset Sky Lounge Pass", price: 999, duration: "60 Mins", features: ["Welcome Mocktail", "Chef Tapas Selection"] },
          { title: "360° 4-Course Skyline Dinner", price: 1899, duration: "90 Mins", features: ["4-Course Chef Menu", "Reserved Perimeter Seating", "Mocktail Pairing"], isPopular: true },
        ],
      },
    },
    {
      slug: "vr-simulator-arena",
      name: "6-DOF Hydraulic VR Simulator Rig",
      headline: "Championship Simulation Pods",
      category: "VIRTUAL RACING",
      description: "Full-motion hydraulic pods mirroring real G-forces, force-feedback direct drive steering, and immersive 4K VR headsets.",
      durationMinutes: 20,
      minAge: 10,
      capacityPerSlot: 6,
      basePrice: 499.0,
      posterImageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
      pricing: {
        create: [
          { title: "Single Rig Session", price: 499, duration: "15 Mins", features: ["1x Circuit of Choice", "Full Hydraulic Motion"] },
          { title: "Pro Duel Challenge", price: 899, duration: "30 Mins", features: ["Head-to-Head Battle", "Telemetry Comparison"], isPopular: true },
        ],
      },
    },
  ];

  for (const exp of experiences) {
    const { pricing, ...expData } = exp;
    await prisma.experience.upsert({
      where: { slug: exp.slug },
      update: expData,
      create: {
        ...expData,
        pricing,
      },
    });
  }
  console.log(`✅ Seeded Experiences (${experiences.length})`);

  // 3. Seed Packages
  const packages = [
    {
      name: "RACE PACK",
      slug: "race-pack",
      description: "The ultimate track day package for speed enthusiasts seeking pure lap telemetry and kart combat.",
      price: 1899.0,
      duration: "90 Mins",
      minGuests: 1,
      maxGuests: 6,
      isFeatured: true,
    },
    {
      name: "FAMILY PACK",
      slug: "family-pack",
      description: "Designed for families to race, play, and dine together across multiple interactive zones.",
      price: 3499.0,
      duration: "3 Hours",
      minGuests: 4,
      maxGuests: 6,
      isFeatured: true,
    },
    {
      name: "ADVENTURE PACK",
      slug: "adventure-pack",
      description: "Combine real asphalt karting with 6-DOF hydraulic VR motion simulator pod sessions.",
      price: 2499.0,
      duration: "2 Hours",
      minGuests: 1,
      maxGuests: 4,
      isFeatured: false,
    },
    {
      name: "CORPORATE PACK",
      slug: "corporate-pack",
      description: "Comprehensive corporate retreat package combining track tournament scoring, banquet presentation, and sky dining.",
      price: 4999.0,
      duration: "Half Day",
      minGuests: 10,
      maxGuests: 50,
      isFeatured: true,
    },
    {
      name: "BIRTHDAY PACK",
      slug: "birthday-pack",
      description: "High-octane birthday party experience with private activity access, custom cake cutting, and arcade play.",
      price: 3999.0,
      duration: "2.5 Hours",
      minGuests: 6,
      maxGuests: 20,
      isFeatured: false,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }
  console.log(`✅ Seeded Packages (${packages.length})`);

  // 4. Seed Offers
  const offers = [
    {
      code: "LAUNCH24",
      name: "VIP Pre-Launch 20% Discount",
      discountType: "PERCENTAGE",
      discountAmount: 20.0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      usageLimit: 500,
    },
    {
      code: "SPEED100",
      name: "Flat Rs. 100 Off First Race",
      discountType: "FIXED",
      discountAmount: 100.0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      usageLimit: 1000,
    },
  ];

  for (const off of offers) {
    await prisma.offer.upsert({
      where: { code: off.code },
      update: off,
      create: off,
    });
  }

  // 5. Seed Initial Bookings
  const sampleBooking1 = await prisma.booking.upsert({
    where: { bookingCode: "TORQ-24O-98214" },
    update: {},
    create: {
      bookingCode: "TORQ-24O-98214",
      userId: racer.id,
      customerName: "Rahul Sharma",
      customerEmail: "rahul@example.com",
      customerPhone: "+91 98765 43210",
      experienceName: "Electric Go-Karting Grand Prix",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      timeSlot: "05:00 PM - 06:00 PM (Sunset Slot)",
      guestCount: 2,
      totalAmount: 2598.0,
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.SUCCESS,
      qrCodeUrl: "24OURS-PASS:TORQ-24O-98214",
      payment: {
        create: {
          amount: 2598.0,
          currency: "INR",
          status: PaymentStatus.SUCCESS,
          razorpayPaymentId: "pay_sample_test_001",
        },
      },
    },
  });

  const sampleBooking2 = await prisma.booking.upsert({
    where: { bookingCode: "TORQ-24O-74621" },
    update: {},
    create: {
      bookingCode: "TORQ-24O-74621",
      userId: racer.id,
      customerName: "Ananya Verma",
      customerEmail: "ananya@example.com",
      customerPhone: "+91 98765 43211",
      experienceName: "360° Panoramic Sky Restaurant",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      timeSlot: "08:00 PM - 09:30 PM (Lounge Slot)",
      guestCount: 4,
      totalAmount: 7596.0,
      bookingStatus: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.SUCCESS,
      qrCodeUrl: "24OURS-PASS:TORQ-24O-74621",
      payment: {
        create: {
          amount: 7596.0,
          currency: "INR",
          status: PaymentStatus.SUCCESS,
          razorpayPaymentId: "pay_sample_test_002",
        },
      },
    },
  });

  console.log(`✅ Seeded Sample Bookings: ${sampleBooking1.bookingCode}, ${sampleBooking2.bookingCode}`);

  // 6. Seed Sample Event Enquiry
  await prisma.eventEnquiry.create({
    data: {
      name: "Vikramaditya Rao",
      email: "vikram@techcorp.com",
      phone: "+91 98765 11223",
      eventType: "Corporate Grand Prix & Offsite",
      expectedGuests: 60,
      preferredDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      preferredTime: "10:00 AM - 06:00 PM",
      requirements: "Circuit tournament with podium ceremony and 360 sky dining buffet dinner.",
      status: "PENDING",
    },
  });

  // 7. Seed Sample Reviews
  await prisma.review.createMany({
    data: [
      {
        authorName: "Karan Singhania",
        rating: 5,
        experience: "Electric Go-Karting Grand Prix",
        comment: "The torque on these karts is unbelievable! The multi-level elevation track feels like a mini Monaco.",
        isApproved: true,
      },
      {
        authorName: "Pooja Hegde",
        rating: 5,
        experience: "360° Sky Dining",
        comment: "Breathtaking views of the highway and hills. The sunset mocktails and gourmet dinner were extraordinary.",
        isApproved: true,
      },
      {
        authorName: "Arjun Reddy",
        rating: 5,
        experience: "RC Racing Arena",
        comment: "Best RC stadium track in South India. Professional timing gates and very competitive!",
        isApproved: true,
      },
    ],
    skipDuplicates: true,
  });

  console.log("🏁 24OURS Database Seeding Finished Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

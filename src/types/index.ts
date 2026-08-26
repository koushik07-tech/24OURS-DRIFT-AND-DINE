export type Role = "USER" | "ADMIN" | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  token?: string;
}

export interface Experience {
  id: string;
  slug: string;
  number: string;
  name: string;
  headline: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  specs?: Record<string, string>;
  heroVideo?: string;
  posterImage: string;
  actionText: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  experienceName: string;
  date: string;
  timeSlot: string;
  guests: number;
  guestCount?: number;
  totalAmount?: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED";
  bookingStatus?: string;
  paymentStatus?: string;
  payment?: {
    id?: string;
    amount?: number;
    currency?: string;
    razorpayOrderId?: string | null;
    razorpayPaymentId?: string | null;
    status?: string;
  } | null;
  qrData?: string;
  qrCodeUrl?: string | null;
  createdAt: string;
  specialRequests?: string;
}


export interface EventEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  expectedGuests: string;
  preferredDate: string;
  requirements: string;
  createdAt: string;
}

export interface AutomotiveVehicle {
  id: string;
  name: string;
  category: string;
  power: string;
  topSpeed: string;
  acceleration: string;
  chassis: string;
  brakes: string;
  image: string;
  desc: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  type: "image" | "video";
  src: string;
  alt: string;
  aspect?: string;
}

export interface LeaderboardEntry {
  rank: number;
  driver: string;
  kart: string;
  lapTime: string;
  gap: string;
  date: string;
}

export interface RCLeaderboardEntry {
  rank: number;
  racer: string;
  car: string;
  lapTime: string;
  points: number;
}

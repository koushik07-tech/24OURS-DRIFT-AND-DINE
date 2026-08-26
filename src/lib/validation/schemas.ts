import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const bookingCreateSchema = z.object({
  experienceName: z.string().optional(),
  experienceId: z.string().optional(),
  packageId: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  guests: z.number().int().min(1, "At least 1 guest required").max(50, "Max 50 guests per direct booking"),
  customerName: z.string().min(2, "Customer name is required"),
  customerEmail: z.string().email("Valid customer email is required"),
  customerPhone: z.string().min(8, "Valid phone number is required"),
  specialRequests: z.string().optional(),
  discountCode: z.string().optional(),
});

export const bookingUpdateSchema = z.object({
  bookingStatus: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REFUNDED"]).optional(),
  paymentStatus: z.enum(["PENDING", "SUCCESS", "FAILED", "REFUNDED"]).optional(),
  notes: z.string().optional(),
});

export const enquiryCreateSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  eventType: z.string().min(2, "Event type is required"),
  expectedGuests: z.union([z.number(), z.string()]).transform((val) => {
    const parsed = parseInt(String(val), 10);
    return isNaN(parsed) ? 1 : parsed;
  }),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  requirements: z.string().optional(),
  message: z.string().optional(),
});

export const enquiryUpdateSchema = z.object({
  status: z.enum(["PENDING", "CONTACTED", "QUOTED", "BOOKED", "CLOSED"]).optional(),
  message: z.string().optional(),
});

export const subscribeSchema = z.object({
  email: z.string().email("A valid email address is required"),
  name: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export const reviewCreateSchema = z.object({
  authorName: z.string().min(2, "Author name is required"),
  rating: z.number().int().min(1).max(5),
  experience: z.string().min(2, "Experience is required"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export const paymentVerifySchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().min(1, "Razorpay payment ID is required"),
  razorpaySignature: z.string().optional(),
});

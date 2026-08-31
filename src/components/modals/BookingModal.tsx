"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, Users, User, Mail, Phone, CheckCircle2, ArrowRight, ShieldCheck, Flag, Printer, AlertCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useBooking } from "@/context/BookingContext";
import { siteConfig } from "@/config/site";
import { loadRazorpayScript } from "@/lib/utils/razorpay";

const experiencesList = [
  "Electric Go-Karting Grand Prix",
  "Scale 1:8 RC Racing Arena",
  "360° Panoramic Sky Restaurant",
  "6-DOF Hydraulic VR Simulator Rig",
  "Stadium Live Screening Zone",
  "Family Paddock Fun Arena",
];

const experiencePriceMap: Record<string, number> = {
  "Electric Go-Karting Grand Prix": 1299,
  "Scale 1:8 RC Racing Arena": 599,
  "360° Panoramic Sky Restaurant": 1899,
  "6-DOF Hydraulic VR Simulator Rig": 499,
  "Stadium Live Screening Zone": 799,
  "Family Paddock Fun Arena": 699,
};

const timeSlotsList = [
  "11:00 AM - 12:00 PM",
  "12:30 PM - 01:30 PM",
  "02:00 PM - 03:00 PM",
  "03:30 PM - 04:30 PM",
  "05:00 PM - 06:00 PM (Sunset Slot)",
  "06:30 PM - 07:30 PM (Sunset Slot)",
  "08:00 PM - 09:00 PM (Night Track)",
  "09:30 PM - 10:30 PM (Night Track)",
];

export default function BookingModal() {
  const { isBookingOpen, closeBookingModal, selectedExperienceName } = useBooking();

  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState(selectedExperienceName || experiencesList[0]);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState(timeSlotsList[4]);
  const [guests, setGuests] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  if (!isBookingOpen) return null;

  const currentPricePerGuest = experiencePriceMap[experience] || 1299;
  const estimatedTotal = currentPricePerGuest * guests;

  const handleNext = () => {
    setPaymentError(null);
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    setPaymentError(null);
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);
    setIsSubmitting(true);

    try {
      // 1. Ensure Razorpay Checkout SDK is loaded in browser
      const isSdkLoaded = await loadRazorpayScript();
      if (!isSdkLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your internet connection and try again.");
      }

      // 2. Create PENDING booking on backend
      const bookingRes = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceName: experience,
          date,
          timeSlot,
          guests: Number(guests),
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim().toLowerCase(),
          customerPhone: customerPhone.trim(),
          specialRequests: specialRequests.trim() || undefined,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok || !bookingData.success) {
        throw new Error(bookingData.error?.message || "Failed to create booking reservation.");
      }

      const pendingBooking = bookingData.data;

      // 3. Create Razorpay order on backend (server calculates price strictly from DB)
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: pendingBooking.id }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error?.message || "Failed to create payment order.");
      }

      const order = orderData.data;
      const razorpayKey = order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!razorpayKey) {
        throw new Error("Razorpay Key ID is missing.");
      }

      // 4. Open Razorpay Checkout modal
      const options = {
        key: razorpayKey,
        amount: order.amountInPaise,
        currency: order.currency || "INR",
        name: "24OURS — Drift & Dine",
        description: `${experience} (${guests} Guest${guests > 1 ? "s" : ""})`,
        order_id: order.orderId,
        prefill: {
          name: customerName.trim(),
          email: customerEmail.trim(),
          contact: customerPhone.trim(),
        },
        theme: {
          color: "#E10600",
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
            setPaymentError("Payment was cancelled or closed. Your booking remains pending and unconfirmed.");
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setIsSubmitting(false);
          setIsVerifying(true);
          try {
            // 5. Send returned payment credentials to backend for cryptographic signature verification
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: pendingBooking.id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // 6. ONLY upon successful verified signature: Mark confirmed and issue digital pass!
              const confirmed = {
                ...pendingBooking,
                ...verifyData.data?.booking,
                bookingStatus: "CONFIRMED",
                paymentStatus: "SUCCESS",
                qrData: `24OURS-PASS:${pendingBooking.bookingCode}:${date}:${timeSlot}`,
              };
              setConfirmedBooking(confirmed);
              setStep(4);
            } else {
              setPaymentError(verifyData.error?.message || "Payment verification failed. Reservation not confirmed.");
            }
          } catch (verifyErr: any) {
            setPaymentError(verifyErr.message || "Network error while verifying payment with server.");
          } finally {
            setIsVerifying(false);
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (failedRes: any) => {
        setIsSubmitting(false);
        setPaymentError(`Payment failed: ${failedRes.error?.description || "Transaction declined by gateway."}`);
      });

      rzp.open();
    } catch (err: any) {
      setPaymentError(err.message || "An unexpected error occurred during payment initiation.");
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setPaymentError(null);
    setConfirmedBooking(null);
    closeBookingModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative max-w-2xl w-full bg-carbon-950 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-carbon-900 border border-white/10 text-carbon-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 mb-6">
          <span className="text-xs font-mono text-brand-red uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5" />
            24OURS Concierge Booking Paddock
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
            {step === 4 ? "PASS ISSUED & CONFIRMED" : "RESERVE YOUR EXPERIENCE"}
          </h3>
          <p className="text-xs text-carbon-400 font-sans">
            Malur, Kolar, Karnataka Destination • Instant digital ticket pass generation
          </p>
        </div>

        {/* Step Progress Tracker (Steps 1-3) */}
        {step < 4 && (
          <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-carbon-900 border border-white/10 text-center text-xs font-mono mb-6">
            <div className={`py-1.5 rounded-lg ${step === 1 ? "bg-brand-red text-white font-bold" : "text-carbon-400"}`}>
              1. Experience
            </div>
            <div className={`py-1.5 rounded-lg ${step === 2 ? "bg-brand-red text-white font-bold" : "text-carbon-400"}`}>
              2. Date & Time
            </div>
            <div className={`py-1.5 rounded-lg ${step === 3 ? "bg-brand-red text-white font-bold" : "text-carbon-400"}`}>
              3. Guest Details
            </div>
          </div>
        )}

        {/* Step 1: Experience Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-xs font-mono text-carbon-400 uppercase">
              Select Destination Attraction
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experiencesList.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setExperience(exp)}
                  className={`p-4 rounded-2xl text-left border text-xs font-mono transition-all ${
                    experience === exp
                      ? "bg-carbon-850 border-brand-red text-white font-bold shadow-glow-red"
                      : "bg-carbon-900/60 border-white/10 text-carbon-300 hover:border-white/20"
                  }`}
                >
                  <p className="text-white text-sm font-heading font-bold">{exp}</p>
                  <span className="text-[10px] text-brand-red mt-1 block uppercase">● AVAILABLE</span>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2"
              >
                <span>Select Date & Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Date & Slot */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Select Visit Date</label>
                <input
                  type="date"
                  value={date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-brand-red"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Racers / Guests Count</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-10 h-10 rounded-xl bg-carbon-850 border border-white/10 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="text-lg font-display font-bold text-white w-8 text-center">{guests}</span>
                  <button
                    type="button"
                    onClick={() => setGuests(guests + 1)}
                    className="w-10 h-10 rounded-xl bg-carbon-850 border border-white/10 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-carbon-400 uppercase mb-2">Available Time Slots</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlotsList.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`p-2.5 rounded-xl text-[11px] font-mono text-left border transition-all ${
                      timeSlot === slot
                        ? "bg-brand-red text-white border-brand-red font-bold"
                        : "bg-carbon-900 border-white/10 text-carbon-300 hover:border-white/20"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl bg-carbon-900 border border-white/10 text-white text-xs font-mono"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2"
              >
                <span>Guest Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Guest Details & Payment */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {paymentError && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/70 border border-brand-red/50 text-red-200 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-white">Payment Unconfirmed</p>
                  <p className="text-carbon-300">{paymentError}</p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 9187194643"
                  className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Special Requirements / Notes</label>
              <textarea
                rows={2}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any celebration notes, dietary preferences, or lap telemetry requirements..."
                className="w-full px-4 py-2 bg-carbon-950 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-brand-red"
              />
            </div>

            {/* Order Summary & Pricing Preview */}
            <div className="p-3.5 rounded-2xl bg-carbon-900 border border-white/10 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-carbon-400 block text-[11px] uppercase tracking-wider">
                  Total Amount ({guests} {guests > 1 ? "Guests" : "Guest"})
                </span>
                <span className="text-emerald-400 font-bold text-lg">
                  ₹{estimatedTotal.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-carbon-500 block">₹{currentPricePerGuest.toLocaleString("en-IN")} per guest</span>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-md bg-carbon-950 border border-white/10 text-[10px] text-carbon-300 flex items-center gap-1.5 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-red" />
                  Razorpay Secured
                </span>
              </div>
            </div>

            <div className="pt-2 text-xs font-mono text-carbon-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Digital boarding pass and QR token are generated only after verified payment.</span>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting || isVerifying}
                className="px-5 py-2.5 rounded-xl bg-carbon-900 border border-white/10 text-white text-xs font-mono disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isVerifying}
                className="px-6 py-3 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Opening Checkout...</span>
                  </>
                ) : isVerifying ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Payment...</span>
                  </>
                ) : (
                  <span>PAY & CONFIRM RESERVATION</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Pass Boarding Card Result with QR Code */}
        {step === 4 && confirmedBooking && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-carbon-900 border border-white/15 space-y-6">
              
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-carbon-400 uppercase">Booking Reference Code</span>
                  <p className="text-xl sm:text-2xl font-mono font-black text-brand-red">
                    {confirmedBooking.bookingCode}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                  ● CONFIRMED PASS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3 text-xs font-mono text-carbon-300">
                  <div>
                    <span className="text-carbon-500 text-[10px] block">Attraction</span>
                    <span className="text-white font-bold text-sm">{confirmedBooking.experienceName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-carbon-500 text-[10px] block">Date</span>
                      <span className="text-white font-bold">{confirmedBooking.date}</span>
                    </div>
                    <div>
                      <span className="text-carbon-500 text-[10px] block">Slot</span>
                      <span className="text-brand-red font-bold">{confirmedBooking.timeSlot}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-carbon-500 text-[10px] block">Guest / Driver</span>
                    <span className="text-white">{confirmedBooking.customerName} ({confirmedBooking.guests} Guests)</span>
                  </div>
                </div>

                <div className="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-black text-center">
                  <QRCodeSVG
                    value={confirmedBooking.qrData}
                    size={110}
                    bgColor="#FFFFFF"
                    fgColor="#0A0A0A"
                  />
                  <span className="text-[8px] font-mono uppercase tracking-widest text-carbon-600 font-bold mt-1.5">
                    Scan at Pit-Lane Kiosk
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-carbon-900 border border-white/10 text-xs font-mono text-white hover:border-brand-red flex items-center gap-2"
              >
                <Printer className="w-4 h-4 text-brand-red" />
                <span>Print Ticket</span>
              </button>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

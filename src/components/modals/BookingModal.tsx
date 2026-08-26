"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, Users, User, Mail, Phone, CheckCircle2, ArrowRight, ShieldCheck, Flag, Printer, AlertCircle, CreditCard, RotateCcw, Check, Sparkles, AlertTriangle, Ban, Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useBooking } from "@/context/BookingContext";
import { paymentsApi } from "@/lib/api/payments";
import { bookingsApi } from "@/lib/api/bookings";
import { loadRazorpayScript } from "@/lib/utils/razorpay";

const experiencesList = [
  "Electric Go-Karting Grand Prix",
  "Scale 1:8 Championship RC Racing",
  "RC Virtual Gaming Zone & Simulator",
  "RC High-Speed Boat Basin",
  "RC Tactical Tank Combat Arena",
  "RC Plane & Aviation Zone",
  "Half-Road FPV Headset RC Racing",
  "Kidz Zone Junior Adventure",
  "360° Signature Panoramic Dining (Non-Alcoholic)",
  "Grand Event & Banquet Booking",
  "Corporate CCC Championship Package",
  "Automotive & Flux Motors VIP Tour",
];

const timeSlotsList = [
  { label: "12:00 AM – 01:00 AM (Midnight Heat)", blocked: false },
  { label: "01:30 AM – 02:30 AM (Late Night Track)", blocked: false },
  { label: "03:00 AM – 04:00 AM (Pre-Maintenance)", blocked: false },
  { label: "04:00 AM – 07:00 AM (Daily Maintenance Window)", blocked: true },
  { label: "07:30 AM – 08:30 AM (Morning Sprint)", blocked: false },
  { label: "09:00 AM – 10:00 AM (Paddock Session)", blocked: false },
  { label: "10:30 AM – 11:30 AM (Day Heat)", blocked: false },
  { label: "12:00 PM – 01:00 PM (Midday Session)", blocked: false },
  { label: "01:30 PM – 02:30 PM (Afternoon Sprint)", blocked: false },
  { label: "02:30 PM – 03:30 PM (Student Window)", blocked: false },
  { label: "04:00 PM – 05:00 PM (Student Window)", blocked: false },
  { label: "05:30 PM – 06:30 PM (Golden Sunset Heat)", blocked: false },
  { label: "07:00 PM – 08:00 PM (Twilight Session)", blocked: false },
  { label: "08:30 PM – 09:30 PM (Night Lights Grand Prix)", blocked: false },
  { label: "10:00 PM – 11:00 PM (Night Rush)", blocked: false },
  { label: "11:00 PM – 12:00 AM (Midnight Warmup)", blocked: false },
];

function getEstimatedPrice(exp: string, guestCount: number) {
  let unit = 1299;
  const l = exp.toLowerCase();
  if (l.includes("sky dining") || l.includes("restaurant") || l.includes("360")) unit = 1899;
  else if (l.includes("rc")) unit = 599;
  else if (l.includes("vr") || l.includes("simulator")) unit = 499;
  return unit * guestCount;
}

export default function BookingModal() {
  const { isBookingOpen, closeBookingModal, selectedExperienceName, createBooking, refreshBookings } = useBooking();

  const [step, setStep] = useState(1);
  const [experience, setExperience] = useState(selectedExperienceName || experiencesList[0]);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("05:30 PM – 06:30 PM (Golden Sunset Heat)");
  const [guests, setGuests] = useState(2);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  
  // Loading & State variables
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [pendingBooking, setPendingBooking] = useState<any>(null);
  const [paymentOrder, setPaymentOrder] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [simulatedPrompt, setSimulatedPrompt] = useState(false);
  const [isPaymentFailed, setIsPaymentFailed] = useState(false);

  if (!isBookingOpen) return null;

  const handleNext = () => {
    setErrorMessage("");
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    setErrorMessage("");
    if (step > 1) setStep(step - 1);
  };

  // Initiate or retry the payment process
  const initiatePayment = async (existingBooking?: any) => {
    if (isSubmitting) return; // Prevent double-clicking
    setErrorMessage("");
    setIsPaymentFailed(false);
    setIsSubmitting(true);

    try {
      // 1. Create booking in PENDING state (or reuse existing pending reservation if retrying)
      let b = existingBooking || pendingBooking;
      if (!b) {
        setLoadingText("Reserving session slot...");
        b = await createBooking({
          experienceName: experience,
          date,
          timeSlot,
          guests,
          customerName,
          customerEmail,
          customerPhone,
          specialRequests,
        });
        setPendingBooking(b);
      }

      // 2. Request server-side Razorpay order creation
      setLoadingText("Initializing Razorpay Gateway...");
      const orderRes = await paymentsApi.createOrder(b.id);
      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.error?.message || "Failed to initialize payment gateway order.");
      }

      const orderData = orderRes.data;
      setPaymentOrder(orderData);

      // 3. Check if simulated DEV mode or real Razorpay checkout
      if (orderData.isSimulated) {
        setSimulatedPrompt(true);
        setIsSubmitting(false);
        setLoadingText("");
        return;
      }

      // 4. Live / Configured Razorpay Checkout Flow
      setLoadingText("Loading secure checkout...");
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your network connection.");
      }

      const rzpOptions = {
        key: orderData.keyId,
        amount: orderData.amountInPaise,
        currency: orderData.currency || "INR",
        name: "24OURS — DRIFT & DINE",
        description: `${experience} (${orderData.bookingCode})`,
        order_id: orderData.orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#e11d48",
        },
        modal: {
          ondismiss: function () {
            // User cancelled/closed checkout: return to safe pending state without displaying failure
            setIsSubmitting(false);
            setLoadingText("");
            setErrorMessage("Payment checkout closed. Payment pending — your booking is not confirmed yet. You can retry payment anytime below.");
          },
        },
        handler: async function (response: any) {
          try {
            setIsSubmitting(true);
            setLoadingText("Verifying payment on server...");
            setErrorMessage("");

            // 5. Verify cryptographic signature on the server
            const verifyRes = await paymentsApi.verifyPayment({
              bookingId: b.id,
              razorpayOrderId: response.razorpay_order_id || orderData.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (!verifyRes.success || !verifyRes.data) {
              setIsPaymentFailed(true);
              throw new Error("Payment verification failed — your booking has not been confirmed.");
            }

            const confirmed = verifyRes.data.booking || {
              ...b,
              bookingStatus: "CONFIRMED",
              paymentStatus: "SUCCESS",
              status: "CONFIRMED",
            };

            setConfirmedBooking(confirmed);
            setStep(4);
            await refreshBookings();
          } catch (err: any) {
            setIsPaymentFailed(true);
            setErrorMessage(err.message || "Payment verification failed — your booking has not been confirmed.");
          } finally {
            setIsSubmitting(false);
            setLoadingText("");
          }
        },
      };

      const rzp = new (window as any).Razorpay(rzpOptions);
      rzp.on("payment.failed", function (resp: any) {
        console.error("[RazorpaySDK] Payment failed event:", resp.error);
        setIsPaymentFailed(true);
        setErrorMessage(`Payment verification failed — your booking has not been confirmed: ${resp.error?.description || "Transaction declined."}`);
        setIsSubmitting(false);
        setLoadingText("");
      });
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to proceed to payment.");
      setIsSubmitting(false);
      setLoadingText("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initiatePayment();
  };

  // Handler for Developer Simulated Success
  const handleSimulatedSuccess = async () => {
    if (isSubmitting || !pendingBooking || !paymentOrder) return;
    setIsSubmitting(true);
    setLoadingText("Verifying simulated payment...");
    setErrorMessage("");
    setIsPaymentFailed(false);

    try {
      const simPaymentId = `pay_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const verifyRes = await paymentsApi.verifyPayment({
        bookingId: pendingBooking.id,
        razorpayOrderId: paymentOrder.orderId,
        razorpayPaymentId: simPaymentId,
        razorpaySignature: "simulated_dev_signature",
      });

      if (!verifyRes.success || !verifyRes.data) {
        setIsPaymentFailed(true);
        throw new Error("Payment verification failed — your booking has not been confirmed.");
      }

      const confirmed = verifyRes.data.booking || {
        ...pendingBooking,
        bookingStatus: "CONFIRMED",
        paymentStatus: "SUCCESS",
        status: "CONFIRMED",
      };

      setConfirmedBooking(confirmed);
      setSimulatedPrompt(false);
      setStep(4);
      await refreshBookings();
    } catch (err: any) {
      setIsPaymentFailed(true);
      setErrorMessage(err.message || "Payment verification failed — your booking has not been confirmed.");
    } finally {
      setIsSubmitting(false);
      setLoadingText("");
    }
  };

  // Handler for Simulated Cancellation / Retry Test
  const handleSimulatedCancel = () => {
    setSimulatedPrompt(false);
    setIsSubmitting(false);
    setIsPaymentFailed(false);
    setErrorMessage("Payment checkout closed. Payment pending — your booking is not confirmed yet. You can click 'Retry Payment' below.");
  };

  // Handler for Simulated Signature Mismatch (Testing Rejection)
  const handleSimulatedSignatureFailure = async () => {
    if (isSubmitting || !pendingBooking || !paymentOrder) return;
    setIsSubmitting(true);
    setLoadingText("Testing server signature rejection...");
    setErrorMessage("");

    try {
      const simPaymentId = `pay_sim_fail_${Date.now()}`;
      const verifyRes = await paymentsApi.verifyPayment({
        bookingId: pendingBooking.id,
        razorpayOrderId: paymentOrder.orderId,
        razorpayPaymentId: simPaymentId,
        razorpaySignature: "invalid_bad_signature_mismatch",
      });

      if (!verifyRes.success) {
        setIsPaymentFailed(true);
        setSimulatedPrompt(false);
        setErrorMessage("Payment verification failed — your booking has not been confirmed.");
      }
    } catch (err: any) {
      setIsPaymentFailed(true);
      setSimulatedPrompt(false);
      setErrorMessage(err.message || "Payment verification failed — your booking has not been confirmed.");
    } finally {
      setIsSubmitting(false);
      setLoadingText("");
      await refreshBookings();
    }
  };

  // Handler for Retrying Payment
  const handleRetryPayment = () => {
    setIsPaymentFailed(false);
    setErrorMessage("");
    initiatePayment(pendingBooking);
  };

  // Handler for Cancelling Pending/Failed Booking
  const handleCancelBooking = async () => {
    if (pendingBooking?.id) {
      try {
        setIsSubmitting(true);
        setLoadingText("Cancelling reservation...");
        await bookingsApi.cancelBooking(pendingBooking.id);
        await refreshBookings();
      } catch (err) {
        console.error("Error cancelling booking:", err);
      } finally {
        setIsSubmitting(false);
        setLoadingText("");
      }
    }
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setStep(1);
    setConfirmedBooking(null);
    setPendingBooking(null);
    setPaymentOrder(null);
    setSimulatedPrompt(false);
    setIsPaymentFailed(false);
    setErrorMessage("");
    setLoadingText("");
    closeBookingModal();
  };

  const estimatedTotal = getEstimatedPrice(experience, guests);

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
            Chikkaballapura Destination • Instant digital ticket pass generation upon verified payment
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
              3. Guest & Payment
            </div>
          </div>
        )}

        {errorMessage && !isPaymentFailed && (
          <div className="mb-6 p-3 rounded-xl bg-red-950/60 border border-brand-red/50 text-red-300 text-xs font-mono flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-brand-red shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Step 1: Experience Selection */}
        {step === 1 && (
          <div className="space-y-4">
            <label className="block text-xs font-mono text-carbon-400 uppercase">
              Select Destination Attraction
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
              {experiencesList.map((exp) => (
                <button
                  key={exp}
                  type="button"
                  onClick={() => setExperience(exp)}
                  className={`p-3.5 rounded-2xl text-left border text-xs font-mono transition-all ${
                    experience === exp
                      ? "bg-carbon-850 border-brand-red text-white font-bold shadow-glow-red"
                      : "bg-carbon-900/60 border-white/10 text-carbon-300 hover:border-white/20"
                  }`}
                >
                  <p className="text-white text-xs sm:text-sm font-heading font-bold">{exp}</p>
                  <span className="text-[10px] text-brand-red mt-1 block uppercase">● AVAILABLE FOR BOOKING</span>
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
                <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Guests / Drivers Count</label>
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
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono text-carbon-400 uppercase">24-Hour Time Slots</label>
                <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  4 AM – 7 AM Maintenance Locked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {timeSlotsList.map((slot) => {
                  const isBlocked = slot.blocked;
                  const isSelected = timeSlot === slot.label;
                  return (
                    <button
                      key={slot.label}
                      type="button"
                      disabled={isBlocked}
                      onClick={() => !isBlocked && setTimeSlot(slot.label)}
                      className={`p-2.5 rounded-xl text-[11px] font-mono text-left border transition-all ${
                        isBlocked
                          ? "bg-carbon-950/80 border-red-900/30 text-carbon-600 cursor-not-allowed opacity-50 line-through"
                          : isSelected
                          ? "bg-brand-red text-white border-brand-red font-bold shadow-glow-red"
                          : "bg-carbon-900 border-white/10 text-carbon-300 hover:border-white/20"
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
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
                <span>Guest Details & Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Guest Details & Razorpay Checkout */}
        {step === 3 && (
          <div className="space-y-4">
            {isPaymentFailed ? (
              /* Dedicated Payment Failure State View */
              <div className="p-6 rounded-3xl bg-carbon-900 border border-red-500/40 space-y-5 animate-fadeIn">
                <div className="flex items-center gap-2 text-brand-red font-mono text-xs font-bold uppercase">
                  <AlertTriangle className="w-5 h-5 text-brand-red" />
                  <span>PAYMENT VERIFICATION FAILED</span>
                </div>

                <div className="p-4 bg-red-950/40 border border-red-800/40 rounded-2xl text-red-200 text-xs font-mono space-y-2">
                  <p className="font-bold text-sm text-red-100">
                    Payment verification failed — your booking has not been confirmed.
                  </p>
                  <p className="text-red-300/80 text-[11px]">
                    {errorMessage || "Cryptographic signature validation failed. No charge was confirmed for your ticket pass."}
                  </p>
                </div>

                {pendingBooking && (
                  <div className="p-4 bg-carbon-950 rounded-2xl border border-white/10 font-mono text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-carbon-400">Booking Reference:</span>
                      <span className="text-brand-red font-bold">{pendingBooking.bookingCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-carbon-400">Attraction:</span>
                      <span className="text-white">{pendingBooking.experienceName || experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-carbon-400">Booking Status:</span>
                      <span className="text-amber-400 font-bold">PENDING PAYMENT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-carbon-400">Amount Due:</span>
                      <span className="text-emerald-400 font-bold">₹{pendingBooking.totalAmount?.toLocaleString("en-IN") || estimatedTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleRetryPayment}
                    className="py-3 px-4 rounded-xl bg-brand-red hover:bg-brand-redDark text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-red disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                    <span>{isSubmitting ? (loadingText || "Processing...") : "Retry Payment"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleCancelBooking}
                    className="py-3 px-4 rounded-xl bg-carbon-850 hover:bg-carbon-800 border border-white/10 text-carbon-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Ban className="w-4 h-4 text-carbon-400" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              </div>
            ) : simulatedPrompt ? (
              /* Simulated Payment Prompt for Development */
              <div className="p-6 rounded-3xl bg-carbon-900 border border-brand-red/40 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-brand-red font-mono text-xs font-bold uppercase">
                  <Sparkles className="w-4 h-4" />
                  <span>DEVELOPMENT / SIMULATED PAYMENT GATEWAY</span>
                </div>

                <p className="text-xs text-carbon-300 font-sans">
                  Razorpay test credentials are in simulated developer mode. Select an action to test the server verification, retry behavior, or idempotency:
                </p>

                <div className="p-3 bg-carbon-950 rounded-xl border border-white/10 font-mono text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-carbon-400">Order ID:</span>
                    <span className="text-white">{paymentOrder?.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-carbon-400">Amount:</span>
                    <span className="text-emerald-400 font-bold">₹{paymentOrder?.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-carbon-400">Booking Code:</span>
                    <span className="text-brand-red font-bold">{paymentOrder?.bookingCode}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSimulatedSuccess}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{isSubmitting ? (loadingText || "Verifying...") : "Simulate Payment Success (Authorize & Issue Pass)"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSimulatedCancel}
                    className="w-full py-2.5 rounded-xl bg-carbon-850 hover:bg-carbon-800 border border-white/10 text-carbon-300 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Cancel / Close Checkout (Keep PENDING for Retry)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSimulatedSignatureFailure}
                    className="w-full py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>Simulate Signature Mismatch (Test Rejection)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Step 3 Guest Form */
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Special Requirements / Celebration Notes</label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any celebration notes, dietary preferences, or lap telemetry requirements..."
                    className="w-full px-4 py-2 bg-carbon-950 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-brand-red"
                  />
                </div>

                {/* Pricing & Guarantee Summary */}
                <div className="p-4 rounded-2xl bg-carbon-900 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-carbon-400">Attraction:</span>
                    <span className="text-white font-bold">{experience}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-carbon-400">Total Drivers / Guests:</span>
                    <span className="text-white font-bold">{guests}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-mono border-t border-white/10 pt-2">
                    <span className="text-carbon-300 font-bold uppercase">Estimated Amount (INR):</span>
                    <span className="text-emerald-400 font-bold text-base">₹{estimatedTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-2 text-xs font-mono text-carbon-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Secure 256-bit encrypted Razorpay Checkout. Pass issued immediately upon verified payment.</span>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 rounded-xl bg-carbon-900 border border-white/10 text-white text-xs font-mono"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                    <span>{isSubmitting ? (loadingText || "Initializing Gateway...") : `PAY ₹${estimatedTotal.toLocaleString("en-IN")} & CONFIRM PASS`}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
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
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                    ● CONFIRMED PASS (PAID)
                  </span>
                </div>
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
                      <span className="text-white font-bold">
                        {typeof confirmedBooking.date === "string" && confirmedBooking.date.includes("T")
                          ? new Date(confirmedBooking.date).toLocaleDateString("en-IN")
                          : confirmedBooking.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-carbon-500 text-[10px] block">Slot</span>
                      <span className="text-brand-red font-bold">{confirmedBooking.timeSlot}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-carbon-500 text-[10px] block">Guest / Driver</span>
                    <span className="text-white">{confirmedBooking.customerName} ({confirmedBooking.guestCount || confirmedBooking.guests || guests} Guests)</span>
                  </div>
                  <div>
                    <span className="text-carbon-500 text-[10px] block">Amount Paid</span>
                    <span className="text-emerald-400 font-bold">₹{confirmedBooking.totalAmount?.toLocaleString("en-IN") || estimatedTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="md:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-black text-center">
                  <QRCodeSVG
                    value={
                      confirmedBooking.qrCodeUrl ||
                      confirmedBooking.qrData ||
                      `24OURS-PASS:${confirmedBooking.bookingCode}:${confirmedBooking.date}:${confirmedBooking.timeSlot}`
                    }
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

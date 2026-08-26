"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ShieldAlert, ArrowLeft, Calendar, Clock, Users, Mail, Phone, 
  CreditCard, CheckCircle2, AlertCircle, XCircle, Loader2, Flag, 
  QrCode, Send, RefreshCw, Lock
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export default function AdminBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params?.id as string;

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooking() {
      if (!bookingId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/bookings/${encodeURIComponent(bookingId)}`);
        const json = await res.json();
        if (json.success && json.data) {
          setBooking(json.data);
        } else {
          setError(json.error?.message || "Failed to load booking details.");
        }
      } catch {
        setError("Network error loading booking details.");
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center text-white font-mono">
        <Loader2 className="w-8 h-8 text-brand-red animate-spin mr-3" />
        <span>Loading Booking Ledger...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 max-w-2xl mx-auto text-white text-center font-mono space-y-4">
        <AlertCircle className="w-12 h-12 text-brand-red mx-auto" />
        <h2 className="text-xl font-bold uppercase">Booking Not Found</h2>
        <p className="text-xs text-carbon-400">{error || "The requested booking ID does not exist."}</p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-carbon-900 border border-white/10 text-xs text-white hover:border-brand-red"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Admin Console</span>
        </Link>
      </div>
    );
  }

  const payment = booking.payment;
  const isConfirmed = booking.bookingStatus === "CONFIRMED" && booking.paymentStatus === "SUCCESS";

  return (
    <div className="pt-32 pb-20 min-h-screen subtle-grid text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-carbon-900 border border-white/10 text-carbon-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-mono text-brand-red uppercase tracking-wider font-bold">
                Booking Reference Audit
              </span>
              <h1 className="text-2xl font-mono font-black text-white">{booking.bookingCode}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
              isConfirmed
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : booking.bookingStatus === "CANCELLED"
                ? "bg-red-500/20 text-brand-red border-red-500/30"
                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
            }`}>
              {booking.bookingStatus} • {booking.paymentStatus}
            </span>
          </div>
        </div>

        {/* 3-Column Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Col 1: Customer & Experience Info */}
          <div className="p-6 rounded-3xl bg-carbon-950 border border-white/10 space-y-6 font-mono text-xs shadow-card-elevated">
            <h3 className="font-heading font-bold text-sm text-white uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-red" />
              <span>Customer & Session</span>
            </h3>

            <div className="space-y-3 text-carbon-300">
              <div>
                <span className="text-carbon-500 text-[10px] block">Customer Name</span>
                <span className="text-white font-bold">{booking.customerName}</span>
              </div>
              <div>
                <span className="text-carbon-500 text-[10px] block">Contact Email</span>
                <span className="text-white">{booking.customerEmail}</span>
              </div>
              <div>
                <span className="text-carbon-500 text-[10px] block">Contact Phone</span>
                <span className="text-white">{booking.customerPhone}</span>
              </div>
              <div className="border-t border-white/10 pt-3">
                <span className="text-carbon-500 text-[10px] block">Experience Attraction</span>
                <span className="text-brand-red font-bold">{booking.experienceName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-carbon-500 text-[10px] block">Date</span>
                  <span className="text-white font-bold">
                    {new Date(booking.date).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-carbon-500 text-[10px] block">Guests</span>
                  <span className="text-white font-bold">{booking.guestCount} Drivers</span>
                </div>
              </div>
              <div>
                <span className="text-carbon-500 text-[10px] block">Time Slot</span>
                <span className="text-white">{booking.timeSlot}</span>
              </div>
              {booking.notes && (
                <div className="border-t border-white/10 pt-2">
                  <span className="text-carbon-500 text-[10px] block">Special Notes</span>
                  <span className="text-carbon-400 italic">"{booking.notes}"</span>
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Payment Ledger Details */}
          <div className="p-6 rounded-3xl bg-carbon-950 border border-white/10 space-y-6 font-mono text-xs shadow-card-elevated">
            <h3 className="font-heading font-bold text-sm text-white uppercase flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Payment Ledger Record</span>
            </h3>

            {payment ? (
              <div className="space-y-3 text-carbon-300">
                <div className="flex justify-between items-center">
                  <span className="text-carbon-500">Ledger Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    payment.status === "SUCCESS" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                  }`}>
                    {payment.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-carbon-500">Amount</span>
                  <span className="text-emerald-400 font-bold text-sm">₹{payment.amount?.toLocaleString("en-IN")} ({payment.currency})</span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <span className="text-carbon-500 text-[10px] block">Razorpay Order ID</span>
                  <span className="text-white font-mono">{payment.razorpayOrderId || "None"}</span>
                </div>
                <div>
                  <span className="text-carbon-500 text-[10px] block">Razorpay Payment ID</span>
                  <span className="text-white font-mono">{payment.razorpayPaymentId || "None"}</span>
                </div>
                <div>
                  <span className="text-carbon-500 text-[10px] block">Cryptographic Signature</span>
                  <span className="text-carbon-400 font-mono text-[10px] truncate block">
                    {payment.razorpaySignature ? `${payment.razorpaySignature.slice(0, 24)}...` : "None"}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-2">
                  <span className="text-carbon-500 text-[10px] block">Payment Ledger Created</span>
                  <span className="text-carbon-400">{new Date(payment.createdAt).toLocaleString("en-IN")}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-carbon-900 rounded-xl text-center text-carbon-400">
                No payment ledger record found for this booking.
              </div>
            )}
          </div>

          {/* Col 3: Lifecycle Timeline & Pass */}
          <div className="p-6 rounded-3xl bg-carbon-950 border border-white/10 space-y-6 font-mono text-xs shadow-card-elevated">
            <h3 className="font-heading font-bold text-sm text-white uppercase flex items-center gap-2">
              <QrCode className="w-4 h-4 text-brand-red" />
              <span>Pass & Lifecycle Timeline</span>
            </h3>

            {/* QR Code Pass */}
            {isConfirmed && (
              <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center text-black space-y-2">
                <QRCodeSVG
                  value={`24OURS-PASS:${booking.bookingCode}:${booking.date}:${booking.timeSlot}`}
                  size={100}
                />
                <span className="text-[9px] font-bold uppercase tracking-wider text-carbon-700">
                  QR Pass Valid for Entry
                </span>
              </div>
            )}

            {/* Step-by-Step Timeline */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                <div>
                  <p className="text-white font-bold">1. Booking Created</p>
                  <p className="text-[10px] text-carbon-400">{new Date(booking.createdAt).toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${payment?.razorpayOrderId ? "bg-emerald-400" : "bg-carbon-600"}`} />
                <div>
                  <p className="text-white font-bold">2. Payment Order Created</p>
                  <p className="text-[10px] text-carbon-400">{payment?.razorpayOrderId ? "Order Generated" : "Pending"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${payment?.status === "SUCCESS" ? "bg-emerald-400" : payment?.status === "FAILED" ? "bg-brand-red" : "bg-carbon-600"}`} />
                <div>
                  <p className="text-white font-bold">3. Payment Authorization</p>
                  <p className="text-[10px] text-carbon-400">Status: {payment?.status || "PENDING"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className={`w-2 h-2 rounded-full mt-1 shrink-0 ${isConfirmed ? "bg-emerald-400" : "bg-carbon-600"}`} />
                <div>
                  <p className="text-white font-bold">4. Pass Issued & Emails</p>
                  <p className="text-[10px] text-carbon-400">
                    Customer: {booking.customerEmailSentAt ? "Dispatched" : "Pending"} • Manager: {booking.managerEmailSentAt ? "Dispatched" : "Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

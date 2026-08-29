"use client";

import React, { useState } from "react";
import { X, Building2, Send, CheckCircle2, ShieldCheck, Sparkles, Calendar, Users, Phone, Mail } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

export default function EnquiryModal() {
  const { isEnquiryOpen, closeEnquiryModal, createEnquiry } = useBooking();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "Corporate Grand Prix & Offsite",
    expectedGuests: "50",
    preferredDate: "",
    requirements: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isEnquiryOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEnquiry(formData);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    closeEnquiryModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative max-w-xl w-full bg-carbon-950 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl text-left max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-carbon-900 border border-white/10 text-carbon-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 mb-6">
          <span className="text-xs font-mono text-brand-red uppercase tracking-widest font-semibold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            Turnkey Event Production
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-black text-white uppercase">
            BESPOKE EVENT ENQUIRY
          </h3>
          <p className="text-xs text-carbon-400 font-sans">
            Corporate retreats, milestone birthdays, wedding celebrations & tournament offsites.
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Vikramaditya Rao"
                className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="vikram@company.com"
                  className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Mobile Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9187194643"
                  className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Event Type</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-brand-red"
                >
                  <option>Corporate Grand Prix & Offsite</option>
                  <option>Milestone Birthday Celebration</option>
                  <option>Wedding / Sangeet / Reception</option>
                  <option>Automotive Meet & Product Launch</option>
                  <option>Private Destination Gathering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Expected Guests</label>
                <input
                  type="number"
                  value={formData.expectedGuests}
                  onChange={(e) => setFormData({ ...formData, expectedGuests: e.target.value })}
                  placeholder="50"
                  className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-red"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Preferred Date</label>
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-carbon-950 border border-white/15 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-brand-red"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-carbon-400 uppercase mb-1">Requirements & Vision</label>
              <textarea
                rows={3}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="Tell us about your catering, staging, racing tournament, or DJ requirements..."
                className="w-full px-4 py-2 bg-carbon-950 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-brand-red text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-brand-redDark shadow-glow-red flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Dispatching..." : "SUBMIT BESPOKE ENQUIRY"}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center mx-auto text-brand-red">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-display font-bold text-white uppercase">Enquiry Dispatched!</h4>
            <p className="text-xs text-carbon-300 max-w-sm mx-auto font-sans leading-relaxed">
              Thank you, <span className="text-white font-bold">{formData.name}</span>. Our senior event producer will review your requirements and reply to <span className="text-brand-red font-mono">{formData.email}</span> within 24 hours.
            </p>
            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-xl bg-carbon-900 border border-white/10 text-white font-mono text-xs hover:border-brand-red"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

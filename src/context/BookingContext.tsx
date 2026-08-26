"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Booking, EventEnquiry } from "@/types";
import { bookingsApi } from "@/lib/api/bookings";
import { enquiriesApi } from "@/lib/api/enquiries";

interface BookingContextType {
  isBookingOpen: boolean;
  openBookingModal: (defaultExperience?: string) => void;
  closeBookingModal: () => void;
  isEnquiryOpen: boolean;
  openEnquiryModal: (defaultType?: string) => void;
  closeEnquiryModal: () => void;
  selectedExperienceName: string;
  setSelectedExperienceName: (name: string) => void;
  allBookings: Booking[];
  createBooking: (details: {
    experienceName?: string;
    experienceId?: string;
    packageId?: string;
    date: string;
    timeSlot: string;
    guests: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    specialRequests?: string;
    discountCode?: string;
  }) => Promise<Booking>;
  allEnquiries: EventEnquiry[];
  createEnquiry: (details: {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    expectedGuests: string | number;
    preferredDate?: string;
    preferredTime?: string;
    requirements?: string;
    message?: string;
  }) => Promise<EventEnquiry>;
  activeBookingPass: Booking | null;
  setActiveBookingPass: (b: Booking | null) => void;
  refreshBookings: () => Promise<void>;
  refreshEnquiries: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedExperienceName, setSelectedExperienceName] = useState("Electric Go-Karting Grand Prix");
  const [activeBookingPass, setActiveBookingPass] = useState<Booking | null>(null);

  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [allEnquiries, setAllEnquiries] = useState<EventEnquiry[]>([]);

  const refreshBookings = useCallback(async () => {
    try {
      const res = await bookingsApi.getBookings();
      if (res.success && res.data) {
        setAllBookings(res.data);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    }
  }, []);

  const refreshEnquiries = useCallback(async () => {
    try {
      const res = await enquiriesApi.getAllEnquiries();
      if (res.success && res.data) {
        setAllEnquiries(res.data);
      }
    } catch {
      // ignore if non-admin
    }
  }, []);

  useEffect(() => {
    refreshBookings();
    refreshEnquiries();
  }, [refreshBookings, refreshEnquiries]);

  const openBookingModal = (defaultExp?: string) => {
    if (defaultExp) setSelectedExperienceName(defaultExp);
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => setIsBookingOpen(false);

  const openEnquiryModal = (defaultType?: string) => {
    setIsEnquiryOpen(true);
  };

  const closeEnquiryModal = () => setIsEnquiryOpen(false);

  const createBooking = async (details: {
    experienceName?: string;
    experienceId?: string;
    packageId?: string;
    date: string;
    timeSlot: string;
    guests: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    specialRequests?: string;
    discountCode?: string;
  }) => {
    const res = await bookingsApi.createBooking(details);
    if (!res.success || !res.data) {
      throw new Error(res.error?.message || "Failed to create booking reservation.");
    }

    const newBooking = res.data;
    setAllBookings((prev) => [newBooking, ...prev]);
    setActiveBookingPass(newBooking);
    return newBooking;
  };

  const createEnquiry = async (details: {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    expectedGuests: string | number;
    preferredDate?: string;
    preferredTime?: string;
    requirements?: string;
    message?: string;
  }) => {
    const res = await enquiriesApi.createEnquiry(details);
    if (!res.success || !res.data) {
      throw new Error(res.error?.message || "Failed to submit enquiry.");
    }
    const newEnq = res.data;
    setAllEnquiries((prev) => [newEnq, ...prev]);
    return newEnq;
  };

  return (
    <BookingContext.Provider
      value={{
        isBookingOpen,
        openBookingModal,
        closeBookingModal,
        isEnquiryOpen,
        openEnquiryModal,
        closeEnquiryModal,
        selectedExperienceName,
        setSelectedExperienceName,
        allBookings,
        createBooking,
        allEnquiries,
        createEnquiry,
        activeBookingPass,
        setActiveBookingPass,
        refreshBookings,
        refreshEnquiries,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}

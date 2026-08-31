"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Booking, EventEnquiry } from "@/types";
import { generateBookingReference } from "@/lib/utils";

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
    experienceName: string;
    date: string;
    timeSlot: string;
    guests: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    specialRequests?: string;
  }) => Promise<Booking>;
  allEnquiries: EventEnquiry[];
  createEnquiry: (details: Omit<EventEnquiry, "id" | "createdAt">) => Promise<EventEnquiry>;
  activeBookingPass: Booking | null;
  setActiveBookingPass: (b: Booking | null) => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedExperienceName, setSelectedExperienceName] = useState("Go-Karting Grand Prix");
  const [activeBookingPass, setActiveBookingPass] = useState<Booking | null>(null);

  const [allBookings, setAllBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem("24ours_next_bookings");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "bk-101",
        bookingCode: "TORQ-24O-98214",
        experienceName: "Electric Go-Karting Grand Prix",
        date: "2026-09-15",
        timeSlot: "17:00 - 18:00 (Sunset Slot)",
        guests: 2,
        customerName: "Rahul Sharma",
        customerEmail: "rahul@example.com",
        customerPhone: "+91 9187194643",
        status: "CONFIRMED",
        qrData: "24OURS-PASS:TORQ-24O-98214:2026-09-15",
        createdAt: "2026-08-20T10:30:00Z",
      },
      {
        id: "bk-102",
        bookingCode: "TORQ-24O-74621",
        experienceName: "360° Sky Dining Deck",
        date: "2026-09-22",
        timeSlot: "19:30 - 21:00 (Lounge Slot)",
        guests: 4,
        customerName: "Ananya Verma",
        customerEmail: "ananya@example.com",
        customerPhone: "+91 98765 43211",
        status: "CONFIRMED",
        qrData: "24OURS-PASS:TORQ-24O-74621:2026-09-22",
        createdAt: "2026-08-22T14:15:00Z",
      },
    ];
  });

  const [allEnquiries, setAllEnquiries] = useState<EventEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem("24ours_next_enquiries");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "enq-01",
        name: "Vikramaditya Rao",
        email: "vikram@techcorp.com",
        phone: "+91 98765 11223",
        eventType: "Corporate Grand Prix & Offsite",
        expectedGuests: "60",
        preferredDate: "2026-10-05",
        requirements: "Circuit tournament with podium ceremony and 360 sky dining buffet dinner.",
        createdAt: "2026-08-23T11:00:00Z",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem("24ours_next_bookings", JSON.stringify(allBookings));
  }, [allBookings]);

  useEffect(() => {
    localStorage.setItem("24ours_next_enquiries", JSON.stringify(allEnquiries));
  }, [allEnquiries]);

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
    experienceName: string;
    date: string;
    timeSlot: string;
    guests: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    specialRequests?: string;
  }) => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error?.message || "Failed to create booking reservation.");
    }
    const newBooking = json.data;
    setAllBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const createEnquiry = async (details: Omit<EventEnquiry, "id" | "createdAt">) => {
    await new Promise((res) => setTimeout(res, 600));
    const newEnq: EventEnquiry = {
      id: "enq-" + Date.now(),
      ...details,
      createdAt: new Date().toISOString(),
    };
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

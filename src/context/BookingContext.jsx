import React, { createContext, useContext, useState, useEffect } from 'react';
import { packagesData } from '../data/packages';
import { attractionsData } from '../data/attractions';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedExperience, setSelectedExperience] = useState(attractionsData[0]); // default Go-Karting
  const [selectedPackage, setSelectedPackage] = useState(packagesData[0]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('16:00 - 17:00');
  const [guestCount, setGuestCount] = useState(2);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });
  const [activeBooking, setActiveBooking] = useState(null);

  // Local storage for completed bookings
  const [allBookings, setAllBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('24ours_bookings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'bk-101',
        bookingCode: 'TORQ-24O-98214',
        experienceName: 'Go-Karting Grand Prix',
        packageName: 'RACE PACK',
        date: '2026-09-15',
        timeSlot: '17:00 - 18:30',
        guests: 2,
        amount: 3798,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        customerName: 'Rahul Sharma',
        customerEmail: 'rahul@example.com',
        createdAt: '2026-08-20T10:30:00Z',
      },
      {
        id: 'bk-102',
        bookingCode: 'TORQ-24O-74621',
        experienceName: '360° Sky Dining Deck',
        packageName: 'Sunset VIP Dining Pod',
        date: '2026-09-22',
        timeSlot: '19:00 - 21:00',
        guests: 4,
        amount: 5800,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        customerName: 'Ananya Verma',
        customerEmail: 'ananya@example.com',
        createdAt: '2026-08-22T14:15:00Z',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('24ours_bookings', JSON.stringify(allBookings));
  }, [allBookings]);

  // Calculate pricing
  const calculateTotal = () => {
    const basePrice = selectedPackage?.price || 999;
    return basePrice * guestCount;
  };

  const createBooking = async (paymentDetails = {}) => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceName: selectedExperience?.name || "Electric Go-Karting Grand Prix",
          date: selectedDate,
          timeSlot: selectedTimeSlot,
          guests: guestCount,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setAllBookings((prev) => [json.data, ...prev]);
        return json.data;
      }
    } catch (e) {}
    return null;
  };

  const resetBooking = () => {
    setBookingStep(1);
    setSelectedExperience(attractionsData[0]);
    setSelectedPackage(packagesData[0]);
    setGuestCount(2);
  };

  return (
    <BookingContext.Provider
      value={{
        bookingStep,
        setBookingStep,
        selectedExperience,
        setSelectedExperience,
        selectedPackage,
        setSelectedPackage,
        selectedDate,
        setSelectedDate,
        selectedTimeSlot,
        setSelectedTimeSlot,
        guestCount,
        setGuestCount,
        customerInfo,
        setCustomerInfo,
        calculateTotal,
        createBooking,
        activeBooking,
        allBookings,
        setAllBookings,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

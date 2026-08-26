import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export interface BookingEmailPayload {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  experienceName?: string | null;
  date: Date | string;
  timeSlot: string;
  guestCount: number;
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
  qrCodeUrl?: string | null;
  notes?: string | null;
  createdAt: Date | string;
}

export class EmailService {
  private static getResendClient(): Resend | null {
    const apiKey = process.env.RESEND_API_KEY || process.env.EMAIL_API_KEY;
    if (!apiKey || apiKey.includes("placeholder")) {
      return null;
    }
    return new Resend(apiKey);
  }

  private static getFromAddress(): string {
    return process.env.EMAIL_FROM || "24OURS Concierge <bookings@24oursdriftanddine.com>";
  }

  private static getManagerAddress(): string {
    return process.env.MANAGER_EMAIL || "client@24oursdriftanddine.com";
  }

  /**
   * Dispatches both Manager and Customer booking emails with idempotency deduplication.
   * Safe: will NOT throw or corrupt booking state on email provider failures.
   */
  static async sendBookingNotificationEmails(bookingId: string) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          experience: true,
          package: true,
          payment: true,
        },
      });

      if (!booking) {
        console.warn(`[EmailService] Booking not found for ID: ${bookingId}`);
        return { managerSent: false, customerSent: false };
      }

      const resend = this.getResendClient();
      const from = this.getFromAddress();
      const managerEmail = this.getManagerAddress();
      const formattedDate = new Date(booking.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      let managerSent = false;
      let customerSent = false;

      const bookingData = booking as any;

      // 1. Send Manager Email (if not already sent)
      if (!bookingData.managerEmailSentAt) {
        const managerSubject = `🏁 New Booking Confirmed — ${booking.bookingCode} — ${formattedDate}`;
        const managerHtml = this.generateManagerEmailHtml(booking, formattedDate);
        const managerText = this.generateManagerEmailText(booking, formattedDate);

        if (resend) {
          try {
            await resend.emails.send({
              from,
              to: managerEmail,
              subject: managerSubject,
              html: managerHtml,
              text: managerText,
            });
            managerSent = true;
          } catch (err) {
            console.error("[EmailService] Failed to send manager email via Resend:", err);
          }
        } else {
          // Log structured email output in development / without configured API key
          console.log(`[EmailService - DEV / SIMULATED] Sent Manager Notification to: ${managerEmail}`);
          console.log(`Subject: ${managerSubject}`);
          managerSent = true;
        }

        if (managerSent) {
          try {
            await prisma.booking.update({
              where: { id: booking.id },
              data: { managerEmailSentAt: new Date() } as any,
            });
          } catch {
            // Safe fallback if field is not yet migrated in database
          }
        }
      } else {
        console.log(`[EmailService] Manager email already sent for booking: ${booking.bookingCode}. Skipping duplicate.`);
      }

      // 2. Send Customer Confirmation Email (if not already sent)
      if (!bookingData.customerEmailSentAt) {
        const customerSubject = `🏁 Your 24OURS Booking Is Confirmed — ${booking.bookingCode}`;
        const customerHtml = this.generateCustomerEmailHtml(booking, formattedDate);
        const customerText = this.generateCustomerEmailText(booking, formattedDate);

        if (resend && booking.customerEmail) {
          try {
            await resend.emails.send({
              from,
              to: booking.customerEmail,
              subject: customerSubject,
              html: customerHtml,
              text: customerText,
            });
            customerSent = true;
          } catch (err) {
            console.error("[EmailService] Failed to send customer email via Resend:", err);
          }
        } else if (booking.customerEmail) {
          console.log(`[EmailService - DEV / SIMULATED] Sent Customer Confirmation to: ${booking.customerEmail}`);
          console.log(`Subject: ${customerSubject}`);
          customerSent = true;
        }

        if (customerSent) {
          try {
            await prisma.booking.update({
              where: { id: booking.id },
              data: { customerEmailSentAt: new Date() } as any,
            });
          } catch {
            // Safe fallback if field is not yet migrated in database
          }
        }
      } else {
        console.log(`[EmailService] Customer email already sent for booking: ${booking.bookingCode}. Skipping duplicate.`);
      }

      return { managerSent, customerSent };
    } catch (error) {
      console.error("[EmailService] Unexpected error during booking email notifications:", error);
      // Safe return: never crash the caller
      return { managerSent: false, customerSent: false };
    }
  }

  // ==========================================
  // MANAGER EMAIL TEMPLATES
  // ==========================================
  private static generateManagerEmailHtml(booking: any, formattedDate: string): string {
    const expName = booking.experienceName || booking.experience?.name || booking.package?.name || "Flagship Experience";
    const paymentRef = booking.payment?.razorpayPaymentId || booking.payment?.razorpayOrderId || "Pending / Offline";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080808; color: #f5f5f5; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #262626; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #e11d48 0%, #9f1239 100%); padding: 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: 1px; }
    .header p { margin: 6px 0 0 0; color: #ffe4e6; font-size: 14px; }
    .content { padding: 24px; }
    .badge { display: inline-block; background-color: #27272a; color: #38bdf8; font-size: 14px; font-weight: 700; padding: 6px 12px; border-radius: 4px; font-family: monospace; }
    .section-title { color: #e11d48; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 20px 0 8px 0; border-bottom: 1px solid #27272a; padding-bottom: 4px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .info-table td { padding: 6px 0; font-size: 14px; }
    .info-table td.label { color: #a1a1aa; width: 40%; }
    .info-table td.value { color: #f4f4f5; font-weight: 600; }
    .highlight-box { background-color: #1c1917; border: 1px dashed #44403c; padding: 12px; border-radius: 6px; margin-top: 16px; font-size: 13px; color: #d6d3d1; }
    .footer { background-color: #09090b; padding: 16px 24px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #27272a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>24OURS DRIFT & DINE</h1>
      <p>NEW BOOKING NOTIFICATION (MANAGER DISPATCH)</p>
    </div>
    <div class="content">
      <div style="text-align: center; margin-bottom: 16px;">
        <span class="badge">PASS CODE: ${booking.bookingCode}</span>
      </div>

      <div class="section-title">Customer Details</div>
      <table class="info-table">
        <tr><td class="label">Full Name:</td><td class="value">${booking.customerName}</td></tr>
        <tr><td class="label">Email:</td><td class="value"><a href="mailto:${booking.customerEmail}" style="color: #38bdf8;">${booking.customerEmail}</a></td></tr>
        <tr><td class="label">Phone:</td><td class="value"><a href="tel:${booking.customerPhone}" style="color: #38bdf8;">${booking.customerPhone}</a></td></tr>
      </table>

      <div class="section-title">Session Details</div>
      <table class="info-table">
        <tr><td class="label">Experience:</td><td class="value">${expName}</td></tr>
        <tr><td class="label">Session Date:</td><td class="value">${formattedDate}</td></tr>
        <tr><td class="label">Time Window:</td><td class="value">${booking.timeSlot}</td></tr>
        <tr><td class="label">Total Guests:</td><td class="value">${booking.guestCount} Guest(s)</td></tr>
      </table>

      ${
        booking.notes
          ? `<div class="section-title">Special Requirements / Notes</div>
             <div class="highlight-box">${booking.notes}</div>`
          : ""
      }

      <div class="section-title">Financial & Ledger</div>
      <table class="info-table">
        <tr><td class="label">Total Amount:</td><td class="value" style="color: #4ade80;">₹${booking.totalAmount.toLocaleString("en-IN")}</td></tr>
        <tr><td class="label">Payment Status:</td><td class="value">${booking.paymentStatus}</td></tr>
        <tr><td class="label">Booking Status:</td><td class="value">${booking.bookingStatus}</td></tr>
        <tr><td class="label">Payment Ref:</td><td class="value" style="font-family: monospace; font-size: 12px;">${paymentRef}</td></tr>
        <tr><td class="label">Booked At:</td><td class="value">${new Date(booking.createdAt).toLocaleString("en-IN")}</td></tr>
      </table>
    </div>
    <div class="footer">
      Automated dispatch from 24OURS Drift & Dine Backend Service.<br>
      NH 44, Chikkaballapura, Karnataka — High-Torque Motorsport & Sky Dining.
    </div>
  </div>
</body>
</html>
    `;
  }

  private static generateManagerEmailText(booking: any, formattedDate: string): string {
    const expName = booking.experienceName || booking.experience?.name || booking.package?.name || "Flagship Experience";
    return `
24OURS DRIFT & DINE — NEW BOOKING CONFIRMED

Booking Code: ${booking.bookingCode}

CUSTOMER
Name:  ${booking.customerName}
Email: ${booking.customerEmail}
Phone: ${booking.customerPhone}

BOOKING DETAILS
Experience: ${expName}
Date:       ${formattedDate}
Time Slot:  ${booking.timeSlot}
Guests:     ${booking.guestCount}
Notes:      ${booking.notes || "None"}

PAYMENT & STATUS
Amount:         ₹${booking.totalAmount}
Payment Status: ${booking.paymentStatus}
Booking Status: ${booking.bookingStatus}
Booked At:      ${new Date(booking.createdAt).toLocaleString("en-IN")}

---
Automated dispatch from 24OURS Drift & Dine Server.
`;
  }

  // ==========================================
  // CUSTOMER CONFIRMATION TEMPLATES
  // ==========================================
  private static generateCustomerEmailHtml(booking: any, formattedDate: string): string {
    const expName = booking.experienceName || booking.experience?.name || booking.package?.name || "Flagship Experience";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080808; color: #f5f5f5; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #262626; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #09090b 0%, #18181b 100%); border-bottom: 2px solid #e11d48; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 2px; }
    .header p { margin: 6px 0 0 0; color: #e11d48; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .content { padding: 24px; }
    .pass-card { background: linear-gradient(135deg, #1c1917 0%, #0c0a09 100%); border: 1px solid #44403c; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px; }
    .pass-code { font-size: 24px; font-weight: 900; color: #e11d48; font-family: monospace; letter-spacing: 2px; margin: 8px 0; }
    .section-title { color: #f43f5e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 20px 0 8px 0; border-bottom: 1px solid #27272a; padding-bottom: 4px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .info-table td { padding: 6px 0; font-size: 14px; }
    .info-table td.label { color: #a1a1aa; width: 40%; }
    .info-table td.value { color: #f4f4f5; font-weight: 600; }
    .instructions { background-color: #18181b; border-left: 3px solid #e11d48; padding: 14px; border-radius: 4px; font-size: 13px; color: #d4d4d8; line-height: 1.6; margin-top: 18px; }
    .footer { background-color: #09090b; padding: 20px 24px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #27272a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>24OURS</h1>
      <p>DRIFT & DINE — SESSION CONFIRMED</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello <strong>${booking.customerName}</strong>,</p>
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5;">
        Your high-torque motorsport & culinary experience pass has been confirmed. Please present your booking code upon arrival at the paddock concierge.
      </p>

      <div class="pass-card">
        <div style="font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px;">Official Session Pass Code</div>
        <div class="pass-code">${booking.bookingCode}</div>
        <div style="font-size: 12px; color: #4ade80;">STATUS: CONFIRMED (${booking.paymentStatus})</div>
      </div>

      <div class="section-title">Session Details</div>
      <table class="info-table">
        <tr><td class="label">Experience:</td><td class="value">${expName}</td></tr>
        <tr><td class="label">Date:</td><td class="value">${formattedDate}</td></tr>
        <tr><td class="label">Time Slot:</td><td class="value">${booking.timeSlot}</td></tr>
        <tr><td class="label">Guests:</td><td class="value">${booking.guestCount} Driver(s) / Guest(s)</td></tr>
        <tr><td class="label">Total Paid:</td><td class="value" style="color: #4ade80;">₹${booking.totalAmount.toLocaleString("en-IN")}</td></tr>
      </table>

      <div class="instructions">
        <strong style="color: #ffffff;">🏁 Arrival & Trackside Instructions:</strong><br>
        • Please arrive <strong>15 minutes prior</strong> to your scheduled slot for briefing & telemetry assignment.<br>
        • Closed-toe shoes required for karting and motorsport circuits.<br>
        • Location: <strong>NH 44, Chikkaballapura, Karnataka 562101</strong> (Near Nandi Hills Junction).
      </div>
    </div>
    <div class="footer">
      Questions or Rescheduling? Contact our Concierge at concierge@24oursdriftanddine.com<br>
      © 2026 24OURS Drift & Dine. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;
  }

  private static generateCustomerEmailText(booking: any, formattedDate: string): string {
    const expName = booking.experienceName || booking.experience?.name || booking.package?.name || "Flagship Experience";
    return `
🏁 24OURS DRIFT & DINE — SESSION CONFIRMED

Hello ${booking.customerName},

Your booking pass is confirmed!

Booking Code: ${booking.bookingCode}
Experience:   ${expName}
Date:         ${formattedDate}
Time Slot:    ${booking.timeSlot}
Guests:       ${booking.guestCount}
Total Paid:   ₹${booking.totalAmount}
Status:       ${booking.paymentStatus}

ARRIVAL INSTRUCTIONS:
- Please arrive 15 minutes prior to your time window for paddock check-in and briefing.
- Closed-toe shoes are mandatory for go-karting tracks.
- Venue: NH 44, Chikkaballapura, Karnataka.

Need assistance? Contact concierge@24oursdriftanddine.com
`;
  }
}

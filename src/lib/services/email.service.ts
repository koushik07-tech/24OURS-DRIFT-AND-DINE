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
    if (!apiKey || apiKey.includes("placeholder") || apiKey.includes("your_")) {
      return null;
    }
    return new Resend(apiKey);
  }

  private static getFromAddress(): string {
    return process.env.EMAIL_FROM || "24OURS Concierge <bookings@24oursdriftanddine.com>";
  }

  private static getManagerAddress(): string {
    return process.env.MANAGER_EMAIL || "manager@24oursdriftanddine.com";
  }

  private static getAppUrl(): string {
    return (
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
    );
  }

  /**
   * Dispatches both Manager and Customer booking confirmation emails with idempotency deduplication.
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

      // Strictly guard: Never send confirmation emails for unpaid, pending, or failed bookings
      if (booking.bookingStatus !== "CONFIRMED" || booking.paymentStatus !== "SUCCESS") {
        console.log(`[EmailService] Skipping booking notification emails for unconfirmed booking: ${booking.bookingCode} (Status: ${booking.bookingStatus}, Payment: ${booking.paymentStatus})`);
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

      // 1. Send Manager Notification Email (if not already sent)
      if (!bookingData.managerEmailSentAt) {
        const managerSubject = "New Booking - 24OURS Drift & Dine";
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
            // Safe fallback
          }
        }
      } else {
        console.log(`[EmailService] Manager email already sent for booking: ${booking.bookingCode}. Skipping duplicate.`);
      }

      // 2. Send Customer Confirmation & Digital Pass Email (if not already sent)
      if (!bookingData.customerEmailSentAt) {
        const customerSubject = `🏁 Your 24OURS Booking Confirmation & Pass — ${booking.bookingCode}`;
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
            // Safe fallback
          }
        }
      } else {
        console.log(`[EmailService] Customer email already sent for booking: ${booking.bookingCode}. Skipping duplicate.`);
      }

      return { managerSent, customerSent };
    } catch (error) {
      console.error("[EmailService] Unexpected error during booking email notifications:", error);
      return { managerSent: false, customerSent: false };
    }
  }

  /**
   * Dispatches Booking Cancellation & Refund notifications to both Customer and Concierge Desk.
   */
  static async sendBookingCancellationEmail(bookingId: string, cancellationReason?: string) {
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
        return { customerSent: false, managerSent: false };
      }

      const resend = this.getResendClient();
      const from = this.getFromAddress();
      const managerEmail = this.getManagerAddress();
      const formattedDate = new Date(booking.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      let customerSent = false;
      let managerSent = false;

      const customerSubject = `⚠️ Booking Reservation Cancelled — ${booking.bookingCode}`;
      const customerHtml = this.generateCancellationEmailHtml(booking, formattedDate, cancellationReason);
      const customerText = this.generateCancellationEmailText(booking, formattedDate, cancellationReason);

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
          console.error("[EmailService] Failed to dispatch cancellation email to customer:", err);
        }
      } else if (booking.customerEmail) {
        console.log(`[EmailService - DEV / SIMULATED] Sent Cancellation Notice to: ${booking.customerEmail}`);
        customerSent = true;
      }

      const managerSubject = `⚠️ Reservation Cancelled by Customer — ${booking.bookingCode} — ${formattedDate}`;
      if (resend) {
        try {
          await resend.emails.send({
            from,
            to: managerEmail,
            subject: managerSubject,
            html: customerHtml,
            text: customerText,
          });
          managerSent = true;
        } catch (err) {
          console.error("[EmailService] Failed to dispatch cancellation notification to manager:", err);
        }
      } else {
        console.log(`[EmailService - DEV / SIMULATED] Sent Cancellation Alert to Manager: ${managerEmail}`);
        managerSent = true;
      }

      return { customerSent, managerSent };
    } catch (error) {
      console.error("[EmailService] Unexpected error during cancellation email dispatch:", error);
      return { customerSent: false, managerSent: false };
    }
  }

  // ==========================================
  // MANAGER EMAIL TEMPLATES
  // ==========================================
  private static generateManagerEmailHtml(booking: any, formattedDate: string): string {
    const expName = booking.experienceName || booking.experience?.name || booking.package?.name || "Flagship Experience";
    const razorpayOrderId = booking.payment?.razorpayOrderId || "N/A";
    const razorpayPaymentId = booking.payment?.razorpayPaymentId || "N/A";
    const appUrl = this.getAppUrl();
    const adminBookingUrl = `${appUrl}/admin/bookings/${booking.id}`;
    const verifyUrl = `${appUrl}/verify/${booking.bookingCode}`;

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
    .btn { display: inline-block; background-color: #e11d48; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; font-size: 14px; margin-top: 16px; }
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
        <span class="badge">BOOKING ID: ${booking.bookingCode}</span>
      </div>

      <div class="section-title">Customer Details</div>
      <table class="info-table">
        <tr><td class="label">Customer Name:</td><td class="value">${booking.customerName}</td></tr>
        <tr><td class="label">Customer Email:</td><td class="value"><a href="mailto:${booking.customerEmail}" style="color: #38bdf8;">${booking.customerEmail}</a></td></tr>
        <tr><td class="label">Customer Phone:</td><td class="value"><a href="tel:${booking.customerPhone}" style="color: #38bdf8;">${booking.customerPhone}</a></td></tr>
      </table>

      <div class="section-title">Experience & Session</div>
      <table class="info-table">
        <tr><td class="label">Experience Booked:</td><td class="value">${expName}</td></tr>
        <tr><td class="label">Booking Date:</td><td class="value">${formattedDate}</td></tr>
        <tr><td class="label">Booking Time:</td><td class="value">${booking.timeSlot}</td></tr>
        <tr><td class="label">Number of Guests:</td><td class="value">${booking.guestCount} Guest(s)</td></tr>
        <tr><td class="label">Internal ID:</td><td class="value" style="font-family: monospace; font-size: 12px;">${booking.id}</td></tr>
      </table>

      ${
        booking.notes
          ? `<div class="section-title">Special Requirements / Notes</div>
             <div class="highlight-box">${booking.notes}</div>`
          : ""
      }

      <div class="section-title">Financial & Payment Ledger</div>
      <table class="info-table">
        <tr><td class="label">Amount Paid:</td><td class="value" style="color: #4ade80;">₹${booking.totalAmount.toLocaleString("en-IN")}</td></tr>
        <tr><td class="label">Payment Status:</td><td class="value">${booking.paymentStatus}</td></tr>
        <tr><td class="label">Booking Status:</td><td class="value">${booking.bookingStatus}</td></tr>
        <tr><td class="label">Razorpay Order ID:</td><td class="value" style="font-family: monospace; font-size: 12px;">${razorpayOrderId}</td></tr>
        <tr><td class="label">Razorpay Payment ID:</td><td class="value" style="font-family: monospace; font-size: 12px; color: #38bdf8;">${razorpayPaymentId}</td></tr>
        <tr><td class="label">Booked At:</td><td class="value">${new Date(booking.createdAt).toLocaleString("en-IN")}</td></tr>
      </table>

      <div style="text-align: center; margin-top: 20px;">
        <a href="${adminBookingUrl}" class="btn" style="margin-right: 8px;">Open Admin Booking Details</a>
        <a href="${verifyUrl}" class="btn" style="background-color: #27272a;">View Boarding Pass</a>
      </div>
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
    const razorpayOrderId = booking.payment?.razorpayOrderId || "N/A";
    const razorpayPaymentId = booking.payment?.razorpayPaymentId || "N/A";
    const appUrl = this.getAppUrl();
    return `
New Booking - 24OURS Drift & Dine

Booking ID:         ${booking.bookingCode}
Internal ID:        ${booking.id}

CUSTOMER
Customer Name:      ${booking.customerName}
Customer Email:     ${booking.customerEmail}
Customer Phone:     ${booking.customerPhone}

BOOKING DETAILS
Experience Booked:  ${expName}
Booking Date:       ${formattedDate}
Booking Time:       ${booking.timeSlot}
Number of Guests:   ${booking.guestCount}
Special Notes:      ${booking.notes || "None"}

PAYMENT LEDGER
Amount Paid:        ₹${booking.totalAmount}
Payment Status:     ${booking.paymentStatus}
Booking Status:     ${booking.bookingStatus}
Razorpay Order ID:  ${razorpayOrderId}
Razorpay Payment ID:${razorpayPaymentId}
Booked At:          ${new Date(booking.createdAt).toLocaleString("en-IN")}

ADMIN LINK:
${appUrl}/admin/bookings/${booking.id}

BOARDING PASS VERIFICATION:
${appUrl}/verify/${booking.bookingCode}

---
Automated dispatch from 24OURS Drift & Dine Server.
`;
  }

  // ==========================================
  // CUSTOMER CONFIRMATION TEMPLATES
  // ==========================================
  private static generateCustomerEmailHtml(booking: any, formattedDate: string): string {
    const expName = booking.experienceName || booking.experience?.name || booking.package?.name || "Flagship Experience";
    const razorpayPaymentId = booking.payment?.razorpayPaymentId || "N/A";
    const appUrl = this.getAppUrl();
    const verifyUrl = `${appUrl}/verify/${booking.bookingCode}`;
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}&bgcolor=18-18-27&color=225-29-72`;

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
    .pass-code { font-size: 26px; font-weight: 900; color: #e11d48; font-family: monospace; letter-spacing: 2px; margin: 8px 0; }
    .qr-container { margin: 16px auto; width: 160px; height: 160px; background-color: #ffffff; padding: 8px; border-radius: 8px; }
    .section-title { color: #f43f5e; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 20px 0 8px 0; border-bottom: 1px solid #27272a; padding-bottom: 4px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .info-table td { padding: 6px 0; font-size: 14px; }
    .info-table td.label { color: #a1a1aa; width: 40%; }
    .info-table td.value { color: #f4f4f5; font-weight: 600; }
    .btn { display: inline-block; background-color: #e11d48; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 700; font-size: 14px; margin-top: 12px; }
    .instructions { background-color: #18181b; border-left: 3px solid #e11d48; padding: 14px; border-radius: 4px; font-size: 13px; color: #d4d4d8; line-height: 1.6; margin-top: 18px; }
    .footer { background-color: #09090b; padding: 20px 24px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #27272a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>24OURS</h1>
      <p>DRIFT & DINE — BOOKING CONFIRMATION & DIGITAL PASS</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello <strong>${booking.customerName}</strong>,</p>
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5;">
        Your high-torque motorsport & culinary experience is confirmed! Present your digital pass or booking code upon arrival at the paddock concierge.
      </p>

      <div class="pass-card">
        <div style="font-size: 12px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px;">Official Session Booking ID / Pass Code</div>
        <div class="pass-code">${booking.bookingCode}</div>
        <div style="font-size: 12px; color: #4ade80; font-weight: bold; margin-bottom: 12px;">STATUS: CONFIRMED (${booking.paymentStatus})</div>

        <div class="qr-container">
          <img src="${qrImageUrl}" alt="Pass QR Code" width="160" height="160" style="display: block; width: 100%; height: 100%; border: none;" />
        </div>
        <p style="font-size: 11px; color: #71717a; margin: 4px 0 0 0;">Scan at paddock gates for rapid check-in</p>

        <div>
          <a href="${verifyUrl}" class="btn">Open Digital Pass</a>
        </div>
      </div>

      <div class="section-title">Booking Details</div>
      <table class="info-table">
        <tr><td class="label">Experience:</td><td class="value">${expName}</td></tr>
        <tr><td class="label">Date:</td><td class="value">${formattedDate}</td></tr>
        <tr><td class="label">Time:</td><td class="value">${booking.timeSlot}</td></tr>
        <tr><td class="label">Number of Guests:</td><td class="value">${booking.guestCount} Guest(s)</td></tr>
        <tr><td class="label">Amount Paid:</td><td class="value" style="color: #4ade80;">₹${booking.totalAmount.toLocaleString("en-IN")} (Inclusive of all taxes)</td></tr>
        <tr><td class="label">Razorpay Payment ID:</td><td class="value" style="font-family: monospace; font-size: 12px; color: #38bdf8;">${razorpayPaymentId}</td></tr>
      </table>

      <div class="instructions">
        <strong style="color: #ffffff;">🏁 Instructions for Using Your Pass:</strong><br>
        • Please arrive <strong>15 minutes prior</strong> to your scheduled slot for driver briefing & RFID telemetry assignment.<br>
        • Present this QR code or booking code <strong>${booking.bookingCode}</strong> at the reception desk.<br>
        • Closed-toe shoes are mandatory for karting circuits.<br>
        • Venue: <strong>NH 44, Chikkaballapura, Karnataka 562101</strong> (Near Nandi Hills Junction).
      </div>
    </div>
    <div class="footer">
      Questions or Rescheduling? Contact our Concierge at <a href="mailto:concierge@24oursdriftanddine.com" style="color: #e11d48;">concierge@24oursdriftanddine.com</a><br>
      © 2026 24OURS Drift & Dine. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;
  }

  private static generateCustomerEmailText(booking: any, formattedDate: string): string {
    const expName = booking.experienceName || booking.experience?.name || booking.package?.name || "Flagship Experience";
    const razorpayPaymentId = booking.payment?.razorpayPaymentId || "N/A";
    const appUrl = this.getAppUrl();
    return `
🏁 24OURS DRIFT & DINE — BOOKING CONFIRMATION & PASS

Hello ${booking.customerName},

Your booking is confirmed!

BOOKING DETAILS:
Booking ID:          ${booking.bookingCode}
Experience:          ${expName}
Date:                ${formattedDate}
Time:                ${booking.timeSlot}
Number of Guests:    ${booking.guestCount}
Amount Paid:         ₹${booking.totalAmount}
Razorpay Payment ID: ${razorpayPaymentId}
Status:              CONFIRMED (${booking.paymentStatus})

VIEW DIGITAL PASS & QR CODE:
${appUrl}/verify/${booking.bookingCode}

INSTRUCTIONS FOR USING YOUR PASS:
- Please arrive 15 minutes prior to your time window for paddock check-in and briefing.
- Present this booking ID or QR code at reception.
- Closed-toe shoes are mandatory for karting tracks.
- Venue: NH 44, Chikkaballapura, Karnataka.

Need assistance? Contact concierge@24oursdriftanddine.com
`;
  }

  // ==========================================
  // CANCELLATION & REFUND TEMPLATES
  // ==========================================
  private static generateCancellationEmailHtml(booking: any, formattedDate: string, reason?: string): string {
    const expName = booking.experienceName || booking.experience?.name || booking.package?.name || "Flagship Experience";

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080808; color: #f5f5f5; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #121212; border: 1px solid #262626; border-radius: 8px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #18181b 0%, #27272a 100%); border-bottom: 2px solid #71717a; padding: 28px 24px; text-align: center; }
    .header h1 { margin: 0; color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: 2px; }
    .header p { margin: 6px 0 0 0; color: #f43f5e; font-size: 14px; font-weight: 700; text-transform: uppercase; }
    .content { padding: 24px; }
    .section-title { color: #a1a1aa; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin: 20px 0 8px 0; border-bottom: 1px solid #27272a; padding-bottom: 4px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
    .info-table td { padding: 6px 0; font-size: 14px; }
    .info-table td.label { color: #a1a1aa; width: 40%; }
    .info-table td.value { color: #f4f4f5; font-weight: 600; }
    .notice-box { background-color: #1c1917; border-left: 3px solid #f43f5e; padding: 14px; border-radius: 4px; font-size: 13px; color: #d4d4d8; line-height: 1.6; margin-top: 18px; }
    .footer { background-color: #09090b; padding: 20px 24px; text-align: center; font-size: 12px; color: #71717a; border-top: 1px solid #27272a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>24OURS</h1>
      <p>DRIFT & DINE — RESERVATION CANCELLED</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-top: 0;">Hello <strong>${booking.customerName}</strong>,</p>
      <p style="color: #a1a1aa; font-size: 14px; line-height: 1.5;">
        This is to confirm that your reservation <strong>${booking.bookingCode}</strong> has been cancelled.
      </p>

      <div class="section-title">Cancelled Reservation Details</div>
      <table class="info-table">
        <tr><td class="label">Booking ID:</td><td class="value" style="font-family: monospace; color: #f43f5e;">${booking.bookingCode}</td></tr>
        <tr><td class="label">Experience:</td><td class="value">${expName}</td></tr>
        <tr><td class="label">Original Date:</td><td class="value">${formattedDate}</td></tr>
        <tr><td class="label">Time Slot:</td><td class="value">${booking.timeSlot}</td></tr>
        <tr><td class="label">Amount:</td><td class="value">₹${booking.totalAmount.toLocaleString("en-IN")}</td></tr>
        <tr><td class="label">Status:</td><td class="value" style="color: #f43f5e;">CANCELLED</td></tr>
      </table>

      ${
        reason
          ? `<div class="section-title">Cancellation Reason</div>
             <p style="font-size: 14px; color: #d4d4d8;">${reason}</p>`
          : ""
      }

      <div class="notice-box">
        <strong style="color: #ffffff;">💳 Refund Information:</strong><br>
        If your payment was successfully captured, eligible refunds will be initiated automatically to your original payment method in accordance with our <strong>Cancellation & Refund Policy</strong> (processed within 5–7 banking business days).
      </div>
    </div>
    <div class="footer">
      Need to re-book or have questions? Contact our Concierge at <a href="mailto:concierge@24oursdriftanddine.com" style="color: #e11d48;">concierge@24oursdriftanddine.com</a><br>
      © 2026 24OURS Drift & Dine. All rights reserved.
    </div>
  </div>
</body>
</html>
    `;
  }

  private static generateCancellationEmailText(booking: any, formattedDate: string, reason?: string): string {
    const expName = booking.experienceName || booking.experience?.name || booking.package?.name || "Flagship Experience";
    return `
⚠️ 24OURS DRIFT & DINE — RESERVATION CANCELLED

Hello ${booking.customerName},

Your reservation ${booking.bookingCode} has been cancelled.

DETAILS:
Booking ID:    ${booking.bookingCode}
Experience:    ${expName}
Date:          ${formattedDate}
Time Slot:     ${booking.timeSlot}
Total Amount:  ₹${booking.totalAmount}
Status:        CANCELLED
${reason ? `Reason:        ${reason}\n` : ""}
REFUND NOTICE:
If your payment was captured, eligible refunds are processed back to your original source of payment within 5-7 business days per our Cancellation Policy.

Need assistance? Contact concierge@24oursdriftanddine.com
`;
  }
}

import { EventEnquiry } from "@/types";

export const enquiriesApi = {
  async createEnquiry(details: {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    expectedGuests: number | string;
    preferredDate?: string;
    preferredTime?: string;
    requirements?: string;
    message?: string;
  }): Promise<{ success: boolean; data?: EventEnquiry; error?: { code: string; message: string } }> {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    return res.json();
  },

  async getAllEnquiries(): Promise<{ success: boolean; data?: EventEnquiry[]; error?: any }> {
    const res = await fetch("/api/enquiries", {
      method: "GET",
    });
    return res.json();
  },
};

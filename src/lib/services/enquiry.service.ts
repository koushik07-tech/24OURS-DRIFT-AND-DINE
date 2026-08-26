import { prisma } from "@/lib/prisma";

export class EnquiryService {
  static async createEnquiry(data: {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    expectedGuests: number;
    preferredDate?: string;
    preferredTime?: string;
    requirements?: string;
    message?: string;
  }) {
    let parsedDate: Date | null = null;
    if (data.preferredDate) {
      const d = new Date(data.preferredDate);
      if (!isNaN(d.getTime())) parsedDate = d;
    }

    return prisma.eventEnquiry.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        eventType: data.eventType.trim(),
        expectedGuests: data.expectedGuests || 1,
        preferredDate: parsedDate,
        preferredTime: data.preferredTime || null,
        requirements: data.requirements || null,
        message: data.message || null,
        status: "PENDING",
      },
    });
  }

  static async getAllEnquiries() {
    return prisma.eventEnquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getEnquiryById(id: string) {
    const enquiry = await prisma.eventEnquiry.findUnique({
      where: { id },
    });
    if (!enquiry) throw new Error("ENQUIRY_NOT_FOUND");
    return enquiry;
  }

  static async updateEnquiry(id: string, data: { status?: string; message?: string }) {
    const existing = await prisma.eventEnquiry.findUnique({ where: { id } });
    if (!existing) throw new Error("ENQUIRY_NOT_FOUND");

    return prisma.eventEnquiry.update({
      where: { id },
      data: {
        ...(data.status ? { status: data.status } : {}),
        ...(data.message ? { message: data.message } : {}),
      },
    });
  }

  static async deleteEnquiry(id: string) {
    return prisma.eventEnquiry.delete({
      where: { id },
    });
  }
}

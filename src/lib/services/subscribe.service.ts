import { prisma } from "@/lib/prisma";

export class SubscribeService {
  static async subscribe(data: { email: string; name?: string; interests?: string[] }) {
    const normalizedEmail = data.email.trim().toLowerCase();

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: {
          name: data.name?.trim() || existing.name,
          interests: data.interests || existing.interests,
        },
      });
    }

    return prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        name: data.name?.trim() || "Racer",
        interests: data.interests || [],
        source: "24OURS-PreLaunch-Web",
      },
    });
  }

  static async getSubscriberCount() {
    return prisma.newsletterSubscriber.count();
  }
}

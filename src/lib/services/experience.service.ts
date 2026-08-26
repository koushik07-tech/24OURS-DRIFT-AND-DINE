import { prisma } from "@/lib/prisma";

export class ExperienceService {
  static async getAllExperiences() {
    return prisma.experience.findMany({
      where: { isActive: true },
      include: {
        pricing: true,
        images: true,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  static async getExperienceByIdOrSlug(identifier: string) {
    return prisma.experience.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        pricing: true,
        images: true,
      },
    });
  }

  static async getAllPackages() {
    return prisma.package.findMany({
      include: {
        items: {
          include: {
            experience: true,
          },
        },
      },
      orderBy: { price: "asc" },
    });
  }

  static async getPackageByIdOrSlug(identifier: string) {
    return prisma.package.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        items: {
          include: {
            experience: true,
          },
        },
      },
    });
  }
}

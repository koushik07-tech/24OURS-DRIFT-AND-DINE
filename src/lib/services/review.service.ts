import { prisma } from "@/lib/prisma";

export class ReviewService {
  static async getAllReviews(approvedOnly = true) {
    return prisma.review.findMany({
      where: approvedOnly ? { isApproved: true } : {},
      orderBy: { createdAt: "desc" },
    });
  }

  static async createReview(
    data: {
      authorName: string;
      rating: number;
      experience: string;
      comment: string;
    },
    userId?: string
  ) {
    return prisma.review.create({
      data: {
        userId: userId || null,
        authorName: data.authorName.trim(),
        rating: data.rating,
        experience: data.experience.trim(),
        comment: data.comment.trim(),
        isApproved: true,
      },
    });
  }

  static async updateReviewApproval(id: string, isApproved: boolean) {
    return prisma.review.update({
      where: { id },
      data: { isApproved },
    });
  }

  static async deleteReview(id: string) {
    return prisma.review.delete({
      where: { id },
    });
  }
}

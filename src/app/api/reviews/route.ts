import { NextRequest, NextResponse } from "next/server";
import { ReviewService } from "@/lib/services/review.service";
import { reviewCreateSchema } from "@/lib/validation/schemas";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const reviews = await ReviewService.getAllReviews(true);
    return NextResponse.json({
      success: true,
      data: reviews,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch reviews" } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = reviewCreateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: validated.error.errors[0]?.message } },
        { status: 400 }
      );
    }

    const session = await getUserFromRequest(req);
    const review = await ReviewService.createReview(validated.data, session?.userId);

    return NextResponse.json(
      { success: true, data: review, message: "Review published" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to create review" } },
      { status: 500 }
    );
  }
}

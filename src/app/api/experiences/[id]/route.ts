import { NextRequest, NextResponse } from "next/server";
import { ExperienceService } from "@/lib/services/experience.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const experience = await ExperienceService.getExperienceByIdOrSlug(id);

    if (!experience) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Experience not found" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: experience,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to fetch experience" },
      },
      { status: 500 }
    );
  }
}

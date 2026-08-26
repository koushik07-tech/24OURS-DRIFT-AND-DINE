import { NextResponse } from "next/server";
import { ExperienceService } from "@/lib/services/experience.service";

export async function GET() {
  try {
    const experiences = await ExperienceService.getAllExperiences();
    return NextResponse.json({
      success: true,
      data: experiences,
    });
  } catch (error: any) {
    console.error("Experiences GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to fetch experiences" },
      },
      { status: 500 }
    );
  }
}

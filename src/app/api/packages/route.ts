import { NextResponse } from "next/server";
import { ExperienceService } from "@/lib/services/experience.service";

export async function GET() {
  try {
    const packages = await ExperienceService.getAllPackages();
    return NextResponse.json({
      success: true,
      data: packages,
    });
  } catch (error: any) {
    console.error("Packages GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to fetch packages" },
      },
      { status: 500 }
    );
  }
}

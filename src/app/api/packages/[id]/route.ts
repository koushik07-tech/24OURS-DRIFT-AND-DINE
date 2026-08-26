import { NextRequest, NextResponse } from "next/server";
import { ExperienceService } from "@/lib/services/experience.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const pkg = await ExperienceService.getPackageByIdOrSlug(id);

    if (!pkg) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Package not found" },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pkg,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to fetch package" },
      },
      { status: 500 }
    );
  }
}

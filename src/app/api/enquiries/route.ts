import { NextRequest, NextResponse } from "next/server";
import { enquiryCreateSchema } from "@/lib/validation/schemas";
import { EnquiryService } from "@/lib/services/enquiry.service";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = enquiryCreateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: validated.error.errors[0]?.message || "Invalid enquiry details",
          },
        },
        { status: 400 }
      );
    }

    const enquiry = await EnquiryService.createEnquiry(validated.data as any);
    return NextResponse.json(
      {
        success: true,
        data: enquiry,
        message: "Enquiry submitted successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Enquiry creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to submit event enquiry" },
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const enquiries = await EnquiryService.getAllEnquiries();

    return NextResponse.json({
      success: true,
      data: enquiries,
    });
  } catch (error: any) {
    if (error.message === "FORBIDDEN" || error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch enquiries" } },
      { status: 500 }
    );
  }
}

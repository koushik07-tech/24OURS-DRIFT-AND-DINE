import { NextRequest, NextResponse } from "next/server";
import { EnquiryService } from "@/lib/services/enquiry.service";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const enquiries = await EnquiryService.getAllEnquiries();

    return NextResponse.json({
      success: true,
      data: enquiries,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
      { status: 403 }
    );
  }
}

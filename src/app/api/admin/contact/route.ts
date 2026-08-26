import { NextRequest, NextResponse } from "next/server";
import { ContactService } from "@/lib/services/contact.service";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const messages = await ContactService.getAllMessages();

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
      { status: 403 }
    );
  }
}

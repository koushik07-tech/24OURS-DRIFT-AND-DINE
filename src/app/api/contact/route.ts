import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/schemas";
import { ContactService } from "@/lib/services/contact.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = contactSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: validated.error.errors[0]?.message || "Invalid contact form data",
          },
        },
        { status: 400 }
      );
    }

    const message = await ContactService.createMessage(validated.data);
    return NextResponse.json(
      {
        success: true,
        data: message,
        message: "Message received. Our concierge team will reach out shortly.",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to dispatch message" },
      },
      { status: 500 }
    );
  }
}

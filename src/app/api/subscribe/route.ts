import { NextRequest, NextResponse } from "next/server";
import { subscribeSchema } from "@/lib/validation/schemas";
import { SubscribeService } from "@/lib/services/subscribe.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = subscribeSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: validated.error.errors[0]?.message || "Invalid email address",
          },
        },
        { status: 400 }
      );
    }

    const subscriber = await SubscribeService.subscribe(validated.data);

    return NextResponse.json({
      success: true,
      message: "Successfully registered for 24OURS VIP pre-launch updates.",
      data: {
        email: subscriber.email,
        name: subscriber.name,
      },
    });
  } catch (error: any) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: "Failed to save VIP subscription" },
      },
      { status: 500 }
    );
  }
}

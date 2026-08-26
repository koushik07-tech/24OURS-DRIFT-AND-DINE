import { NextResponse } from "next/server";
import { SubscribeService } from "@/lib/services/subscribe.service";

export async function GET() {
  try {
    const count = await SubscribeService.getSubscriberCount();
    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation/schemas";
import { AuthService } from "@/lib/services/auth.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: validated.error.errors[0]?.message || "Invalid registration data",
          },
        },
        { status: 400 }
      );
    }

    const { user } = await AuthService.register(validated.data);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please log in.",
        data: { user },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === "EMAIL_EXISTS") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "EMAIL_EXISTS",
            message: "An account with this email address already exists.",
          },
        },
        { status: 409 }
      );
    }

    if (error.message === "USERNAME_EXISTS") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USERNAME_EXISTS",
            message: "This username is already taken. Please choose another.",
          },
        },
        { status: 409 }
      );
    }

    console.error("Register API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Internal server error during registration.",
        },
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation/schemas";
import { AuthService } from "@/lib/services/auth.service";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: validated.error.errors[0]?.message || "Invalid credentials",
          },
        },
        { status: 400 }
      );
    }

    const { user, token } = await AuthService.login(validated.data);

    const response = NextResponse.json({
      success: true,
      data: { user, token },
    });

    setAuthCookie(response, token);
    return response;
  } catch (error: any) {
    if (error.message === "INVALID_CREDENTIALS") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_CREDENTIALS",
            message: "Invalid username or password.",
          },
        },
        { status: 401 }
      );
    }

    console.error("Login API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "Internal server error during login.",
        },
      },
      { status: 500 }
    );
  }
}

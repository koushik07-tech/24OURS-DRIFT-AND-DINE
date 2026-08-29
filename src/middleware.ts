import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "24ours_auth_token";
const AUTH_SECRET = process.env.AUTH_SECRET || "your-super-secret-jwt-key-change-in-production-min-32-chars";

// Helper to decode Base64Url string in Edge runtime with proper padding
function base64UrlDecode(b64url: string): string {
  let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (b64.length % 4 !== 0) {
    b64 += "=";
  }
  return atob(b64);
}

// Helper to cryptographically verify HMAC-SHA256 JWT in Edge runtime
async function verifyJwtInEdge(token: string, secret: string): Promise<{ userId?: string; email?: string; role?: string; exp?: number } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, signatureB64] = parts;
    
    // 1. Decode & validate payload structure and expiration
    const payloadStr = base64UrlDecode(payloadB64);
    const payload = JSON.parse(payloadStr);
    if (!payload.userId || !payload.exp || payload.exp * 1000 < Date.now()) {
      return null;
    }

    // 2. Cryptographically verify signature using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const binSig = base64UrlDecode(signatureB64);
    const sigBytes = new Uint8Array(binSig.length);
    for (let i = 0; i < binSig.length; i++) {
      sigBytes[i] = binSig.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify("HMAC", key, sigBytes, data);
    return isValid ? payload : null;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Skip Next.js internals, static files, and icons
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/api/status") ||
    pathname.startsWith("/api/payments/webhook") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|css|js)$/)
  ) {
    return NextResponse.next();
  }

  // 2. Read token and parse session
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifyJwtInEdge(token, AUTH_SECRET) : null;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "ADMIN";

  // 3. Define Auth Pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // 4. Handle authenticated users attempting to access /login or /signup
  if (isAuthenticated && isAuthPage) {
    const redirectUrl = req.nextUrl.searchParams.get("redirect");
    if (redirectUrl && redirectUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 5. Handle unauthenticated users accessing /login or /signup
  if (!isAuthenticated && isAuthPage) {
    const res = NextResponse.next();
    if (token) {
      // Clear stale, expired, or invalid cookie from browser
      res.cookies.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        expires: new Date(0),
        path: "/",
      });
    }
    return res;
  }

  // 6. Handle Admin Routes (/admin, /admin/*)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      if (token) {
        res.cookies.set(COOKIE_NAME, "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 0,
          expires: new Date(0),
          path: "/",
        });
      }
      return res;
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 7. Handle Admin API Routes (/api/admin/*)
  if (pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      const res = NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
      if (token) {
        res.cookies.set(COOKIE_NAME, "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 0,
          expires: new Date(0),
          path: "/",
        });
      }
      return res;
    }
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Admin access required." } },
        { status: 403 }
      );
      }
    return NextResponse.next();
  }

  // 8. Handle Protected User Dashboard (/dashboard, /dashboard/*)
  if (pathname.startsWith("/dashboard")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      const res = NextResponse.redirect(loginUrl);
      if (token) {
        res.cookies.set(COOKIE_NAME, "", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 0,
          expires: new Date(0),
          path: "/",
        });
      }
      return res;
    }
    return NextResponse.next();
  }

  // 9. All other routes (Homepage "/", legal pages, booking modal endpoints, public APIs) remain open
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

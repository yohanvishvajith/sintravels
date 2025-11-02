import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Paths that require authentication
const protectedPaths = ["/api/admin", "/api/user/me", "/api/users"];

export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const payload = await verifyToken(token);
      if (!payload) {
        return NextResponse.json(
          { ok: false, error: "Invalid token" },
          { status: 401 }
        );
      }

      // Check if user has ADMIN role for admin routes
      if (pathname.startsWith("/api/admin") && payload.role !== "ADMIN") {
        return NextResponse.json(
          { ok: false, error: "Forbidden - Admin access required" },
          { status: 403 }
        );
      }

      // Add user info to request headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", payload.userId.toString());
      requestHeaders.set("x-user-role", payload.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { ok: false, error: "Authentication failed" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

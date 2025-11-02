import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./lib/auth-middleware";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply auth middleware for API routes
  if (pathname.startsWith("/api")) {
    return authMiddleware(request);
  }

  // Apply i18n middleware for other routes
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected route prefixes and their required roles
const PROTECTED_ROUTES: Record<string, string> = {
  "/startup": "startup",
  "/partner": "partner",
  "/nic": "nic",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const matchedPrefix = Object.keys(PROTECTED_ROUTES).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!matchedPrefix) {
    return NextResponse.next();
  }

  // Read auth from cookies (we'll also set a cookie on login)
  const token = request.cookies.get("sonic_token")?.value;
  const role = request.cookies.get("sonic_role")?.value;

  if (!token || !role) {
    // Not authenticated — redirect to home
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  const requiredRole = PROTECTED_ROUTES[matchedPrefix];
  if (role !== requiredRole) {
    // Wrong role — redirect to their own dashboard
    const url = request.nextUrl.clone();
    url.pathname = `/${role}/dashboard`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/startup/:path*",
    "/partner/:path*",
    "/nic/:path*",
  ],
};

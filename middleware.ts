import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for better-auth session cookie
  const sessionCookie = request.cookies.get("better-auth.session_token");
  const isAuthenticated = Boolean(sessionCookie);

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";

  // Redirect unauthenticated users from dashboard routes to sign-in
  if (isDashboardRoute && !isAuthenticated) {
    console.log(
      `Middleware: Redirecting unauthenticated user from ${pathname} to /sign-in`,
    );
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    console.log(
      `Middleware: Redirecting authenticated user from ${pathname} to /dashboard`,
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
};

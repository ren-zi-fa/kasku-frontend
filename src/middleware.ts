import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  
  const isAuthPage = pathname === "/" || pathname === "/auth/signup";

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && isDashboardRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/signup", "/dashboard/:path*"],
};

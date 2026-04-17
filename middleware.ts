import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  response.headers.set("x-pathname", pathname);

  const requiresAuth = protectedPaths.some((path) => pathname.startsWith(path));
  const hasSession = request.cookies.has("siakad_session");

  if (requiresAuth && !hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

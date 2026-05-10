import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const protectedRoutes = ["/dashboard", "/results", "/saved"];
  const isProtected = protectedRoutes.some((path) => request.nextUrl.pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();
  if (!request.cookies.get("uni_match_session")?.value) return NextResponse.redirect(new URL("/", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/results/:path*", "/saved/:path*"] };

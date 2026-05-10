import { NextResponse, type NextRequest } from "next/server";
import { getSameOriginUrl } from "@/lib/request-url";
import { authCookieName, createDemoSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = createDemoSession();
  const response = NextResponse.redirect(getSameOriginUrl(request, "/search"));

  response.cookies.set(authCookieName, user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

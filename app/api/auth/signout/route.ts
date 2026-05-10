import { NextResponse, type NextRequest } from "next/server";
import { getSameOriginUrl } from "@/lib/request-url";
import { authCookieName } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(getSameOriginUrl(request, "/"));
  response.cookies.delete(authCookieName);
  return response;
}

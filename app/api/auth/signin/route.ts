import { NextResponse } from "next/server";
import { authCookieName, createDemoSession } from "@/lib/auth";

export async function GET() {
  const user = createDemoSession();
  const response = NextResponse.redirect(new URL("/search", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  response.cookies.set(authCookieName, user.id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return response;
}

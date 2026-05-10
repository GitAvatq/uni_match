import { NextResponse } from "next/server";
import { authCookieName } from "@/lib/auth";
export async function GET() { const response = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")); response.cookies.delete(authCookieName); return response; }

import type { NextRequest } from "next/server";

export function getRequestOrigin(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host") || request.nextUrl.host;
  const protocol = forwardedProto || request.nextUrl.protocol.replace(":", "") || "http";

  return `${protocol}://${host}`;
}

export function getSameOriginUrl(request: NextRequest, pathname: string) {
  return new URL(pathname, getRequestOrigin(request));
}

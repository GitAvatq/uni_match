import { cookies } from "next/headers";
import { getOrCreateDemoUser, getUserById } from "@/lib/db";

export const authCookieName = "uni_match_session";

export async function getSessionUser() {
  const jar = await cookies();
  const id = jar.get(authCookieName)?.value;
  if (!id) return null;
  return getUserById(id);
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export function createDemoSession() {
  return getOrCreateDemoUser();
}

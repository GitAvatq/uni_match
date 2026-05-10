import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { removeSaved, saveScholarship } from "@/lib/db";
import type { Scholarship } from "@/lib/types";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => null) as { scholarship?: Scholarship } | null;
  if (!body?.scholarship?.id) return NextResponse.json({ error: "Scholarship is required." }, { status: 400 });
  return NextResponse.json(saveScholarship(user.id, body.scholarship));
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Saved id is required." }, { status: 400 });
  removeSaved(user.id, id);
  return NextResponse.json({ ok: true });
}

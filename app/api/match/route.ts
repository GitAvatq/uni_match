import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { canRunSearch, incrementSearchCount, saveSearch } from "@/lib/db";
import { matchScholarships } from "@/lib/anthropic";
import { validateProfile } from "@/lib/validation";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in before running an AI scholarship match." }, { status: 401 });
  const parsed = validateProfile(await request.json().catch(() => null));
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  if (!canRunSearch(user.id)) return NextResponse.json({ error: "Search limit reached. Free users get 3 AI searches/month. Upgrade to Pro for unlimited matching." }, { status: 429 });
  try {
    const results = await matchScholarships(parsed.data);
    const search = saveSearch(user.id, parsed.data, results);
    incrementSearchCount(user.id);
    return NextResponse.json({ ...results, searchId: search.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "AI matching failed." }, { status: 500 });
  }
}

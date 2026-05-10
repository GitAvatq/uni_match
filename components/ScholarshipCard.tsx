"use client";

import { useState } from "react";
import type { Scholarship } from "@/lib/types";
import { MatchScore } from "@/components/MatchScore";
import { toast } from "@/components/Toaster";

const difficultyMap = { competitive: "🔴 Competitive", moderate: "🟡 Moderate", accessible: "🟢 Accessible" };

export function ScholarshipSkeleton() {
  return <div className="glass h-80 animate-pulse rounded-3xl" />;
}

export function ScholarshipCard({ scholarship, initiallySaved = false, savedId, onRemoved }: { scholarship: Scholarship; initiallySaved?: boolean; savedId?: string; onRemoved?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(initiallySaved);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    const response = await fetch("/api/save", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scholarship }) });
    setBusy(false);
    if (response.ok) { setSaved(true); toast.success("Scholarship saved!"); } else toast.error("Please sign in to save scholarships.");
  }

  async function remove() {
    setBusy(true);
    const response = await fetch(`/api/save?id=${encodeURIComponent(savedId || scholarship.id)}`, { method: "DELETE" });
    setBusy(false);
    if (response.ok) { setSaved(false); toast.info("Scholarship removed."); onRemoved?.(); } else toast.error("Could not remove scholarship.");
  }

  return (
    <article className="glass rounded-3xl p-5 transition hover:-translate-y-1 hover:border-blue-400/40 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-blue-200">
            <span>{scholarship.flag} {scholarship.country}</span><span>•</span><span>{scholarship.type}</span>
          </div>
          <h3 className="font-display text-2xl font-semibold text-white">{scholarship.name}</h3>
          <p className="mt-1 text-slate-400">{scholarship.organization}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-amber-500/15 px-3 py-1 text-sm font-bold text-amber-200">{scholarship.amount}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">Deadline: {scholarship.deadline}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">{difficultyMap[scholarship.difficulty]}</span>
          </div>
        </div>
        <MatchScore score={scholarship.matchScore} />
      </div>
      <p className="mt-5 leading-7 text-slate-300">{scholarship.whyMatch}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={() => setExpanded((value) => !value)} className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10">{expanded ? "Hide details" : "Expand details"}</button>
        <button disabled={busy} onClick={saved ? remove : save} className="rounded-full border border-pink-300/30 px-4 py-2 text-sm font-bold text-pink-100 hover:bg-pink-500/10">{saved ? "♥ Saved" : "♡ Save"}</button>
        <a href={scholarship.applyUrl} target="_blank" rel="noreferrer" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-500">Apply Now →</a>
      </div>
      {expanded && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Detail title="Requirements" items={scholarship.requirements} />
          <Detail title="Your Strengths" items={scholarship.strengths} tone="green" />
          <Detail title="Gaps to Address" items={scholarship.gaps} tone="amber" />
        </div>
      )}
    </article>
  );
}

function Detail({ title, items, tone = "blue" }: { title: string; items: string[]; tone?: "blue" | "green" | "amber" }) {
  const color = tone === "green" ? "text-emerald-200" : tone === "amber" ? "text-amber-200" : "text-blue-200";
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><h4 className={`mb-3 font-bold ${color}`}>{title}</h4><ul className="space-y-2 text-sm text-slate-300">{items.map((item) => <li key={item}>• {item}</li>)}</ul></div>;
}

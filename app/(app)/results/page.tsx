import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { ScoreGauge } from "@/components/MatchScore";
import { latestSearch } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
export const metadata: Metadata = { title: "Your Scholarship Matches", description: "AI-generated scholarship matches and strategic advice." };
export default async function ResultsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/");
  const search = latestSearch(user.id);
  if (!search) redirect("/search");
  const results = search.results;
  const paragraphs = results.overallAdvice.split(/\n+/).filter(Boolean);
  return <main className="min-h-screen luxury-gradient"><Navbar /><section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><details className="glass mb-6 rounded-3xl p-5"><summary className="cursor-pointer font-bold">Profile summary</summary><div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-3"><span>Origin: {search.profile.originCountry}</span><span>Targets: {search.profile.targetCountries.join(", ")}</span><span>{search.profile.degreeLevel} · {search.profile.fieldOfStudy}</span><span>GPA: {search.profile.gpa}</span><span>English: {search.profile.englishTest} {search.profile.englishScore || ""}</span><span>Need: {search.profile.financialNeed}</span></div></details><div className="grid gap-6 lg:grid-cols-[320px_1fr]"><aside className="space-y-5"><div className="glass rounded-3xl p-6 text-center"><h2 className="font-display text-2xl">Profile Score</h2><div className="my-5"><ScoreGauge score={results.profileScore} /></div><p className="text-slate-400">Your readiness score across academics, tests, background, and scholarship fit.</p></div><Feedback title="Strengths" items={results.profileFeedback.strengths} /><Feedback title="Improvements" items={results.profileFeedback.improvements} /><Feedback title="Next Steps" items={results.profileFeedback.nextSteps} /></aside><div><h1 className="font-display mb-6 text-4xl md:text-5xl">Your 7 Scholarship Matches</h1><div className="space-y-5">{results.scholarships.map((scholarship) => <ScholarshipCard key={scholarship.id} scholarship={scholarship} />)}</div><div className="glass mt-8 rounded-3xl p-7"><h2 className="font-display text-3xl">AI Advisor</h2>{paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-8 text-slate-300">{paragraph}</p>)}</div></div></div></section></main>;
}
function Feedback({ title, items }: { title: string; items: string[] }) { return <details className="glass rounded-3xl p-5" open={title === "Strengths"}><summary className="cursor-pointer font-bold text-blue-100">{title}</summary><ul className="mt-3 space-y-2 text-sm text-slate-300">{items.map((item) => <li key={item}>• {item}</li>)}</ul></details>; }

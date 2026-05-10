import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { getSessionUser } from "@/lib/auth";
import { listSaved } from "@/lib/db";
export const metadata: Metadata = { title: "Saved Scholarships", description: "Your saved Uni Match scholarship shortlist." };
export default async function SavedPage({ searchParams }: { searchParams: Promise<{ country?: string; deadline?: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/");
  const params = await searchParams;
  const saved = listSaved(user.id).filter((item) => (!params.country || item.country === params.country) && (!params.deadline || item.deadline.toLowerCase().includes(params.deadline.toLowerCase())));
  const countries = Array.from(new Set(listSaved(user.id).map((item) => item.country)));
  return <main className="min-h-screen luxury-gradient"><Navbar /><section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><h1 className="font-display text-5xl">Saved Scholarships</h1><form className="glass my-8 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row"><select name="country" defaultValue={params.country || ""} className="rounded-2xl bg-[#071225] px-4 py-3"><option value="">All countries</option>{countries.map((country) => <option key={country}>{country}</option>)}</select><input name="deadline" defaultValue={params.deadline || ""} placeholder="Filter deadline" className="rounded-2xl bg-[#071225] px-4 py-3" /><button className="rounded-2xl bg-blue-600 px-5 py-3 font-bold">Filter</button></form>{saved.length === 0 ? <div className="glass rounded-3xl p-8 text-center text-slate-300">No saved scholarships yet. Run a search and tap the heart button.</div> : <div className="grid gap-5 xl:grid-cols-2">{saved.map((item) => <div key={item.id}><div className="mb-2 text-sm text-slate-400">Saved {new Date(item.createdAt).toLocaleDateString()}</div><ScholarshipCard scholarship={item.scholarship} initiallySaved savedId={item.id} /></div>)}</div>}</section></main>;
}

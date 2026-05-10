"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { countries, fields } from "@/lib/data";
import type { StudentProfile } from "@/lib/types";
import { toast } from "@/components/Toaster";

const defaults: StudentProfile = { originCountry: "Kazakhstan", targetCountries: ["United States"], degreeLevel: "Bachelor", fieldOfStudy: "Computer Science", gpa: 3.4, englishTest: "IELTS", englishScore: 7, otherLanguages: [], financialNeed: "Partial", workExperience: "0", researchPublications: "No", volunteerWork: "Yes", achievements: "" };

export function ProfileForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<StudentProfile>(defaults);
  const [languageInput, setLanguageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const progress = useMemo(() => (step / 3) * 100, [step]);

  function update<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) { setForm((current) => ({ ...current, [key]: value })); }
  function toggleTarget(country: string) {
    setForm((current) => {
      const exists = current.targetCountries.includes(country);
      const next = exists ? current.targetCountries.filter((item) => item !== country) : [...current.targetCountries, country].slice(0, 3);
      if (!exists && current.targetCountries.length >= 3) toast.info("You can choose up to 3 target countries.");
      return { ...current, targetCountries: next };
    });
  }
  function addLanguage() {
    const language = languageInput.trim();
    if (!language) return;
    update("otherLanguages", [...form.otherLanguages, language].slice(0, 8));
    setLanguageInput("");
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    const response = await fetch("/api/match", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    const payload = await response.json().catch(() => ({}));
    setLoading(false);
    if (!response.ok) { toast.error(payload.error || "Could not run AI match."); return; }
    sessionStorage.setItem("uni_match_results", JSON.stringify(payload));
    router.push("/results");
  }

  return (
    <form onSubmit={submit} className="glass mx-auto max-w-5xl rounded-[2rem] p-5 sm:p-8">
      <div className="mb-8">
        <div className="mb-3 flex justify-between text-sm font-bold text-slate-300"><span>Step {step} of 3</span><span>{Math.round(progress)}%</span></div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} /></div>
      </div>
      {step === 1 && <Academic form={form} update={update} toggleTarget={toggleTarget} />}
      {step === 2 && <Scores form={form} update={update} languageInput={languageInput} setLanguageInput={setLanguageInput} addLanguage={addLanguage} />}
      {step === 3 && <Background form={form} update={update} />}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={() => setStep((value) => Math.max(1, value - 1))} className="rounded-full border border-white/15 px-6 py-3 font-bold text-slate-200 disabled:opacity-40" disabled={step === 1}>Back</button>
        {step < 3 ? <button type="button" onClick={() => setStep((value) => Math.min(3, value + 1))} className="rounded-full bg-blue-600 px-6 py-3 font-bold hover:bg-blue-500">Continue →</button> : <button disabled={loading} className="rounded-full bg-amber-500 px-6 py-3 font-black text-[#050C1C] hover:bg-amber-400 disabled:opacity-60">{loading ? "Analyzing scholarships..." : "Find My Scholarships →"}</button>}
      </div>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) { return <label className="mb-2 block text-sm font-bold text-slate-200">{children}</label>; }
function Select({ value, onChange, children }: { value: string; onChange: (value: string) => void; children: React.ReactNode }) { return <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-[#071225] px-4 py-3 text-white outline-none focus:border-blue-400">{children}</select>; }
function Academic({ form, update, toggleTarget }: { form: StudentProfile; update: <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => void; toggleTarget: (country: string) => void }) {
  return <section className="space-y-6"><h2 className="font-display text-3xl">Academic Profile</h2><div className="grid gap-5 md:grid-cols-2"><div><Label>Country of Origin</Label><Select value={form.originCountry} onChange={(v) => update("originCountry", v)}>{countries.map((c) => <option key={c}>{c}</option>)}</Select></div><div><Label>Field of Study</Label><Select value={form.fieldOfStudy} onChange={(v) => update("fieldOfStudy", v)}>{fields.map((f) => <option key={f}>{f}</option>)}</Select></div></div><div><Label>Target Study Country (up to 3)</Label><div className="grid max-h-60 gap-2 overflow-auto rounded-2xl border border-white/10 bg-[#071225] p-3 sm:grid-cols-2 lg:grid-cols-3">{countries.map((country) => <button type="button" key={country} onClick={() => toggleTarget(country)} className={`rounded-xl px-3 py-2 text-left text-sm ${form.targetCountries.includes(country) ? "bg-blue-600 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}>{country}</button>)}</div></div><div><Label>Degree Level</Label><div className="grid gap-3 sm:grid-cols-3">{["Bachelor", "Master", "PhD"].map((degree) => <button type="button" key={degree} onClick={() => update("degreeLevel", degree as StudentProfile["degreeLevel"])} className={`rounded-2xl border p-5 text-left ${form.degreeLevel === degree ? "border-blue-400 bg-blue-600/20" : "border-white/10 bg-white/5"}`}><span className="text-xl font-black">{degree}</span><p className="mt-2 text-sm text-slate-400">Scholarships tuned for {degree} programs.</p></button>)}</div></div></section>;
}
function Scores({ form, update, languageInput, setLanguageInput, addLanguage }: { form: StudentProfile; update: <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => void; languageInput: string; setLanguageInput: (v: string) => void; addLanguage: () => void }) {
  const max = form.englishTest === "IELTS" ? 9 : form.englishTest === "TOEFL" ? 120 : 160;
  return <section className="space-y-6"><h2 className="font-display text-3xl">Test Scores</h2><div><Label>GPA: {form.gpa.toFixed(1)} / 4.0 <span className="ml-2 text-amber-300">{form.gpa < 2.6 ? "Poor" : form.gpa < 3.4 ? "Good" : "Excellent"}</span></Label><input type="range" min="0" max="4" step="0.1" value={form.gpa} onChange={(e) => update("gpa", Number(e.target.value))} className="w-full accent-blue-600" /></div><div className="grid gap-4 md:grid-cols-2"><div><Label>English Test</Label><div className="grid grid-cols-2 gap-2">{["IELTS", "TOEFL", "Duolingo", "None"].map((test) => <button type="button" key={test} onClick={() => update("englishTest", test as StudentProfile["englishTest"])} className={`rounded-xl px-3 py-3 font-bold ${form.englishTest === test ? "bg-blue-600" : "bg-white/10"}`}>{test}</button>)}</div></div>{form.englishTest !== "None" && <div><Label>{form.englishTest} Score</Label><input type="number" min="0" max={max} value={form.englishScore || ""} onChange={(e) => update("englishScore", Number(e.target.value))} className="w-full rounded-2xl border border-white/10 bg-[#071225] px-4 py-3 outline-none focus:border-blue-400" /></div>}</div><div><Label>Other Languages</Label><div className="flex gap-2"><input value={languageInput} onChange={(e) => setLanguageInput(e.target.value)} className="flex-1 rounded-2xl border border-white/10 bg-[#071225] px-4 py-3 outline-none" placeholder="French, German, Korean..." /><button type="button" onClick={addLanguage} className="rounded-2xl bg-white/10 px-4 font-bold">Add</button></div><div className="mt-3 flex flex-wrap gap-2">{form.otherLanguages.map((lang) => <span key={lang} className="rounded-full bg-white/10 px-3 py-1 text-sm">{lang}</span>)}</div></div></section>;
}
function Background({ form, update }: { form: StudentProfile; update: <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => void }) {
  return <section className="space-y-6"><h2 className="font-display text-3xl">Background</h2><div className="grid gap-5 md:grid-cols-2"><Choice label="Financial Need" value={form.financialNeed} options={["Yes", "Partial", "No"]} onChange={(v) => update("financialNeed", v as StudentProfile["financialNeed"])} /><Choice label="Work Experience" value={form.workExperience} options={["0", "1-2 years", "3-5 years", "5+"]} onChange={(v) => update("workExperience", v as StudentProfile["workExperience"])} /><Choice label="Research Publications" value={form.researchPublications} options={["Yes", "No"]} onChange={(v) => update("researchPublications", v as StudentProfile["researchPublications"])} /><Choice label="Volunteer Work" value={form.volunteerWork} options={["Yes", "No"]} onChange={(v) => update("volunteerWork", v as StudentProfile["volunteerWork"])} /></div><div><Label>Achievements ({form.achievements.length}/500)</Label><textarea maxLength={500} value={form.achievements} onChange={(e) => update("achievements", e.target.value)} className="min-h-36 w-full rounded-2xl border border-white/10 bg-[#071225] px-4 py-3 outline-none focus:border-blue-400" placeholder="Awards, Olympiads, startups, community projects, leadership, publications..." /></div></section>;
}
function Choice({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <div><Label>{label}</Label><div className="flex flex-wrap gap-2">{options.map((option) => <button type="button" key={option} onClick={() => onChange(option)} className={`rounded-xl px-4 py-3 font-bold ${value === option ? "bg-blue-600" : "bg-white/10"}`}>{option}</button>)}</div></div>; }

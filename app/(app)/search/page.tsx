import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ProfileForm } from "@/components/ProfileForm";
export const metadata: Metadata = { title: "Scholarship Search", description: "Build your student profile and get AI scholarship matches." };
export default function SearchPage() { return <main className="min-h-screen luxury-gradient"><Navbar /><section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><div className="mb-8"><p className="font-bold uppercase tracking-[.3em] text-blue-300">Profile builder</p><h1 className="font-display mt-3 text-5xl">Find My Scholarships</h1><p className="mt-4 max-w-2xl text-slate-300">Answer three quick sections. Uni Match will score your profile, find grants, and show exactly where to improve.</p></div><ProfileForm /></section></main>; }

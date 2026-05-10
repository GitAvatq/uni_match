import Link from "next/link";
import { getSessionUser } from "@/lib/auth";

export async function Navbar() {
  const user = await getSessionUser();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050C1C]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 font-black shadow-lg shadow-blue-600/30">U</span>
          <span className="font-display text-2xl font-semibold tracking-tight">Uni Match</span>
        </Link>
        <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/#how" className="hover:text-white">How it works</Link>
          <Link href="/#pricing" className="hover:text-white">Pricing</Link>
          <Link href="/saved" className="hover:text-white">Saved</Link>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/search" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold hover:bg-blue-500">Search</Link>
            <div className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-sm font-bold" title={user.email}>{user.name.slice(0, 1)}</div>
            <a href="/api/auth/signout" className="hidden text-sm text-slate-400 hover:text-white sm:block">Sign out</a>
          </div>
        ) : (
          <a href="/api/auth/signin" className="rounded-full border border-white/15 px-4 py-2 text-sm font-bold hover:bg-white/10">Sign In</a>
        )}
      </nav>
    </header>
  );
}

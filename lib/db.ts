import type { MatchResults, Scholarship, StudentProfile } from "@/lib/types";

type User = { id: string; name: string; email: string; image?: string; plan: "FREE" | "PRO"; searchesThisMonth: number; searchMonth: string };
type Search = { id: string; userId: string; profile: StudentProfile; results: MatchResults; createdAt: string };
type Saved = { id: string; userId: string; scholarshipId: string; scholarship: Scholarship; country: string; deadline: string; createdAt: string };
type Store = { users: User[]; searches: Search[]; saved: Saved[] };

const globalForDb = globalThis as unknown as { uniMatchStore?: Store };
export const store: Store = globalForDb.uniMatchStore ?? { users: [], searches: [], saved: [] };
globalForDb.uniMatchStore = store;

export const prisma = null;

export function currentMonthKey(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function getOrCreateDemoUser(email = "founder@unimatch.ai") {
  let user = store.users.find((item) => item.email === email);
  if (!user) {
    user = { id: crypto.randomUUID(), name: "Demo Founder", email, plan: "FREE", searchesThisMonth: 0, searchMonth: currentMonthKey() };
    store.users.push(user);
  }
  return user;
}

export function getUserById(id: string) {
  return store.users.find((user) => user.id === id) || null;
}

export function incrementSearchCount(userId: string) {
  const user = getUserById(userId);
  if (!user) return null;
  const month = currentMonthKey();
  if (user.searchMonth !== month) {
    user.searchMonth = month;
    user.searchesThisMonth = 0;
  }
  user.searchesThisMonth += 1;
  return user;
}

export function canRunSearch(userId: string) {
  const user = getUserById(userId);
  if (!user) return false;
  if (user.plan === "PRO") return true;
  const month = currentMonthKey();
  return user.searchMonth !== month || user.searchesThisMonth < 3;
}

export function saveSearch(userId: string, profile: StudentProfile, results: MatchResults) {
  const search: Search = { id: crypto.randomUUID(), userId, profile, results, createdAt: new Date().toISOString() };
  store.searches.unshift(search);
  return search;
}

export function latestSearch(userId: string) {
  return store.searches.find((search) => search.userId === userId) || null;
}

export function saveScholarship(userId: string, scholarship: Scholarship) {
  const existing = store.saved.find((item) => item.userId === userId && item.scholarshipId === scholarship.id);
  if (existing) return existing;
  const saved: Saved = { id: crypto.randomUUID(), userId, scholarshipId: scholarship.id, scholarship, country: scholarship.country, deadline: scholarship.deadline, createdAt: new Date().toISOString() };
  store.saved.unshift(saved);
  return saved;
}

export function removeSaved(userId: string, id: string) {
  const before = store.saved.length;
  store.saved = store.saved.filter((item) => !(item.userId === userId && (item.id === id || item.scholarshipId === id)));
  globalForDb.uniMatchStore = store;
  return store.saved.length < before;
}

export function listSaved(userId: string) {
  return store.saved.filter((item) => item.userId === userId);
}

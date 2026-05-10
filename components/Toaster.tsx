"use client";

import { useEffect, useState } from "react";

type Toast = { id: string; message: string; tone: "success" | "error" | "info" };
const listeners = new Set<(toast: Toast) => void>();

export const toast = {
  success: (message: string) => emit(message, "success"),
  error: (message: string) => emit(message, "error"),
  info: (message: string) => emit(message, "info")
};

function emit(message: string, tone: Toast["tone"]) {
  const item = { id: crypto.randomUUID(), message, tone };
  listeners.forEach((listener) => listener(item));
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);
  useEffect(() => {
    const listener = (toast: Toast) => {
      setItems((current) => [toast, ...current].slice(0, 4));
      setTimeout(() => setItems((current) => current.filter((item) => item.id !== toast.id)), 3500);
    };
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return (
    <div className="fixed right-4 top-4 z-50 space-y-3">
      {items.map((item) => (
        <div key={item.id} className={`rounded-2xl border px-4 py-3 text-sm shadow-2xl ${item.tone === "success" ? "border-emerald-400/40 bg-emerald-500/15" : item.tone === "error" ? "border-red-400/40 bg-red-500/15" : "border-blue-400/40 bg-blue-500/15"}`}>{item.message}</div>
      ))}
    </div>
  );
}

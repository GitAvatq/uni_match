import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/Toaster";

export const metadata: Metadata = {
  title: { default: "Uni Match — AI Scholarship Matching", template: "%s | Uni Match" },
  description: "Find realistic scholarships, deadlines, and admission strategy in 60 seconds with AI.",
  metadataBase: new URL("https://unimatch.ai"),
  openGraph: { title: "Uni Match", description: "AI-powered scholarship matching for international students.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050C1C] text-slate-100 antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

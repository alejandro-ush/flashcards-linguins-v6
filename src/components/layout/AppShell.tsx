/* src/components/layout/AppShell.tsx */
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MainNav } from "@/components/navigation/MainNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/reset");

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50">
      {!isAuthRoute && (
        <header className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900/60 to-slate-950">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-400/10 text-xs font-bold text-teal-300">
                L
              </div>
              <div className="leading-tight text-sm">
                <p className="font-semibold">Linguins v6</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                  Focus Flow
                </p>
              </div>
            </Link>
            <MainNav />
            <Link
              href="/login"
              className="hidden rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200 hover:bg-slate-900 sm:inline-flex"
            >
              Entrar / Registrarse
            </Link>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

/* src/app/(public)/page.tsx
Landing publica */

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          LINGUINS v6 · FOCUS FLOW
        </p>
        <h1 className="text-4xl font-semibold sm:text-5xl">
          Aprender idiomas sin ruido,{" "}
          <span className="text-teal-300">como una meditación activa</span>.
        </h1>
        <p className="text-lg text-slate-300">
          Flashcards inteligentes, IA adaptativa y modos rápidos para estudiar
          cuando tu energía es limitada pero tus metas son grandes.
        </p>
        <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="rounded-full bg-teal-400 px-6 py-2.5 text-sm font-medium text-slate-950 hover:bg-teal-300"
          >
            Empezar ahora
          </Link>
          <Link
            href="/study"
            className="rounded-full border border-slate-600 px-6 py-2.5 text-sm text-slate-100 hover:bg-slate-900/70"
          >
            Probar demo
          </Link>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          v6 · Next.js 14 · Supabase · OpenAI.
        </p>
      </div>
    </div>
  );
}

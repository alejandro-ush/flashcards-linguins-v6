// File: src/app/study/page.tsx
// Pantalla oficial /study v6.1 usando motores reales + StudyFlashcard UI.

"use client";

import { useEffect, useMemo } from "react";
import { useStudyFlow } from "@/core/hooks/useStudyFlow";
import { StudyFlashcardBridge } from "@/components/study/StudyFlashcardBridge";

export default function StudyPage() {
  const { currentItem, loading, start, next } = useStudyFlow();

  // Auto-start de la sesión al entrar en /study
  useEffect(() => {
    void start();
  }, []); // ← dependencia vacía


  const isLoading = loading.start || loading.answer || loading.next;

  const hasItem = useMemo(() => currentItem !== null, [currentItem]);

  const handleNext = () => {
    void next();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="text-sm font-semibold tracking-[0.32em] uppercase text-slate-400">
            Linguins v6.1 · Modo Reto
          </h1>
          <p className="text-xs text-slate-500">
            Primero ves el alemán, luego revelas la traducción. Sin distracciones.
          </p>
        </header>

        <section className="space-y-6">
          <StudyFlashcardBridge
            item={currentItem}
            isLoading={isLoading && !hasItem}
            onNext={handleNext}
          />

          {/* Placeholder para futuras métricas / smart start / tips */}
          <div className="max-w-3xl mx-auto text-center text-xs text-slate-500">
            Próximo paso v6.1: integrar aquí resumen rápido de sesión,
            micro-objetivo del día y mensajes motivacionales.
          </div>
        </section>
      </div>
    </main>
  );
}

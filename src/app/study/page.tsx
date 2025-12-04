// File: src/app/study/page.tsx
// Pantalla oficial v6.1: conecta useStudyFlow con StudyCard y StudyActions.

"use client";

import { StudyCard } from "@/components/study/StudyCard";
import { StudyActions } from "@/components/study/StudyActions";
import { useStudyFlow } from "@/core/hooks/useStudyFlow";

export default function StudyPage() {
  const { currentItem, loading, start, answer, next } = useStudyFlow();

  const isLoading = loading.start || loading.answer || loading.next;

  const handleStart = () => {
    void start();
  };

  const markCorrect = () => {
    void answer(true, 0);
  };

  const markWrong = () => {
    void answer(false, 0);
  };

  const nextItem = () => {
    void next();
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <button
          onClick={handleStart}
          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-50"
        >
          Iniciar sesión
        </button>
      </div>

      <StudyCard item={currentItem} isLoading={isLoading} />

      <StudyActions
        item={currentItem}
        isLoading={isLoading}
        onMarkCorrect={markCorrect}
        onMarkWrong={markWrong}
        onNext={nextItem}
      />
    </div>
  );
}

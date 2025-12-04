// File: src/components/study/StudyActions.tsx
// Botonera mínima v6.1 (sin lógica de motores), basada en Item.

import type { Item } from "@/core/types";

type Props = {
  item: Item | null;
  isLoading: boolean;
  onMarkCorrect: () => void;
  onMarkWrong: () => void;
  onNext: () => void;
};

export function StudyActions({
  item,
  isLoading,
  onMarkCorrect,
  onMarkWrong,
  onNext,
}: Props) {
  if (isLoading) return <div>Loading…</div>;

  const disableAnswers = item === null;

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        onClick={onMarkCorrect}
        disabled={disableAnswers}
        className="rounded-lg border border-slate-800 bg-emerald-900/60 px-3 py-2 text-emerald-50 disabled:opacity-50"
      >
        Correcto
      </button>
      <button
        onClick={onMarkWrong}
        disabled={disableAnswers}
        className="rounded-lg border border-slate-800 bg-rose-900/60 px-3 py-2 text-rose-50 disabled:opacity-50"
      >
        Incorrecto
      </button>
      <button
        onClick={onNext}
        className="rounded-lg border border-slate-800 bg-slate-800 px-3 py-2 text-slate-50"
      >
        Siguiente
      </button>
    </div>
  );
}

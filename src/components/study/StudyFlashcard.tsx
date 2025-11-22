// src/components/study/StudyFlashcard.tsx

'use client';

import type { CardV6 } from '@/types/cards';
import type { StudySide } from '@/hooks/useStudySession';

function getTypeLabel(typeId: number) {
  if (typeId === 1) return 'Sustantivo';
  if (typeId === 2) return 'Verbo';
  return 'Palabra';
}

function formatGender(gender?: string | null) {
  if (!gender) return null;
  switch (gender) {
    case 'masculine':
      return 'der (masculino)';
    case 'feminine':
      return 'die (femenino)';
    case 'neuter':
      return 'das (neutro)';
    default:
      return gender;
  }
}

export function StudyFlashcard({
  card,
  side,
}: {
  card: CardV6;
  side: StudySide;
}) {
  const typeLabel = getTypeLabel(card.type_id);
  const genderLabel = formatGender(card.gender);

  const isFront = side === 'front';

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 flex flex-col gap-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span className="uppercase tracking-[0.22em] text-slate-500">
          MODO RETO · v6
        </span>
        <span className="px-2 py-0.5 rounded-full border border-slate-700 text-[11px]">
          {typeLabel}
        </span>
      </div>

      {/* Palabra principal */}
      <div className="mt-2 text-center space-y-2">
        {isFront ? (
          <>
            <p className="text-[13px] uppercase tracking-[0.2em] text-slate-500">
              Lado A · Alemán
            </p>
            <p className="text-4xl sm:text-5xl font-semibold text-slate-50">
              {card.word_from || '—'}
            </p>
          </>
        ) : (
          <>
            <p className="text-[13px] uppercase tracking-[0.2em] text-slate-500">
              Lado B · Español
            </p>
            <p className="text-4xl sm:text-5xl font-semibold text-emerald-300">
              {card.word_to || '—'}
            </p>
          </>
        )}
      </div>

      {/* Detalles extra (solo en el lado B) */}
      {!isFront && (
        <div className="mt-4 grid gap-2 text-sm text-slate-200">
          {genderLabel && (
            <p>
              <span className="text-xs text-slate-500 mr-1">Género:</span>
              <span className="font-medium">{genderLabel}</span>
            </p>
          )}
          {card.plural && (
            <p>
              <span className="text-xs text-slate-500 mr-1">Plural:</span>
              <span className="font-medium">{card.plural}</span>
            </p>
          )}
          {card.is_uncountable && (
            <p className="text-xs text-amber-300">
              Sustantivo no contable (piensa en “agua”, “pan”).
            </p>
          )}
          {card.note && (
            <p className="text-xs text-slate-300 border-t border-slate-800 pt-2 mt-1">
              Nota: {card.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

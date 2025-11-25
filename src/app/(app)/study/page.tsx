// src/app/(app)/study/page.tsx

/* ver1
'use client';

import { useEffect, useState } from 'react';
import type { CardV6 } from '@/types/cards';
import { useStudySession } from '@/hooks/useStudySession';
import { StudyFlashcard } from '@/components/study/StudyFlashcard';

export default function StudyPage() {
  const [cards, setCards] = useState<CardV6[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const session = useStudySession({ cards });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/decks');
        if (!res.ok) {
          throw new Error('No se pudo cargar el mazo.');
        }
        const json = await res.json();
        // API actual: { ok, count, cards }
        setCards(json.cards ?? []);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? 'Error inesperado al cargar las tarjetas.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto space-y-4">
      --{ Header }
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Modo Reto (Study) · v6
          </h1>
          <p className="text-sm text-slate-400">
            Una tarjeta, foco total. Primero ves el alemán, luego revelas la
            traducción y los detalles.
          </p>
        </div>

        {session.hasCards && (
          <div className="text-xs text-right text-slate-400">
            <p>
              Tarjeta {session.index + 1} de {session.total}
            </p>
          </div>
        )}
      </div>

      -- Estados de carga / error / vacío
      {loading && (
        <p className="text-sm text-slate-400">Cargando tarjetas…</p>
      )}

      {error && (
        <p className="text-sm text-rose-400 bg-rose-950/40 border border-rose-800 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {!loading && !error && !session.hasCards && (
        <p className="text-sm text-slate-400">
          No hay tarjetas disponibles todavía. Revisa que la base de datos tenga
          palabras cargadas para DE → ES.
        </p>
      )}

      -- Card y acciones
      {session.current && (
        <div className="space-y-4">
          <StudyFlashcard card={session.current} side={session.side} />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={session.flip}
              className="flex-1 rounded-full bg-emerald-400 text-black py-2 text-sm font-medium hover:bg-emerald-300 transition"
            >
              {session.side === 'front'
                ? 'Ver respuesta y detalles'
                : 'Volver al lado A'}
            </button>
            <div className="flex gap-2">
              <button
                onClick={session.prev}
                className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:bg-slate-900/60"
              >
                Anterior
              </button>
              <button
                onClick={session.next}
                className="rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-200 hover:bg-slate-900/60"
              >
                Siguiente
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Tip: En v7 vamos a conectar esto con SRS (Leitner) + IA adaptativa
            usando tus respuestas y tiempos reales.
          </p>
        </div>
      )}
    </main>
  );
}
*/

"use client";

import Link from "next/link";
import { StudyModeTabs } from "@/components/study/StudyModeTabs";

export default function StudyHubPage() {
  return (
    <main className="px-4 py-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Modo Reto</h1>
          <p className="text-sm text-slate-400">
            Entrená vocabulario con diferentes estilos de práctica. Todos
            conectados a un mismo sistema de repaso espaciado.
          </p>
        </div>
        <StudyModeTabs />
      </div>

      <div className="grid gap-4 sm:grid-cols-3 text-sm">
        <Link
          href="/study/flashcard"
          className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 hover:border-primary/60 hover:bg-slate-900 transition"
        >
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-[0.18em]">
            Flashcards
          </p>
          <p className="text-slate-50 font-medium mb-1">
            Memoria (Clásica)
          </p>
          <p className="text-[11px] text-slate-400">
            Tarjetas, ideal para repaso rápido y consolidar
            vocabulario.
          </p>
        </Link>

        <Link
          href="/study/writing"
          className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 hover:border-primary/60 hover:bg-slate-900 transition"
        >
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-[0.18em]">
            Writing
          </p>
          <p className="text-slate-50 font-medium mb-1">
            Escritura
          </p>
          <p className="text-[11px] text-slate-400">
            Practicá escribiendo palabras o frase. Refuerza ortografía y
            producción activa.
          </p>
        </Link>

        <Link
          href="/study/mc"
          className="rounded-2xl bg-slate-900/70 border border-slate-800 p-4 hover:border-primary/60 hover:bg-slate-900 transition"
        >
          <p className="text-xs text-slate-400 mb-1 uppercase tracking-[0.18em]">
            Multiple Choice
          </p>
          <p className="text-slate-50 font-medium mb-1">
            Opción múltiple
          </p>
          <p className="text-[11px] text-slate-400">
            Elegí la respuesta correcta entre varias opciones. Perfecto para
            niveles iniciales A1–A2.
          </p>
        </Link>
      </div>
    </main>
  );
}

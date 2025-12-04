// src/app/(app)/study/flashcard/page.tsx

/* v5 -antigua
## Actualización del modo A: SRS real por nivel A1 ##

Este archivo ahora:
  .Carga solo nivel A1, máx. 50 tarjetas, aleatorias desde /api/study/cards?level=A1&limit=50&shuffle=true
  .Lee el progreso real desde user_progress vía /api/study/srs/get
  .Usa el motor selectNextIndex de lib/srs/selectNextCard
  .Actualiza user_progress en /api/study/srs/update
  .Selecciona la siguiente tarjeta en función del SRS
  .Mantiene:
    .tu UI
    .tu texto
    .framer-motion
    .StudyModeTabs
    .useStudySession (ahora con goTo())
*/

/*
## v6 FINAL — Flashcard ##
Combinación perfecta entre:
 - v5 (SRS completo, skip, posición X/Y)
 - v6 (UI mejorada, traducción grande, artículo en naranja)
 - tu diseño original

Compatible 100% con useStudyEngine v6
*/




/*
  v6 – Modo Flashcard (A)
  -----------------------------------------
  - Usa el motor común useStudyEngine (SRS real con user_progress)
  - Muestra:
      · palabra en alemán (lado A)
      · traducción en español (lado B, grande)
      · artículo der/die/das (si es sustantivo)
      · tipo de palabra (noun, verb, adjective…)
      · plural y nota (solo si no es sustantivo, según el backend)
      · caja SRS actual
      · posición dentro del mazo

  - Añade estadísticas locales de sesión (TEMPORAL v6):
      · total de respuestas
      · correctas / incorrectas
      · accuracy %
      · racha de aciertos

    Estas stats NO van a BD todavía, son solo para feedback rápido.
*/
"use client";

import { useState } from "react";
import { useStudyEngine } from "@/hooks/useStudyEngine";
import { StudyModeTabs } from "@/components/study/StudyModeTabs";
import { motion, AnimatePresence } from "framer-motion";

// 🔥 Mapa de género → artículo oficial alemán
const ARTICLE_BY_GENDER: Record<string, string> = {
  masculine: "der",
  feminine: "die",
  neuter: "das",
};

// 🔥 ID del tipo de palabra para sustantivos (word_types.id = 1)
const NOUN_TYPE_ID = 1;

// ⚠️ Stats locales de la sesión (TEMPORAL v6, sin BD)
type SessionStats = {
  total: number;
  correct: number;
  incorrect: number;
  streak: number;
};

const INITIAL_STATS: SessionStats = {
  total: 0,
  correct: 0,
  incorrect: 0,
  streak: 0,
};

export default function FlashcardStudyPage() {
  const {
    loading,
    error,
    currentCard,
    currentProgress,
    side,
    flip,
    markCorrect,
    markIncorrect,
    skip,
    currentIndex,
    cards,
  } = useStudyEngine({ level: "A1", limit: 50, shuffle: true });

  // ⚠️ Stats locales (no se guardan en BD, solo feedback de sesión)
  const [sessionStats, setSessionStats] = useState<SessionStats>(INITIAL_STATS);

  // Derivados de stats
  const accuracy =
    sessionStats.total > 0
      ? Math.round((sessionStats.correct / sessionStats.total) * 100)
      : 0;

  // Estados de carga / error / vacío
  if (loading) {
    return <p className="p-6 text-slate-400">Cargando tarjetas…</p>;
  }

  if (error) {
    return (
      <p className="p-6 text-rose-400 bg-rose-950/40 border border-rose-800 rounded-xl">
        {error}
      </p>
    );
  }

  if (!currentCard) {
    return (
      <p className="p-6 text-slate-400">
        No hay tarjetas disponibles por ahora.
      </p>
    );
  }

  const total = cards.length;
  const position = currentIndex !== null ? currentIndex + 1 : 1;

  // ¿Es sustantivo?
  const isNoun =
    currentCard.type_id === NOUN_TYPE_ID ||
    currentCard.type_name?.toLowerCase() === "noun";

  // Artículo solo si es sustantivo y tenemos gender
  const article = isNoun
    ? ARTICLE_BY_GENDER[currentCard.gender ?? ""]
    : null;

  // Handlers que combinan SRS + stats locales
  const handleMarkCorrect = async () => {
    await markCorrect();
    // ⚠️ Stats locales de sesión (TEMPORAL)
    setSessionStats((prev) => ({
      total: prev.total + 1,
      correct: prev.correct + 1,
      incorrect: prev.incorrect,
      streak: prev.streak + 1,
    }));
  };

  const handleMarkIncorrect = async () => {
    await markIncorrect();
    // ⚠️ Stats locales de sesión (TEMPORAL)
    setSessionStats((prev) => ({
      total: prev.total + 1,
      correct: prev.correct,
      incorrect: prev.incorrect + 1,
      streak: 0,
    }));
  };

  // ------------------------------
  // UI Flashcard
  // ------------------------------
  return (
    <main className="px-4 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header + tabs */}
      <div className="flex justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Modo Flashcard
          </h1>
          <p className="text-slate-400 text-sm">
            Mostrá la traducción y respondé si la sabías o no.
          </p>
        </div>
        <StudyModeTabs />
      </div>

      {/* Mini resumen de estado + stats de sesión (TEMPORAL) */}
      <div className="space-y-2 text-xs text-slate-400">
        <div className="flex items-center justify-between">
          <span>
            Tarjeta {position} de {total}
          </span>
          <span>
            Caja SRS:{" "}
            <span className="text-slate-100 font-semibold">
              {currentProgress?.box ?? "-"}
            </span>
          </span>
        </div>

        {/* Stats locales de sesión (TEMPORAL v6) */}
        <div className="grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-3 py-2">
            <p className="text-[11px] text-slate-400">Respuestas sesión</p>
            <p className="text-sm font-semibold text-slate-100">
              {sessionStats.total}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-3 py-2">
            <p className="text-[11px] text-slate-400">Precisión</p>
            <p className="text-sm font-semibold text-slate-100">
              {accuracy}%
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900/70 border border-slate-800 px-3 py-2">
            <p className="text-[11px] text-slate-400">Racha actual</p>
            <p className="text-sm font-semibold text-emerald-300">
              {sessionStats.streak} ✅
            </p>
          </div>
        </div>
      </div>

      {/* Tarjeta con animación */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCard.id + "-" + side}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-8 rounded-3xl bg-slate-900 border border-slate-800"
        >
          {/* FRONT – palabra en alemán */}
          {side === "front" && (
            <p className="text-4xl font-bold text-primary">
              {currentCard.word_from}
            </p>
          )}

          {/* BACK – traducción + detalles */}
          {side === "back" && (
            <div className="space-y-4">
              {/* Traducción grande (lado B) */}
              <p className="text-4xl font-bold text-primary tracking-wide">
                {currentCard.word_to}
              </p>

              {/* Artículo (solo si es sustantivo) */}
              {article && (
                <p className="text-orange-400 text-2xl font-semibold">
                  {article}
                </p>
              )}

              {/* Tipo de palabra + género */}
              <div className="text-sm text-slate-400 space-y-1 mt-2">
                {currentCard.type_name && (
                  <p>Tipo: {currentCard.type_name}</p>
                )}

                {currentCard.gender && (
                  <p>Género: {currentCard.gender}</p>
                )}
              </div>

              {/* Plural + Nota (nota ya viene filtrada desde el backend para NO mostrar en sustantivos) */}
              <div className="text-sm text-slate-400 space-y-1">
                {currentCard.note && <p>{currentCard.note}</p>}

                {currentCard.plural && (
                  <p className="text-lg text-slate-300">
                    <span className="text-slate-400">Plural:</span>{" "}
                    {currentCard.plural}
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Botón frente → mostrar respuesta */}
        {side === "front" ? (
          <button
            onClick={flip}
            className="flex-1 rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-800"
          >
            Mostrar respuesta
          </button>
        ) : (
          <>
            <button
              onClick={handleMarkIncorrect}
              className="flex-1 rounded-full border border-rose-500 text-rose-300 px-4 py-2 hover:bg-rose-500/10"
            >
              ❌ No la sabía
            </button>

            <button
              onClick={handleMarkCorrect}
              className="flex-1 rounded-full border border-emerald-500 text-emerald-300 px-4 py-2 hover:bg-emerald-500/10"
            >
              ✅ La sabía
            </button>
          </>
        )}

        {/* Botón saltar */}
        <button
          onClick={skip}
          className="sm:w-auto rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-800"
        >
          Saltar
        </button>
      </div>
    </main>
  );
}


// src/app/(app)/study/writing/page.tsx

/* ## MODO WRITING(INPUT) - modular ##
    .Modular
    .Estable
    .Preparado para IA adaptativa
    .Compatible con SRS
    .Claro y bien organizado
    .Con mejoras UX reales
    .Fácil de extender para v7
*/


"use client";

import { useState } from "react";
import { useStudyEngine } from "@/hooks/useStudyEngine";
import { StudyModeTabs } from "@/components/study/StudyModeTabs";

function normalize(str: string) {
  return str
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

// ⚠️ TEMPORAL STATS v6 – solo en memoria, por sesión
type SessionStats = {
  total: number;
  correct: number;
  incorrect: number;
  streak: number;
  maxStreak: number;
};

type CheckResult =
  | null
  | {
      status: "correct" | "incorrect";
      userAnswer: string;
      correctAnswer: string;
    };

export default function WritingStudyPage() {
  const {
    loading,
    error,
    currentCard,
    next,
    markCorrect,
    markIncorrect,
  } = useStudyEngine({ level: "A1", limit: 50 });

  const [value, setValue] = useState("");
  const [result, setResult] = useState<CheckResult>(null);

  // ⚠️ TEMPORAL STATS v6 – se reinician al recargar la página
  const [stats, setStats] = useState<SessionStats>({
    total: 0,
    correct: 0,
    incorrect: 0,
    streak: 0,
    maxStreak: 0,
  });

  if (loading) return <p className="p-6 text-slate-400">Cargando…</p>;
  if (error)
    return (
      <p className="p-6 text-rose-400 bg-rose-950/40 border border-rose-800 rounded-xl">
        {error}
      </p>
    );
  if (!currentCard)
    return <p className="p-6 text-slate-400">No hay tarjetas.</p>;

  const accuracy =
    stats.total === 0
      ? 0
      : Math.round((stats.correct / stats.total) * 100);

  // -----------------------------
  // 1) Comprobar respuesta (NO avanza todavía)
  // -----------------------------
  const handleCheck = () => {
    if (!value.trim()) return;

    const ok = normalize(value) === normalize(currentCard.word_to);

    setResult({
      status: ok ? "correct" : "incorrect",
      userAnswer: value,
      correctAnswer: currentCard.word_to,
    });
  };

  // -----------------------------
  // 2) Pasar a la siguiente tarjeta (ahí sí marcamos correcto/incorrecto + stats)
  // -----------------------------
  const handleNextAfterResult = async () => {
    if (!result) return;

    // 2.1) Actualizar stats locales (TEMPORAL)
    setStats((prev) => {
      const wasCorrect = result.status === "correct";
      const total = prev.total + 1;
      const correct = prev.correct + (wasCorrect ? 1 : 0);
      const incorrect = prev.incorrect + (wasCorrect ? 0 : 1);
      const streak = wasCorrect ? prev.streak + 1 : 0;
      const maxStreak = Math.max(prev.maxStreak, streak);

      return { total, correct, incorrect, streak, maxStreak };
    });

    // 2.2) Actualizar progreso real vía SRS
    if (result.status === "correct") {
      await markCorrect();
    } else {
      await markIncorrect();
    }

    // 2.3) Reset de UI para la siguiente tarjeta
    setValue("");
    setResult(null);

    // Por si en el futuro queremos lógica especial, usamos next() explícito
    next();
  };

  // -----------------------------
  // 3) Saltar tarjeta sin evaluar
  // -----------------------------
  const handleSkip = () => {
    setValue("");
    setResult(null);
    next();
  };

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto space-y-6">
      {/* Header + tabs */}
      <div className="flex justify-between items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-50">
            Modo Writing
          </h1>
          <p className="text-slate-400 text-sm">
            Escribí la traducción de la palabra que se muestra. Cuando hagas click en comprobar, va a pasar a la
            siguiente tarjeta.
          </p>
        </div>
        <StudyModeTabs />
      </div>

      {/* ⚠️ TEMPORAL STATS v6 – sólo sesión actual */}
      <div className="grid gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3">
          <p className="text-slate-400 mb-1">Resueltas hoy</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3">
          <p className="text-slate-400 mb-1">Precisión</p>
          <p className="text-xl font-semibold">{accuracy}%</p>
        </div>
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3">
          <p className="text-slate-400 mb-1">Racha</p>
          <p className="text-xl font-semibold">
            {stats.streak}{" "}
            <span className="text-[11px] text-slate-500">
              (máx. {stats.maxStreak})
            </span>
          </p>
        </div>
      </div>

      {/* Card writing */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-6">
        <p className="text-4xl font-bold text-primary mb-2">
          {currentCard.word_from}
        </p>

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!!result} // bloqueamos input después de comprobar
          className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 placeholder:text-slate-500"
          placeholder="Escribe la traducción…"
        />

        {/* Feedback tras comprobar */}
        {result && (
          <div
            className={
              result.status === "correct"
                ? "mt-4 rounded-2xl border border-emerald-500/60 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-200"
                : "mt-4 rounded-2xl border border-rose-500/60 bg-rose-500/5 px-4 py-3 text-sm text-rose-200"
            }
          >
            {result.status === "correct" ? (
              <p>
                ✅ Correcto. La traducción es{" "}
                <span className="font-semibold">
                  {result.correctAnswer}
                </span>
                .
              </p>
            ) : (
              <>
                <p className="mb-1">
                  ❌ No es correcto. Vos escribiste:{" "}
                  <span className="font-semibold">
                    {result.userAnswer || "—"}
                  </span>
                  .
                </p>
                <p>
                  ✅ La traducción correcta es:{" "}
                  <span className="font-semibold">
                    {result.correctAnswer}
                  </span>
                  .
                </p>
              </>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          {/* Botón COMPROBAR sólo si todavía no hay resultado */}
          {!result && (
            <button
              onClick={handleCheck}
              disabled={!value.trim()}
              className="flex-1 rounded-full border border-slate-600 px-6 py-2 text-slate-100 text-sm hover:bg-slate-800"
            >
              Comprobar
            </button>
          )}

          {/* Botón SIGUIENTE aparece cuando ya se mostró el resultado */}
          {result && (
            <button
              onClick={handleNextAfterResult}
              className="flex-1 rounded-full border border-slate-600 px-6 py-2 text-slate-100 text-sm hover:bg-slate-800"
            >
              Siguiente tarjeta
            </button>
          )}

          {/* Saltar siempre disponible */}
          <button
            onClick={handleSkip}
            className="sm:w-auto rounded-full border border-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-800"
          >
            Saltar
          </button>
        </div>
      </div>
    </main>
  );
}

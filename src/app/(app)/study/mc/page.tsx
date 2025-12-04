// src/app/(app)/study/mc/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useStudyEngine } from "@/hooks/useStudyEngine";
import { StudyModeTabs } from "@/components/study/StudyModeTabs";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/*
--------------------------------------------------------------
 MODO MULTIPLE CHOICE v6 — versión final corregida
 Cambios pedidos:
 ✔ Botón “Siguiente tarjeta”
 ✔ Feedback se mantiene visible y NO se borra antes de tiempo
 ✔ Texto “¿Cuál es la opción correcta?”
 ✔ Opciones más angostas (max-w-md)
 ✔ Alineación corregida (palabra + texto alineados con opciones)
 ✔ Estadísticas locales v6
--------------------------------------------------------------
*/

export default function MultipleChoiceStudyPage() {
  const {
    loading,
    error,
    currentCard,
    next,
    markCorrect,
    markIncorrect,
    cards,
  } = useStudyEngine({ level: "A1", limit: 50 });

  const [options, setOptions] = useState<string[]>([]);
  const [result, setResult] = useState<null | {
    correctAnswer: string;
    selected: string;
    status: "correct" | "incorrect";
  }>(null);

  // ------------------- Estadísticas locales -------------------
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    streak: 0,
    maxStreak: 0,
  });

  // ---------------------------------------------------------
  // GENERAR OPCIONES NUEVAS CUANDO CAMBIA LA TARJETA
  // ---------------------------------------------------------
  useEffect(() => {
<<<<<<< ours
  if (!currentCard) return;

  queueMicrotask(() => {
    const other = cards
      .filter((c) => c.id !== currentCard.id)
      .slice(0, 30)
      .map((c) => c.word_to);

    const distractors = shuffle(other).slice(0, 2);

    setOptions(shuffle([currentCard.word_to, ...distractors]));
  });
}, [currentCard, cards]);
=======
    if (!currentCard) return;

    queueMicrotask(() => {
      const other = cards
        .filter((c) => c.id !== currentCard.id)
        .slice(0, 30)
        .map((c) => c.word_to);

      const distractors = shuffle(other).slice(0, 2);

      setOptions(shuffle([currentCard.word_to, ...distractors]));
     });
  }, [currentCard, cards]);

  // ❗ ELIMINADO el reset automático de result
  //    Esto era lo que rompía el feedback y la UX.
>>>>>>> theirs

  if (loading) return <p className="p-6 text-slate-400">Cargando…</p>;
  if (error) return <p className="p-6 text-rose-400">{error}</p>;
  if (!currentCard) return <p className="p-6 text-slate-400">No hay tarjetas.</p>;

  // ---------------------------------------------------------
  // 1) Seleccionar opción → solo muestra resultado
  // ---------------------------------------------------------
  const handleSelect = (opt: string) => {
    if (result) return; // Ya elegiste

    const isCorrect = opt === currentCard.word_to;

    setResult({
      correctAnswer: currentCard.word_to,
      selected: opt,
      status: isCorrect ? "correct" : "incorrect",
    });
  };

  // ---------------------------------------------------------
  // 2) Botón SIGUIENTE → ahora sí avanzamos la tarjeta
  // ---------------------------------------------------------
  const handleNextAfterResult = async () => {
    if (!result) return;

    const isCorrect = result.status === "correct";

    // estadísticas locales
    setStats((prev) => {
      const total = prev.total + 1;
      const correct = prev.correct + (isCorrect ? 1 : 0);
      const incorrect = prev.incorrect + (isCorrect ? 0 : 1);
      const streak = isCorrect ? prev.streak + 1 : 0;
      const maxStreak = Math.max(prev.maxStreak, streak);

      return { total, correct, incorrect, streak, maxStreak };
    });

    // Guardar en SRS
    if (isCorrect) await markCorrect();
    else await markIncorrect();

    // Reset solo aquí
    setResult(null);

    // Siguiente tarjeta
    next();
  };

  return (
    <main className="px-4 py-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
<<<<<<< ours
          <h1 className="text-2xl font-semibold text-slate-50">Modo Multiple Choice</h1>
=======
          <h1 className="text-2xl font-semibold text-slate-50">
            Modo Multiple Choice
          </h1>
>>>>>>> theirs
          <p className="text-slate-400 text-sm">Elegí la opción correcta.</p>
        </div>
        <StudyModeTabs />
      </div>

<<<<<<< ours
      {/* ⚠️ TEMPORAL STATS v6 – sólo sesión actual */}
=======
      {/* ---------------- Stats locales ---------------- */}
>>>>>>> theirs
      <div className="grid gap-3 sm:grid-cols-3 text-xs">
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3">
          <p className="text-slate-400 mb-1">Resueltas hoy</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>

        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-3">
          <p className="text-slate-400 mb-1">Precisión</p>
          <p className="text-xl font-semibold">
<<<<<<< ours
            {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
=======
            {stats.total > 0
              ? Math.round((stats.correct / stats.total) * 100)
              : 0}
            %
>>>>>>> theirs
          </p>
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

<<<<<<< ours

      {/* Card */}
=======
      {/* ---------------- Card ---------------- */}
>>>>>>> theirs
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 space-y-6 max-w-md mx-auto">
        
        {/* PALABRA */}
        <p className="text-left text-4xl font-bold text-primary">
          {currentCard.word_from}
        </p>

        {/* Pregunta */}
        <p className="text-left text-slate-300">
          ¿Cuál es la opción correcta?
        </p>

        {/* Opciones */}
        <div className="space-y-3">
          {options.map((opt) => {
            const disabled = !!result;
            const isCorrect = opt === currentCard.word_to;

            let style =
              "w-full text-left px-4 py-3 rounded-xl bg-slate-800 border border-slate-600 text-slate-200";

            if (result) {
              if (isCorrect)
                style =
                  "w-full text-left px-4 py-3 rounded-xl bg-emerald-900 border-emerald-500 text-emerald-200";
              else if (opt === result.selected)
                style =
                  "w-full text-left px-4 py-3 rounded-xl bg-rose-900 border-rose-500 text-rose-200";
              else
                style =
                  "w-full text-left px-4 py-3 rounded-xl bg-slate-800/40 border-slate-700/40 text-slate-600";
            }

            return (
              <button
                key={opt}
                disabled={disabled}
                onClick={() => handleSelect(opt)}
                className={style}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback textual */}
        {result && result.status === "incorrect" && (
          <p className="text-left text-rose-300 text-sm mt-3">
            ❌ Incorrecto — Respuesta correcta:{" "}
            <span className="text-slate-200 font-semibold">
              {result.correctAnswer}
            </span>
          </p>
        )}

        {result && result.status === "correct" && (
          <p className="text-left text-emerald-300 text-sm mt-3">
            ✅ ¡Correcto!
          </p>
        )}
      </div>

      {/* BOTÓN SIGUIENTE */}
      {result && (
        <button
          onClick={handleNextAfterResult}
          className="rounded-full border border-slate-600 bg-primary px-6 py-2 text-slate-100 font-medium hover:bg-slate-800 mx-auto block"
        >
          Siguiente tarjeta
        </button>
      )}

      {/* Saltar */}
      <button
        onClick={next}
        className="rounded-full border border-slate-600 px-4 py-2 text-slate-200 hover:bg-slate-800 mx-auto block"
      >
        Saltar
      </button>
    </main>
  );
<<<<<<< ours
}
=======
}
>>>>>>> theirs

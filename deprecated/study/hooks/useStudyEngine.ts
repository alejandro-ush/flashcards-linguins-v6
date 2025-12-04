// src/hooks/useStudyEngine.ts

/*

## 🚀 versión final del hook – Motor común de estudio v6 ##
Profesional, modular, preparada para los 3 modos (A/B/C), compatible 100% con la arquitectura que estás construyendo.

Objetivos clave cumplidos:
    .Carga tarjetas (con filtro nivel, límite, shuffle)
    .Carga progreso desde user_progress
    .Integra selectNextCard (motor SRS)
    .Mantiene lógica original de sesión (front/back)
    .Expone API mínima para los 3 modos
    .No mezcla UI con lógica
    .Evita duplicación entre modos
    .Prepara terreno para IA adaptativa en v7
*/

"use client";

import { useEffect, useState, useCallback } from "react";
import type { CardV6 } from "@/types/cards";
import { selectNextCard } from "@/lib/srs/selectNextCard";

const DEFAULT_LEVEL = "A1";
const DEFAULT_LIMIT = 50;

// UUID válido temporal para desarrollo
const TEST_USER_ID = "00000000-0000-4000-8000-000000000001";

export type ProgressByWordId = Record<
  number,
  {
    word_id: number;
    attempts: number;
    correct: number;
    last_review?: string | null;
    next_review?: string | null;
    showed_hint: boolean;
    hint_uses: number;
    box?: number; // agregado
  }
>;

export type StudySide = "front" | "back";

interface UseStudyEngineOptions {
  level?: string;
  limit?: number;
  shuffle?: boolean;
}

export function useStudyEngine({
  level = DEFAULT_LEVEL,
  limit = DEFAULT_LIMIT,
  shuffle = true,
}: UseStudyEngineOptions = {}) {
  // ============================================================
  // ESTADOS PRINCIPALES
  // ============================================================
  const [cards, setCards] = useState<CardV6[]>([]);
  const [progress, setProgress] = useState<ProgressByWordId>({});
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [side, setSide] = useState<StudySide>("front");

  // ============================================================
  // 1) CARGAR TARJETAS
  // ============================================================
  const loadCards = useCallback(async () => {
    const params = new URLSearchParams({
      level,
      limit: String(limit),
      shuffle: String(shuffle),
    });

    const res = await fetch(`/api/study/cards?${params.toString()}`);
    if (!res.ok) throw new Error("No se pudo cargar el mazo (cards).");

    const json = await res.json();
    return (json.cards ?? []) as CardV6[];
  }, [level, limit, shuffle]);

  // ============================================================
  // 2) CARGAR PROGRESO SRS
  // ============================================================
  const loadProgress = useCallback(async (ids: number[]) => {
    if (!ids.length) return {};

    const params = new URLSearchParams({
      user_id: TEST_USER_ID,
      word_ids: ids.join(","),
    });

    const res = await fetch(`/api/study/srs/get?${params.toString()}`);
    if (!res.ok) {
      console.warn("No se pudo cargar progreso SRS.");
      return {};
    }

    const json = await res.json();
    const entries = json.progress ?? [];

    const map: ProgressByWordId = {};
    for (const row of entries) {
      map[row.word_id] = row;
    }
    return map;
  }, []);

  // ============================================================
  // 3) CARGA INICIAL COMPLETA
  // ============================================================
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const loadedCards = await loadCards();
        setCards(loadedCards);

        const ids = loadedCards.map((c) => c.id);
        const loadedProgress = await loadProgress(ids);
        setProgress(loadedProgress);

        const first = selectNextCard(loadedCards, loadedProgress, null);
        setCurrentIndex(first);
        setSide("front");
      } catch (err: any) {
        setError(err.message ?? "Error inesperado al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [loadCards, loadProgress]);

  // ============================================================
  // 4) CONTROL DE SESIÓN
  // ============================================================

  const flip = () => setSide((s) => (s === "front" ? "back" : "front"));

  const goTo = (index: number) => {
    setCurrentIndex(index);
    setSide("front");
  };

  const next = () => {
    if (!cards.length) return;

    const nextIdx = selectNextCard(cards, progress, currentIndex);
    if (nextIdx !== null) {
      setCurrentIndex(nextIdx);
      setSide("front");
    }
  };

  // ============================================================
  // 5) ACTUALIZAR PROGRESO (LOCAL + SERVER)
  // ============================================================
  const updateProgress = async (
    wordId: number,
    wasCorrect: boolean,
    usedHint = false
  ) => {
    // --- Server ---
    const res = await fetch("/api/study/srs/update", {
      method: "POST",
      body: JSON.stringify({
        user_id: TEST_USER_ID,
        word_id: wordId,
        was_correct: wasCorrect,
        used_hint: usedHint,
      }),
    });

    let updatedFromServer = null;
    if (res.ok) {
      const json = await res.json();
      updatedFromServer = json.progress;
    }

    // --- Local ---
    setProgress((prev) => {
      const existing = prev[wordId] ?? {
        word_id: wordId,
        attempts: 0,
        correct: 0,
        showed_hint: false,
        hint_uses: 0,
      };

      const base = {
        ...existing,
        attempts: existing.attempts + 1,
        correct: existing.correct + (wasCorrect ? 1 : 0),
        showed_hint: existing.showed_hint || usedHint,
        hint_uses: existing.hint_uses + (usedHint ? 1 : 0),
      };

      if (updatedFromServer) {
        return {
          ...prev,
          [wordId]: {
            ...base,
            last_review: updatedFromServer.last_review,
            next_review: updatedFromServer.next_review,
            box: updatedFromServer.box,
          },
        };
      }

      return { ...prev, [wordId]: base };
    });
  };

  const markCorrect = async () => {
    const card = cards[currentIndex ?? -1];
    if (!card) return;
    await updateProgress(card.id, true);
    next();
  };

  const markIncorrect = async () => {
    const card = cards[currentIndex ?? -1];
    if (!card) return;
    await updateProgress(card.id, false);
    next();
  };

  // ============================================================
  // 6) API EXTERNA PARA UI
  // ============================================================

  return {
    loading,
    error,

    cards,
    progress,
    currentIndex,

    currentCard: currentIndex !== null ? cards[currentIndex] : null,
    currentProgress:
      currentIndex !== null ? progress[cards[currentIndex]?.id] : null,

    side,
    flip,

    next,
    goTo,

    markCorrect,
    markIncorrect,

    skip: next,
  };
}

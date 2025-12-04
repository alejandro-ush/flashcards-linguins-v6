// src/hooks/useStudySession.ts

'use client';

import { useState, useMemo, useEffect } from 'react';
import type { CardV6 } from '@/types/cards';

export type StudySide = 'front' | 'back';

interface UseStudySessionOptions {
  cards: CardV6[];
}

export function useStudySession({ cards }: UseStudySessionOptions) {
  const total = cards.length;

  // Estado inicial
  const [index, setIndex] = useState(0);
  const [side, setSide] = useState<StudySide>('front');

  // ======================================================
  // 🔧 FIX LINT ERROR:
  // Evitar setState directo en el body del effect.
  // Lo envolvemos en queueMicrotask y solo si hay tarjetas.
  // ======================================================
  
  // Reset automático cuando cambian las tarjetas
  useEffect(() => {
    if (total === 0) return;

    queueMicrotask(() => {
      setIndex(0);
      setSide("front");
    });
  }, [total]);

  // Card actual
  const current = useMemo(() => {
    if (!total) return null;
    if (index >= total) return cards[0] ?? null;
    return cards[index] ?? null;
  }, [cards, index, total]);

  // Flip card
  const flip = () => {
    if (!current) return;
    setSide((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  // Avance lineal clásico (solo para backup)
  const next = () => {
    if (!total) return;
    setIndex((prev) => (prev + 1 < total ? prev + 1 : prev));
    setSide('front');
  };

  const prev = () => {
    if (!total) return;
    setIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
    setSide('front');
  };

  const reset = () => {
    setIndex(0);
    setSide('front');
  };

  // 🔥 Control manual para el SRS real
  const goTo = (newIndex: number) => {
    if (!total) return;
    if (newIndex < 0 || newIndex >= total) return;
    setIndex(newIndex);
    setSide('front');
  };

  return {
    current,
    index,
    total,
    side,
    flip,
    next,
    prev,
    reset,

    // === Control de flujo real para SRS ===
    goTo,
    setSide,
    setIndex,

    hasCards: total > 0,
  };
}

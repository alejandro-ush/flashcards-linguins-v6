// src/hooks/useStudySession.ts

'use client';

import { useState, useMemo } from 'react';
import type { CardV6 } from '@/types/cards';

export type StudySide = 'front' | 'back';

interface UseStudySessionOptions {
  cards: CardV6[];
}

export function useStudySession({ cards }: UseStudySessionOptions) {
  const [index, setIndex] = useState(0);
  const [side, setSide] = useState<StudySide>('front');

  const total = cards.length;

  const current = useMemo(() => {
    if (!total) return null;
    return cards[index] ?? null;
  }, [cards, index, total]);

  const flip = () => {
    if (!current) return;
    setSide((prev) => (prev === 'front' ? 'back' : 'front'));
  };

  const next = () => {
    if (!total) return;
    setIndex((prev) => (prev + 1) % total);
    setSide('front');
  };

  const prev = () => {
    if (!total) return;
    setIndex((prev) => (prev - 1 + total) % total);
    setSide('front');
  };

  const reset = () => {
    setIndex(0);
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
    hasCards: total > 0,
  };
}

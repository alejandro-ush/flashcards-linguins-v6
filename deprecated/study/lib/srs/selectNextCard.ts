// src/lib/srs/selectNextCard.ts

/*
## Motor SRS compartido ##
Versión final, estable, limpia
  .Compatible con los 3 modos A/B/C
  .Compatible con los endpoints "/api/study/srs/get" y "/api/study/srs/update"
  .Compatible con useStudyEngine()
  .100% conectado al motor SRS
  .Sin dependencias externas
  .Sin nada experimental

Este archivo hace 4 cosas clave:
1)ComputeBox()
  .Convierte aciertos → box (1 a 5).
  .Más aciertos → mayor box → menos prioridad.

2)Sistema de pesos
  Prioriza tarjetas "olvidadas":
    | Box | Significado    | Peso |
    | --- | -------------- | ---- |
    | 1   | muy urgente    | 5    |
    | 2   | urgente        | 3    |
    | 3   | normal         | 2    |
    | 4   | baja prioridad | 1    |
    | 5   | casi dominada  | 0.5  |

3)selectNextCard()
  Elige la próxima carta usando:
    .pesos
    .probabilidad proporcional
    .penalización para no repetir la misma carta

4)Exporta un tipo útil para los endpoints
    .UserProgressEntryFull
  Esto evita que Next te rompa cuando haga el mapping.
*/


import type { CardV6 } from "@/types/cards";

/**
 * Progreso SRS por palabra para un usuario.
 * Coincide con la tabla user_progress.
 */
export interface UserProgressEntry {
  word_id: number;
  attempts: number;
  correct: number;
  last_review?: string | null;
  next_review?: string | null;
  showed_hint: boolean;
  hint_uses: number;
}

/**
 * Calcula la "box" SRS a partir de la cantidad de aciertos.
 * Cada 2 aciertos sube una caja. Clamp 1–5.
 */
export function computeBoxFromCounts(correct: number): number {
  const raw = 1 + Math.floor(correct / 2);
  return Math.min(Math.max(raw, 1), 5);
}

/**
 * Peso por box: cajas bajas → más prioridad.
 */
const BOX_WEIGHTS = {
  1: 5,   // muy urgente
  2: 3,
  3: 2,
  4: 1,
  5: 0.5, // casi dominada
} as const;

/**
 * Motor principal: elige el índice de la próxima tarjeta
 * en base a:
 *  - box (calculada con correct)
 *  - progresos previos
 *  - penalización para no repetir siempre la misma
 */
export function selectNextCard(
  cards: CardV6[],
  progress: Record<number, UserProgressEntry>,
  currentIndex: number | null
): number | null {
  if (cards.length === 0) return null;

  const weighted: { index: number; weight: number }[] = [];

  cards.forEach((card, index) => {
    const entry = progress[card.id];

    const correct = entry?.correct ?? 0;
    const box = computeBoxFromCounts(correct);

    let weight = BOX_WEIGHTS[box as keyof typeof BOX_WEIGHTS] ?? BOX_WEIGHTS[1];

    // Penalizar la tarjeta actual para no repetirla todo el tiempo
    if (currentIndex !== null && index === currentIndex) {
      weight *= 0.2;
    }

    weighted.push({ index, weight });
  });

  const total = weighted.reduce((sum, w) => sum + w.weight, 0);
  if (!Number.isFinite(total) || total <= 0) return 0;

  // Roulette-wheel selection (proporcional al peso)
  let r = Math.random() * total;
  for (const w of weighted) {
    if (r <= w.weight) return w.index;
    r -= w.weight;
  }

  // Fallback de seguridad
  return weighted[weighted.length - 1]?.index ?? 0;
}

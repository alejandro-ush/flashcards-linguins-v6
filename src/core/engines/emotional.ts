import type { StudyAttempt, StudySessionSummary } from "../types";

export type EmotionalState =
  | "steady"
  | "frustrated"
  | "tired"
  | "confident";

export function classifyEmotionalState(params: {
  accuracy: number;
  velocityMs: number;
  errorsRepeated: number;
  inactivityDays?: number;
}): EmotionalState {
  const { accuracy, velocityMs, errorsRepeated, inactivityDays } = params;

  const lowAccuracy = accuracy < 60;
  const slow = velocityMs > 3500;
  const tiredByInactivity = typeof inactivityDays === "number" && inactivityDays > 3;

  if (errorsRepeated >= 2 || (lowAccuracy && slow)) return "frustrated";
  if (slow || tiredByInactivity) return "tired";
  if (accuracy >= 85 && errorsRepeated === 0) return "confident";
  return "steady";
}

export function getEmotionalSupport(params: {
  summary: StudySessionSummary;
  recentAttempts: StudyAttempt[];
  inactivityDays?: number;
}): string {
  const { summary, recentAttempts, inactivityDays } = params;
  const last = recentAttempts[recentAttempts.length - 1];
  const errorsRepeated = countConsecutiveErrors(recentAttempts);
  const velocityMs = last?.response_time_ms ?? 0;

  const state = classifyEmotionalState({
    accuracy: summary.accuracy,
    velocityMs,
    errorsRepeated,
    inactivityDays,
  });

  if (state === "frustrated") {
    return "Los tropiezos son normales. Hagamos un repaso corto para recuperar confianza.";
  }
  if (state === "tired") {
    return "Pausa breve y retomamos suave. Tu constancia importa más que la velocidad.";
  }
  if (state === "confident") {
    return "Buen ritmo y precisión alta. Sigamos con sesiones cortas para sostener el avance.";
  }
  return "Estás progresando. Continuemos con calma, paso a paso.";
}

function countConsecutiveErrors(attempts: StudyAttempt[]): number {
  if (attempts.length === 0) return 0;
  const lastItemId = attempts[attempts.length - 1].item_id;
  let count = 0;

  for (let i = attempts.length - 1; i >= 0; i -= 1) {
    const att = attempts[i];
    if (att.item_id !== lastItemId) break;
    if (!att.is_correct) count += 1;
    else break;
  }

  return count;
}

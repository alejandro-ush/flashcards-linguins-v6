import type { StudySessionSummary } from "../types";

export function getMotivationMessage(params: {
  summary: StudySessionSummary;
  streak?: number;
}): string {
  const { summary, streak = 0 } = params;
  const { accuracy, mastered_items_count, reinforced_items_count } = summary;

  if (accuracy >= 85 && mastered_items_count > 0) {
    return "Gran sesión: mantienes alta precisión y consolidaste ítems clave. Sigue con sesiones cortas.";
  }

  if (accuracy >= 70 && reinforced_items_count > 0) {
    return "Buen trabajo: reforzaste puntos críticos. Mantén el ritmo y añade un repaso mañana.";
  }

  if (accuracy < 60) {
    return "Los errores son parte del proceso. Hoy enfócate en repasar 5 ítems para ganar confianza.";
  }

  if (streak >= 3) {
    return "Racha positiva: tu constancia está dando frutos. Una sesión breve más mantendrá el impulso.";
  }

  return "Sesión cumplida. Sigue con pasos cortos y constantes para avanzar de forma sólida.";
}

export function getMicroGoal(params: {
  summary: StudySessionSummary;
}): string {
  const { summary } = params;
  const { accuracy, reinforced_items_count, mastered_items_count } = summary;

  if (mastered_items_count > 0) {
    return "Mañana: 2 ítems nuevos + 3 repasos rápidos de tus ítems dominados.";
  }

  if (reinforced_items_count > 0 && accuracy >= 70) {
    return "Haz un repaso de 5 ítems reforzados y añade 1 nuevo para variar.";
  }

  if (accuracy < 60) {
    return "Objetivo simple: repasa 5 ítems conocidos hasta llegar a 70% de acierto.";
  }

  return "Plan breve: 3 ítems conocidos + 1 nuevo para mantener el progreso.";
}

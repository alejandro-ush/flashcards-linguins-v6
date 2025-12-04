import type {
  InsightSnapshot,
  SkillState,
  StudyAttempt,
  StudySessionSummary,
} from "../types";

export function summarizeSession(params: {
  session_id: number;
  attempts: StudyAttempt[];
  skillsBefore: Record<number, SkillState>;
  skillsAfter: Record<number, SkillState>;
}): StudySessionSummary {
  const { session_id, attempts, skillsBefore, skillsAfter } = params;

  const totalItems = attempts.length;
  const correct = attempts.filter((a) => a.is_correct).length;
  const accuracy = totalItems === 0 ? 0 : Math.round((correct / totalItems) * 100);

  const avgResponse =
    totalItems === 0
      ? 0
      : Math.round(
          attempts.reduce((sum, a) => sum + a.response_time_ms, 0) / totalItems
        );

  const newItems = countNewItems(skillsBefore, skillsAfter);
  const reinforcedItems = countReinforced(skillsBefore, skillsAfter);
  const masteredItems = countMastered(skillsBefore, skillsAfter);

  const ranked = rankByStrength(skillsAfter);
  const strengths = ranked.top.map((s) => `Item ${s.item_id} (fuerza ${s.strength})`);
  const weaknesses = ranked.bottom.map((s) => `Item ${s.item_id} (fuerza ${s.strength})`);

  const recommendation = buildRecommendation({ accuracy, avgResponse, reinforcedItems, masteredItems });

  return {
    session_id,
    total_items: totalItems,
    accuracy,
    avg_response_time_ms: avgResponse,
    new_items_count: newItems,
    reinforced_items_count: reinforcedItems,
    mastered_items_count: masteredItems,
    strengths: strengths.length ? strengths : undefined,
    weaknesses: weaknesses.length ? weaknesses : undefined,
    recommendation,
  };
}

export function buildInsightSnapshot(params: {
  weeklyAttempts: StudyAttempt[];
  weeklySkills: SkillState[];
}): InsightSnapshot {
  const { weeklyAttempts, weeklySkills } = params;

  const accuracyTrend = computeAccuracyTrend(weeklyAttempts);
  const velocityTrend = computeVelocityTrend(weeklyAttempts);

  const best = pickBestSkill(weeklySkills);
  const weakest = pickWeakestSkill(weeklySkills);

  const consistency = computeConsistencyScore(weeklyAttempts);
  const recommendation = buildInsightRecommendation({
    bestSkill: best,
    weakestSkill: weakest,
    accuracyTrend,
    velocityTrend,
    consistencyScore: consistency,
  });

  return {
    best_skill: best ?? "",
    weakest_skill: weakest ?? "",
    accuracy_trend: accuracyTrend,
    velocity_trend: velocityTrend,
    consistency_score: consistency,
    recommendation,
  };
}

function countNewItems(
  before: Record<number, SkillState>,
  after: Record<number, SkillState>
): number {
  return Object.values(after).filter((s) => {
    const prev = before[s.item_id];
    return (!prev || prev.strength === 0) && s.strength > 0;
  }).length;
}

function countReinforced(
  before: Record<number, SkillState>,
  after: Record<number, SkillState>
): number {
  return Object.values(after).filter((s) => {
    const prev = before[s.item_id];
    return prev && prev.strength < 40 && s.strength >= 40;
  }).length;
}

function countMastered(
  before: Record<number, SkillState>,
  after: Record<number, SkillState>
): number {
  return Object.values(after).filter((s) => {
    const prev = before[s.item_id];
    const wasBelow = prev ? prev.strength < 80 : true;
    return wasBelow && s.strength >= 80;
  }).length;
}

function rankByStrength(skills: Record<number, SkillState>): {
  top: SkillState[];
  bottom: SkillState[];
} {
  const ordered = Object.values(skills).sort((a, b) => b.strength - a.strength);
  return {
    top: ordered.slice(0, 2),
    bottom: ordered.slice(-2),
  };
}

function buildRecommendation(params: {
  accuracy: number;
  avgResponse: number;
  reinforcedItems: number;
  masteredItems: number;
}): string {
  const { accuracy, avgResponse, reinforcedItems, masteredItems } = params;

  if (accuracy >= 85 && masteredItems > 0) {
    return "Excelente ritmo: mantén sesiones cortas y agrega 1–2 ítems nuevos.";
  }
  if (accuracy >= 70 && reinforcedItems > 0) {
    return "Buen progreso: refuerza los ítems recién consolidados y añade un repaso rápido.";
  }
  if (accuracy < 60) {
    return "Hay errores frecuentes: haz una sesión corta de refuerzo y baja la velocidad.";
  }
  if (avgResponse > 3000) {
    return "Las respuestas son lentas: practica 5 ítems conocidos para ganar fluidez.";
  }
  return "Continúa con sesiones breves y mezcla repaso con 1 ítem nuevo.";
}

function computeAccuracyTrend(attempts: StudyAttempt[]): number[] {
  if (attempts.length === 0) return [];
  // División simple en ventanas de igual tamaño (7 puntos)
  const buckets = 7;
  const size = Math.max(1, Math.floor(attempts.length / buckets));
  const trend: number[] = [];

  for (let i = 0; i < attempts.length; i += size) {
    const slice = attempts.slice(i, i + size);
    const total = slice.length;
    const correct = slice.filter((a) => a.is_correct).length;
    const acc = total === 0 ? 0 : Math.round((correct / total) * 100);
    trend.push(acc);
  }

  return trend.slice(0, buckets);
}

function computeVelocityTrend(attempts: StudyAttempt[]): number[] {
  if (attempts.length === 0) return [];
  const buckets = 7;
  const size = Math.max(1, Math.floor(attempts.length / buckets));
  const trend: number[] = [];

  for (let i = 0; i < attempts.length; i += size) {
    const slice = attempts.slice(i, i + size);
    const total = slice.length;
    const avg =
      total === 0
        ? 0
        : Math.round(
            slice.reduce((sum, a) => sum + a.response_time_ms, 0) / total
          );
    trend.push(avg);
  }

  return trend.slice(0, buckets);
}

function pickBestSkill(skills: SkillState[]): string | null {
  if (skills.length === 0) return null;
  const sorted = [...skills].sort((a, b) => b.strength - a.strength);
  return `Item ${sorted[0].item_id}`;
}

function pickWeakestSkill(skills: SkillState[]): string | null {
  if (skills.length === 0) return null;
  const sorted = [...skills].sort((a, b) => a.strength - b.strength);
  return `Item ${sorted[0].item_id}`;
}

function computeConsistencyScore(attempts: StudyAttempt[]): number {
  if (attempts.length === 0) return 0;
  // Estimación simple: sesiones realizadas = bloques de 20 intents
  const SESSION_SIZE = 20;
  const expectedSessions = 7; // objetivo semanal simple
  const doneSessions = Math.max(1, Math.floor(attempts.length / SESSION_SIZE));
  const ratio = Math.min(1, doneSessions / expectedSessions);
  return Math.round(ratio * 100);
}

function buildInsightRecommendation(params: {
  bestSkill: string | null;
  weakestSkill: string | null;
  accuracyTrend: number[];
  velocityTrend: number[];
  consistencyScore: number;
}): string {
  const { weakestSkill, accuracyTrend, velocityTrend, consistencyScore } = params;
  const latestAccuracy = accuracyTrend.at(-1) ?? 0;
  const latestVelocity = velocityTrend.at(-1) ?? 0;

  if (consistencyScore < 60) {
    return "Recupera constancia con sesiones cortas de 10 intentos diarios.";
  }
  if (latestAccuracy < 65) {
    return "Concéntrate en tus debilidades: repasa el ítem más bajo y apunta a 70% de acierto.";
  }
  if (latestVelocity > 3000) {
    return "Mejora la fluidez con prácticas rápidas de 5 ítems conocidos.";
  }
  if (weakestSkill) {
    return `Refuerza ${weakestSkill} con 3 repasos rápidos hoy.`;
  }
  return "Buen equilibrio: mezcla repaso con 1 ítem nuevo mañana.";
}

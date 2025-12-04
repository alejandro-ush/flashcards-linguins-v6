import type { Item, SkillState, StudyAttempt } from "../types";

export type AdaptiveReason =
  | "review"
  | "new"
  | "difficulty_adjustment"
  | "cooldown";

export function selectNextItem(params: {
  items: Item[];
  skills: Record<number, SkillState>;
  recentAttempts: StudyAttempt[];
  sessionDurationMs?: number;
}): { item: Item | null; reason: AdaptiveReason } {
  const { items, skills, recentAttempts, sessionDurationMs } = params;

  if (shouldCooldown(sessionDurationMs)) {
    return { item: null, reason: "cooldown" };
  }

  const lastAttempt = recentAttempts[recentAttempts.length - 1];
  const errorsRepeated = countConsecutiveErrors(recentAttempts, skills);

  // Regla: errores repetidos → quedarse en el mismo ítem (ajuste de dificultad)
  if (errorsRepeated >= 2 && lastAttempt) {
    const sameItem = items.find((it) => it.id === lastAttempt.item_id) ?? null;
    if (sameItem) {
      return { item: sameItem, reason: "difficulty_adjustment" };
    }
  }

  // Clasificar ítems por status y fuerza
  const classified = classifyItems(items, skills);

  // Regla: strength < 40 → refuerzo prioritario
  const reviewCandidate =
    classified.reviewQueue.length > 0
      ? classified.reviewQueue[0]
      : null;
  if (reviewCandidate) {
    return { item: reviewCandidate, reason: "review" };
  }

  const lastWasNew = wasLastNewItem(lastAttempt, skills);
  const highPerfAllowsNew = isHighPerformance(recentAttempts, skills);

  // Regla: no introducir ítems nuevos dos veces seguidas
  if (highPerfAllowsNew && !lastWasNew && classified.newQueue.length > 0) {
    return { item: classified.newQueue[0], reason: "new" };
  }

  // Fallback: seleccionar el ítem con menor strength (determinista)
  const fallback =
    classified.remainingQueue.length > 0
      ? classified.remainingQueue[0]
      : classified.newQueue[0] ?? null;

  if (fallback) {
    const reason = classified.newQueue.includes(fallback) ? "new" : "review";
    return { item: fallback, reason };
  }

  return { item: null, reason: "review" };
}

export function classifyAttemptDifficulty(
  attempt: StudyAttempt,
  skill?: SkillState
): "easy" | "medium" | "hard" {
  if (!skill) return "medium";
  const fast = attempt.response_time_ms <= SPEED_GOOD_MS;
  if (attempt.is_correct && fast && skill.strength >= 70) return "easy";
  if (!attempt.is_correct || skill.strength < 40) return "hard";
  return "medium";
}

const SPEED_GOOD_MS = 1500;
const SPEED_SLOW_MS = 3500;
const FATIGUE_THRESHOLD_MS = 20 * 60 * 1000; // 20 min

type ClassifiedQueues = {
  reviewQueue: Item[];
  newQueue: Item[];
  remainingQueue: Item[];
};

function shouldCooldown(sessionDurationMs?: number): boolean {
  const durationFatigue =
    typeof sessionDurationMs === "number" &&
    sessionDurationMs >= FATIGUE_THRESHOLD_MS;
  const fatigueSignals = false; // placeholder v6.1, hooks for v6.2 (error streak, slow streak)
  return durationFatigue || fatigueSignals;
}

function countConsecutiveErrors(
  attempts: StudyAttempt[],
  skills: Record<number, SkillState>
): number {
  if (attempts.length === 0) return 0;
  const lastItemId = attempts[attempts.length - 1].item_id;
  let count = 0;

  for (let i = attempts.length - 1; i >= 0; i -= 1) {
    const att = attempts[i];
    if (att.item_id !== lastItemId) break;
    if (!att.is_correct) count += 1;
    else break;
  }

  // Considerar historial: si ya tenía errores previos según skill
  const skill = skills[lastItemId];
  if (skill && skill.times_wrong > skill.times_correct && !attempts[attempts.length - 1].is_correct) {
    count += 1;
  }

  return count;
}

function classifyItems(
  items: Item[],
  skills: Record<number, SkillState>
): ClassifiedQueues {
  const reviewQueue: Item[] = [];
  const newQueueByDifficulty: {
    easy: Item[];
    medium: Item[];
    hard: Item[];
  } = { easy: [], medium: [], hard: [] };
  const remainingQueue: Item[] = [];

  const withStatus = items.map((it) => {
    const skill = skills[it.id];
    const total = skill
      ? skill.times_correct + skill.times_wrong
      : 0;
    const status = total === 0 ? "new" : classifyStatus(skill!);
    const strength = skill?.strength ?? 0;
    const newDifficulty = total === 0 ? classifyNewDifficulty(it) : null;
    return { item: it, status, strength, newDifficulty };
  });

  withStatus
    .sort((a, b) => {
      if (a.strength === b.strength) return a.item.id - b.item.id;
      return a.strength - b.strength;
    })
    .forEach(({ item, status, strength, newDifficulty }) => {
      if (status === "new") {
        const bucket = newDifficulty ?? "medium";
        newQueueByDifficulty[bucket].push(item);
        return;
      }
      if (strength < 40) {
        reviewQueue.push(item);
        return;
      }
      remainingQueue.push(item);
    });

  const newQueue = [
    ...newQueueByDifficulty.easy.sort((a, b) => a.id - b.id),
    ...newQueueByDifficulty.medium.sort((a, b) => a.id - b.id),
    ...newQueueByDifficulty.hard.sort((a, b) => a.id - b.id),
  ];

  return { reviewQueue, newQueue, remainingQueue };
}

function classifyStatus(skill: SkillState): "new" | "in_progress" | "reinforced" | "mastered" {
  if (!skill || skill.times_correct + skill.times_wrong === 0) return "new";
  if (skill.strength >= 80) return "mastered";
  if (skill.strength >= 40) return "reinforced";
  return "in_progress";
}

function wasLastNewItem(
  lastAttempt: StudyAttempt | undefined,
  skills: Record<number, SkillState>
): boolean {
  if (!lastAttempt) return false;
  const skill = skills[lastAttempt.item_id];
  if (!skill) return true;
  const total = skill.times_correct + skill.times_wrong;
  return total <= 1;
}

function isHighPerformance(
  attempts: StudyAttempt[],
  skills: Record<number, SkillState>
): boolean {
  if (attempts.length === 0) return false;
  const window = attempts.slice(-3);
  if (window.length < 3) return false;

  const fastCount = window.filter(
    (att) => att.response_time_ms <= SPEED_GOOD_MS
  ).length;
  const correctCount = window.filter((att) => att.is_correct).length;
  const last = window[window.length - 1];
  const strength = skills[last.item_id]?.strength ?? 0;

  return correctCount >= 2 && fastCount >= 2 && strength >= 70;
}

function classifyNewDifficulty(item: Item): "easy" | "medium" | "hard" {
  if (item.item_type === "word") return "easy";
  if (item.item_type === "phrase") return "medium";
  if (item.item_type === "chunk" || item.item_type === "concept") return "hard";
  // Metadata hook for futuros ajustes
  const metaDifficulty = (item.metadata as Record<string, unknown> | undefined)?.["difficulty"];
  if (metaDifficulty === "easy" || metaDifficulty === "medium" || metaDifficulty === "hard") {
    return metaDifficulty;
  }
  return "medium";
}

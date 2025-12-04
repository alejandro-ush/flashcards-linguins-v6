import type {
  Item,
  SkillState,
  StudyAttempt,
  StudyItemState,
} from "../types";

const STRENGTH_GAIN = 6;
const STRENGTH_LOSS = 10;
const FAST_RESPONSE_MS = 1200;
const SLOW_RESPONSE_MS = 4000;

export function getInitialSkillState(item: Item): SkillState {
  return {
    item_id: item.id,
    strength: 0,
    times_correct: 0,
    times_wrong: 0,
    avg_response_time: 0,
    last_seen: "",
    decay_factor: 1,
    predicted_next_review: "",
    difficulty_level: "baseline",
  };
}

export function updateSkillState(
  state: SkillState,
  attempt: StudyAttempt
): SkillState {
  const totalAttempts = state.times_correct + state.times_wrong;
  const newTotalAttempts = totalAttempts + 1;

  const newTimesCorrect = state.times_correct + (attempt.is_correct ? 1 : 0);
  const newTimesWrong = state.times_wrong + (attempt.is_correct ? 0 : 1);

  const avgResponseTime =
    newTotalAttempts === 0
      ? 0
      : Math.round(
          (state.avg_response_time * totalAttempts + attempt.response_time_ms) /
            newTotalAttempts
        );

  const baseDelta = attempt.is_correct ? STRENGTH_GAIN : -STRENGTH_LOSS;
  const speedAdjustment =
    attempt.response_time_ms <= FAST_RESPONSE_MS
      ? 2
      : attempt.response_time_ms >= SLOW_RESPONSE_MS
      ? -2
      : 0;

  const newStrength = clampStrength(
    state.strength + baseDelta + speedAdjustment
  );

  const newDecay = clampDecay(
    attempt.is_correct ? state.decay_factor * 0.95 : state.decay_factor * 1.05
  );

  // v6.1: mantener determinismo, sin fechas reales
  const predictedNextReview = "";
  const difficultyLevel = classifyDifficulty(newStrength, newTimesWrong);

  return {
    item_id: state.item_id,
    strength: newStrength,
    times_correct: newTimesCorrect,
    times_wrong: newTimesWrong,
    avg_response_time: avgResponseTime,
    last_seen: "",
    decay_factor: newDecay,
    predicted_next_review: predictedNextReview,
    difficulty_level: difficultyLevel,
  };
}

export function batchUpdateSkill(
  states: SkillState[],
  attempts: StudyAttempt[]
): SkillState[] {
  const map = new Map<number, SkillState>();
  states.forEach((s) => map.set(s.item_id, { ...s }));

  attempts.forEach((attempt) => {
    const current =
      map.get(attempt.item_id) ??
      ({
        item_id: attempt.item_id,
        strength: 0,
        times_correct: 0,
        times_wrong: 0,
        avg_response_time: 0,
        last_seen: "",
        decay_factor: 1,
        predicted_next_review: "",
        difficulty_level: "baseline",
      } satisfies SkillState);

    const updated = updateSkillState(current, attempt);
    map.set(attempt.item_id, updated);
  });

  return Array.from(map.values()).sort((a, b) => a.item_id - b.item_id);
}

export function deriveStudyItemState(skill: SkillState): StudyItemState {
  return {
    item_id: skill.item_id,
    strength: skill.strength,
    times_correct: skill.times_correct,
    times_wrong: skill.times_wrong,
    avg_response_time: skill.avg_response_time,
    last_seen: skill.last_seen,
    status: classifyStatus(skill),
  };
}

function clampStrength(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function clampDecay(value: number): number {
  return Math.min(1.5, Math.max(0.5, Number(value.toFixed(3))));
}

function computeNextReviewIso(strength: number, decayFactor: number): string {
  // Placeholder determinista: en v6.1 no se usan timestamps reales
  void strength;
  void decayFactor;
  return "";
}

function classifyDifficulty(strength: number, timesWrong: number): string {
  if (timesWrong >= 2 || strength < 40) return "hard";
  if (strength < 70) return "medium";
  return "easy";
}

function classifyStatus(skill: SkillState): StudyItemState["status"] {
  if (skill.times_correct + skill.times_wrong === 0) return "new";
  if (skill.strength >= 80) return "mastered";
  if (skill.strength >= 40) return "reinforced";
  return "in_progress";
}

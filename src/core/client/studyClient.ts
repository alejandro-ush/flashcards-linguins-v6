// File: src/core/client/studyClient.ts
// Cliente interno v6.1 para el flujo de estudio; determinista y sin DB.

import type {
  Item,
  SkillState,
  StudyAttempt,
  StudySessionSummary,
  InsightSnapshot,
} from "@/core/types";

const DEFAULT_HEADERS = { "Content-Type": "application/json" };

export async function apiStart() {
  // Inicia sesión de estudio usando el endpoint determinista /api/study/start.
  const res = await fetch("/api/study/start", {
    method: "POST",
    headers: DEFAULT_HEADERS,
  });
  return res.json() as Promise<{
    ok: boolean;
    session_id: string;
    items: Item[];
    initial_skills: SkillState[];
  }>;
}

export async function apiAttempt(input: {
  item_id: number;
  user_answer: string;
  response_time_ms: number;
  is_correct: boolean;
  current_skill?: SkillState;
}) {
  // Envía intento y devuelve skill actualizado (sin side effects externos).
  const res = await fetch("/api/study/attempt", {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(input),
  });
  return res.json() as Promise<{
    ok: boolean;
    attempt?: StudyAttempt;
    skill?: SkillState;
    error?: string;
  }>;
}

export async function apiNext(input: {
  items: Item[];
  skills: SkillState[];
  recentAttempts: StudyAttempt[];
  sessionDurationMs?: number;
}) {
  // Pide el siguiente ítem al Adaptive Engine v6.1 (determinista, sin random).
  const res = await fetch("/api/study/next", {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(input),
  });
  return res.json() as Promise<{
    ok: boolean;
    next_item: Item | null;
    adaptive_reason: "review" | "new" | "difficulty_adjustment" | "cooldown";
    error?: string;
  }>;
}

export async function apiEnd(input: {
  session_id: number;
  attempts: StudyAttempt[];
  skillsBefore: SkillState[];
  skillsAfter: SkillState[];
}) {
  // Cierre de sesión: resumen + insights + mensajes (todo determinista).
  const res = await fetch("/api/study/end", {
    method: "POST",
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(input),
  });
  return res.json() as Promise<{
    ok: boolean;
    summary: StudySessionSummary;
    insights: InsightSnapshot;
    motivation: string;
    micro_goal: string;
    emotional: string;
    error?: string;
  }>;
}

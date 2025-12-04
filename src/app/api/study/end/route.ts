// File: src/app/api/study/end/route.ts

import { NextResponse } from "next/server";
import type {
  InsightSnapshot,
  SkillState,
  StudyAttempt,
  StudySessionSummary,
} from "@/core/types";
import { summarizeSession, buildInsightSnapshot } from "@/core/engines/tracking";
import { getMotivationMessage, getMicroGoal } from "@/core/engines/motivation";
import { getEmotionalSupport } from "@/core/engines/emotional";

type Body = {
  session_id?: number;
  attempts?: StudyAttempt[];
  skillsBefore?: SkillState[];
  skillsAfter?: SkillState[];
};

export async function POST(req: Request) {
  // Endpoint determinista: calcula summary e insights en memoria, sin DB ni timestamps.
  const body = (await req.json()) as Body;

  const sessionId = typeof body.session_id === "number" ? body.session_id : 0;
  const attempts = Array.isArray(body.attempts) ? body.attempts : [];
  const skillsBeforeArr = Array.isArray(body.skillsBefore)
    ? body.skillsBefore
    : [];
  const skillsAfterArr = Array.isArray(body.skillsAfter)
    ? body.skillsAfter
    : [];

  const skillsBefore = toSkillMap(skillsBeforeArr);
  const skillsAfter = toSkillMap(skillsAfterArr);

  // Resumen de sesión (determinista, sin fechas).
  const summary: StudySessionSummary = summarizeSession({
    session_id: sessionId,
    attempts,
    skillsBefore,
    skillsAfter,
  });

  // Insights semanales simulados con mismos datos (sin DB).
  const insights: InsightSnapshot = buildInsightSnapshot({
    weeklyAttempts: attempts,
    weeklySkills: skillsAfterArr,
  });

  // Mensajes breves alineados a desempeño real (sin IA externa).
  const motivation = getMotivationMessage({ summary });
  const micro_goal = getMicroGoal({ summary });
  const emotional = getEmotionalSupport({ summary, recentAttempts: attempts });

  return NextResponse.json({
    ok: true,
    summary,
    insights,
    motivation,
    micro_goal,
    emotional,
  });
}

function toSkillMap(list: SkillState[]): Record<number, SkillState> {
  const map: Record<number, SkillState> = {};
  for (const s of list) {
    map[s.item_id] = s;
  }
  return map;
}

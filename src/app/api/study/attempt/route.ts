// File: src/app/api/study/attempt/route.ts

import { NextResponse } from "next/server";
import type { SkillState, StudyAttempt } from "@/core/types";
import { updateSkillState, getInitialSkillState } from "@/core/engines/skill";

type Body = {
  item_id?: number;
  user_answer?: string;
  response_time_ms?: number;
  is_correct?: boolean;
  current_skill?: SkillState;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  const { item_id, user_answer, response_time_ms, is_correct, current_skill } =
    body ?? {};

  if (
    typeof item_id !== "number" ||
    typeof response_time_ms !== "number" ||
    typeof is_correct !== "boolean"
  ) {
    return NextResponse.json(
      { ok: false, error: "Parámetros inválidos." },
      { status: 400 }
    );
  }

  const attempt: StudyAttempt = {
    item_id,
    user_answer: typeof user_answer === "string" ? user_answer : "",
    is_correct,
    response_time_ms,
  };

  const baseSkill =
    current_skill?.item_id === item_id
      ? current_skill
      : getInitialSkillState({
          id: item_id,
          concept_key: "mock",
          item_type: "word",
          level_id: 1,
          category_id: 1,
          metadata: {},
        });

  const updated_skill = updateSkillState(baseSkill, attempt);

  return NextResponse.json({
    ok: true,
    attempt,
    skill: updated_skill,
  });
}

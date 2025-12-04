// File: src/app/api/study/next/route.ts

import { NextResponse } from "next/server";
import type { Item, SkillState, StudyAttempt } from "@/core/types";
import { selectNextItem } from "@/core/engines/adaptive";

type Body = {
  items?: Item[];
  skills?: SkillState[];
  recentAttempts?: StudyAttempt[];
  sessionDurationMs?: number;
};

export async function POST(req: Request) {
  // Endpoint determinista: usa Adaptive Engine v6.1 con datos en memoria.
  const body = (await req.json()) as Body;
  const items = Array.isArray(body.items) ? body.items : [];
  const skillsArr = Array.isArray(body.skills) ? body.skills : [];
  const recentAttempts = Array.isArray(body.recentAttempts)
    ? body.recentAttempts
    : [];
  const sessionDurationMs =
    typeof body.sessionDurationMs === "number"
      ? body.sessionDurationMs
      : undefined;

  if (items.length === 0 || skillsArr.length === 0) {
    return NextResponse.json(
      { ok: false, error: "items y skills son requeridos." },
      { status: 400 }
    );
  }

  // Determinismo: skills en mapa por item_id, sin timestamps ni random.
  const skillsMap: Record<number, SkillState> = {};
  for (const s of skillsArr) {
    skillsMap[s.item_id] = s;
  }

  const { item, reason } = selectNextItem({
    items,
    skills: skillsMap,
    recentAttempts,
    sessionDurationMs,
  });

  // Fallback: si no hay item, devolver null con reason review para seguir loop.
  return NextResponse.json({
    ok: true,
    next_item: item ?? null,
    adaptive_reason: reason,
  });
}

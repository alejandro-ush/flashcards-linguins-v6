// src/app/api/study/srs/update/route.ts

/*
## Endpoint POST → actualizar progreso SRS ##

 .Recibe: user_id, word_id, correct, used_hint
 .Hace upsert en user_progress
 .Actualiza: attempts, correct, last_review, next_review, showed_hint, hint_uses
 */

/*
## Endpoint POST → actualizar progreso SRS ##

 .Recibe: user_id, word_id, was_correct, used_hint
 .Hace upsert en user_progress
 .Actualiza: attempts, correct, last_review, next_review, showed_hint, hint_uses
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { UserProgressEntry } from "@/lib/srs/selectNextCard";

// Cliente del SERVER (Service Role)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Calcula próximo intervalo SRS
function computeNextReview(box: number): string {
  const now = Date.now();
  const intervalsMs = {
    1: 5 * 60 * 1000,
    2: 30 * 60 * 1000,
    3: 12 * 60 * 60 * 1000,
    4: 36 * 60 * 60 * 1000,
    5: 5 * 24 * 60 * 60 * 1000,
  } as const;

  const delta = intervalsMs[box as keyof typeof intervalsMs] ?? intervalsMs[1];
  const next = new Date(now + delta);
  return next.toISOString();
}

// Calcula box según correctos acumulados
function computeBoxFromCounts(correct: number): number {
  const raw = 1 + Math.floor(correct / 2);
  return Math.min(Math.max(raw, 1), 5);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userId: string | undefined = body.user_id;
    const wordId: number | undefined = body.word_id;
    const wasCorrect: boolean | undefined = body.was_correct;
    const usedHint: boolean = !!body.used_hint;

    if (!userId || !wordId || typeof wasCorrect !== "boolean") {
      return NextResponse.json(
        {
          ok: false,
          error: "Faltan parámetros obligatorios: user_id, word_id, was_correct.",
        },
        { status: 400 }
      );
    }

    // 1) Leer progreso actual
    const { data: existingRows, error: selectError } = await supabase
      .from("user_progress")
      .select(
        "id, word_id, attempts, correct, last_review, next_review, showed_hint, hint_uses"
      )
      .eq("user_id", userId)
      .eq("word_id", wordId)
      .limit(1);

    if (selectError) {
      console.error("Error leyendo user_progress:", selectError);
      return NextResponse.json(
        { ok: false, error: "No se pudo leer el progreso actual." },
        { status: 500 }
      );
    }

    const existing: (UserProgressEntry & { id: number }) | null =
      existingRows && existingRows.length > 0 ? (existingRows[0] as any) : null;

    const nowIso = new Date().toISOString();

    const prevAttempts = existing?.attempts ?? 0;
    const prevCorrect = existing?.correct ?? 0;
    const prevHintUses = existing?.hint_uses ?? 0;
    const prevShowedHint = existing?.showed_hint ?? false;

    const newAttempts = prevAttempts + 1;
    const newCorrect = prevCorrect + (wasCorrect ? 1 : 0);
    const newBox = computeBoxFromCounts(newCorrect);
    const nextReview = computeNextReview(newBox);

    const newHintUses = usedHint ? prevHintUses + 1 : prevHintUses;
    const newShowedHint = prevShowedHint || !!usedHint;

    // 2) Upsert del progreso
    const upsertPayload = {
      user_id: userId,
      word_id: wordId,
      attempts: newAttempts,
      correct: newCorrect,
      last_review: nowIso,
      next_review: nextReview,
      showed_hint: newShowedHint,
      hint_uses: newHintUses,
    };

    const { error: upsertError } = await supabase
      .from("user_progress")
      .upsert(upsertPayload, {
        onConflict: "user_id,word_id",
      });

    if (upsertError) {
      console.error("Error actualizando user_progress:", upsertError);
      return NextResponse.json(
        { ok: false, error: "No se pudo actualizar el progreso." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      progress: {
        word_id: wordId,
        attempts: newAttempts,
        correct: newCorrect,
        last_review: nowIso,
        next_review: nextReview,
        showed_hint: newShowedHint,
        hint_uses: newHintUses,
        box: newBox,
      },
    });
  } catch (err) {
    console.error("Error en /api/study/srs/update:", err);
    return NextResponse.json(
      { ok: false, error: "Error inesperado en el servidor." },
      { status: 500 }
    );
  }
}

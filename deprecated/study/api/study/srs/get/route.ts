// src/app/api/study/srs/get/route.ts

/* ## Endpoint GET → obtener progreso SRS de un usuario ##

Recibe:
  . user_id → UUID del usuario (por ahora TEST_USER_ID)
  . word_ids → lista de IDs de palabras: "1,2,3,10"

Devuelve:
  . Intentos, correctos, hints, next_review, last_review
  . Preparado para SRS v7 (intervalos inteligentes)

IMPORTANTE:
  No calcula "box" aquí.
  El hook o el motor SRS deben calcularlo con computeBox().

 >> 🔐 Más adelante: reemplazás user_id por el UID del usuario autenticado y eliminás el parámetro de query.
*/

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,             // NO usar NEXT_PUBLIC aquí
  process.env.SUPABASE_SERVICE_ROLE_KEY! // clave server-side
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("user_id")?.trim();
    const wordIdsRaw = searchParams.get("word_ids");

    // --------------------------------------------
    // Validación básica
    // --------------------------------------------
    if (!userId || !wordIdsRaw) {
      return NextResponse.json(
        { ok: false, error: "Faltan parámetros user_id y word_ids." },
        { status: 400 }
      );
    }

    const wordIds = wordIdsRaw
      .split(",")
      .map((n) => Number(n))
      .filter((n) => Number.isFinite(n));

    if (wordIds.length === 0) {
      return NextResponse.json(
        { ok: false, error: "word_ids está vacío o es inválido." },
        { status: 400 }
      );
    }

    // --------------------------------------------
    // Leer progreso desde la BD
    // --------------------------------------------
    const { data, error } = await supabase
      .from("user_progress")
      .select(
        "word_id, attempts, correct, last_review, next_review, showed_hint, hint_uses"
      )
      .eq("user_id", userId)
      .in("word_id", wordIds);

    if (error) {
      console.error("Error leyendo user_progress:", error);
      return NextResponse.json(
        { ok: false, error: "No se pudo obtener el progreso." },
        { status: 500 }
      );
    }

    // --------------------------------------------
    // Respuesta final
    // --------------------------------------------
    return NextResponse.json({
      ok: true,
      progress: data ?? [],
    });

  } catch (err) {
    console.error("Error crítico en /api/study/srs/get:", err);
    return NextResponse.json(
      { ok: false, error: "Error inesperado en /api/study/srs/get." },
      { status: 500 }
    );
  }
}

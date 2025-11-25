// src/app/api/study/cards/route.ts

/*
## Nuevo endpoint: /api/study/cards ##

 .Filtra por nivel (A1/A2/B1/B2) usando levels.name
 .Admite filtros futuros por tipo (word_types.name) y categoría (category_types.name)
 .Permite limit y shuffle
 .Devuelve { ok, count, cards } compatible con tu CardV6

>>Más adelante podés ampliar con paginado real (offset, page) sin romper nada.


📌 1.Resumen general

Este endpoint devuelve el conjunto de tarjetas (cards) para estudiar, combinando datos provenientes de 4 tablas de la base de datos:
  .words (palabra base + nivel + categoría + tipo)
  .translations (traducciones DE ↔ ES)
  .word_attributes (gender, plural, note, incontable…)
  .levels, word_types, category_types (para metadata)

Soporta filtros por:
  .nivel (A1, A2, B1, B2)
  .tipo (noun, verb…)
  .categoría (food, home…)
  .limite de tarjetas
  .shuffle opcional

Y devuelve tarjetas listas para usar en los modos A/B/C.
Es el origen de datos principal del motor SRS. 


🧩 2.Funciones principales del archivo
    2.1. GET() — controlador del endpoint
    Recibe consultas vía query params y coordina todo el proceso:
      .level → filtra nivel A1, A2, etc.
      .type → sustantivo, verbo…
      .category → comida, casa, familia…
      .limit → cantidad máxima (default: 50)
      .shuffle → mezcla aleatoria
    
    2.2. parseIntSafe()
    Pequeño helper para convertir limit en número válido y evitar errores por parámetros incorrectos.

    2.3. Carga desde “words”
    Consulta principal:
      .id
      .concept_key
      .level_id → levels.name
      .type_id → word_types.name
      .category_type_id → category_types.name
    Aporta la base de la tarjeta.

    2.4. Traducciones desde “translations”
    Trae dos idiomas simultáneamente:
      .Alemán (language_id = 1)
      .Español (language_id = 3)
    Cada tarjeta final nace de mezclar estos dos valores.

    2.5. Atributos desde “word_attributes”
    Opcionalmente agrega:
      .gender (masculine / feminine / neuter)
      .plural (irregular)
      .note
      .is_uncountable
    Estos agregan riqueza pedagógica al sistema.

    2.6. Fusión final en CardV6
    Cada tarjeta final contiene:
      .word_from → alemán
      .word_to → español
      .gender
      .plural
      .note
      .type (noun, verb…)
      .category
      .level
    Es el formato estándar esperado en el front.

    2.7. Filtrado final
      .Descarta tarjetas sin traducción completa.
      .Mezcla aleatoria si se pidió shuffle.
      .Aplica límite final para rendimiento.

🚀 4.Preparado para
  .Filtros combinados nivel + tipo + categoría
  .Carga optimizada para SRS
  .Modos A/B/C (flashcard / writing / multiple-choice)
  .Modo “personalizado por categoría”
  .Modo “temas del día”
  .IA adaptativa v7 para seleccionar qué tarjetas estudiar
  .Filtros avanzados (solo sustantivos → útiles para artículos DER/DIE/DAS)
*/


import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Client Server (Service Role)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Idiomas
const LANG_DE = 1;
const LANG_ES = 3;

// Utilidad para parsear límite
function parseIntSafe(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const level = searchParams.get("level");       // A1, A2…
    const type = searchParams.get("type");         // noun, verb…
    const category = searchParams.get("category"); // food, home…
    const limit = parseIntSafe(searchParams.get("limit"), 50);
    const shuffle = searchParams.get("shuffle") === "true";

    // -------------------------------------------------------
    // 1) Palabras base + joins de metadata (levels, types, categories)
    // -------------------------------------------------------
    let query = supabase
      .from("words")
      .select(`
        id,
        concept_key,
        level_id,
        type_id,
        category_type_id,
        levels(name),
        word_types(name),
        category_types(name)
      `);

    if (level) query = query.eq("levels.name", level);
    if (type) query = query.eq("word_types.name", type);
    if (category) query = query.eq("category_types.name", category);

    const { data: words, error: wordsError } = await query;

    if (wordsError) {
      console.error("Error leyendo words en /api/study/cards:", wordsError);
      return NextResponse.json(
        { ok: false, error: "No se pudieron obtener las palabras base." },
        { status: 500 }
      );
    }

    if (!words?.length) {
      return NextResponse.json({
        ok: true,
        count: 0,
        cards: []
      });
    }

    const wordIds = words.map((w) => w.id);

    // -------------------------------------------------------
    // 2) Traducciones DE + ES
    // -------------------------------------------------------
    const { data: translations, error: transError } = await supabase
      .from("translations")
      .select("word_id, language_id, text")
      .in("word_id", wordIds)
      .in("language_id", [LANG_DE, LANG_ES]);

    if (transError) {
      console.error("Error leyendo translations:", transError);
      return NextResponse.json(
        { ok: false, error: "Error al obtener traducciones." },
        { status: 500 }
      );
    }

    const mapTranslations = new Map<number, any>();
    for (const t of translations ?? []) {
      if (!mapTranslations.has(t.word_id)) {
        mapTranslations.set(t.word_id, {});
      }
      mapTranslations.get(t.word_id)[t.language_id] = t.text;
    }

    // -------------------------------------------------------
    // 3) Atributos (gender, plural, note...)
    // -------------------------------------------------------
    const { data: attributes, error: attrError } = await supabase
      .from("word_attributes")
      .select("word_id, key, value")
      .in("word_id", wordIds);

    if (attrError) {
      console.error("Error leyendo word_attributes:", attrError);
      return NextResponse.json(
        { ok: false, error: "Error al obtener atributos." },
        { status: 500 }
      );
    }

    const mapAttrs = new Map<number, any>();
    for (const a of attributes ?? []) {
      if (!mapAttrs.has(a.word_id)) {
        mapAttrs.set(a.word_id, {});
      }
      mapAttrs.get(a.word_id)[a.key] = a.value;
    }

    // -------------------------------------------------------
    // 4) Fusionar en CardV6 completo (gender, plural, note, type_name…)
    // -------------------------------------------------------
    let cards = words.map((w) => {
      const t = mapTranslations.get(w.id) || {};
      const a = mapAttrs.get(w.id) || {};

      return {
        id: w.id,
        concept_key: w.concept_key,

        // ALEMÁN y ESPAÑOL
        word_from: t[LANG_DE] || "",
        word_to: t[LANG_ES] || "",

        // Atributos
        gender: a.gender ?? null,
        plural: a.plural ?? null,
        note: w.word_types?.name === "noun" ? null : a.note || null, // NO mostrar notas si es sustantivo (noun)
        is_uncountable: a.is_uncountable === "true",

        // Metadata
        level: w.levels?.name ?? "",
        type_name: w.word_types?.name ?? "",
        type_id: w.type_id,
        category_name: w.category_types?.name ?? "",
      };
    });

    // Filtrar tarjetas válidas
    cards = cards.filter((c) => c.word_from && c.word_to);

    // Mezclar si corresponde
    if (shuffle && cards.length > 1) {
      cards = [...cards].sort(() => Math.random() - 0.5);
    }

    return NextResponse.json({
      ok: true,
      count: cards.length,
      cards: cards.slice(0, limit),
    });

  } catch (err) {
    console.error("Error crítico en /api/study/cards:", err);
    return NextResponse.json(
      { ok: false, error: "Error inesperado en /api/study/cards." },
      { status: 500 }
    );
  }
}

// src/lib/cards/loadCards.ts

import { supabase } from '@/lib/supabaseClient';
import type { CardV6, WordRecord, TranslationRecord, AttributeRecord } from '@/types/cards';

// ===============================
// Carga de Cards para StudyMode v6
// ===============================

interface LoadCardsParams {
  from: string; // código idioma origen (ej: 'de')
  to: string;   // código idioma destino (ej: 'es')
  limit?: number;
}

export async function loadCards({ from, to, limit = 20 }: LoadCardsParams): Promise<CardV6[]> {
  // 1) Obtener IDs de idiomas
  const { data: langs } = await supabase
    .from('languages')
    .select('id, code');

  if (!langs) return [];

  const langFrom = langs.find(l => l.code === from);
  const langTo   = langs.find(l => l.code === to);

  if (!langFrom || !langTo) {
    console.error('Idiomas no encontrados en BD');
    return [];
  }

  // 2) Obtener palabras base
  const { data: words } = await supabase
    .from('words')
    .select('*')
    .limit(limit);

  if (!words) return [];

  // 3) Obtener traducciones origen y destino
  const { data: translations } = await supabase
    .from('translations')
    .select('*')
    .in('word_id', words.map(w => w.id));

  // 4) Atributos (solo origen, por ahora)
  const { data: attributes } = await supabase
    .from('word_attributes')
    .select('*')
    .in('word_id', words.map(w => w.id));

  // ============================
  // Mapear Word → CardV6
  // ============================

  const cards: CardV6[] = words.map(w => {
    const tFrom = translations?.find(t => t.word_id === w.id && t.language_id === langFrom.id);
    const tTo   = translations?.find(t => t.word_id === w.id && t.language_id === langTo.id);

    const attrs = attributes?.filter(a => a.word_id === w.id && a.language_id === langFrom.id) ?? [];

    // Reducir atributos a objeto simple
    const attrObj: Record<string, string> = {};
    attrs.forEach(a => {
      attrObj[a.key] = a.value;
    });

    return {
      id: w.id,
      concept_key: w.concept_key,
      word_from: tFrom?.text ?? '',
      word_to: tTo?.text ?? '',

      // atributos v6
      gender: attrObj['gender'],
      plural: attrObj['plural'],
      is_uncountable: attrObj['is_uncountable'] === 'true',
      note: attrObj['note'],

      // metadatos
      category_type_id: w.category_type_id,
      level_id: w.level_id,
      type_id: w.type_id,
    };
  });

  // quitar duplicados posibles (por seguridad)
  const dedup = Array.from(new Map(cards.map(c => [c.id, c])).values());

  return dedup;
}

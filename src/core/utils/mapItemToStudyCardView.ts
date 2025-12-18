// File: src/core/utils/mapItemToStudyCardView.ts
import type { Item } from "@/core/types";
import type { StudyCardView } from "@/core/types/ui";

function cleanString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isValidTagsArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((v) => typeof v === "string" && v.trim().length > 0)
  );
}

export function mapItemToStudyCardView(item: Item | null): StudyCardView | null {
  // Regla determinista: item debe existir
  if (!item) return null;

  // Validación estricta de word_from / word_to
  const word = cleanString(item.word_from);
  const translation = cleanString(item.word_to);
  if (!word || !translation) return null;

  const meta = isPlainObject(item.metadata) ? (item.metadata as Record<string, unknown>) : {};

  // Jerarquía metadata -> item para campos opcionales
  const gender = cleanString(meta.gender) ?? cleanString(item.gender);
  const plural = cleanString(meta.plural) ?? cleanString(item.plural);
  const note = cleanString(meta.note) ?? cleanString(item.note);

  // Tags: solo si es array de strings válidas; sin deduplicar ni reordenar
  const tags = isValidTagsArray(item.tags) ? (item.tags as string[]) : undefined;

  return {
    word,
    translation,
    gender,
    plural,
    note,
    tags,
    // Idiomas fijos actuales; en el futuro se podrían hacer configurables
    languageFrom: "Alemán",
    languageTo: "Español",
  };
}

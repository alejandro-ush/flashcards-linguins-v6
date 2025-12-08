// File: src/components/study/StudyFlashcardBridge.tsx
// Puente entre Item v6.1 y el componente visual StudyFlashcard (solo UI).

import type { Item } from "@/core/types";
import { StudyFlashcard } from "@/components/study/StudyFlashcard";

type StudyFlashcardBridgeProps = {
  item: Item | null;
  isLoading: boolean;
  onNext?: () => void;
};

type FlashcardViewItem = {
  word: string;
  translation: string;
  gender?: string;
  plural?: string;
  note?: string;
  tags?: string[];
  languageFrom?: string;
  languageTo?: string;
} | null;

function mapItemToFlashcardItem(item: Item | null): FlashcardViewItem {
  if (!item) return null;

  const meta = (item.metadata ?? {}) as Record<string, unknown>;

  const word =
    (meta.front as string | undefined) ??
    (meta.text as string | undefined) ??
    item.concept_key;

  const translation =
    (meta.back as string | undefined) ??
    (meta.translation as string | undefined) ??
    "—";

  const gender = meta.gender as string | undefined;
  const plural = meta.plural as string | undefined;
  const note = meta.note as string | undefined;

  const tags: string[] = [];

  if (item.item_type) {
    tags.push(item.item_type);
  }

  // Etiqueta simple de categoría/nivel mientras no tengamos nombres bonitos.
  if (typeof item.level_id === "number") {
    tags.push(`Level ${item.level_id}`);
  }
  if (typeof item.category_id === "number") {
    tags.push(`Category ${item.category_id}`);
  }

  return {
    word,
    translation,
    gender,
    plural,
    note,
    tags,
    languageFrom: "Alemán",
    languageTo: "Español",
  };
}

export function StudyFlashcardBridge({
  item,
  isLoading,
  onNext,
}: StudyFlashcardBridgeProps) {
  if (isLoading && !item) {
    return (
      <div className="py-16 text-center text-slate-400">
        Cargando tarjetas de estudio…
      </div>
    );
  }

  const viewItem = mapItemToFlashcardItem(item);

  if (!viewItem) {
    return (
      <div className="py-16 text-center text-slate-500">
        No hay ítems disponibles para estudiar.
      </div>
    );
  }

  return (
    <StudyFlashcard
      item={viewItem}
      onNext={onNext}
      onPrevious={undefined}
    />
  );
}

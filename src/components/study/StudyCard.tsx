// File: src/components/study/StudyCard.tsx
// Muestra el lado A de un Item v6.1 (UI mínima, sin lógica de motores).

import type { Item } from "@/core/types";

type StudyCardProps = {
  item: Item | null;
  isLoading: boolean;
};

export function StudyCard({ item, isLoading }: StudyCardProps) {
  if (isLoading) return <div>Loading…</div>;
  if (!item) return <div>Sin ítem activo. Inicia una sesión.</div>;

  const meta = item.metadata ?? {};
  const text = (meta as Record<string, unknown>).text ?? item.concept_key;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2 text-slate-50">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {item.item_type}
      </div>
      <div className="text-lg font-semibold">{String(text)}</div>
      <div className="text-xs text-slate-500">
        Level: {item.level_id} · Category: {item.category_id}
      </div>
    </div>
  );
}

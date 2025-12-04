import { NextResponse } from "next/server";
import type { Item, SkillState } from "@/core/types";
import { getInitialSkillState } from "@/core/engines/skill";

// Datos simulados y deterministas para v6.1 (sin DB)
const MOCK_ITEMS: Item[] = [
  {
    id: 1,
    concept_key: "guten_morgen",
    item_type: "phrase",
    level_id: 1,
    category_id: 1,
    metadata: { text: "Guten Morgen" },
  },
  {
    id: 2,
    concept_key: "brot",
    item_type: "word",
    level_id: 1,
    category_id: 2,
    metadata: { text: "Brot" },
  },
  {
    id: 3,
    concept_key: "danke",
    item_type: "word",
    level_id: 1,
    category_id: 3,
    metadata: { text: "Danke" },
  },
];

export async function POST() {
  const items = MOCK_ITEMS;
  const initial_skills: SkillState[] = items.map((item) =>
    getInitialSkillState(item)
  );

  return NextResponse.json({
    ok: true,
    session_id: "session-001",
    items,
    initial_skills,
  });
}

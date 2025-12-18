// src/core/types/index.ts

/**
 * Item — Modelo crudo proveniente de Supabase.
 * Combina:
 *  - información lingüística (word_from, gender, tags…)
 *  - información taxonómica (level_id, category_id, item_type)
 *  - metadata para motores (registro flexible)
 */

export type ItemType = "word" | "phrase" | "chunk" | "concept";

export interface Item {
  id: number;   //Identificador único
  concept_key: string;   //Clave semántica del concepto (apple_noun, go_verb, etc.)
  item_type: ItemType;   //Tipo de ítem lingüístico
  
  /** Nivel y categoría (taxonomía interna) */
  level_id: number;
  category_id: number;
  
  /**
   * CONTENIDO LINGÜÍSTICO — datos reales de estudio que vienen de la API v6
   * y que la UI necesita mostrar.
   */
  word_from: string | null;       // Lado A (p. ej. "Apfel")
  word_to: string | null;         // Lado B (p. ej. "Manzana")

  gender?: string | null;         // masculino/femenino etc.
  plural?: string | null;         // p. ej. "Äpfel"
  note?: string | null;           // nota opcional
  tags?: string[] | null;         // chips/etiquetas

  /**
   * METADATA — usado exclusivamente por motores (Adaptive, Skill, Emotional, etc.)
   * Estructura flexible, nunca se elimina.
   */
  metadata: Record<string, unknown>;
}

export interface StudyAttempt {
  item_id: number;
  user_answer: string;
  is_correct: boolean;
  response_time_ms: number;
}

export type StudyItemStatus = "new" | "in_progress" | "reinforced" | "mastered";

export interface StudyItemState {
  item_id: number;
  strength: number;
  times_correct: number;
  times_wrong: number;
  avg_response_time: number;
  last_seen: string;
  status: StudyItemStatus;
}

export interface SkillState {
  item_id: number;
  strength: number;
  times_correct: number;
  times_wrong: number;
  avg_response_time: number;
  last_seen: string;
  decay_factor: number;
  predicted_next_review: string;
  difficulty_level: string;
}

export interface StudySessionSummary {
  session_id: number;
  total_items: number;
  accuracy: number;
  avg_response_time_ms: number;
  new_items_count: number;
  reinforced_items_count: number;
  mastered_items_count: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendation?: string;
}

export type SeverityLevel = "low" | "medium" | "high";

export interface FeedbackResult {
  corrected_text: string;
  errors_detected: string[];
  improvement_points: string[];
  severity_level: SeverityLevel;
  emotional_tone: string;
  examples?: string[];
}

export interface InsightSnapshot {
  best_skill: string;
  weakest_skill: string;
  accuracy_trend: number[];
  velocity_trend: number[];
  consistency_score: number;
  recommendation: string;
}

export type SessionEventType = "start" | "attempt" | "next_item" | "end" | "error";

export interface SessionEvent {
  session_id: number;
  event_type: SessionEventType;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

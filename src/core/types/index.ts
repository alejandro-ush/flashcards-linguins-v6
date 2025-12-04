export type ItemType = "word" | "phrase" | "chunk" | "concept";

export interface Item {
  id: number;
  concept_key: string;
  item_type: ItemType;
  level_id: number;
  category_id: number;
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

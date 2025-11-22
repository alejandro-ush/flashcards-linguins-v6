// src/types/cards.ts

// ===============================
// Flashcards Linguins v6 — Tipos
// ===============================

export type LanguageCode = 'de' | 'es' | 'en'; // extendible

// Registro base de la tabla words
export interface WordRecord {
  id: number;
  concept_key: string;
  category_type_id: number;
  level_id: number;
  type_id: number;
}

// Registro de la tabla translations
export interface TranslationRecord {
  id: number;
  word_id: number;
  language_id: number;
  text: string;
}

// Registro de la tabla word_attributes
export interface AttributeRecord {
  id: number;
  word_id: number;
  language_id: number;
  key: string;
  value: string;
}

// ===============================
// Mapeo Final para StudyMode
// ===============================

export interface CardV6 {
  id: number;
  concept_key: string;

  // idioma origen y destino
  word_from: string; // Ej: DE
  word_to: string;   // Ej: ES

  // atributos opcionales por idioma
  gender?: string; 
  plural?: string;
  is_uncountable?: boolean;
  note?: string;

  // metadatos
  category_type_id: number;
  level_id: number;
  type_id: number; // noun, verb, etc.
}

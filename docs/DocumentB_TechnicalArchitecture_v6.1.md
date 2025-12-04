📘 DOCUMENT B — TECHNICAL ARCHITECTURE v6.1
Titles in English, content in Spanish
Version 1.0 – Corporate Edition

0. Purpose of the Technical Architecture
Este documento define cómo debe construirse Linguins v6.1 desde un punto de vista técnico, estructural y modular.
Objetivos:
Alinear a todos los equipos (Frontend, Backend, AI, Codex).


Crear una base escalable para v6.1 → v6.2 → v7.


Asegurar consistencia y flexibilidad modular.


Definir contratos, modelos y flujos para evitar ambigüedades.


Establecer el “single source of truth” técnico.


Este documento NO contiene:
Diseño visual


Copywriting


Detalles pedagógicos (eso está en Documento A)



1. System Overview
Linguins v6.1 se compone de:
1.1 Frontend (Next.js 14 + TypeScript + App Router)
UI modular por modos


Renderizado rápido


SSR/ISR para carga estable


Manejo de sesiones de estudio


Integración con motores via API


1.2 Backend (Supabase)
Base de datos PostgreSQL


Middleware RLS para seguridad


RPC/Functions para operaciones críticas


Telemetría y tracking via triggers o API


1.3 AI Layer
Interacciones de Feedback


Insights en lenguaje natural


Mensajes emocionales


Micro-coaching


Integrado vía API propia


1.4 Core Engines (in-app logic)
Skill Engine


Tracking Engine


Adaptive Engine


Motivation Engine


Emotional Engine


👉 Todos los motores operan sobre la misma Unidad de Aprendizaje: Item.

2. Data Model (Database Schema)
El esquema debe ser simple, universal y preparado para crecer.
 Aquí están las tablas obligatorias para v6.1.

2.1 Table: items
Unidad mínima de aprendizaje.
Columnas:
id (PK)


concept_key (único)


item_type (word | phrase | chunk | concept)


level_id


category_id


word_from (texto origen)


word_to (texto destino)


gender (opcional)


plural (opcional)


note


created_at



2.2 Table: study_sessions
Registra una sesión de estudio del usuario.
id


user_id


session_type (study | feedback)


started_at


ended_at


total_items


accuracy


avg_response_time_ms


metadata (JSONB)



2.3 Table: attempts
Cada intento del usuario.
id


session_id


item_id


user_answer


is_correct


response_time_ms


created_at



2.4 Table: user_skill_map
Estado de la habilidad del usuario.
user_id


item_id


strength (0–100)


times_correct


times_wrong


avg_response_time


last_seen


👉 Esta tabla permite implementar el Skill Engine y el Adaptive Engine.

2.5 Table: weekly_insights
Datos agregados para mostrar evolución.
user_id


week_start


strength_gains


weak_areas


improvements


summary_text


created_at



3. TypeScript Models (Interfaces)
Estas interfaces las debe usar el frontend y el backend.

3.1 Item
export interface Item {
  id: number;
  concept_key: string;
  item_type: "word" | "phrase" | "chunk" | "concept";
  word_from: string;
  word_to: string;
  gender?: string;
  plural?: string;
  note?: string;
  level_id: number;
  category_id: number;
}


3.2 StudyAttempt
export interface StudyAttempt {
  item_id: number;
  user_answer: string;
  is_correct: boolean;
  response_time_ms: number;
}


3.3 SkillState
export interface SkillState {
  item_id: number;
  strength: number;
  times_correct: number;
  times_wrong: number;
  avg_response_time: number;
  last_seen: string;
}


3.4 StudySessionSummary
export interface StudySessionSummary {
  session_id: number;
  total_items: number;
  accuracy: number;
  avg_response_time_ms: number;
  strengths?: string[];
  weaknesses?: string[];
  recommendation?: string;
}


4. API Contract (v6.1)
La API debe ser estable, predecible y minimalista.

4.1 Start Study Session
POST /api/study/start

Body:
{
  "mode": "flashcard" | "mcq" | "writing"
}

Response:
{
  "ok": true,
  "session_id": 123,
  "items": [...]
}


4.2 Submit Attempt
POST /api/study/attempt

Body:
{
  "session_id": 123,
  "item_id": 5,
  "user_answer": "...",
  "is_correct": true,
  "response_time_ms": 1300
}


4.3 Get Next Item (Adaptive Engine)
GET /api/study/next?session_id=123

Response:
{
  "item": {...},
  "adaptive_reason": "review_due" | "new_item" | "difficulty_adjustment"
}


4.4 End Session
POST /api/study/end

Response:
{
  "summary": { ...StudySessionSummary }
}


4.5 Feedback Mode API
POST /api/feedback/analyze

Devuelve:
correcciones


explicaciones simples


motivación ligera



4.6 Insights API
GET /api/insights/weekly

Devuelve:
progreso total


mejoras


debilidades


texto generado por IA



5. Folder Structure (Frontend)
Organización sugerida para claridad y modularidad:
src/
 ├── app/
 │    ├── study/
 │    ├── feedback/
 │    ├── insights/
 │    └── api/
 ├── components/
 ├── core/
 │    ├── engines/
 │    │       ├── adaptive.ts
 │    │       ├── skill.ts
 │    │       ├── tracking.ts
 │    │       ├── motivation.ts
 │    │       └── emotional.ts
 │    ├── types/
 │    └── utils/
 ├── libs/
 └── hooks/


6. Core Engines – Technical Behavior

6.1 Skill Engine (Technical)
Actualiza:
strength


avg_response_time


times_correct


times_wrong


Debe ejecutarse:
al recibir un nuevo attempt


al finalizar una sesión



6.2 Adaptive Engine
Reglas básicas:
Si strength < 40: mostrar más repaso


Si times_wrong >= 2: bajar dificultad


Si usuario es rápido y correcto: introducir nuevos items


Si sesión es muy larga: cooldown automático


Output:
{
  next_item: Item;
  reason: "review" | "new" | "difficulty_adjustment"
}


6.3 Emotional Engine
Basado en:
accuracy


tiempo fuera de la app


errores repetidos


velocidad lenta


Genera mensajes tipo:
“Este error es muy común. Sigamos.”


“Buen esfuerzo, aunque hoy estés cansado.”



7. Session Flow (Engineering View)
FE llama a /start → obtiene primeros items


Usuario responde → /attempt


BE actualiza Skill Engine


Backend llama Adaptive Engine → devuelve siguiente item


Al final → /end


Tracking Engine genera métricas y summary


Emotional Engine produce mensaje final



8. Codex Development Guidelines
Para trabajar con este proyecto:
Do:
respetar interfaces


mantener modularidad


no mezclar motores


documentar cada función


proponer optimizaciones


Don't:
modificar DB sin permiso


introducir IA donde no corresponde


romper contrato de API


crear lógica repetida
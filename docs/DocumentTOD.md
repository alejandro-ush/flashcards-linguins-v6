📘 LINGUINS v6.1 — TECHNICAL ONBOARDING DOCUMENT (TOD)
Version 1.0 – Human-Friendly Edition

0. Welcome
Bienvenido al proyecto Linguins v6.1, una plataforma modular de aprendizaje de idiomas diseñada para ser:
rápida,


emocionalmente inteligente,


adaptativa,


científicamente fundamentada,


escalable para futuras versiones (v6.2, v7…).


Este documento te da una visión rápida de:
cómo funciona el sistema,


dónde está cada cosa,


qué se puede tocar,


qué no se puede tocar,


qué motores existen,


cómo empezar a contribuir.



1. What Linguins v6.1 Is
Linguins es:
una plataforma que usa unidades mínimas de aprendizaje (Items),


con motores internos (engines) para guiar la experiencia,


modos principales: Study, Feedback, Insights,


una arquitectura modular y escalable,


IA integrada para correcciones, insights y soporte emocional,


una experiencia diseñada para aprender bien y sentirse acompañado.


Importante:
 Linguins v6.1 NO es una app completa.
 Es un núcleo funcional sólido sobre el cual se construirán los modos avanzados.

2. High-Level Architecture
El proyecto se divide en:
A) Frontend (Next.js + TypeScript)
Modos:
/study


/feedback


/insights


UI rápida, modular, basada en componentes limpios.

B) Backend (Supabase + API Routes)
Incluye:
base de datos PostgreSQL


seguridad RLS


funciones RPC (si necesarias)


endpoints propios en /api/*



C) Engines (Core Business Logic)
Ubicados en:
src/core/engines/

Motores:
Skill Engine


Tracking Engine


Adaptive Engine


Motivation Engine


Emotional Engine


Los motores NO están vinculados a UI.
 Son el cerebro de la experiencia.

D) AI Layer
Usada para:
corrección de escritura


explicaciones simples


mensajes emocionales


insights en lenguaje natural


NO usada para:
selección de contenido


SRS


planes de estudio


generación masiva de datos



3. Folder Structure (Overview)
src/
 ├── app/
 │    ├── study/
 │    ├── feedback/
 │    ├── insights/
 │    └── api/
 ├── components/
 ├── core/
 │    ├── engines/
 │    ├── types/
 │    └── utils/
 ├── libs/
 └── hooks/


4. Database Overview
Las tablas principales:
items
Unidad mínima de aprendizaje.
study_sessions
Cada sesión de estudio.
attempts
Cada intento del usuario.
user_skill_map
Dónde se guarda la fuerza y progreso de cada item para cada usuario.
weekly_insights
Resumen y evolución semanal.

5. API Endpoints You Must Know
Study:
POST /api/study/start


POST /api/study/attempt


GET /api/study/next


POST /api/study/end


Feedback (IA):
POST /api/feedback/analyze


Insights:
GET /api/insights/weekly



6. Core Engines (What They Do)
Skill Engine
Actualiza:
fuerza


precisión


tiempo de respuesta


memoria


No tiene interfaz visual.

Tracking Engine
Genera métricas e insights visibles:
fortalezas


debilidades


mejoras



Adaptive Engine
Decide:
qué estudiar


cuándo repasar


cuándo introducir nuevo contenido


cuándo bajar dificultad


Es clave para Study.

Motivation Engine
Genera:
refuerzos positivos breves


micro-goals


mensajes adultos



Emotional Engine
Da soporte emocional:
“Es normal cometer este error”


“Hoy lo hiciste bien, incluso si te costó”



7. Session Flow (How a Study Session Works)
Usuario inicia → /start


Recibe Items iniciales


Va respondiendo → /attempt


Skill Engine actualiza métricas


Adaptive Engine decide el siguiente Item → /next


Sesión termina → /end


Tracking + Emotional Engine producen summary


Insights se actualizan semanalmente



8. Things You Can Work On (Allowed Scope)
UI/UX de Study, Feedback e Insights


Mejoras de rendimiento


Engines internos


API endpoints


Componentes modulares


Utils y hooks


Documentación



9. Things You MUST NOT Change
estructura de carpetas


nombres de tablas


nombres de endpoints


motores (no fusionarlos)


incluir nuevos modos (Voice, Social…)


modelos de datos base


contratos de API


esquema de BD


introducir IA donde no corresponde



10. How to Start Contributing
Leer Documentos A, B y C (conceptos + arquitectura + reglas de Codex).


Revisar estructura del repo.


Identificar módulo donde trabajar (Study, Feedback, etc.).


Confirmar requerimiento con el PM o con el equipo.


Implementar respetando motores, arquitectura y modularidad.


Revisar calidad y evitar side-effects.


Crear Pull Request bien documentado.



11. Coding Standards
TypeScript estricto


funciones puras cuando sea posible


componentes simples y reusables


engines independientes y bien comentados


evitar duplicación de lógica


retornar siempre { ok, data } o { ok, error }



12. The Philosophy You Must Respect
Simplicidad


Modularidad


Adaptación continua


Ritmo humano


Mensajes adultos y cálidos


Progreso visible


Estabilidad antes que complejidad



13. Future Vision (Why This Matters)
v6.1 es el núcleo sobre el cual se construirá:
Voice Mode


Social Mode


Explorer Mode


Conversation Mode


Tutor avanzado


Aprendizaje emocional adaptativo 2.0


Personalización profunda basada en IA


Tu trabajo aquí determina la calidad del futuro del producto.


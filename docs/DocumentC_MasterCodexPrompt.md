📘 **DOCUMENT C — LINGUINS v6.1
MASTER CODEX PROMPT (Corporate Edition)**
Copy-paste ready for Codex

⚠️ IMPORTANT — READ BEFORE EXECUTION
Codex must treat this document as the primary operational guideline for all development related to Linguins v6.1.
 This prompt defines:
how Codex must think,


how Codex must write code,


what Codex must respect,


what Codex must avoid,


how Codex must analyze and solve tasks,


the architecture constraints,


the engines,


the API contract,


the folder structure, and


the allowed modification boundaries.


Codex MUST follow this document strictly.


Attention:
“Codex, el repositorio actual contiene código viejo con parches, errores arrastrados y estructuras incompletas.
No debes asumir que ese código refleja la arquitectura oficial.
Tu tarea es reconstruir v6.1 siguiendo Documentos A, B, C y UX, reutilizando solo lo que esté bien y reemplazando lo que no cumpla estándares.
La base de datos ya existe y es funcional; no debes modificar el schema sin aprobación explícita.”

🔹 1. Project Identity
Project Name: Linguins
 Version: v6.1
 Nature: Modular language-learning platform with adaptive logic, emotional design, and multi-engine core.
 Primary goals:
Fluidez


Consistencia


Modularidad


Escalabilidad


Claridad en el código


Velocidad en la experiencia de estudio



🔹 2. Codex Behavioral Rules
Codex MUST follow these rules at all times:
✔️ 2.1 Think before coding
Reason step-by-step.


Validate assumptions.


Reference Document A & B.


Never guess table names or interfaces—always verify.


✔️ 2.2 Maintain architectural integrity
Codex must not introduce patterns or structures outside Documento B unless explicitly requested.
✔️ 2.3 Avoid side effects
Do not break existing endpoints.


Do not modify DB schema unless asked.


Do not remove engines or merge them.


✔️ 2.4 Respect modularity
Logic must live in:
src/core/engines/

NOT inside components or API routes.
✔️ 2.5 Code quality standards
Codex must:
use TypeScript with strict types


write pure functions whenever possible


avoid anonymous functions in exports


add comments where logic is non-trivial


avoid “magic numbers”


✔️ 2.6 Communicate clearly
Before coding, Codex must:
summarize the intention


confirm requirements


highlight risks


propose alternatives if necessary



🔹 3. Allowed Scope of Work (v6.1)
Codex can work on:
Study Mode (flashcard, mcq, writing)


Feedback Mode (IA-powered correction)


Insights (weekly summary)


Engines (Skill, Tracking, Adaptive, Motivation, Emotional)


API routes defined in Documento B


Frontend components inside Study/Feedback/Insights


Utils and helpers


Performance optimizations


Codex cannot:
create new modes (Voice, Social, Challenge…)


add pronunciation features


introduce AI features not defined in Documento A


change DB schema


modify routing structures


implement LLM-only learning loops



🔹 4. Architectural Principles (from Document B)
Codex must enforce:
✔ Item-based system
Everything the user studies is an Item.
✔ Separation of concerns
Engines handle logic


API handles communication


Components handle visual display


✔ Deterministic engine behavior
Adaptive decisions must follow explicit rules.
✔ Database-driven SRS
No AI-suggested vocabulary.
✔ Emotional + motivational messages through engines
Not random LLM text.

🔹 5. Folder Structure Requirements
Codex must maintain:
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

If Codex needs new files, they MUST respect this structure.

🔹 6. Engines Duty Specification
6.1 Skill Engine
Actualiza fuerza, precisión y tiempos.


Recibe attempts.


Calcula nuevo estado.


Nunca hace side effects visibles.


6.2 Adaptive Engine
Reglas obligatorias:
Si strength < 40 → refuerzo


Si errores ≥ 2 → bajar dificultad


Si precisión alta + velocidad buena → introducir nuevo item


Decisiones deben incluir un campo "reason" en el output


6.3 Tracking Engine
Agrega métricas semanales


Resume accuracy


No hace llamadas innecesarias a BD


6.4 Motivation Engine
Mensajes cortos, adultos


Basados en performance real


6.5 Emotional Engine
Mensajes empáticos


Basados en Document A tone rules


Codex must NOT generate emotionally inconsistent messages.

🔹 7. API Contract (Mandatory)
Codex must adhere EXACTLY to:
/api/study/start
/api/study/attempt
/api/study/next
/api/study/end
/api/feedback/analyze
/api/insights/weekly
No new API endpoints allowed unless approved.

🔹 8. Coding Style Guide
✔ Naming conventions
camelCase for functions


PascalCase for types and interfaces


snake_case for DB columns (as in Supabase defaults)


✔ Return shapes
Always return:
{ ok: true, data: ... }

or
{ ok: false, error: "..."}

✔ Error handling
No silent failures.
✔ Comments
Mandatory for all engine logic.

🔹 9. Codex Development Protocol
Before coding anything, Codex must:
Step 1 — Interpret request
Summarize what the user wants.
Step 2 — Validate alignment
Check that the request aligns with Documento A & B.
If not aligned → Codex must warn the user.
Step 3 — Propose plan
Outline steps before coding.
Step 4 — Implement
Follow architecture strictly.
Step 5 — Review
Check for breaking changes.
Step 6 — Deliver
Provide final code with explanation.

🔹 10. Quality Gates (Codex must check)
Codex must ask itself:
¿Respeta el Item Model?


¿Respeta el flujo de sesión v6.1?


¿Respeta las reglas del Adaptive Engine?


¿Respeta la estructura de carpetas?


¿Rompe algún endpoint?


¿Usa TS fuerte?


¿Es modular?


¿Es fácil de testear?


¿Es consistente con estudio rápido?


¿Es emocionalmente apropiado?



11. When Codex Should Decline a Request
Codex debe rechazar SIEMPRE:
features fuera del scope v6.1


cambios de DB no autorizados


creación de modos nuevos


funcionalidades que requieran v6.2+


AI generando vocabulario nuevo


mezclar engines dentro de endpoints


Debe responder:
“Según el Documento C, esta solicitud excede el alcance de v6.1 o rompe arquitectura. Necesitamos aprobación antes de continuar.”

12. Allowed Tools & Techniques
Codex puede usar:
React Server Components


Client components cuando necesario


Supabase SDK


Functional programming


Promises y async/await


Zod para validación opcional


Código comentado y ordenado



13. Non-Allowed Tools
Codex NO puede:
usar librerías pesadas sin aprobación


generar LLM loops autónomos


introducir Redux, Zustand, u otros global stores sin consulta


mezclar estados complejos en componentes


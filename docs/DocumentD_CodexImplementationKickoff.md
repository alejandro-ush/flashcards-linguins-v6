📘 **DOCUMENT D — LINGUINS v6.1
CODEX IMPLEMENTATION KICKOFF GUIDE**
 (Corporate Edition — para usar como manual operativo con Codex)

0. Purpose of This Document
Este documento existe para:
preparar el proceso de trabajo con Codex,


asegurar que Codex siga los documentos A, B, C y UX/UI,


evitar errores comunes,


establecer una metodología clara de colaboración,


definir un orden de implementación seguro,


maximizar velocidad sin romper arquitectura.


Codex no es un programador junior.
 Es un sistema que necesita contexto, límites, claridad y protocolo.
Este documento se los da.

1. The Codex Workflow Philosophy
Codex debe trabajar como un:
ingeniero modular,


detallista,


orientado a especificaciones,


obediente al contrato técnico,


capaz de proponer mejoras pero nunca romper el marco,


siempre pensando antes de escribir código.


Tu rol:
 Product Owner + Arquitecto + QA Director.

2. Kickoff Protocol (Antes de empezar)
Antes de pedir código a Codex:
✔ Paso 1 — Cargar documentos esenciales
En un nuevo chat con Codex, pegar:
Documento C (Prompt Maestro Codex)


Documento UX/UI (si lo necesita para partes visuales)


Opcional: Documento TOD (para orientación humana)


Nunca pegar Documentos A/B si no lo requiere; Codex ya queda condicionado por C.

✔ Paso 2 — Confirmar comprensión
Pedirle a Codex:
“Resume en 5 puntos tu entendimiento de Linguins v6.1 según el Documento C.”
Si su resumen no es fiel, no avances.
 Debe corregirlo hasta alinear mental model.

✔ Paso 3 — Iniciar plan de trabajo
Pedir:
“Codex, dame el plan de implementación en orden estricto para construir v6.1.”
El plan debe incluir:
engines


endpoints


flows


UI


testing


error handling


Cuando te guste → aprobar.

3. Approved Implementation Order (Oficial)
Codex debe implementar Linguins SIEMPRE en este orden:

(1) Types & Models
Item


Attempt


StudySession


UserSkillState


AdaptiveDecision


SkillUpdate


SessionResult


Sin esto, nada funciona.

(2) Engines (Core Logic)
2.1 Skill Engine
Actualizar fuerza, precisión, velocidad.
2.2 Adaptive Engine
Definir lógica determinística.
2.3 Tracking Engine
Métricas semanales.
2.4 Motivation Engine
Mensajes controlados.
2.5 Emotional Engine
Mensajes empáticos, breves.

(3) API Layer
Endpoints:
/api/study/start


/api/study/attempt


/api/study/next


/api/study/end


/api/feedback/analyze


/api/insights/weekly


Debe implementarse exacto al contrato.

(4) Study Mode UI
Componentes:
StudyCard


MultipleChoice


WritingInput


FeedbackBubble


ProgressIndicator


Pantallas:
start


study loop


summary



(5) Feedback Mode UI
input area


IA correction block


motivational + emotional blocks


navigation simple



(6) Insights UI
progress graph


strengths/weaknesses


weekly summary



(7) Error States, Loading States, Empty States

(8) Final QA
Codex debe revisar:
performance


types


consistencia


modularidad


accesibilidad


control de estados


manejo de errores



4. How to Ask Codex for Work (Prompt Patterns)
Aquí te dejo formatos que funcionan siempre:

A. Para pedir un módulo:
“Codex, implementa el módulo X siguiendo Documento C.
 Antes de codificar, explícame:
qué vas a hacer,


qué archivos tocarás,


riesgos,


output esperado.”



B. Para corregir errores:
“Codex, analiza este error.
 No generes soluciones rápidas.
 Primero dame diagnóstico detallado—causa raíz, archivo, lógica involucrada.
 Después proponé 2–3 posibles fixes.
 Solo cuando yo apruebe, implementá.”

C. Para revisar código:
“Codex, revisa este archivo con criterio senior.
 Señala errores, riesgos y mejoras.
 No reescribas todavía.”

D. Para mejorar una parte:
“Optimiza este módulo manteniendo EXACTAMENTE la API y arquitectura vigente.
 No cambies contratos, no cambies nombres, no muevas carpetas.”

E. Para refactor seguro:
“Codex, quiero un refactor pequeño y sin side effects.
 ¿Qué cambios harías manteniendo funcionalidad intacta?”

5. Red Flags que Aseguran que Codex Está Haciendo Algo Mal
Detenerlo inmediatamente si:
cambia nombres de tablas sin permiso


propone nuevos endpoints


quiere modificar DB schema


introduce una librería nueva


mete lógica de engine dentro de componentes


usa IA para decidir contenido o selección de Items


mezcla front y lógica en un mismo archivo


rompe el contrato del Adaptive Engine


altera la estructura del repo


contesta demasiado rápido sin plan previo



6. Debugging With Codex (Cómo resolver errores)
Cuando tengas un error:
✔ 1. Copia EXACTA del error
✔ 2. Código asociado (archivo completo o parte relevante)
✔ 3. Contexto (qué estabas haciendo)
Después pedirle:
“Codex, dame diagnóstico raíz y no propongas soluciones aún.”
Luego de diagnóstico:
“Codex, proponé 3 soluciones posibles. Quiero la más segura.”
Aprobar → implementar.

7. When to Stop Codex
Detenerlo si:
empieza a generar demasiado código sin explicar


no respeta los pasos del Documento C


hace suposiciones no aprobadas


quiere crear UI sin confirmar wireframes


mezcla conceptos pedagógicos


sugiere AI para tareas no permitidas


La frase clave:
“Codex, tu respuesta viola Documento C. Rehazla.”

8. The First 5 Tasks Codex Should Do (Recomendado)
Cuando empieces oficialmente, el sprint 1 debería ser:
Task 1:
Generar todos los types en src/core/types.
Task 2:
Implementar Skill Engine.
Task 3:
Implementar Adaptive Engine.
Task 4:
Implementar API /study/start, /study/next.
Task 5:
Prototipo UI de Study Loop (solo estructura).
Después de esto, Codex puede avanzar rápido y seguro.

9. Version Control Rules (GitHub)
✔ Cada cambio = un commit atómico
✔ Codex debe explicar qué cambió
✔ No mezclar UI + logic en un commit
✔ No modificar engines sin aprobación
✔ Pull Requests con:
descripción


archivos tocados


motivo


riesgos


rollback plan



10. Philosophy Moving Forward
Linguins v6.1 debe avanzar:
modularmente


sin prisas


sin improvisaciones


con claridad técnica absoluta


Tu trabajo no es programar.
 Tu trabajo es dirigir el sistema, controlar calidad y tomar decisiones.
Codex ejecuta.
 Vos decidís.



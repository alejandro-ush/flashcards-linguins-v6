📘 LINGUINS v6.1 — UX/UI DESIGN GUIDELINES
Títulos en inglés + contenido en español
 Versión para diseñadores (UI/UX, motion, product design)

0. Purpose of This Document
Este documento existe para que el equipo de UX/UI:
entienda la filosofía de Linguins v6.1


diseñe pantallas alineadas al modelo pedagógico


cree una experiencia emocionalmente inteligente


defina componentes reutilizables


prepare flujos antes de que Codex implemente


evite inconsistencias en interacción y tono


El objetivo es orden y claridad, no limitar la creatividad.

1. Product Experience Pillars (Los pilares UX de Linguins)
1. Fast → Siempre rápido
Los usuarios quieren practicar en segundos, no navegar interfaces.
Principio:
“Menos pantallas, más estudio.”

2. Focused → Cero ruido
Durante estudio, solo ver lo esencial.
sin banners


sin menús gigantes


sin colores distractivos



3. Emotionally Intelligent → Diseñado para humanos
No queremos robots.
 Queremos acompañar.
Ejemplos:
feedback breve, cálido, adulto


motivación real, no clichés


mensajes basados en datos del usuario



4. Adaptive → La UI responde al usuario
La interfaz cambia según:
dificultad


errores repetidos


cansancio


progreso


tiempo en sesión



5. Minimal Cognitive Load → Carga mental mínima
Nada debe exigir más de 2–3 segundos para entender.

2. Core Interaction Flows (Flujos esenciales)
El equipo UX debe diseñar cuidadosamente:
2.1 Study Flow (Flashcard, MCQ, Writing)
Estructura universal:
Inicio de sesión


selección rápida (nivel o deck)


pantalla mínima


mostrar “Estimated Time: 3–5 min”


Loop de estudio (repetir)


mostrar Item


recibir respuesta


micro-recompensa visual


mostrar feedback breve


pasar al siguiente automáticamente


Cierre


resumen claro en 4 partes:


aciertos


errores


palabras críticas


tendencia del día


Opciones final


repetir


guardar como “favorito para repasar”


salir


El usuario nunca debe estar a más de 1 clic de estudiar.

2.2 Feedback Flow (Tutor IA)
El diseño debe comunicar que hay un “compañero inteligente”, no un examen.
Pasos:
Usuario escribe o responde algo.


IA corrige y explica con:


una frase de reconocimiento emocional


2–3 puntos de mejora


un ejemplo nuevo


Usuario puede:


seguir


pedir otra explicación


pedir ejemplo adicional


El feedback debe sentirse como un profesor atento, no un juez.

2.3 Insights Flow
Debe ser:
visual


claro


motivador


absolutamente breve


Tres secciones:
A. “Lo que hiciste bien”
bloques verdes


mensajes simples


datos reales (accuracy, velocidad)


B. “Tu punto débil del momento”
solo 1 cosa


propuesta clara: “Practica 3 Items hoy”


C. “Tu tendencia”
gráfica minimal


7 días o 14 días



3. Emotional Design Rules
3.1 Tono de voz
Debe ser:
adulto


empático


directo


cálido


humano


Prohibido:
emojis excesivos


mensajes infantiles


sarcasmo


frases tipo “¡Sigue así campeón!”


textos largos que molesten



3.2 Reglas UI para feedback emocional
Color suave y consistente para mensajes.


Espaciado respirable alrededor de frases emocionales.


Micro-animaciones lentas (0.2–0.4s).


Nada debe bloquear el flujo del estudio.



4. Visual Identity Principles
4.1 Color System
Paleta calmada, profesional


Colores energéticos solo para reforzar aciertos/error


No usar colores saturados en exceso


Evitar “gamer look”



4.2 Typography
clara y minimalista


dos pesos principales: regular y semi-bold


tamaño grande para Items



4.3 Layout Principles
Centrados


Enfocados


Mucho negativo space


Interacciones grandes y táctiles



5. Component System (UI Atoms)
UX debe definir y estandarizar:
5.1 Buttons
primary


secondary


ghost


destructive (solo para errores graves)


Reglas:
bordes suaves


tamaños amplios


mínimo texto



5.2 Feedback Blocks
Usados para:
aciertos


errores


recomendaciones


mensajes emocionales



5.3 Item Card
Elemento central del Study Mode.
Debe soportar:
flashcard


multiple choice


writing


Proponer un diseño unificado que cambie según modalidad.

5.4 Progress Indicators
Simples: barras, puntos, círculos.
Regla:
 No usar indicadores que generen ansiedad.

6. Navigation Rules
La navegación debe ser plana, no profunda.


El usuario debe llegar a Study en menos de 2 pasos desde Home.


Home solo muestra:


Study


Feedback


Insights


Sin distracciones.

7. Microinteractions and Motion
Debe existir:
sutil animación cuando acertás


pequeña vibración/error cuando fallás


transición suave entre Items


feedback inmediato (menos de 100 ms)


NO debe existir:
pops rápidos


animaciones largas


efectos ruidosos



8. Accessibility Standards
tamaños grandes


tipografías claras


contraste alto


navegación fluida con teclado


timers opcionales para users ansiosos



9. States UX MUST Design
Cada sistema requiere:
Loading states
Minimalistas.
Empty states
Ejemplo:
 "Todavía no has estudiado hoy. Haz una sesión corta."
Error states
Claridad, calma.
Success states
Breves, positivos.

10. Deliverables UX necesarios ANTES de Codex
Para que Codex pueda implementar sin ambigüedad, necesitamos:
✔️ 1. Wireframes de los tres modos principales
Study


Feedback


Insights


✔️ 2. Component Library
botones


cards


contenedores


alerts


inputs


loaders


✔️ 3. Flujos completos
Study session loop


Feedback session loop


Insights breakdown


✔️ 4. Microinteractions esenciales
correcto


incorrecto


escritura


cambio de Item


✔️ 5. Tono emocional UI
ejemplos de estilo


spacing


paleta


✔️ 6. Arquitectura de navegación
home


study


feedback


insights


settings (si aplica)



⭐ DOCUMENTO UX/UI COMPLETADO
Este documento es suficiente para que:
UX/UI diseñe los wireframes y componentes


PM valide la experiencia


El equipo cree un Design System


Codex reciba especificaciones claras para implementar


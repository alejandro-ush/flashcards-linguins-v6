// src/core/types/ui.ts

// ---------------------------------------------------------
// StudyCardView — DTO oficial para la UI del modo Study v6.1
// Representa la "vista" de una tarjeta ya procesada y lista
// para ser mostrada sin lógica adicional en el componente UI.
// ---------------------------------------------------------

export type StudyCardView = {
  /** Lado A — palabra principal (obligatoria) */
  word: string;

  /** Lado B — traducción obligatoria */
  translation: string;

  /** Datos opcionales del lado B */
  gender?: string;
  plural?: string;
  note?: string;

  /** Chips o badges informativos */
  tags?: string[];

  /** Información de idiomas para el header */
  languageFrom?: string; // fallback en UI: "Alemán"
  languageTo?: string;   // fallback en UI: "Español"
};


/* Nota - mejoras

¿Posibles mejoras a futuro?
(Pero no implementarlas ahora)

    .Añadir id?: string si StudyFlow lo necesita para tracking.
    .Añadir level?: string | number si la UI empieza a mostrar niveles.
    .Añadir category?: string para metadata de navegación.
    .Crear un mapper Item → StudyCardView para centralizar la normalización.

*/
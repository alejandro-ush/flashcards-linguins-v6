export const themes = {
  darkPremium: {
    color: {
      bg: "#050816",
      bgElevated: "#0b1020",
      textMain: "#e5f0ff",
      textSoft: "#94a3b8",
      textMuted: "#64748b",
      accentPrimary: "#2ce39b",
      accentPrimarySoft: "#9bf6d5",
      chipBorder: "rgba(148,163,184,0.25)",

    },
    surface: {
      app: "#050816",
      card: "rgba(12,18,34,0.96)",
      chip: "rgba(15,23,42,0.9)",
      nav: "rgba(15,23,42,0.95)",
      buttonPrimary: "var(--gradient-primary)",
      buttonSecondary: "radial-gradient(circle at top,rgba(15,23,42,0.96),rgba(15,23,42,1))",
    },
    border: {
      soft: "rgba(148,163,184,0.2)",
      strong: "rgba(148,163,184,0.5)",
      card: "rgba(148,163,184,0.25)",
    },
    radius: {
      pill: "999px",
      card: "32px",
      xl: "24px",
      xxl: "32px",
    },
    shadow: {
      cardShadow: "0 30px 80px rgba(0,0,0,0.65)",
      softShadow: "0 16px 40px rgba(34,197,94,0.28)",
    },
    blur: {
      soft: "18px",
      strong: "26px",
    },
    gradient: {
      primaryGradient: "linear-gradient(135deg,#2CE39B 0%,#27C48A 60%,#20B777 100%)",
      surfaceSoftGradient:
        "radial-gradient(circle at top left,rgba(44,227,155,0.08),transparent 60%),radial-gradient(circle at bottom right,rgba(15,23,42,0.8),rgba(2,6,23,0.98))",
      chipGradient:
        "radial-gradient(circle at top,rgba(148,163,184,0.18),rgba(15,23,42,0.9))",
    },
  },
  sepia: {
    color: {},
    surface: {},
    border: {},
    radius: {},
    shadow: {},
    blur: {},
    gradient: {},
  },
  light: {
    color: {},
    surface: {},
    border: {},
    radius: {},
    shadow: {},
    blur: {},
    gradient: {},
  },
  glow: {
    color: {},
    surface: {},
    border: {},
    radius: {},
    shadow: {},
    blur: {},
    gradient: {},
  },
  navyMono: {
    color: {},
    surface: {},
    border: {},
    radius: {},
    shadow: {},
    blur: {},
    gradient: {},
  },
} as const;

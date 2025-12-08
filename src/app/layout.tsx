// src/app/layout.tsx
import "@/app/globals.css";
import type { ReactNode } from "react";
import { themes } from "@/styles/tokens";

export const metadata = {
  title: "Flashcards Linguins v6 – Focus Flow",
  description: "Plataforma de aprendizaje de idiomas con flashcards inteligentes e IA adaptativa.",
};

const theme = themes.darkPremium;

const cssVars = `
  :root {
    --surface-app: ${theme.surface.app};
    --surface-card: ${theme.surface.card};
    --surface-chip: ${theme.surface.chip};
    --surface-nav: ${theme.surface.nav};
    --surface-button-primary: ${theme.surface.buttonPrimary};
    --surface-button-secondary: ${theme.surface.buttonSecondary};

    --text-main: ${theme.color.textMain};
    --text-soft: ${theme.color.textSoft};
    --text-muted: ${theme.color.textMuted};
    --accent-primary: ${theme.color.accentPrimary};
    --accent-primary-soft: ${theme.color.accentPrimarySoft};
    --chip-border: ${theme.color.chipBorder};

    --border-soft: ${theme.border.soft};
    --border-strong: ${theme.border.strong};
    --border-card: ${theme.border.card};

    --radius-pill: ${theme.radius.pill};
    --radius-card: ${theme.radius.card};
    --radius-xl: ${theme.radius.xl};

    --shadow-card: ${theme.shadow.cardShadow};
    --shadow-soft: ${theme.shadow.softShadow};

    --blur-soft: ${theme.blur.soft};
    --blur-strong: ${theme.blur.strong};

    --gradient-primary: ${theme.gradient.primaryGradient};
    --gradient-surface-soft: ${theme.gradient.surfaceSoftGradient};
    --gradient-chip: ${theme.gradient.chipGradient};
  }
`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <style jsx global>{cssVars}</style>
      </head>
      <body className="min-h-screen bg-surface-app text-main">
        {children}
      </body>
    </html>
  );
}

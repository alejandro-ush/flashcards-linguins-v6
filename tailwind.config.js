// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "surface-app": "var(--surface-app)",
        "surface-card": "var(--surface-card)",
        "surface-chip": "var(--surface-chip)",
        "surface-nav": "var(--surface-nav)",

        "text-main": "var(--text-main)",
        "text-soft": "var(--text-soft)",
        "text-muted": "var(--text-muted)",

        "accent-primary": "var(--accent-primary)",
        "accent-primary-soft": "var(--accent-primary-soft)",

        "border-soft": "var(--border-soft)",
        "border-strong": "var(--border-strong)",
        "border-card": "var(--border-card)",
        "chip-border": "var(--chip-border)",
      },
      borderRadius: {
        pill: "var(--radius-pill)",    // 999px
        card: "var(--radius-card)",    // 32px
        xl: "var(--radius-xl)",        // 24px
      },
      boxShadow: {
        card: "var(--shadow-card)",    // 0 30px 80px rgba(0,0,0,0.65)
        soft: "var(--shadow-soft)",    // mint glow leve
      },
      backdropBlur: {
        soft: "var(--blur-soft)",      // 18px
        strong: "var(--blur-strong)",  // 26px
      },

      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",          // botón premium mint
        "gradient-surface-soft": "var(--gradient-surface-soft)",// fondo glass card
        "gradient-chip": "var(--gradient-chip)",                // pills
      },
    }
  },
  plugins: []
};

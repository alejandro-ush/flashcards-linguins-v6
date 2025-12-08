/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#050816",
        bgElevated: "#0b1020",
        cardBg: "rgba(12,18,34,0.96)",
        cardBorder: "rgba(148,163,184,0.25)",
        textMain: "#E5F0FF",
        textSoft: "#94A3B8",
        textMuted: "#64748B",
        accentMint: "#2CE39B",
        accentMintSoft: "#9BF6D5",
        deepGreen: "#022C22"
      },
      borderRadius: {
        xl: "24px",
        pill: "999px"
      },
      boxShadow: {
        card: "0 30px 80px rgba(0,0,0,0.65)",
        mint: "0 16px 40px rgba(34,197,94,0.28)"
      },
      backdropBlur: {
        soft: "18px",
        strong: "26px"
      }
    }
  },
  plugins: []
};

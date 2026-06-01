import type { Config } from "tailwindcss";

// Paleta cozy do LUMA — acolhedora, redonda, calorosa.
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        luma: {
          bg0: "#14131f",
          bg: "#1c1b29",
          card: "#262438",
          ink: "#f3efff",
          muted: "#a79fce",
          accent: "#ff9ec7",
          accent2: "#b69cff",
          mint: "#5fd6a0",
          gold: "#ffcf5c",
        },
      },
      fontFamily: {
        rounded: ["var(--font-rounded)", "Quicksand", "Nunito", "ui-rounded", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px rgba(0,0,0,0.35)",
        glow: "0 0 50px rgba(255,158,199,0.25)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
} satisfies Config;

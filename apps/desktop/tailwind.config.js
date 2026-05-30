/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        luma: {
          bg0: "#14131f",
          bg: "#1c1b29",
          card: "rgba(255,255,255,0.06)",
          ink: "#f3efff",
          muted: "#a79fce",
          accent: "#ff9ec7",
          accent2: "#b69cff",
        },
      },
      fontFamily: {
        rounded: [
          "Quicksand",
          "Nunito",
          "ui-rounded",
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 10px 40px rgba(0,0,0,0.35)",
        glow: "0 0 40px rgba(255,158,199,0.25)",
      },
    },
  },
  plugins: [],
};

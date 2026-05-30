import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend do app desktop (carregado pelo Tauri em produção).
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  server: { port: 1420, strictPort: true },
  // Plugins do Tauri só existem no contexto nativo; nunca bundlar no frontend.
  optimizeDeps: { exclude: ["@tauri-apps/plugin-sql"] },
  build: {
    target: "es2021",
    outDir: "dist",
    rollupOptions: { external: [/^@tauri-apps\//] },
  },
});

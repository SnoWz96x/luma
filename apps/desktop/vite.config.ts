import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Frontend do app desktop (carregado pelo Tauri em produção).
export default defineConfig({
  plugins: [react()],
  clearScreen: false,
  // Caminhos relativos: no app embutido o frontend é servido por um protocolo
  // próprio (tauri:///asset://), então "/assets/..." absoluto quebra. "./" resolve.
  base: "./",
  server: { port: 1420, strictPort: true },
  // Plugins do Tauri só existem no contexto nativo; nunca bundlar no frontend.
  optimizeDeps: { exclude: ["@tauri-apps/plugin-sql"] },
  build: {
    target: "es2021",
    outDir: "dist",
    rollupOptions: { external: [/^@tauri-apps\//] },
  },
});

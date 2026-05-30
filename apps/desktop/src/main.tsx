import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { hydrateFromSqlite } from "./repositories";
import { LUMA_KEYS } from "./lib/dataPrivacy";
import "./index.css";

function mount() {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// Restaura o cache local a partir do SQLite (durável) caso o webview tenha sido
// limpo; depois monta o app. No browser (sem Tauri) é no-op imediato.
hydrateFromSqlite([...LUMA_KEYS]).finally(mount);

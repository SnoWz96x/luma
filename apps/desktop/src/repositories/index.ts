// Repositórios concretos (Infra) que implementam os contratos de @luma/shared.
// SQLite via Tauri quando disponível; memória no dev/browser.
export { db, isTauri } from "./db";
export { vitalStateRepo } from "./vitalStateRepo";

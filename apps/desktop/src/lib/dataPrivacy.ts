// Privacidade — exportar / importar / apagar TODOS os dados do usuário.
// Requisito do produto (docs/01 e briefing): dados são do usuário, sempre
// exportáveis e apagáveis. Hoje os stores usam localStorage; este módulo é a
// fonte única das chaves para um backup/restauro coerente.
import { kvSet, kvRemove } from "../repositories";

export const LUMA_KEYS = [
  "luma.adoption", // appStore — pet adotado + nome
  "luma.progress", // progressStore — crescimento, badges, streak
  "luma.habits", // habitsStore — hábitos + fagulhas
  "luma.shop", // shopStore — itens cosméticos
  "luma.memories", // memoryStore — diário + memórias
  "luma.support", // supportStore — contatos + emergência
] as const;

export interface LumaBackup {
  app: "LUMA";
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

/** Coleta todos os dados num objeto serializável. */
export function exportData(): LumaBackup {
  const data: Record<string, unknown> = {};
  for (const key of LUMA_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
  }
  return {
    app: "LUMA",
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

/** Dispara o download de um arquivo .json com o backup. */
export function downloadBackup(): void {
  const backup = exportData();
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `luma-backup-${backup.exportedAt.slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Restaura um backup (substitui os dados atuais). Retorna true se válido. */
export function importBackup(json: string): boolean {
  let parsed: LumaBackup;
  try {
    parsed = JSON.parse(json) as LumaBackup;
  } catch {
    return false;
  }
  if (parsed?.app !== "LUMA" || typeof parsed.data !== "object") return false;
  for (const key of LUMA_KEYS) {
    if (key in parsed.data) {
      kvSet(key, JSON.stringify(parsed.data[key]));
    }
  }
  return true;
}

/** Apaga TODOS os dados do LUMA (irreversível). */
export function eraseAllData(): void {
  for (const key of LUMA_KEYS) kvRemove(key);
}

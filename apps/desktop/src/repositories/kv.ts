// kvRepo — persistência durável de estado dos stores.
// Estratégia: localStorage é o CACHE SÍNCRONO de leitura (o webview do Tauri o
// mantém em disco entre sessões); o SQLite (tabela app_kv) é o espelho DURÁVEL,
// escrito de forma assíncrona "best-effort". Isso dá robustez e abre caminho para
// export por arquivo .db e futura sincronização — sem tornar os stores async.
import { db } from "./db";

/** Lê um valor (string JSON) do cache local. */
export function kvGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Grava no cache local (sync) e espelha no SQLite (async, best-effort). */
export function kvSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
  void mirrorToSqlite(key, value);
}

/** Remove de ambos. */
export function kvRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  void (async () => {
    const database = await db();
    if (!database) return;
    try {
      await database.execute("DELETE FROM app_kv WHERE key = ?", [key]);
    } catch {
      /* ignore */
    }
  })();
}

async function mirrorToSqlite(key: string, value: string): Promise<void> {
  const database = await db();
  if (!database) return;
  try {
    await database.execute(
      `INSERT INTO app_kv (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      [key, value, new Date().toISOString()],
    );
  } catch {
    /* ignore — localStorage já garante a persistência mínima */
  }
}

/**
 * Hidratação: na 1ª execução em que o localStorage está vazio mas o SQLite tem
 * dados (ex.: cache do webview limpo), restaura o cache a partir do banco.
 * Chamar uma vez no boot do app.
 */
export async function hydrateFromSqlite(keys: string[]): Promise<boolean> {
  const database = await db();
  if (!database) return false;
  let restored = false;
  for (const key of keys) {
    if (kvGet(key) !== null) continue;
    try {
      const rows = await database.select<{ value: string }[]>(
        "SELECT value FROM app_kv WHERE key = ?",
        [key],
      );
      const value = rows[0]?.value;
      if (value !== undefined) {
        localStorage.setItem(key, value);
        restored = true;
      }
    } catch {
      /* ignore */
    }
  }
  return restored;
}

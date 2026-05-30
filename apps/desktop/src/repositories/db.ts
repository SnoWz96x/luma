// Acesso ao SQLite via tauri-plugin-sql. Carregado dinamicamente para que o app
// continue rodando no browser (dev) sem o Tauri — nesse caso db() retorna null
// e os repositórios usam memória. Veja docs/03-BANCO-DE-DADOS.md.

export interface SqlDatabase {
  execute(query: string, bindValues?: unknown[]): Promise<unknown>;
  select<T>(query: string, bindValues?: unknown[]): Promise<T>;
}

let dbPromise: Promise<SqlDatabase | null> | null = null;

/** True quando rodando dentro do Tauri (tem acesso ao SQLite nativo). */
export function isTauri(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

export function db(): Promise<SqlDatabase | null> {
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    if (!isTauri()) return null;
    // Especificador dinâmico (variável) para o bundler NÃO analisar estaticamente:
    // o pacote só existe no contexto Tauri (instalado no build nativo).
    const pkg = ["@tauri-apps", "plugin-sql"].join("/");
    const mod = (await import(/* @vite-ignore */ pkg)) as {
      default: { load(path: string): Promise<SqlDatabase> };
    };
    return mod.default.load("sqlite:luma.db");
  })();
  return dbPromise;
}

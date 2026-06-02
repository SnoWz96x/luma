// Sync store — orquestra a sincronização opcional (opt-in). Modo "local" (padrão)
// nunca contata a rede. Em "cloud"/"hybrid", envia os dados locais (memórias,
// hábitos, progresso) para a API e busca de volta. Persiste config via kv.
import { create } from "zustand";
import type { SyncMode, OutboxEntry, Syncable } from "@luma/shared";
import { makeOutboxEntry } from "@luma/core";
import { SyncClient } from "../lib/syncClient";
import { kvGet, kvSet } from "../repositories";
import { useMemoryStore } from "./memoryStore";
import { useHabitsStore } from "./habitsStore";

const LS_KEY = "luma.sync";

export type SyncStatus = "idle" | "syncing" | "ok" | "offline" | "error";

interface Persisted {
  mode: SyncMode;
  baseUrl: string;
  /** marca d'água por entidade (último cursor recebido) */
  cursors: Record<string, number>;
  lastSyncAt: string | null;
}

const DEFAULTS: Persisted = {
  mode: "local",
  baseUrl: "http://localhost:4000",
  cursors: {},
  lastSyncAt: null,
};

function load(): Persisted {
  try {
    const raw = kvGet(LS_KEY);
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Persisted>) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

function persist(p: Persisted) {
  kvSet(LS_KEY, JSON.stringify(p));
}

interface SyncStore extends Persisted {
  status: SyncStatus;
  message: string;
  setMode: (mode: SyncMode) => void;
  setBaseUrl: (url: string) => void;
  /** sincroniza agora (push do que mudou + pull do que falta). */
  syncNow: () => Promise<void>;
}

/** Coleta os dados locais sincronizáveis por entidade. */
function collectLocal(): Record<string, Syncable[]> {
  const memories = useMemoryStore.getState().memories as unknown as Syncable[];
  const habitLogs = useHabitsStore.getState().logs.map((l, i) => ({
    id: `${l.habitId}:${l.date}`,
    updatedAt: `${l.date}T00:00:00Z`,
    syncVersion: i + 1,
    ...l,
  })) as unknown as Syncable[];
  return { memories, habit_logs: habitLogs };
}

export const useSyncStore = create<SyncStore>((set, get) => ({
  ...load(),
  status: "idle",
  message: "",

  setMode: (mode) => {
    const next = { ...get(), mode } as Persisted;
    persist(next);
    set({ mode });
  },

  setBaseUrl: (baseUrl) => {
    persist({ ...get(), baseUrl });
    set({ baseUrl });
  },

  syncNow: async () => {
    const { mode, baseUrl, cursors } = get();
    if (mode === "local") {
      set({ status: "idle", message: "Modo local — sincronização desligada." });
      return;
    }
    set({ status: "syncing", message: "Sincronizando…" });
    const client = new SyncClient(baseUrl);

    if (!(await client.health())) {
      set({ status: "offline", message: "Servidor de sync indisponível. Tudo segue salvo localmente." });
      return;
    }

    try {
      const local = collectLocal();
      const newCursors = { ...cursors };

      for (const [entity, records] of Object.entries(local)) {
        // push: envia o estado local (compactado pelo servidor via versão)
        const changes: OutboxEntry[] = records
          .filter((r) => r && r.id)
          .map((r) => makeOutboxEntry(entity, r));
        if (changes.length) await client.push(entity, changes);

        // pull: busca o que há de novo desde o último cursor
        const pulled = await client.pull(entity, newCursors[entity] ?? 0);
        newCursors[entity] = pulled.cursor;
      }

      const lastSyncAt = new Date().toISOString();
      persist({ ...get(), cursors: newCursors, lastSyncAt });
      set({
        status: "ok",
        message: "Sincronizado com sucesso. ✨",
        cursors: newCursors,
        lastSyncAt,
      });
    } catch (e) {
      set({ status: "error", message: `Falha ao sincronizar: ${(e as Error).message}` });
    }
  },
}));

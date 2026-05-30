// Memory store — fonte única de memórias (diário + conversas alimentam aqui).
// Persiste em localStorage. Privacidade: tudo editável/apagável (docs/06).
import { create } from "zustand";
import { diaryMemory } from "@luma/core";
import type { Memory } from "@luma/shared";

const LS_KEY = "luma.memories";

function load(): Memory[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Memory[];
  } catch {
    /* ignore */
  }
  return [];
}

function persist(list: Memory[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

interface MemoryStore {
  memories: Memory[];
  /** adiciona uma memória pronta (ex.: extraída de conversa) */
  add: (m: Memory) => void;
  /** registra uma entrada de diário (vira memória source='manual') */
  addDiary: (text: string, emotion?: string) => Memory | null;
  /** apaga uma memória (privacidade) */
  remove: (id: string) => void;
  /** entradas de diário, mais recentes primeiro */
  diaryEntries: () => Memory[];
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  memories: load(),

  add: (m) => {
    const next = [...get().memories, m];
    persist(next);
    set({ memories: next });
  },

  addDiary: (text, emotion) => {
    const cand = diaryMemory(text, emotion !== undefined ? { emotion } : {});
    if (!cand) return null;
    const mem: Memory = {
      id: `d-${Date.now()}`,
      userId: "local",
      content: cand.content,
      importance: Math.round(cand.importance),
      source: cand.source,
      createdAt: new Date().toISOString(),
      ...(cand.emotion !== undefined ? { emotion: cand.emotion } : {}),
    };
    const next = [...get().memories, mem];
    persist(next);
    set({ memories: next });
    return mem;
  },

  remove: (id) => {
    const next = get().memories.filter((m) => m.id !== id);
    persist(next);
    set({ memories: next });
  },

  diaryEntries: () =>
    [...get().memories]
      .filter((m) => m.source === "manual")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
}));

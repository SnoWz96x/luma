// AI store — escolha do provider de IA (Mock offline ou Ollama local) + modelo.
// Persistido via kv. O resolvedor de provider faz fallback automático para o
// Mock se o Ollama não estiver disponível, para o chat nunca quebrar.
import { create } from "zustand";
import { MockProvider, LocalOllamaProvider } from "@luma/core";
import type { AIProvider } from "@luma/shared";
import { kvGet, kvSet } from "../repositories";

const LS_KEY = "luma.ai";

export type AIMode = "mock" | "ollama";

interface Persisted {
  mode: AIMode;
  baseUrl: string;
  model: string;
}

const DEFAULTS: Persisted = {
  mode: "mock",
  baseUrl: "http://localhost:11434",
  model: "phi3:mini",
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

const mock = new MockProvider();

export type OllamaStatus = "unknown" | "checking" | "online" | "offline";

interface AIStore extends Persisted {
  status: OllamaStatus;
  setMode: (mode: AIMode) => void;
  setBaseUrl: (url: string) => void;
  setModel: (model: string) => void;
  /** testa conexão com o Ollama e atualiza o status */
  checkOllama: () => Promise<boolean>;
  /**
   * Devolve o provider a usar agora. Se o modo for Ollama mas estiver offline,
   * cai no Mock automaticamente (o chat nunca quebra).
   */
  resolveProvider: () => Promise<AIProvider>;
}

export const useAiStore = create<AIStore>((set, get) => ({
  ...load(),
  status: "unknown",

  setMode: (mode) => {
    const next = { ...get(), mode } as Persisted;
    persist(next);
    set({ mode });
    if (mode === "ollama") void get().checkOllama();
  },

  setBaseUrl: (baseUrl) => {
    persist({ ...get(), baseUrl });
    set({ baseUrl });
  },

  setModel: (model) => {
    persist({ ...get(), model });
    set({ model });
  },

  checkOllama: async () => {
    set({ status: "checking" });
    const { baseUrl, model } = get();
    const provider = new LocalOllamaProvider({ baseUrl, model });
    const ok = await provider.isAvailable();
    set({ status: ok ? "online" : "offline" });
    return ok;
  },

  resolveProvider: async () => {
    const { mode, baseUrl, model } = get();
    if (mode === "mock") return mock;
    const provider = new LocalOllamaProvider({ baseUrl, model });
    const ok = await provider.isAvailable();
    set({ status: ok ? "online" : "offline" });
    return ok ? provider : mock; // fallback gentil
  },
}));

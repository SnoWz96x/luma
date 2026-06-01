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
  /** tags de modelos instalados no Ollama (Model Manager) */
  installed: string[];
  /** RAM total detectada em GB (navigator.deviceMemory; fallback 8) */
  ramGb: number;
  setMode: (mode: AIMode) => void;
  setBaseUrl: (url: string) => void;
  setModel: (model: string) => void;
  /** testa conexão com o Ollama e atualiza o status */
  checkOllama: () => Promise<boolean>;
  /** lê os modelos instalados (/api/tags) e atualiza `installed` */
  refreshModels: () => Promise<void>;
  /**
   * Devolve o provider a usar agora. Se o modo for Ollama mas estiver offline,
   * cai no Mock automaticamente (o chat nunca quebra).
   */
  resolveProvider: () => Promise<AIProvider>;
}

/** RAM aproximada do dispositivo (Chromium expõe deviceMemory; senão 8). */
function detectRamGb(): number {
  const dm = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  return typeof dm === "number" && dm > 0 ? dm : 8;
}

export const useAiStore = create<AIStore>((set, get) => ({
  ...load(),
  status: "unknown",
  installed: [],
  ramGb: detectRamGb(),

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
    if (ok) void get().refreshModels();
    return ok;
  },

  refreshModels: async () => {
    try {
      const res = await fetch(`${get().baseUrl}/api/tags`);
      if (!res.ok) return;
      const data = (await res.json()) as { models?: { name: string }[] };
      const tags = (data.models ?? []).map((m) => m.name);
      set({ installed: tags });
    } catch {
      /* offline — mantém lista atual */
    }
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

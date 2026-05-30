// App store — fluxo geral (onboarding -> casa) e personagem adotado.
import { create } from "zustand";

export type AppPhase = "onboarding" | "home";

interface AppStore {
  phase: AppPhase;
  adoptedDefId: string | null;
  petName: string;
  adopt: (defId: string, name: string) => void;
  reset: () => void;
}

const LS_KEY = "luma.adoption";

function loadAdoption(): { defId: string; name: string } | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as { defId: string; name: string }) : null;
  } catch {
    return null;
  }
}

const saved = loadAdoption();

export const useAppStore = create<AppStore>((set) => ({
  phase: saved ? "home" : "onboarding",
  adoptedDefId: saved?.defId ?? null,
  petName: saved?.name ?? "",

  adopt: (defId, name) => {
    const clean = name.trim() || "Luma";
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ defId, name: clean }));
    } catch {
      /* ignore */
    }
    set({ phase: "home", adoptedDefId: defId, petName: clean });
  },

  reset: () => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      /* ignore */
    }
    set({ phase: "onboarding", adoptedDefId: null, petName: "" });
  },
}));

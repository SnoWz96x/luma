// App store — fluxo geral (onboarding -> eclosão -> casa) e personagem adotado.
import { create } from "zustand";
import { kvGet, kvSet, kvRemove } from "../repositories";

export type AppPhase = "onboarding" | "home";

interface Saved {
  defId: string;
  name: string;
  hatched: boolean;
}

interface AppStore {
  phase: AppPhase;
  adoptedDefId: string | null;
  petName: string;
  /** o ovo já chocou? (ritual de nascimento) */
  hatched: boolean;
  adopt: (defId: string, name: string) => void;
  hatch: () => void;
  reset: () => void;
}

const LS_KEY = "luma.adoption";

function loadAdoption(): Saved | null {
  try {
    const raw = kvGet(LS_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Partial<Saved>;
    if (!p.defId) return null;
    return {
      defId: p.defId,
      name: p.name ?? "Luma",
      hatched: p.hatched ?? false,
    };
  } catch {
    return null;
  }
}

function persist(s: Saved) {
  try {
    kvSet(LS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

const saved = loadAdoption();

export const useAppStore = create<AppStore>((set, get) => ({
  phase: saved ? "home" : "onboarding",
  adoptedDefId: saved?.defId ?? null,
  petName: saved?.name ?? "",
  hatched: saved?.hatched ?? false,

  adopt: (defId, name) => {
    const clean = name.trim() || "Luma";
    // ao adotar, começa como OVO ainda não chocado (ritual de nascimento)
    persist({ defId, name: clean, hatched: false });
    set({ phase: "home", adoptedDefId: defId, petName: clean, hatched: false });
  },

  hatch: () => {
    const { adoptedDefId, petName } = get();
    if (adoptedDefId)
      persist({ defId: adoptedDefId, name: petName, hatched: true });
    set({ hatched: true });
  },

  reset: () => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      /* ignore */
    }
    set({
      phase: "onboarding",
      adoptedDefId: null,
      petName: "",
      hatched: false,
    });
  },
}));

// Support store — contatos de confiança + preferências de emergência. Opt-in.
// Persiste em localStorage. Privacidade: dados do usuário, apagáveis.
import { create } from "zustand";
import { DEFAULT_EMERGENCY_PREFS } from "@luma/core";
import type { SupportContact, EmergencyPreferences } from "@luma/shared";
import { kvGet, kvSet } from "../repositories";

const LS_KEY = "luma.support";

interface Persisted {
  contacts: SupportContact[];
  prefs: EmergencyPreferences;
  country: string;
}

function load(): Persisted {
  try {
    const raw = kvGet(LS_KEY);
    if (raw) return JSON.parse(raw) as Persisted;
  } catch {
    /* ignore */
  }
  return { contacts: [], prefs: DEFAULT_EMERGENCY_PREFS, country: "BR" };
}

function persist(p: Persisted) {
  try {
    kvSet(LS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

interface SupportStore extends Persisted {
  addContact: (c: Omit<SupportContact, "id">) => void;
  removeContact: (id: string) => void;
  setPrefs: (prefs: EmergencyPreferences) => void;
  setCountry: (country: string) => void;
}

export const useSupportStore = create<SupportStore>((set, get) => {
  const initial = load();

  function commit(patch: Partial<Persisted>) {
    const next = { ...get(), ...patch };
    const data: Persisted = {
      contacts: next.contacts,
      prefs: next.prefs,
      country: next.country,
    };
    persist(data);
    set(data);
  }

  return {
    ...initial,

    addContact: (c) =>
      commit({
        contacts: [...get().contacts, { ...c, id: `ct-${Date.now()}` }],
      }),

    removeContact: (id) =>
      commit({ contacts: get().contacts.filter((c) => c.id !== id) }),

    setPrefs: (prefs) => commit({ prefs }),

    setCountry: (country) => commit({ country }),
  };
});

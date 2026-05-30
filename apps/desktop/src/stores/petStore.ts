// Store do pet (Zustand). Orquestra a Tamagotchi Engine para a UI.
// A persistência (SQLite) será plugada via repositories; aqui mantemos o estado vivo.
import { create } from "zustand";
import {
  DEFAULT_STATE,
  tick,
  applyInteraction,
  toSensorySignals,
  type InteractionKind,
} from "@luma/core";
import { getCatalog } from "@luma/characters";
import type { CharacterDef, VitalState, SensorySignals } from "@luma/shared";
import { vitalStateRepo } from "../repositories";

// id da instância ativa do personagem (no MVP, um só por usuário local).
const ACTIVE_CHARACTER_ID = "active";

interface PetStore {
  character: CharacterDef;
  state: VitalState;
  lastTickAt: string;
  signals: SensorySignals;
  /** carrega o estado persistido (SQLite) ao iniciar */
  hydrate: () => Promise<void>;
  /** avança o tempo (decay/regen) e recomputa sinais sensoriais */
  runTick: () => void;
  /** aplica uma interação do usuário */
  interact: (kind: InteractionKind) => void;
  /** troca o personagem ativo */
  setCharacter: (id: string) => void;
}

const catalog = getCatalog();
const defaultChar = catalog.find((c) => c.id === "luma") ?? catalog[0]!;

export function findCharacter(id: string | null): CharacterDef {
  return catalog.find((c) => c.id === id) ?? defaultChar;
}

function recompute(state: VitalState): SensorySignals {
  return toSensorySignals(state);
}

export const usePetStore = create<PetStore>((set, get) => ({
  character: defaultChar,
  state: DEFAULT_STATE,
  lastTickAt: new Date().toISOString(),
  signals: recompute(DEFAULT_STATE),

  hydrate: async () => {
    const stored = await vitalStateRepo.get(ACTIVE_CHARACTER_ID);
    if (stored) {
      const { lastTickAt, ...vitals } = stored;
      const now = new Date().toISOString();
      const next = tick(vitals, lastTickAt, now);
      set({ state: next, lastTickAt: now, signals: recompute(next) });
      await vitalStateRepo.save(ACTIVE_CHARACTER_ID, next, now);
    }
  },

  runTick: () => {
    const now = new Date().toISOString();
    const { state, lastTickAt } = get();
    const next = tick(state, lastTickAt, now);
    set({ state: next, lastTickAt: now, signals: recompute(next) });
    void vitalStateRepo.save(ACTIVE_CHARACTER_ID, next, now);
  },

  interact: (kind) => {
    const next = applyInteraction(get().state, kind);
    const now = new Date().toISOString();
    set({ state: next, signals: recompute(next) });
    void vitalStateRepo.save(ACTIVE_CHARACTER_ID, next, now);
  },

  setCharacter: (id) => {
    const found = catalog.find((c) => c.id === id);
    if (found) set({ character: found });
  },
}));

export { catalog };

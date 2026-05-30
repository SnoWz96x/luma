// Habits store — hábitos do dia + fagulhas (moeda gentil). Persiste em localStorage.
import { create } from "zustand";
import {
  SEED_HABITS,
  completeHabit,
  habitProgress,
  doneCountToday,
} from "@luma/core";
import type { HabitLogEntry, HabitProgress } from "@luma/shared";

const LS_KEY = "luma.habits";
const today = () => new Date().toISOString().slice(0, 10);

interface Persisted {
  logs: HabitLogEntry[];
  sparks: number;
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as Persisted;
  } catch {
    /* ignore */
  }
  return { logs: [], sparks: 0 };
}

function persist(p: Persisted) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

interface HabitsStore extends Persisted {
  progress: () => HabitProgress[];
  doneToday: () => number;
  /** conclui um hábito; retorna fagulhas ganhas (0 se já feito) */
  complete: (habitId: string) => number;
  /** adiciona fagulhas (recompensa de mini-games) */
  addSparks: (amount: number) => void;
}

export const useHabitsStore = create<HabitsStore>((set, get) => {
  const initial = load();
  return {
    ...initial,

    progress: () => habitProgress(SEED_HABITS, get().logs, today()),
    doneToday: () => doneCountToday(get().logs, today()),

    complete: (habitId) => {
      const r = completeHabit(get().logs, habitId, today());
      if (!r.completed) return 0;
      const next = { logs: r.logs, sparks: get().sparks + r.reward };
      persist(next);
      set(next);
      return r.reward;
    },

    addSparks: (amount) => {
      const next = { logs: get().logs, sparks: get().sparks + amount };
      persist(next);
      set(next);
    },
  };
});

export { SEED_HABITS };

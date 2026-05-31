// Progress store — crescimento (Growth), conquistas (badges) e streak.
// Usa as engines puras do core; persiste em localStorage no MVP (SQLite depois).
import { create } from "zustand";
import {
  DEFAULT_GROWTH,
  DEFAULT_STREAK,
  addCare,
  addDay,
  advanceGrowth,
  unlockBadge,
  registerStreakDay,
  streakBadges,
  type CareEvent,
} from "@luma/core";
import type {
  GrowthState,
  StreakState,
  UnlockedBadge,
  UserTrait,
} from "@luma/shared";
import { kvGet, kvSet } from "../repositories";

const LS_KEY = "luma.progress";

interface Persisted {
  growth: GrowthState;
  streak: StreakState;
  badges: UnlockedBadge[];
  lastDay: string | null;
}

function load(): Persisted {
  try {
    const raw = kvGet(LS_KEY);
    if (raw) return JSON.parse(raw) as Persisted;
  } catch {
    /* ignore */
  }
  return {
    growth: DEFAULT_GROWTH,
    streak: DEFAULT_STREAK,
    badges: [],
    lastDay: null,
  };
}

function persist(p: Persisted) {
  kvSet(LS_KEY, JSON.stringify(p));
}

const today = () => new Date().toISOString().slice(0, 10);

interface ProgressStore extends Persisted {
  /** evento recém-desbloqueado para celebrar na UI (badge id) */
  justUnlocked: string | null;
  clearCelebration: () => void;
  /** registra cuidado (carinho/hábito/conversa) e avança crescimento */
  care: (event: CareEvent, traits?: UserTrait[]) => void;
  /** check-in diário: conta o dia, atualiza streak e badges */
  dailyCheckin: (traits?: UserTrait[]) => void;
  /** desbloqueia um badge manualmente (ex.: primeira conversa) */
  award: (badgeId: string) => void;
  /** DEMO: injeta convívio/cuidado para avançar um estágio na hora */
  demoGrow: (traits?: UserTrait[]) => void;
}

export const useProgressStore = create<ProgressStore>((set, get) => {
  const initial = load();

  function commit(next: Persisted, justUnlocked: string | null = null) {
    persist(next);
    set({ ...next, justUnlocked });
  }

  /** Aplica evolução e desbloqueia badges de marco; retorna o badge novo (se houver). */
  function withEvolutionBadges(
    growth: GrowthState,
    badges: UnlockedBadge[],
    evolved: boolean,
  ): { badges: UnlockedBadge[]; unlocked: string | null } {
    if (!evolved) return { badges, unlocked: null };
    let next = badges;
    let unlocked: string | null = null;
    const r1 = unlockBadge(next, "first_evolution");
    next = r1.list;
    if (r1.isNew) unlocked = "first_evolution";
    if (growth.stage === "adult") {
      const r2 = unlockBadge(next, "grown_up");
      next = r2.list;
      if (r2.isNew) unlocked = "grown_up";
    }
    return { badges: next, unlocked };
  }

  return {
    ...initial,
    justUnlocked: null,

    clearCelebration: () => set({ justUnlocked: null }),

    award: (badgeId) => {
      const { growth, streak, badges, lastDay } = get();
      const { list, isNew } = unlockBadge(badges, badgeId);
      if (isNew) commit({ growth, streak, badges: list, lastDay }, badgeId);
    },

    care: (event, traits = []) => {
      const { streak, badges, lastDay } = get();
      const adv = advanceGrowth(addCare(get().growth, event), traits);
      const b = withEvolutionBadges(adv.state, badges, adv.evolved);
      commit(
        { growth: adv.state, streak, badges: b.badges, lastDay },
        b.unlocked,
      );
    },

    demoGrow: (traits = []) => {
      const { streak, badges, lastDay } = get();
      // injeta convívio e cuidado fartos para garantir o próximo estágio
      let growth = {
        ...get().growth,
        daysTogether: get().growth.daysTogether + 14,
      };
      for (let i = 0; i < 80; i++) growth = addCare(growth, "interaction");
      const adv = advanceGrowth(growth, traits);
      const b = withEvolutionBadges(adv.state, badges, adv.evolved);
      commit(
        { growth: adv.state, streak, badges: b.badges, lastDay },
        b.unlocked,
      );
    },

    dailyCheckin: (traits = []) => {
      const t = today();
      const state = get();
      if (state.lastDay === t) return; // já fez hoje

      // +1 dia de convívio, cuidado de check-in, streak e crescimento
      let growth = addDay(state.growth);
      growth = addCare(growth, "checkin");
      const adv = advanceGrowth(growth, traits);
      growth = adv.state;

      const streakUpd = registerStreakDay(state.streak, t);

      // badges de hábito + marcos
      let badges = state.badges;
      let unlocked: string | null = null;
      for (const id of streakBadges(streakUpd.streak)) {
        const r = unlockBadge(badges, id);
        badges = r.list;
        if (r.isNew) unlocked = id;
      }
      if (growth.daysTogether >= 7) {
        const r = unlockBadge(badges, "first_week");
        badges = r.list;
        if (r.isNew) unlocked = "first_week";
      }
      const ev = withEvolutionBadges(growth, badges, adv.evolved);
      badges = ev.badges;
      if (ev.unlocked) unlocked = ev.unlocked;

      commit(
        { growth, streak: streakUpd.streak, badges, lastDay: t },
        unlocked,
      );
    },
  };
});

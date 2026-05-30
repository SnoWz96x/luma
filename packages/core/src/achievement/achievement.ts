// Achievement Engine — badges + streak com proteção gentil.
// Sem comparação social, sem expirar, sem punir (docs/12). PURO.
import type {
  BadgeDef,
  UnlockedBadge,
  StreakState,
} from "@luma/shared";

export const DEFAULT_STREAK: StreakState = {
  current: 0,
  best: 0,
  lastDate: null,
  freezes: 2, // começa com 2 "folgas" (streak freeze)
};

// Catálogo de badges. `secret` só aparece após desbloquear.
export const BADGES: BadgeDef[] = [
  { id: "first_meeting", title: "Primeiro encontro", description: "Você adotou seu companheiro.", emoji: "🥚", group: "bond" },
  { id: "first_week", title: "Uma semana juntos", description: "7 dias de convivência.", emoji: "🗓️", group: "bond" },
  { id: "first_talk", title: "Primeira conversa", description: "Vocês conversaram pela primeira vez.", emoji: "💬", group: "bond" },
  { id: "bonded", title: "Vínculo profundo", description: "Seu laço ficou forte.", emoji: "✨", group: "bond" },
  { id: "habit_3", title: "Constância", description: "3 dias seguidos de cuidado.", emoji: "🌱", group: "habit" },
  { id: "habit_7", title: "Semana firme", description: "7 dias seguidos de cuidado.", emoji: "🔥", group: "habit" },
  { id: "habit_30", title: "Um mês de cuidado", description: "30 dias de hábitos.", emoji: "🏵️", group: "habit" },
  { id: "first_evolution", title: "Primeira mudança", description: "Seu pet cresceu de estágio.", emoji: "🌟", group: "growth" },
  { id: "grown_up", title: "Crescido", description: "Seu pet chegou à fase adulta.", emoji: "🦋", group: "growth" },
  { id: "night_owl", title: "Coruja noturna", description: "Cuidou do pet tarde da noite.", emoji: "🌙", group: "discovery", secret: true },
];

const BADGE_INDEX = new Map(BADGES.map((b) => [b.id, b]));

export function getBadge(id: string): BadgeDef | undefined {
  return BADGE_INDEX.get(id);
}

/** Desbloqueia um badge se ainda não estiver desbloqueado. Idempotente. */
export function unlockBadge(
  unlocked: UnlockedBadge[],
  id: string,
  nowISO = new Date().toISOString(),
): { list: UnlockedBadge[]; isNew: boolean } {
  if (!BADGE_INDEX.has(id)) return { list: unlocked, isNew: false };
  if (unlocked.some((u) => u.id === id)) return { list: unlocked, isNew: false };
  return { list: [...unlocked, { id, unlockedAt: nowISO }], isNew: true };
}

// ---- Streak com proteção gentil ----

function daysBetween(a: string, b: string): number {
  const da = Date.parse(`${a}T00:00:00Z`);
  const db = Date.parse(`${b}T00:00:00Z`);
  return Math.round((db - da) / 86_400_000);
}

export interface StreakUpdate {
  streak: StreakState;
  /** quebrou e foi protegido por uma folga? */
  usedFreeze: boolean;
  /** a sequência cresceu hoje? */
  grew: boolean;
}

/**
 * Atualiza o streak com a data de hoje (YYYY-MM-DD).
 * - mesmo dia: sem mudança;
 * - dia seguinte: +1;
 * - pulou 1 dia mas tem folga: consome folga e mantém;
 * - pulou demais (sem folga): reinicia em 1, SEM drama (a UI deve acolher).
 */
export function registerStreakDay(
  streak: StreakState,
  today: string,
): StreakUpdate {
  if (streak.lastDate === null) {
    const s = { ...streak, current: 1, best: Math.max(1, streak.best), lastDate: today };
    return { streak: s, usedFreeze: false, grew: true };
  }
  const gap = daysBetween(streak.lastDate, today);

  if (gap <= 0) {
    return { streak, usedFreeze: false, grew: false };
  }
  if (gap === 1) {
    const current = streak.current + 1;
    return {
      streak: { ...streak, current, best: Math.max(current, streak.best), lastDate: today },
      usedFreeze: false,
      grew: true,
    };
  }
  // pulou (gap >= 2). Tenta usar UMA folga p/ cobrir o buraco de 1 dia.
  if (gap === 2 && streak.freezes > 0) {
    const current = streak.current + 1;
    return {
      streak: {
        ...streak,
        current,
        best: Math.max(current, streak.best),
        lastDate: today,
        freezes: streak.freezes - 1,
      },
      usedFreeze: true,
      grew: true,
    };
  }
  // sem folga suficiente: recomeça gentilmente
  return {
    streak: { ...streak, current: 1, lastDate: today },
    usedFreeze: false,
    grew: false,
  };
}

/** Badges de hábito desbloqueáveis a partir do streak atual. */
export function streakBadges(streak: StreakState): string[] {
  const ids: string[] = [];
  if (streak.best >= 3) ids.push("habit_3");
  if (streak.best >= 7) ids.push("habit_7");
  if (streak.best >= 30) ids.push("habit_30");
  return ids;
}

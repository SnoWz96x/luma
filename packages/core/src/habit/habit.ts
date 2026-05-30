// Habit Engine — hábitos gentis de autocuidado. PURO.
// Sem punição: não concluir não gera perda; concluir dá fagulhas + cuidado.
// Veja docs/14-ROADMAP-UNIFICADO.md e docs/11-CATALOGO-DE-FEATURES.md.
import type { HabitDef, HabitLogEntry, HabitProgress } from "@luma/shared";

// Hábitos-semente (curtos, gentis — inspirados no briefing).
export const SEED_HABITS: HabitDef[] = [
  { id: "water", title: "Beber água", emoji: "💧", type: "habit", reward: 5 },
  { id: "breathe", title: "Respirar fundo", emoji: "🫁", type: "habit", reward: 5 },
  { id: "walk", title: "Dar uma caminhada", emoji: "🚶", type: "habit", reward: 8 },
  { id: "window", title: "Abrir a janela", emoji: "🪟", type: "habit", reward: 4 },
  { id: "tidy", title: "Organizar algo", emoji: "🧹", type: "habit", reward: 6 },
  { id: "write", title: "Escrever uma frase", emoji: "✍️", type: "habit", reward: 6 },
  { id: "reach_out", title: "Mandar mensagem a alguém", emoji: "💌", type: "mission", reward: 10 },
];

const habitIndex = new Map(SEED_HABITS.map((h) => [h.id, h]));

export function getHabit(id: string): HabitDef | undefined {
  return habitIndex.get(id);
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000,
  );
}

/** Streak de um hábito a partir dos logs (dias consecutivos até `today`). */
export function habitStreak(
  logs: HabitLogEntry[],
  habitId: string,
  today: string,
): number {
  const dates = logs
    .filter((l) => l.habitId === habitId)
    .map((l) => l.date)
    .sort()
    .reverse();
  if (!dates.length) return 0;

  // só conta se o último foi hoje ou ontem (senão a sequência quebrou)
  const gapFromToday = daysBetween(dates[0]!, today);
  if (gapFromToday > 1) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    if (daysBetween(dates[i]!, dates[i - 1]!) === 1) streak++;
    else break;
  }
  return streak;
}

export function isDoneToday(
  logs: HabitLogEntry[],
  habitId: string,
  today: string,
): boolean {
  return logs.some((l) => l.habitId === habitId && l.date === today);
}

/** Monta o progresso de todos os hábitos para a UI. */
export function habitProgress(
  defs: HabitDef[],
  logs: HabitLogEntry[],
  today: string,
): HabitProgress[] {
  return defs.map((def) => ({
    def,
    doneToday: isDoneToday(logs, def.id, today),
    streak: habitStreak(logs, def.id, today),
  }));
}

export interface CompleteResult {
  logs: HabitLogEntry[];
  /** fagulhas ganhas (0 se já estava feito hoje) */
  reward: number;
  /** true se foi a primeira conclusão hoje */
  completed: boolean;
}

/** Conclui um hábito hoje (idempotente: repetir no mesmo dia não dá nada). */
export function completeHabit(
  logs: HabitLogEntry[],
  habitId: string,
  today: string,
): CompleteResult {
  const def = habitIndex.get(habitId);
  if (!def || isDoneToday(logs, habitId, today)) {
    return { logs, reward: 0, completed: false };
  }
  return {
    logs: [...logs, { habitId, date: today }],
    reward: def.reward,
    completed: true,
  };
}

/** Quantos hábitos foram concluídos hoje (para o check-in diário). */
export function doneCountToday(logs: HabitLogEntry[], today: string): number {
  return new Set(logs.filter((l) => l.date === today).map((l) => l.habitId)).size;
}

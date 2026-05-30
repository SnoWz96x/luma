// Hábitos e atividades. Veja docs/14-ROADMAP-UNIFICADO.md (Fase 3).

export type HabitType = "habit" | "mission" | "checkin";

export interface HabitDef {
  id: string;
  title: string;
  emoji: string;
  type: HabitType;
  /** recompensa em fagulhas (moeda gentil) ao concluir */
  reward: number;
}

export interface HabitLogEntry {
  habitId: string;
  date: string; // YYYY-MM-DD
}

/** Estado de um hábito num dia (derivado dos logs). */
export interface HabitProgress {
  def: HabitDef;
  doneToday: boolean;
  /** dias consecutivos concluídos */
  streak: number;
}

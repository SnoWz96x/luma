// Conquistas/badges e streaks. Veja docs/12. Sem comparação social, sem expirar.

export interface BadgeDef {
  id: string;
  title: string;
  description: string;
  emoji: string;
  /** categoria para agrupar na UI */
  group: "bond" | "habit" | "growth" | "discovery";
  /** conquista-surpresa (não aparece até desbloquear) */
  secret?: boolean;
}

export interface UnlockedBadge {
  id: string;
  unlockedAt: string;
}

export interface StreakState {
  /** dias consecutivos atuais */
  current: number;
  /** melhor sequência já alcançada */
  best: number;
  /** YYYY-MM-DD do último dia contado */
  lastDate: string | null;
  /** "folgas" disponíveis (streak freeze) — proteção gentil, sem punir */
  freezes: number;
}

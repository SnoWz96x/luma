// Activity Engine — mini-game de respiração guiada (autocuidado, cozy, sem
// game-over). PURO: define as fases; a UI anima e o pet "respira junto".
// Veja docs/14.

export type BreathPhase = "inhale" | "hold" | "exhale" | "rest";

export interface BreathStep {
  phase: BreathPhase;
  /** duração em segundos */
  seconds: number;
  /** instrução gentil mostrada ao usuário */
  label: string;
}

/** Um ciclo de respiração (inspira-segura-expira-descansa). */
export const BREATH_CYCLE: BreathStep[] = [
  { phase: "inhale", seconds: 4, label: "Inspire devagar…" },
  { phase: "hold", seconds: 4, label: "Segure com calma…" },
  { phase: "exhale", seconds: 6, label: "Expire soltando…" },
  { phase: "rest", seconds: 2, label: "Descanse…" },
];

export interface BreathingSession {
  cycles: number;
  steps: BreathStep[];
  totalSeconds: number;
  /** recompensa em fagulhas ao concluir */
  reward: number;
}

/** Cria uma sessão de respiração com N ciclos (padrão 3). */
export function createBreathingSession(cycles = 3): BreathingSession {
  const steps: BreathStep[] = [];
  for (let i = 0; i < cycles; i++) steps.push(...BREATH_CYCLE);
  const totalSeconds = steps.reduce((s, x) => s + x.seconds, 0);
  return { cycles, steps, totalSeconds, reward: 8 };
}

/** Escala da "bolha" 0..1 para uma fase (a UI interpola no tempo). */
export function bubbleScale(phase: BreathPhase): { from: number; to: number } {
  switch (phase) {
    case "inhale":
      return { from: 0.5, to: 1 };
    case "hold":
      return { from: 1, to: 1 };
    case "exhale":
      return { from: 1, to: 0.5 };
    case "rest":
      return { from: 0.5, to: 0.5 };
  }
}

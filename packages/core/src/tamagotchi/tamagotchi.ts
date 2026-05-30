// Tamagotchi Engine — estados vitais com decay/regen no tempo.
// PURO: sem I/O, sem framework. Recebe estado + tempo, devolve novo estado.
// Veja docs/01-ARQUITETURA.md (seções 6 e 7) e docs/03-BANCO-DE-DADOS.md.
import type { VitalState, VitalKey } from "@luma/shared";

export const DEFAULT_STATE: VitalState = {
  energy: 70,
  mood: 60,
  curiosity: 50,
  bond: 30,
  comfort: 60,
  trust: 30,
  sleep: 70,
  progress: 0,
};

const MIN = 0;
const MAX = 100;

export function clampVital(v: number): number {
  if (v < MIN) return MIN;
  if (v > MAX) return MAX;
  return Math.round(v);
}

/**
 * Deriva por hora de cada vital quando o pet é deixado por conta própria.
 * Positivo = recupera; negativo = decai. Vitais sociais (bond/trust/progress)
 * NÃO decaem com o tempo — só mudam por interação (e jamais punem ausência).
 */
const DRIFT_PER_HOUR: Record<VitalKey, number> = {
  energy: -4, // cansa
  mood: -2, // sem estímulo, esmorece um pouco (nunca a zero por ausência)
  curiosity: +3, // acumula vontade de explorar
  sleep: -3, // acumula sono enquanto acordado
  comfort: -1,
  bond: 0,
  trust: 0,
  progress: 0,
};

/** Piso de humor por ausência: saudade leve, nunca tristeza extrema (Safety). */
const MOOD_FLOOR_ON_ABSENCE = 35;

export interface TickOptions {
  /** limita o salto em horas (ex.: voltar após dias não detona o pet) */
  maxHours?: number;
}

/**
 * Avança o estado do tempo `lastTickAt` até `now`.
 * Retorna o novo estado (não muta o input).
 */
export function tick(
  state: VitalState,
  lastTickAtISO: string,
  nowISO: string,
  opts: TickOptions = {},
): VitalState {
  const last = Date.parse(lastTickAtISO);
  const now = Date.parse(nowISO);
  if (!Number.isFinite(last) || !Number.isFinite(now) || now <= last) {
    return { ...state };
  }
  const maxHours = opts.maxHours ?? 24;
  const hours = Math.min((now - last) / 3_600_000, maxHours);

  const next: VitalState = { ...state };
  for (const key of Object.keys(DRIFT_PER_HOUR) as VitalKey[]) {
    const drift = DRIFT_PER_HOUR[key] * hours;
    if (drift === 0) continue;
    let v = state[key] + drift;
    if (key === "mood" && v < MOOD_FLOOR_ON_ABSENCE) v = MOOD_FLOOR_ON_ABSENCE;
    next[key] = clampVital(v);
  }
  return next;
}

export type InteractionKind =
  | "talk" // conversar
  | "play" // brincar
  | "rest" // descansar/dormir
  | "comfort" // aconchego
  | "checkin"; // check-in/hábito cumprido

const INTERACTION_DELTAS: Record<InteractionKind, Partial<VitalState>> = {
  talk: { mood: +6, bond: +3, curiosity: -4, trust: +2 },
  play: { mood: +8, energy: -6, curiosity: +5, bond: +2 },
  rest: { sleep: +25, energy: +20, comfort: +6 },
  comfort: { comfort: +12, mood: +5, trust: +3 },
  checkin: { mood: +4, progress: +5, bond: +2 },
};

/** Aplica uma interação. Não muta o input. */
export function applyInteraction(
  state: VitalState,
  kind: InteractionKind,
): VitalState {
  const deltas = INTERACTION_DELTAS[kind];
  const next: VitalState = { ...state };
  for (const k of Object.keys(deltas) as VitalKey[]) {
    next[k] = clampVital(state[k] + (deltas[k] ?? 0));
  }
  return next;
}

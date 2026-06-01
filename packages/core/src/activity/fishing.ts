// Activity Engine v2 — minigame de pescaria cozy. PURO e determinístico.
// Sem game-over: o tempo de espera e o que se pesca são decididos por lógica
// testável; a UI só anima o lançar/fisgar. Recompensa em fagulhas + item.
// Veja docs/00-IMPLEMENTATION-PLAN.md (Sprint D) e docs/11-CATALOGO-DE-FEATURES.md.

export type CatchKind = "fish" | "boot" | "star" | "treasure";

export interface CatchResult {
  kind: CatchKind;
  label: string;
  emoji: string;
  /** fagulhas ganhas */
  reward: number;
}

const TABLE: { kind: CatchKind; label: string; emoji: string; reward: number; weight: number }[] = [
  { kind: "fish", label: "Peixinho", emoji: "🐟", reward: 4, weight: 55 },
  { kind: "boot", label: "Bota velha", emoji: "🥾", reward: 1, weight: 18 },
  { kind: "star", label: "Estrela-do-mar", emoji: "⭐", reward: 7, weight: 20 },
  { kind: "treasure", label: "Tesourinho", emoji: "💎", reward: 15, weight: 7 },
];

// RNG determinístico (mulberry32) — mesma seed, mesmo resultado (testável).
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Tempo de espera até "fisgar" (ms), entre 1.2s e 4s. */
export function biteDelay(seed: number): number {
  const r = rng(seed)();
  return Math.round(1200 + r * 2800);
}

/** Decide o que foi pescado pela tabela ponderada. Determinístico por seed. */
export function castLine(seed: number): CatchResult {
  const r = rng(seed ^ 0x9e3779b9)();
  const total = TABLE.reduce((s, x) => s + x.weight, 0);
  let roll = r * total;
  for (const t of TABLE) {
    if ((roll -= t.weight) <= 0) {
      return { kind: t.kind, label: t.label, emoji: t.emoji, reward: t.reward };
    }
  }
  const last = TABLE[0]!;
  return { kind: last.kind, label: last.label, emoji: last.emoji, reward: last.reward };
}

export const FISHING_CATCHES = TABLE.map((t) => t.kind);

// World Engine — o "mundo espelho": a jornada do usuário vira paisagem.
// PURO e determinístico. SEM números: o progresso é SENTIDO (flores, árvores,
// vaga-lumes, estrelas, pontes). Veja docs/01-ARQUITETURA.md e docs/14.
import type { WorldElement, WorldElementKind } from "@luma/shared";

/** Sinais da jornada que alimentam o mundo (todos derivados de outras engines). */
export interface JourneyInput {
  /** dias positivos (humor bom) -> flores */
  positiveDays: number;
  /** hábitos concluídos (acumulado) -> construções/brotos */
  habitsDone: number;
  /** amizade 0..100 -> árvores */
  friendship: number;
  /** nº de memórias importantes -> estrelas */
  memories: number;
  /** nº de conversas/mensagens -> vaga-lumes */
  conversations: number;
  /** metas/marcos atingidos -> pontes */
  milestones: number;
}

// Quantos elementos de cada tipo a jornada gera (com tetos suaves p/ não poluir).
function counts(j: JourneyInput): Record<WorldElementKind, number> {
  return {
    flower: Math.min(j.positiveDays, 24),
    building: Math.min(Math.floor(j.habitsDone / 3), 12),
    tree: Math.min(Math.floor(j.friendship / 12), 8),
    star: Math.min(j.memories, 30),
    firefly: Math.min(Math.floor(j.conversations / 2), 20),
    bridge: Math.min(j.milestones, 5),
  };
}

// RNG determinístico (mulberry32) — mesma jornada gera o mesmo mundo.
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

// Faixa vertical (0..1) onde cada tipo "vive" na cena.
const BAND: Record<WorldElementKind, [number, number]> = {
  star: [0.05, 0.35], // céu
  firefly: [0.25, 0.6], // ar
  bridge: [0.55, 0.7], // meio
  tree: [0.45, 0.7], // solo (fundo)
  building: [0.6, 0.78], // solo
  flower: [0.78, 0.95], // chão (frente)
};

const ORDER: WorldElementKind[] = [
  "star",
  "tree",
  "bridge",
  "building",
  "firefly",
  "flower",
];

/**
 * Gera os elementos do mundo espelho a partir da jornada.
 * Determinístico: mesma jornada + seed -> mesmas posições.
 */
export function buildWorld(j: JourneyInput, seed = 7): WorldElement[] {
  const r = rng(seed);
  const c = counts(j);
  const elements: WorldElement[] = [];

  for (const kind of ORDER) {
    const n = c[kind];
    const [top, bottom] = BAND[kind];
    for (let i = 0; i < n; i++) {
      // distribui no eixo X com leve jitter; Y dentro da faixa do tipo
      const x = ((i + 0.5) / n) * 0.9 + 0.05 + (r() - 0.5) * 0.06;
      const y = top + r() * (bottom - top);
      elements.push({
        id: `${kind}-${i}`,
        kind,
        x: Math.max(0.02, Math.min(0.98, x)),
        y: Math.max(0.02, Math.min(0.98, y)),
      });
    }
  }
  return elements;
}

/** Resumo gentil do mundo (texto, sem números) para a UI. */
export function describeWorld(j: JourneyInput): string {
  const parts: string[] = [];
  if (j.positiveDays > 0) parts.push("flores de dias bons");
  if (j.friendship >= 12) parts.push("árvores da nossa amizade");
  if (j.memories > 0) parts.push("estrelas de memórias");
  if (j.conversations > 0) parts.push("vaga-lumes das conversas");
  if (j.milestones > 0) parts.push("pontes das suas conquistas");
  if (!parts.length) return "Seu mundo está só começando. Vamos cultivá-lo juntos. 🌱";
  return `Seu mundo tem ${parts.join(", ")}.`;
}

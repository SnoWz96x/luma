// Memory tiers — recuperação por relevância com decaimento + orçamento de prompt.
// Adaptação enxuta (TS puro) do conceito MemGPT/Letta. Veja docs/12-MEMORY-RESEARCH.md.
// Determinístico e testável; sem embeddings/deps pesadas (offline-first).
import type { Memory } from "@luma/shared";

export type MemoryTier =
  | "short_term"
  | "long_term"
  | "emotional"
  | "relationship"
  | "world"
  | "milestone";

const DAY = 86_400_000;

/** Classifica uma memória num tier a partir de sua origem/emoção/importância. */
export function tierOf(m: Memory): MemoryTier {
  switch (m.source) {
    case "habit":
      return "milestone";
    case "mood":
      return "emotional";
    case "manual":
      return m.emotion ? "emotional" : "long_term";
    default:
      if (m.emotion) return "emotional";
      return m.importance >= 70 ? "long_term" : "short_term";
  }
}

/**
 * Pontuação de relevância = importância × decaimento temporal × bônus emocional.
 * Memórias-marco (milestone) decaem bem devagar (quase não esquecem).
 */
export function relevanceScore(m: Memory, nowISO: string): number {
  const ageDays = Math.max(
    0,
    (Date.parse(nowISO) - Date.parse(m.createdAt)) / DAY,
  );
  const tier = tierOf(m);
  // meia-vida por tier (em dias): marcos duram muito; short-term some rápido.
  const halfLife =
    tier === "milestone"
      ? 365
      : tier === "long_term"
        ? 120
        : tier === "relationship"
          ? 120
          : tier === "emotional"
            ? 60
            : tier === "world"
              ? 45
              : 14; // short_term
  const decay = Math.pow(0.5, ageDays / halfLife);
  const emotionalBonus = m.emotion ? 1.1 : 1;
  return m.importance * decay * emotionalBonus;
}

/** Top-N memórias por relevância (para caber no orçamento do prompt). */
export function recallRelevant(
  memories: Memory[],
  nowISO: string,
  limit = 8,
): Memory[] {
  return [...memories]
    .map((m) => ({ m, s: relevanceScore(m, nowISO) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.m);
}

/** Agrupa memórias por tier (para UI/depuração e resumos por camada). */
export function groupByTier(memories: Memory[]): Record<MemoryTier, Memory[]> {
  const groups: Record<MemoryTier, Memory[]> = {
    short_term: [],
    long_term: [],
    emotional: [],
    relationship: [],
    world: [],
    milestone: [],
  };
  for (const m of memories) groups[tierOf(m)].push(m);
  return groups;
}

/**
 * Decide quando comprimir o histórico: se passou de `maxTurns`, devolve os
 * turnos antigos a resumir (a compressão em si usa o provider de IA na app).
 */
export function turnsToSummarize<T>(turns: T[], maxTurns = 16, keepRecent = 8): T[] {
  if (turns.length <= maxTurns) return [];
  return turns.slice(0, turns.length - keepRecent);
}

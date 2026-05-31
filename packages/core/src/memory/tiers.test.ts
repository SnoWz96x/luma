import { describe, it, expect } from "vitest";
import {
  tierOf,
  relevanceScore,
  recallRelevant,
  groupByTier,
  turnsToSummarize,
} from "./tiers.js";
import type { Memory } from "@luma/shared";

const mk = (over: Partial<Memory>): Memory => ({
  id: Math.random().toString(36).slice(2),
  userId: "u",
  content: "x",
  importance: 50,
  source: "conversation",
  createdAt: "2026-05-01T00:00:00Z",
  ...over,
});

const NOW = "2026-05-31T00:00:00Z";

describe("tierOf", () => {
  it("hábito -> milestone", () => {
    expect(tierOf(mk({ source: "habit" }))).toBe("milestone");
  });
  it("mood -> emotional", () => {
    expect(tierOf(mk({ source: "mood" }))).toBe("emotional");
  });
  it("conversa importante -> long_term", () => {
    expect(tierOf(mk({ importance: 80 }))).toBe("long_term");
  });
  it("conversa com emoção -> emotional", () => {
    expect(tierOf(mk({ emotion: "happy" }))).toBe("emotional");
  });
  it("conversa trivial -> short_term", () => {
    expect(tierOf(mk({ importance: 30 }))).toBe("short_term");
  });
});

describe("relevanceScore (decaimento)", () => {
  it("memória recente vale mais que antiga (mesma importância)", () => {
    const recent = mk({ createdAt: "2026-05-30T00:00:00Z" });
    const old = mk({ createdAt: "2026-01-01T00:00:00Z" });
    expect(relevanceScore(recent, NOW)).toBeGreaterThan(relevanceScore(old, NOW));
  });

  it("marco decai bem mais devagar que conversa trivial", () => {
    const date = "2026-02-01T00:00:00Z";
    const milestone = mk({ source: "habit", importance: 80, createdAt: date });
    const trivial = mk({ importance: 80, createdAt: date });
    expect(relevanceScore(milestone, NOW)).toBeGreaterThan(
      relevanceScore(trivial, NOW),
    );
  });
});

describe("recallRelevant", () => {
  it("retorna os mais relevantes dentro do limite", () => {
    const mems = [
      mk({ importance: 90, createdAt: "2026-05-30T00:00:00Z", content: "a" }),
      mk({ importance: 20, createdAt: "2026-01-01T00:00:00Z", content: "b" }),
      mk({ importance: 60, createdAt: "2026-05-20T00:00:00Z", content: "c" }),
    ];
    const top = recallRelevant(mems, NOW, 2);
    expect(top).toHaveLength(2);
    expect(top[0]!.content).toBe("a");
  });
});

describe("groupByTier", () => {
  it("agrupa por camada", () => {
    const g = groupByTier([mk({ source: "habit" }), mk({ emotion: "sad" })]);
    expect(g.milestone).toHaveLength(1);
    expect(g.emotional).toHaveLength(1);
  });
});

describe("turnsToSummarize", () => {
  it("não resume se está dentro do limite", () => {
    expect(turnsToSummarize([1, 2, 3], 16, 8)).toEqual([]);
  });
  it("resume os antigos, mantém os recentes", () => {
    const turns = Array.from({ length: 20 }, (_, i) => i);
    const toSum = turnsToSummarize(turns, 16, 8);
    expect(toSum).toHaveLength(12);
    expect(toSum[0]).toBe(0);
    expect(toSum.at(-1)).toBe(11);
  });
});

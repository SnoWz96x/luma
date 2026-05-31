import { describe, it, expect } from "vitest";
import { currentChapter, unlockedChapters, TOTAL_CHAPTERS } from "./narrative.js";
import type { Relationship } from "@luma/shared";

const rel = (friendship: number): Relationship => ({
  id: "r", userId: "u", characterId: "c",
  friendship, trust: friendship, familiarity: friendship,
  sharedMemories: 0, sharedAdventures: 0,
  firstMetAt: "2026-01-01T00:00:00Z", totalTimeSeconds: 0,
});

describe("narrative", () => {
  it("começo no primeiro capítulo", () => {
    expect(currentChapter(rel(0)).id).toBe(0);
  });

  it("vínculo forte avança o capítulo", () => {
    expect(currentChapter(rel(90)).id).toBeGreaterThan(0);
  });

  it("desbloqueia capítulos cumulativamente", () => {
    const ch = unlockedChapters(rel(90));
    expect(ch.length).toBeGreaterThan(1);
    expect(ch[0]!.id).toBe(0);
  });

  it("não passa do total", () => {
    expect(unlockedChapters(rel(100)).length).toBeLessThanOrEqual(TOTAL_CHAPTERS);
  });

  it("todo capítulo tem título e texto", () => {
    for (const c of unlockedChapters(rel(100))) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.text.length).toBeGreaterThan(0);
    }
  });
});

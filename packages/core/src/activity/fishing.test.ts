import { describe, it, expect } from "vitest";
import { castLine, biteDelay, FISHING_CATCHES } from "./fishing.js";

describe("castLine", () => {
  it("é determinístico por seed", () => {
    expect(castLine(123)).toEqual(castLine(123));
  });

  it("sempre retorna um tipo válido com recompensa >= 0", () => {
    for (let s = 0; s < 50; s++) {
      const c = castLine(s);
      expect(FISHING_CATCHES).toContain(c.kind);
      expect(c.reward).toBeGreaterThanOrEqual(0);
      expect(c.emoji.length).toBeGreaterThan(0);
    }
  });

  it("peixe é o resultado mais comum numa amostra", () => {
    const counts: Record<string, number> = {};
    for (let s = 0; s < 400; s++) {
      const k = castLine(s).kind;
      counts[k] = (counts[k] ?? 0) + 1;
    }
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]![0];
    expect(top).toBe("fish");
  });

  it("tesouro dá mais fagulhas que peixe", () => {
    // encontra uma seed de cada (existem na amostra)
    let treasure = 0;
    let fish = 0;
    for (let s = 0; s < 400; s++) {
      const c = castLine(s);
      if (c.kind === "treasure") treasure = c.reward;
      if (c.kind === "fish") fish = c.reward;
    }
    expect(treasure).toBeGreaterThan(fish);
  });
});

describe("biteDelay", () => {
  it("fica entre 1.2s e 4s", () => {
    for (let s = 0; s < 30; s++) {
      const d = biteDelay(s);
      expect(d).toBeGreaterThanOrEqual(1200);
      expect(d).toBeLessThanOrEqual(4000);
    }
  });
  it("é determinístico", () => {
    expect(biteDelay(7)).toBe(biteDelay(7));
  });
});

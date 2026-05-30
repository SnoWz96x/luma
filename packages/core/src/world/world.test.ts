import { describe, it, expect } from "vitest";
import { buildWorld, describeWorld, type JourneyInput } from "./world.js";
import { buildConstellation } from "./constellation.js";
import type { Memory } from "@luma/shared";

const empty: JourneyInput = {
  positiveDays: 0, habitsDone: 0, friendship: 0,
  memories: 0, conversations: 0, milestones: 0,
};

const rich: JourneyInput = {
  positiveDays: 5, habitsDone: 9, friendship: 48,
  memories: 4, conversations: 8, milestones: 2,
};

describe("buildWorld", () => {
  it("mundo vazio não gera elementos", () => {
    expect(buildWorld(empty)).toHaveLength(0);
  });

  it("jornada rica gera vários tipos de elemento", () => {
    const kinds = new Set(buildWorld(rich).map((e) => e.kind));
    expect(kinds.has("flower")).toBe(true);
    expect(kinds.has("tree")).toBe(true);
    expect(kinds.has("star")).toBe(true);
    expect(kinds.has("firefly")).toBe(true);
    expect(kinds.has("bridge")).toBe(true);
  });

  it("posições ficam dentro da cena (0..1)", () => {
    for (const e of buildWorld(rich)) {
      expect(e.x).toBeGreaterThanOrEqual(0);
      expect(e.x).toBeLessThanOrEqual(1);
      expect(e.y).toBeGreaterThanOrEqual(0);
      expect(e.y).toBeLessThanOrEqual(1);
    }
  });

  it("é determinístico (mesma jornada -> mesmo mundo)", () => {
    expect(buildWorld(rich, 42)).toEqual(buildWorld(rich, 42));
  });

  it("estrelas ficam no céu (acima) e flores no chão (abaixo)", () => {
    const els = buildWorld(rich);
    const star = els.find((e) => e.kind === "star")!;
    const flower = els.find((e) => e.kind === "flower")!;
    expect(star.y).toBeLessThan(flower.y);
  });

  it("aplica tetos suaves (não polui a cena)", () => {
    const huge: JourneyInput = { ...rich, positiveDays: 999, conversations: 999 };
    const flowers = buildWorld(huge).filter((e) => e.kind === "flower");
    expect(flowers.length).toBeLessThanOrEqual(24);
  });
});

describe("describeWorld", () => {
  it("mundo vazio tem mensagem de começo", () => {
    expect(describeWorld(empty)).toContain("começando");
  });
  it("descreve elementos presentes", () => {
    expect(describeWorld(rich)).toContain("flores");
  });
});

describe("buildConstellation", () => {
  const mems: Memory[] = [
    { id: "m1", userId: "u", content: "Adora desenhar", importance: 80, source: "conversation", createdAt: "2026-01-01T00:00:00Z" },
    { id: "m2", userId: "u", content: "Passou na prova", importance: 50, source: "conversation", createdAt: "2026-02-01T00:00:00Z" },
  ];

  it("uma estrela por memória", () => {
    expect(buildConstellation(mems)).toHaveLength(2);
  });

  it("importância vira brilho", () => {
    const stars = buildConstellation(mems);
    const m1 = stars.find((s) => s.memoryId === "m1")!;
    const m2 = stars.find((s) => s.memoryId === "m2")!;
    expect(m1.brightness).toBeGreaterThan(m2.brightness);
  });

  it("posição estável por id", () => {
    expect(buildConstellation(mems)).toEqual(buildConstellation(mems));
  });
});

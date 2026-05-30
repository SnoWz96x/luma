import { describe, it, expect } from "vitest";
import { extractMemory, rankMemories, diaryMemory } from "./memory.js";
import type { Memory } from "@luma/shared";

describe("extractMemory", () => {
  it("memoriza fato pessoal (nome)", () => {
    const m = extractMemory("meu nome é Allan");
    expect(m).not.toBeNull();
    expect(m!.importance).toBeGreaterThanOrEqual(60);
  });

  it("memoriza preferência", () => {
    expect(extractMemory("eu adoro desenhar de madrugada")).not.toBeNull();
  });

  it("memoriza conquista", () => {
    expect(extractMemory("consegui terminar meu projeto hoje!")).not.toBeNull();
  });

  it("ignora conversa trivial", () => {
    expect(extractMemory("ok")).toBeNull();
    expect(extractMemory("aham, sei")).toBeNull();
  });

  it("emoção forte aumenta importância mesmo sem fato", () => {
    const neutral = extractMemory("estava chovendo lá fora");
    const emotional = extractMemory("estava chovendo lá fora", { emotion: "comfort" });
    expect(neutral).toBeNull();
    expect(emotional).not.toBeNull();
  });
});

describe("diaryMemory", () => {
  it("sempre memoriza uma entrada de diário (escolha do usuário)", () => {
    const m = diaryMemory("hoje o céu estava bonito");
    expect(m).not.toBeNull();
    expect(m!.source).toBe("manual");
    expect(m!.importance).toBeGreaterThanOrEqual(65);
  });

  it("emoção forte aumenta a importância", () => {
    const neutral = diaryMemory("um dia comum", { emotion: "ok" })!;
    const strong = diaryMemory("um dia comum", { emotion: "sad" })!;
    expect(strong.importance).toBeGreaterThan(neutral.importance);
  });

  it("ignora texto vazio", () => {
    expect(diaryMemory("  ")).toBeNull();
  });
});

describe("rankMemories", () => {
  const mk = (id: string, importance: number, createdAt: string): Memory => ({
    id, userId: "u1", content: id, importance, source: "conversation", createdAt,
  });

  it("ordena por importância e respeita o limite", () => {
    const list = [
      mk("a", 30, "2026-01-01T00:00:00Z"),
      mk("b", 90, "2026-01-01T00:00:00Z"),
      mk("c", 60, "2026-01-01T00:00:00Z"),
    ];
    const ranked = rankMemories(list, 2);
    expect(ranked.map((m) => m.id)).toEqual(["b", "c"]);
  });

  it("desempata pela mais recente", () => {
    const list = [
      mk("old", 50, "2026-01-01T00:00:00Z"),
      mk("new", 50, "2026-05-01T00:00:00Z"),
    ];
    expect(rankMemories(list)[0]!.id).toBe("new");
  });
});

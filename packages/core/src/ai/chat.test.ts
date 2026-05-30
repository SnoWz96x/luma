import { describe, it, expect } from "vitest";
import { MockProvider } from "./mockProvider.js";
import { talkToPet } from "./chatService.js";
import { buildSystemPrompt } from "./prompt.js";
import type { PromptContext, Relationship, CharacterDef } from "@luma/shared";

// Personagem mínimo de teste (evita acoplar core a @luma/characters).
const character: CharacterDef = {
  id: "test", name: "Tiko", species: "estrelinha", category: "star",
  rarity: "common", biome: "ceu", archetype: "a guardiã gentil",
  personality: { traits: ["gentil", "calmo"], tone: "macio e sereno", energy: "calm" },
  story: "Tiko brilha junto de você.",
  phrases: { greeting: ["Oi"], idle: ["..."], happy: [":)"], sleepy: ["zzz"], missedYou: ["Que bom te ver de novo."], encourage: ["Bebe água?"] },
  emotions: ["happy", "calm"],
  preferences: { likes: ["noite"], dislikes: ["pressa"] },
  animations: { idle: "i", happy: "h", sleep: "s", curious: "c", comfort: "co" },
  evolution: { stages: [{ id: 0, name: "Faísca", visual: "v" }], triggers: [] },
};

const relationship: Relationship = {
  id: "r1", userId: "u1", characterId: "c1",
  friendship: 40, trust: 30, familiarity: 35,
  sharedMemories: 2, sharedAdventures: 1,
  firstMetAt: "2026-01-01T00:00:00Z", totalTimeSeconds: 3600,
};

const baseCtx: PromptContext = {
  profile: { userId: "u1", favoriteActivity: "desenhar" },
  traits: [{ trait: "creative", weight: 0.8 }, { trait: "calm", weight: 0.5 }],
  todayMood: { date: "2026-05-29", mood: "low" },
  relationship,
  memories: [
    { id: "m1", userId: "u1", content: "Adora desenhar à noite", importance: 70, source: "conversation", createdAt: "2026-05-01T00:00:00Z" },
  ],
  recentTurns: [],
  summaries: [],
  safetyFlags: [],
};

describe("buildSystemPrompt", () => {
  it("inclui persona, regras de segurança e memórias", () => {
    const p = buildSystemPrompt(character, baseCtx);
    expect(p).toContain(character.name);
    expect(p.toLowerCase()).toContain("nunca diagnostique");
    expect(p).toContain("Adora desenhar à noite");
  });

  it("reflete o humor do dia sem números", () => {
    const p = buildSystemPrompt(character, baseCtx);
    expect(p).toContain("difícil");
    expect(p).not.toMatch(/\bmood\b.*\d/);
  });
});

describe("talkToPet (fluxo com Safety)", () => {
  const provider = new MockProvider();

  it("responde a uma saudação", async () => {
    const r = await talkToPet({
      character, context: baseCtx, history: [],
      userMessage: "oi!", provider,
    });
    expect(r.reply.length).toBeGreaterThan(0);
  });

  it("em sinal de crise, oferece recursos reais", async () => {
    const r = await talkToPet({
      character, context: baseCtx, history: [],
      userMessage: "não quero mais viver", provider,
    });
    expect(r.offeredResources).toBe(true);
    expect(r.reply.toLowerCase()).toContain("apoio");
  });

  it("conversa normal não oferece recursos", async () => {
    const r = await talkToPet({
      character, context: baseCtx, history: [],
      userMessage: "hoje foi um dia bom", provider,
    });
    expect(r.offeredResources).toBe(false);
  });
});

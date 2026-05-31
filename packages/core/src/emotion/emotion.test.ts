import { describe, it, expect } from "vitest";
import {
  inferEmotion,
  emotionToToneHint,
  emotionToPetMood,
} from "./emotion.js";
import type { EmotionalSignals } from "@luma/shared";

const base: EmotionalSignals = {
  streak: 0,
  habitsToday: 0,
  friendship: 20,
};

describe("inferEmotion", () => {
  it("todos os sinais ficam em 0..1", () => {
    const ctx = inferEmotion({ ...base, mood: "sad", lastUserText: "to muito triste e sozinho" });
    for (const v of Object.values(ctx)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });

  it("dia ótimo + hábitos -> alta positividade e energia", () => {
    const ctx = inferEmotion({ ...base, mood: "great", habitsToday: 4, streak: 10 });
    expect(ctx.positivity).toBeGreaterThan(0.7);
    expect(ctx.energy).toBeGreaterThan(0.6);
  });

  it("humor triste + texto pesado -> mais estresse", () => {
    const low = inferEmotion({ ...base, mood: "sad", lastUserText: "to ansioso e cansado" });
    const ok = inferEmotion({ ...base, mood: "good" });
    expect(low.stress).toBeGreaterThan(ok.stress);
  });

  it("texto de solidão eleva a necessidade social", () => {
    const ctx = inferEmotion({ ...base, lastUserText: "queria conversar, me sinto sozinho" });
    expect(ctx.socialNeed).toBeGreaterThan(0.5);
  });

  it("streak longo aumenta a confiança", () => {
    const high = inferEmotion({ ...base, streak: 14, friendship: 80, mood: "good" });
    const low = inferEmotion({ ...base, streak: 0, friendship: 10, mood: "good" });
    expect(high.confidence).toBeGreaterThan(low.confidence);
  });

  it("é determinístico", () => {
    const s: EmotionalSignals = { ...base, mood: "ok", lastUserText: "oi" };
    expect(inferEmotion(s)).toEqual(inferEmotion(s));
  });

  it("sem dados -> neutro (perto de 0.5), sem extremos", () => {
    const ctx = inferEmotion(base);
    expect(ctx.positivity).toBeGreaterThan(0.3);
    expect(ctx.positivity).toBeLessThan(0.7);
  });
});

describe("emotionToToneHint (não-clínico)", () => {
  it("estresse alto sugere tom calmo", () => {
    const hint = emotionToToneHint(inferEmotion({ ...base, mood: "sad", lastUserText: "estressado" }));
    expect(hint.toLowerCase()).toMatch(/calmo|acolhedor/);
  });
  it("nunca contém linguagem clínica/diagnóstico", () => {
    const hint = emotionToToneHint(inferEmotion({ ...base, mood: "sad" }));
    expect(hint.toLowerCase()).not.toMatch(/depress|transtorno|diagn[oó]stic|ansiedade/);
  });
});

describe("emotionToPetMood", () => {
  it("clima leve -> happy", () => {
    expect(emotionToPetMood(inferEmotion({ ...base, mood: "great", habitsToday: 3 }))).toBe("happy");
  });
  it("dia difícil -> comfort", () => {
    expect(emotionToPetMood(inferEmotion({ ...base, mood: "sad" }))).toBe("comfort");
  });
});

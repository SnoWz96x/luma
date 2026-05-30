import { describe, it, expect } from "vitest";
import {
  createBreathingSession,
  bubbleScale,
  BREATH_CYCLE,
} from "./breathing.js";

describe("createBreathingSession", () => {
  it("gera N ciclos de respiração", () => {
    const s = createBreathingSession(3);
    expect(s.cycles).toBe(3);
    expect(s.steps).toHaveLength(BREATH_CYCLE.length * 3);
    expect(s.reward).toBeGreaterThan(0);
  });

  it("soma a duração total corretamente", () => {
    const s = createBreathingSession(1);
    const expected = BREATH_CYCLE.reduce((a, x) => a + x.seconds, 0);
    expect(s.totalSeconds).toBe(expected);
  });
});

describe("bubbleScale", () => {
  it("inspirar cresce a bolha", () => {
    const b = bubbleScale("inhale");
    expect(b.to).toBeGreaterThan(b.from);
  });
  it("expirar encolhe a bolha", () => {
    const b = bubbleScale("exhale");
    expect(b.to).toBeLessThan(b.from);
  });
});

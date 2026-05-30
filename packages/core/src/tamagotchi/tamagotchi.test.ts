import { describe, it, expect } from "vitest";
import {
  DEFAULT_STATE,
  tick,
  applyInteraction,
  clampVital,
} from "./tamagotchi.js";
import { toSensorySignals } from "./sensory.js";

const t0 = "2026-01-01T00:00:00.000Z";
const hoursLater = (h: number) =>
  new Date(Date.parse(t0) + h * 3_600_000).toISOString();

describe("clampVital", () => {
  it("mantém entre 0 e 100 e arredonda", () => {
    expect(clampVital(-5)).toBe(0);
    expect(clampVital(150)).toBe(100);
    expect(clampVital(42.6)).toBe(43);
  });
});

describe("tick (decay/regen)", () => {
  it("não muda se o tempo não avançou", () => {
    expect(tick(DEFAULT_STATE, t0, t0)).toEqual(DEFAULT_STATE);
  });

  it("energia e sono decaem com o tempo", () => {
    const s = tick(DEFAULT_STATE, t0, hoursLater(5));
    expect(s.energy).toBeLessThan(DEFAULT_STATE.energy);
    expect(s.sleep).toBeLessThan(DEFAULT_STATE.sleep);
  });

  it("curiosidade acumula com o tempo", () => {
    const s = tick(DEFAULT_STATE, t0, hoursLater(5));
    expect(s.curiosity).toBeGreaterThan(DEFAULT_STATE.curiosity);
  });

  it("vínculo/confiança NÃO decaem por ausência (sem punição)", () => {
    const s = tick(DEFAULT_STATE, t0, hoursLater(72));
    expect(s.bond).toBe(DEFAULT_STATE.bond);
    expect(s.trust).toBe(DEFAULT_STATE.trust);
  });

  it("humor tem piso na ausência: saudade leve, nunca tristeza extrema", () => {
    const s = tick(DEFAULT_STATE, t0, hoursLater(1000));
    expect(s.mood).toBeGreaterThanOrEqual(35);
  });

  it("respeita maxHours (voltar após dias não detona o pet)", () => {
    const long = tick(DEFAULT_STATE, t0, hoursLater(1000), { maxHours: 24 });
    const capped = tick(DEFAULT_STATE, t0, hoursLater(24), { maxHours: 24 });
    expect(long).toEqual(capped);
  });
});

describe("applyInteraction", () => {
  it("brincar melhora humor mas gasta energia", () => {
    const s = applyInteraction(DEFAULT_STATE, "play");
    expect(s.mood).toBeGreaterThan(DEFAULT_STATE.mood);
    expect(s.energy).toBeLessThan(DEFAULT_STATE.energy);
  });

  it("descansar recupera sono e energia", () => {
    const tired = { ...DEFAULT_STATE, sleep: 20, energy: 20 };
    const s = applyInteraction(tired, "rest");
    expect(s.sleep).toBeGreaterThan(tired.sleep);
    expect(s.energy).toBeGreaterThan(tired.energy);
  });

  it("não muta o estado original", () => {
    const snapshot = { ...DEFAULT_STATE };
    applyInteraction(DEFAULT_STATE, "talk");
    expect(DEFAULT_STATE).toEqual(snapshot);
  });
});

describe("toSensorySignals (sem barras)", () => {
  it("humor alto -> paleta quente e clima ensolarado", () => {
    const happy = { ...DEFAULT_STATE, mood: 90, energy: 80 };
    const sig = toSensorySignals(happy);
    expect(sig.palette).toBe("warm");
    expect(sig.weather).toBe("sunny");
    expect(sig.animation).toBe("happy");
  });

  it("sono/energia baixos -> animação de dormir e pouca luz", () => {
    const sleepy = { ...DEFAULT_STATE, sleep: 10, energy: 10 };
    const sig = toSensorySignals(sleepy);
    expect(sig.animation).toBe("sleep");
    expect(sig.light).toBeLessThan(0.4);
  });

  it("humor baixo -> clima de chuva suave e paleta fria", () => {
    const low = { ...DEFAULT_STATE, mood: 30 };
    const sig = toSensorySignals(low);
    expect(sig.weather).toBe("soft_rain");
    expect(sig.palette).toBe("cool");
  });

  it("vínculo alto -> proximidade alta", () => {
    const bonded = { ...DEFAULT_STATE, bond: 95 };
    expect(toSensorySignals(bonded).closeness).toBeGreaterThan(0.9);
  });
});

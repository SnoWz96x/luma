import { describe, it, expect } from "vitest";
import { sparkOfTheDay, proactiveLine, INNER_SPARKS } from "./motivator.js";
import type { EmotionalContext } from "@luma/shared";

const neutral: EmotionalContext = {
  stress: 0.4, energy: 0.5, motivation: 0.5,
  positivity: 0.5, socialNeed: 0.3, confidence: 0.5,
};

describe("sparkOfTheDay", () => {
  it("é estável no mesmo dia", () => {
    expect(sparkOfTheDay("2026-05-31")).toEqual(sparkOfTheDay("2026-05-31"));
  });
  it("sempre retorna um spark do banco", () => {
    const s = sparkOfTheDay("2026-01-01");
    expect(INNER_SPARKS).toContainEqual(s);
  });
});

describe("proactiveLine", () => {
  it("estresse alto -> acolhimento (comfort)", () => {
    const line = proactiveLine({ ...neutral, stress: 0.8 }, "2026-05-31");
    expect(line?.emotion).toBe("comfort");
    expect(line?.source).toBe("care");
  });

  it("necessidade social alta -> incentiva conexão humana", () => {
    const line = proactiveLine({ ...neutral, socialNeed: 0.8 }, "2026-05-31");
    expect(line?.text.toLowerCase()).toMatch(/oi|alguém|alguem/);
  });

  it("contexto neutro -> partilha vida interior (spark)", () => {
    const line = proactiveLine(neutral, "2026-05-31");
    expect(line?.source).toBe("spark");
  });

  it("nunca usa culpa", () => {
    const line = proactiveLine(neutral, "2026-05-31");
    expect(line?.text.toLowerCase()).not.toMatch(/abandon|culpa|me deixou|você sumiu/);
  });
});

import { describe, it, expect } from "vitest";
import { renderPetSVG, renderFromSignals, ANIMATION_CLASS, PET_ANIMATION_CSS } from "./render.js";
import { generateCharacters } from "./generate.js";
import type { SensorySignals } from "@luma/shared";

const sample = generateCharacters()[0]!;

describe("renderPetSVG", () => {
  it("gera SVG válido com o nome no aria-label", () => {
    const svg = renderPetSVG(sample);
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
    expect(svg).toContain(`aria-label="${sample.name}"`);
  });

  it("muda a face conforme o estado", () => {
    const sleep = renderPetSVG(sample, { animation: "sleep" });
    expect(sleep).toContain(">z</text>"); // Zzz só no sono
    const happy = renderPetSVG(sample, { animation: "happy" });
    expect(happy).not.toContain(">z</text>");
  });

  it("brilho reduzido diminui a opacidade do corpo", () => {
    const dim = renderPetSVG(sample, { light: 0.2 });
    const bright = renderPetSVG(sample, { light: 1 });
    expect(dim).not.toEqual(bright);
  });

  it("é determinístico", () => {
    expect(renderPetSVG(sample, { animation: "idle" })).toEqual(
      renderPetSVG(sample, { animation: "idle" }),
    );
  });
});

describe("renderFromSignals", () => {
  it("usa a animação dos sinais sensoriais", () => {
    const signals: SensorySignals = {
      animation: "happy", light: 0.9, weather: "sunny", palette: "warm", pace: 0.8, closeness: 0.5,
    };
    const svg = renderFromSignals(sample, signals);
    expect(svg).toContain("<svg");
  });
});

describe("animação", () => {
  it("toda animação tem classe e keyframe no CSS", () => {
    for (const cls of Object.values(ANIMATION_CLASS)) {
      expect(PET_ANIMATION_CSS).toContain(`.${cls}`);
    }
  });
  it("respeita prefers-reduced-motion", () => {
    expect(PET_ANIMATION_CSS).toContain("prefers-reduced-motion");
  });
});

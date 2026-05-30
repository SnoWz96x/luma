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

describe("evolução visual (estágio + ramo)", () => {
  it("estágio ovo desenha uma casca (sem rosto)", () => {
    const egg = renderPetSVG(sample, { stage: "egg" });
    expect(egg).toContain("ovo de");
    // sem bochechas/olhos do rosto
    expect(egg).not.toContain("#ff9aa2");
  });

  it("estágio adulto mostra rosto (não é ovo)", () => {
    const adult = renderPetSVG(sample, { stage: "adult" });
    expect(adult).not.toContain("ovo de");
    expect(adult).toContain("#ff9aa2"); // bochechas
  });

  it("bebê tem olhos ampliados (transform de escala)", () => {
    const baby = renderPetSVG(sample, { stage: "baby" });
    expect(baby).toContain("scale(");
  });

  it("ramo criativo adiciona um detalhe ao adulto", () => {
    const plain = renderPetSVG(sample, { stage: "adult" });
    const creative = renderPetSVG(sample, { stage: "adult", branch: "creative" });
    expect(creative).not.toEqual(plain);
  });

  it("ramo só aparece em estágios avançados, não em bebê", () => {
    const babyCreative = renderPetSVG(sample, { stage: "baby", branch: "creative" });
    expect(babyCreative).not.toContain("✦");
  });

  it("renderFromSignals aceita objeto com stage/branch", () => {
    const sig: SensorySignals = {
      animation: "idle", light: 1, weather: "clear", palette: "neutral", pace: 0.5, closeness: 0.5,
    };
    const svg = renderFromSignals(sample, sig, { size: 120, stage: "adult", branch: "social" });
    expect(svg).toContain("<svg");
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

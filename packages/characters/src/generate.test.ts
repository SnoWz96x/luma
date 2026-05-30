import { describe, it, expect } from "vitest";
import { generateCharacters } from "./generate.js";
import { characterDefSchema, catalogSchema } from "./schema.js";
import { CATEGORY_CONFIG } from "./data.js";

describe("generateCharacters", () => {
  const catalog = generateCharacters();

  it("gera 100 personagens", () => {
    expect(catalog).toHaveLength(100);
  });

  it("todos passam na validação zod", () => {
    expect(() => catalogSchema.parse(catalog)).not.toThrow();
    for (const c of catalog) {
      expect(() => characterDefSchema.parse(c)).not.toThrow();
    }
  });

  it("ids são únicos", () => {
    const ids = new Set(catalog.map((c) => c.id));
    expect(ids.size).toBe(catalog.length);
  });

  it("inclui os nomes pedidos no briefing", () => {
    const names = new Set(catalog.map((c) => c.name));
    for (const required of ["Luma", "Momo", "Nami", "Sprout", "Orbit", "Bibo", "Koko", "Tiko", "Vee", "Pingo"]) {
      expect(names.has(required)).toBe(true);
    }
  });

  it("cobre todas as 13 categorias", () => {
    const cats = new Set(catalog.map((c) => c.category));
    for (const cat of Object.keys(CATEGORY_CONFIG)) {
      expect(cats.has(cat as never)).toBe(true);
    }
  });

  it("é determinístico (mesma seed -> mesmo catálogo)", () => {
    expect(generateCharacters({ seed: 42 })).toEqual(generateCharacters({ seed: 42 }));
  });

  it("Safety: nenhuma frase de saudade usa culpa", () => {
    const guilt = /abandon|me deixou|você sumiu|culpa|me esqueceu/i;
    for (const c of catalog) {
      for (const phrase of c.phrases.missedYou) {
        expect(guilt.test(phrase)).toBe(false);
      }
    }
  });

  it("raridades seguem a curva (legendary é raro)", () => {
    const legendary = catalog.filter((c) => c.rarity === "legendary").length;
    const common = catalog.filter((c) => c.rarity === "common").length;
    expect(common).toBeGreaterThan(legendary);
  });
});

// @luma/characters — catálogo + gerador. Veja docs/05-CHARACTER-ENGINE.md
import type { CharacterDef } from "@luma/shared";
import { generateCharacters } from "./generate.js";
import { catalogSchema } from "./schema.js";

export * from "./generate.js";
export * from "./schema.js";
export * from "./render.js";

/** Catálogo validado (gerado de forma determinística). */
export function getCatalog(): CharacterDef[] {
  return catalogSchema.parse(generateCharacters());
}

export function getCharacterDef(id: string): CharacterDef | undefined {
  return getCatalog().find((c) => c.id === id);
}

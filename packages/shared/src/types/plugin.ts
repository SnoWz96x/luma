// Plugin Engine — manifestos que estendem o LUMA sem tocar no core.
// Veja docs/00-IMPLEMENTATION-PLAN.md (Sprint D) e docs/15-ARTE-PIPELINE-HIBRIDO.md.
// Tipos de plugin: pacotes de personagens, sprites (arte rica), biomas, eventos.

export type PluginKind = "character-pack" | "sprite-pack" | "biome" | "event";

export interface PluginManifest {
  /** id único do plugin (kebab-case) */
  id: string;
  kind: PluginKind;
  name: string;
  version: string;
  author?: string;
  /** licença do conteúdo (obrigatória p/ reuso; vai para o NOTICE) */
  license?: string;
  /** payload específico do tipo (validado pelo loader) */
  data: unknown;
}

/** Sprite rico de um personagem (camada 2 da arte híbrida). */
export interface SpriteEntry {
  /** id do personagem (CharacterDef.id) ao qual o sprite pertence */
  characterId: string;
  /** mapa estado->URL/asset (idle/happy/sleep/curious/comfort) */
  frames: Partial<Record<string, string>>;
}

export interface SpritePackData {
  sprites: SpriteEntry[];
}

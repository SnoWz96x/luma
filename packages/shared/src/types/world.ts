// Mundo espelho e itens. Veja docs/01-ARQUITETURA.md (World Engine)

export type Biome =
  | "room"
  | "garden"
  | "island"
  | "forest"
  | "library"
  | "space"
  | "aquarium"
  | "sky"
  | "house";

export type Weather = "clear" | "soft_rain" | "rain" | "stars" | "sunny";

/** Elementos do mundo espelho gerados pela jornada do usuário. */
export type WorldElementKind =
  | "flower" // dias positivos
  | "bridge" // metas
  | "tree" // amizades
  | "star" // memórias
  | "firefly" // conversas
  | "building"; // hábitos

export interface WorldElement {
  id: string;
  kind: WorldElementKind;
  x: number;
  y: number;
  sourceRef?: string; // memória/hábito/meta de origem
}

export interface WorldState {
  userId: string;
  activeBiome: Biome;
  weather: Weather;
  palette: "warm" | "neutral" | "cool";
  elements: WorldElement[];
}

export type ItemType =
  | "furniture"
  | "plant"
  | "clothing"
  | "effect"
  | "biome"
  | "sound"
  | "skin";

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: string;
  biome?: string;
  asset?: string;
}

// Tipos de personagem (catálogo + instância). Veja docs/05-CHARACTER-ENGINE.md

export type CharacterCategory =
  | "animal"
  | "robot"
  | "ghost"
  | "plant"
  | "dragon"
  | "alien"
  | "star"
  | "slime"
  | "cloud"
  | "mushroom"
  | "magical"
  | "monster"
  | "pixel-mascot"
  | "minimal-mascot";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type Emotion =
  | "happy"
  | "calm"
  | "curious"
  | "sleepy"
  | "comfort"
  | "sad"
  | "excited";

export interface CharacterPersonality {
  traits: string[];
  tone: string;
  energy: "calm" | "balanced" | "lively";
}

export interface CharacterPhrases {
  greeting: string[];
  idle: string[];
  happy: string[];
  sleepy: string[];
  /** SEM culpa. Ex.: "Que bom te ver de novo." */
  missedYou: string[];
  /** Incentivo a hábitos/conexão humana. */
  encourage: string[];
}

export interface EvolutionStage {
  id: number;
  name: string;
  visual: string;
}

export interface EvolutionTrigger {
  /** traço do usuário (user_traits) que ramifica a evolução */
  trait: string;
  minWeight: number;
  branch: string;
}

export interface CharacterDef {
  id: string;
  name: string;
  species: string;
  category: CharacterCategory;
  rarity: Rarity;
  biome: string;
  archetype: string;
  personality: CharacterPersonality;
  story: string;
  phrases: CharacterPhrases;
  emotions: Emotion[];
  preferences: { likes: string[]; dislikes: string[] };
  animations: {
    idle: string;
    happy: string;
    sleep: string;
    curious: string;
    comfort: string;
  };
  evolution: {
    stages: EvolutionStage[];
    triggers: EvolutionTrigger[];
  };
}

/** Instância adotada pelo usuário (tabela characters). */
export interface CharacterInstance {
  id: string;
  userId: string;
  defId: string;
  nickname?: string;
  evolutionStage: number;
  isActive: boolean;
  adoptedAt: string;
}

// Relacionamento. Veja docs/01-ARQUITETURA.md (Relationship Engine)

export interface Relationship {
  id: string;
  userId: string;
  characterId: string;
  friendship: number; // 0..100
  trust: number; // 0..100
  familiarity: number; // 0..100
  sharedMemories: number;
  sharedAdventures: number;
  firstMetAt: string;
  totalTimeSeconds: number;
}

/** Faixas qualitativas (NUNCA mostradas como número). */
export type RelationshipStage =
  | "stranger"
  | "acquaintance"
  | "friend"
  | "close"
  | "bonded";

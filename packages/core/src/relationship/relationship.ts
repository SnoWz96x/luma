// Relationship Engine — amizade, confiança, familiaridade evoluindo com o convívio.
// Veja docs/01-ARQUITETURA.md. PURO. Nunca pune ausência.
import type { Relationship, RelationshipStage } from "@luma/shared";
import type { InteractionKind } from "../tamagotchi/tamagotchi.js";

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

const DELTAS: Record<InteractionKind, Partial<Pick<Relationship, "friendship" | "trust" | "familiarity">>> = {
  talk: { friendship: 2, trust: 1, familiarity: 2 },
  play: { friendship: 3, familiarity: 1 },
  comfort: { trust: 3, friendship: 1 },
  rest: { familiarity: 1 },
  checkin: { friendship: 1, trust: 1 },
};

export interface ApplyInteractionResult {
  relationship: Relationship;
  /** subiu de estágio nesta interação? (para celebrar marcos) */
  stageUp: boolean;
}

export function applyRelationshipInteraction(
  rel: Relationship,
  kind: InteractionKind,
): ApplyInteractionResult {
  const before = relationshipStage(rel);
  const d = DELTAS[kind];
  const next: Relationship = {
    ...rel,
    friendship: clamp(rel.friendship + (d.friendship ?? 0)),
    trust: clamp(rel.trust + (d.trust ?? 0)),
    familiarity: clamp(rel.familiarity + (d.familiarity ?? 0)),
  };
  const after = relationshipStage(next);
  return { relationship: next, stageUp: STAGE_ORDER[after] > STAGE_ORDER[before] };
}

const STAGE_ORDER: Record<RelationshipStage, number> = {
  stranger: 0,
  acquaintance: 1,
  friend: 2,
  close: 3,
  bonded: 4,
};

/** Estágio qualitativo derivado das variáveis (NUNCA mostrado como número). */
export function relationshipStage(rel: Relationship): RelationshipStage {
  const score = rel.friendship * 0.5 + rel.trust * 0.3 + rel.familiarity * 0.2;
  if (score >= 80) return "bonded";
  if (score >= 55) return "close";
  if (score >= 30) return "friend";
  if (score >= 12) return "acquaintance";
  return "stranger";
}

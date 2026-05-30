// Rótulos qualitativos do relacionamento (NUNCA números — ver docs/01).
import type { Relationship } from "@luma/shared";
import { relationshipStage } from "@luma/core";

const LABEL: Record<string, { text: string; emoji: string }> = {
  stranger: { text: "Se conhecendo", emoji: "🌱" },
  acquaintance: { text: "Quebrando o gelo", emoji: "🌤️" },
  friend: { text: "Amigos", emoji: "💛" },
  close: { text: "Amigos próximos", emoji: "💗" },
  bonded: { text: "Vínculo profundo", emoji: "✨" },
};

export function relationshipLabel(rel: Relationship) {
  return LABEL[relationshipStage(rel)] ?? LABEL.stranger!;
}

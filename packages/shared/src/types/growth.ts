// Ciclo de vida e crescimento do pet. Veja docs/12-FEATURES-MERCADO-E-DIFERENCIAIS.md
// O estágio é SENTIDO (tamanho/proporção/detalhe), nunca uma barra de XP.

export type LifeStage = "egg" | "baby" | "child" | "teen" | "adult" | "elder";

export const LIFE_STAGE_ORDER: LifeStage[] = [
  "egg",
  "baby",
  "child",
  "teen",
  "adult",
  "elder",
];

/** Ramos de evolução guiados pelo estilo de vida do usuário (traços). */
export type EvolutionBranch =
  | "creative"
  | "adventurous"
  | "serene"
  | "social"
  | "balanced";

export interface GrowthState {
  stage: LifeStage;
  /** dias de convívio acumulados (entra na decisão de estágio) */
  daysTogether: number;
  /** pontos de cuidado acumulados (carinho/hábitos) — nunca decaem por ausência */
  carePoints: number;
  /** ramo de evolução escolhido ao virar teen/adult */
  branch: EvolutionBranch;
}

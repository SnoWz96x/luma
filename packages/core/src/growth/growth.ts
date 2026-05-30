// Growth Engine — estágios de vida (egg→elder) e ramo de evolução por estilo de
// vida. PURO. Nunca pune ausência: ausência só atrasa, jamais regride o estágio.
// Veja docs/12-FEATURES-MERCADO-E-DIFERENCIAIS.md.
import type {
  GrowthState,
  LifeStage,
  EvolutionBranch,
  UserTrait,
} from "@luma/shared";
import { LIFE_STAGE_ORDER } from "@luma/shared";

export const DEFAULT_GROWTH: GrowthState = {
  stage: "egg",
  daysTogether: 0,
  carePoints: 0,
  branch: "balanced",
};

// Requisitos por estágio: dias de convívio E pontos de cuidado (ambos).
// Care-quality (Digimon-like) sem punição: faltou cuidado → só demora mais.
const STAGE_REQUIREMENTS: Record<LifeStage, { days: number; care: number }> = {
  egg: { days: 0, care: 0 },
  baby: { days: 1, care: 5 },
  child: { days: 3, care: 25 },
  teen: { days: 7, care: 70 },
  adult: { days: 14, care: 150 },
  elder: { days: 60, care: 500 },
};

/** Pontos de cuidado por tipo de evento (carinho, hábito, conversa). */
export const CARE_POINTS = {
  interaction: 2,
  habitDone: 5,
  checkin: 3,
  dailyVisit: 1,
} as const;

export type CareEvent = keyof typeof CARE_POINTS;

/** Adiciona pontos de cuidado (acumulativo, nunca negativo). */
export function addCare(state: GrowthState, event: CareEvent): GrowthState {
  return { ...state, carePoints: state.carePoints + CARE_POINTS[event] };
}

/** Registra um novo dia de convívio. */
export function addDay(state: GrowthState): GrowthState {
  return { ...state, daysTogether: state.daysTogether + 1 };
}

/** Determina o estágio máximo alcançável com os requisitos atuais. */
export function eligibleStage(state: GrowthState): LifeStage {
  let result: LifeStage = "egg";
  for (const stage of LIFE_STAGE_ORDER) {
    const req = STAGE_REQUIREMENTS[stage];
    if (state.daysTogether >= req.days && state.carePoints >= req.care) {
      result = stage;
    }
  }
  return result;
}

/** Decide o ramo de evolução a partir dos traços do usuário (estilo de vida). */
export function decideBranch(traits: UserTrait[]): EvolutionBranch {
  if (!traits.length) return "balanced";
  const top = [...traits].sort((a, b) => b.weight - a.weight)[0]!;
  if (top.weight < 0.4) return "balanced";
  const map: Record<string, EvolutionBranch> = {
    creative: "creative",
    adventurous: "adventurous",
    calm: "serene",
    serene: "serene",
    social: "social",
  };
  return map[top.trait] ?? "balanced";
}

export interface GrowthAdvance {
  state: GrowthState;
  /** evoluiu de estágio agora? (para celebrar + gerar memória/badge) */
  evolved: boolean;
  /** estágio anterior, se evoluiu */
  from?: LifeStage;
}

/**
 * Aplica o crescimento: promove o estágio se elegível (monotônico — nunca volta)
 * e fixa o ramo de evolução ao chegar em teen.
 */
export function advanceGrowth(
  state: GrowthState,
  traits: UserTrait[] = [],
): GrowthAdvance {
  const target = eligibleStage(state);
  const curIdx = LIFE_STAGE_ORDER.indexOf(state.stage);
  const targetIdx = LIFE_STAGE_ORDER.indexOf(target);

  if (targetIdx <= curIdx) {
    return { state, evolved: false };
  }

  // ao alcançar teen pela primeira vez, define o ramo pelo estilo de vida
  const reachesTeen =
    targetIdx >= LIFE_STAGE_ORDER.indexOf("teen") &&
    curIdx < LIFE_STAGE_ORDER.indexOf("teen");
  const branch = reachesTeen ? decideBranch(traits) : state.branch;

  return {
    state: { ...state, stage: target, branch },
    evolved: true,
    from: state.stage,
  };
}

/** Multiplicador de tamanho do pet por estágio (o crescimento é SENTIDO). */
export function stageScale(stage: LifeStage): number {
  const scale: Record<LifeStage, number> = {
    egg: 0.7,
    baby: 0.78,
    child: 0.88,
    teen: 0.96,
    adult: 1,
    elder: 1,
  };
  return scale[stage];
}

/** Rótulo amigável do estágio (para a UI, sem números). */
export function stageLabel(stage: LifeStage): string {
  const label: Record<LifeStage, string> = {
    egg: "Ovo",
    baby: "Bebê",
    child: "Filhote",
    teen: "Jovem",
    adult: "Adulto",
    elder: "Sábio",
  };
  return label[stage];
}

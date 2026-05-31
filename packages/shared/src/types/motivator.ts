// System Motivator + Eventos + Narrativa. Veja docs/00-IMPLEMENTATION-PLAN.md (Sprint B).
// O pet tem vida interior (sonhos/curiosidades/objetivos) e fala proativamente —
// sempre gentil, opt-in, sem culpa (Safety Layer). Inspiração: AutoGen (agente com
// objetivos próprios) e Animal Crossing (eventos sazonais). Conceito, não código.

/** Tipo de impulso interno do pet. */
export type SparkKind = "dream" | "curiosity" | "goal" | "project";

export interface InnerSpark {
  id: string;
  kind: SparkKind;
  /** texto curto e fofo, em 1ª pessoa */
  text: string;
}

/** Fala proativa que o pet pode oferecer (a UI decide mostrar, opt-in). */
export interface ProactiveLine {
  text: string;
  /** emoção visual sugerida para acompanhar a fala */
  emotion: "happy" | "calm" | "curious" | "comfort";
  /** origem, para a UI/telemetria local */
  source: "spark" | "event" | "care" | "narrative";
}

// ---- Eventos sazonais ----
export type EventId =
  | "new_year"
  | "carnival"
  | "valentine_br" // Dia dos Namorados (BR, 12/06)
  | "winter"
  | "spring"
  | "halloween"
  | "christmas"
  | "user_birthday"
  | "pet_birthday";

export interface SeasonalEvent {
  id: EventId;
  name: string;
  emoji: string;
  /** saudação temática do pet */
  greeting: string;
  /** dica de clima/cena para o World Engine */
  weatherHint?: string;
}

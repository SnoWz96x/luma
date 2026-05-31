// Contexto emocional INFERIDO (sinais 0..1). NÃO é diagnóstico nem classificação
// clínica — apenas marcadores para ajustar o TOM do pet. Veja docs/07-SAFETY-LAYER.md
// e docs/00-IMPLEMENTATION-PLAN.md (Sprint A).

export interface EmotionalContext {
  /** tensão percebida (0 calmo .. 1 tenso) */
  stress: number;
  /** disposição/energia (0 esgotado .. 1 cheio de energia) */
  energy: number;
  /** vontade de agir/cuidar de si (0 .. 1) */
  motivation: number;
  /** clima emocional positivo (0 difícil .. 1 leve) */
  positivity: number;
  /** necessidade de conexão humana (0 .. 1) */
  socialNeed: number;
  /** autoconfiança percebida (0 .. 1) */
  confidence: number;
}

/** Sinais brutos que alimentam a inferência (todos já existem no app). */
export interface EmotionalSignals {
  /** humor do check-in do dia, se houver */
  mood?: import("./memory.js").MoodLabel;
  /** dias consecutivos de cuidado (streak) */
  streak: number;
  /** hábitos concluídos hoje */
  habitsToday: number;
  /** vínculo com o pet 0..100 */
  friendship: number;
  /** última fala do usuário (heurística de palavras — só TOM) */
  lastUserText?: string;
}

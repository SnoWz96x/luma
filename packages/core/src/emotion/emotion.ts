// Emotional Context Engine — infere sinais emocionais (0..1) a partir de dados
// que o app já tem. PURO e determinístico. NÃO diagnostica, NÃO rotula
// clinicamente: apenas ajusta o TOM do pet. Veja docs/00-IMPLEMENTATION-PLAN.md.
import type {
  EmotionalContext,
  EmotionalSignals,
  MoodLabel,
} from "@luma/shared";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// Humor do dia -> valência (0 difícil .. 1 leve).
const MOOD_VALENCE: Record<MoodLabel, number> = {
  great: 1,
  good: 0.75,
  ok: 0.5,
  low: 0.3,
  sad: 0.1,
};

// Palavras (sem acento) que sugerem TOM — heurística leve, jamais diagnóstico.
// Usam radicais (prefixos), por isso \b só no início (casa "cansado", "estressada").
const LOW_WORDS =
  /\b(triste|sozinh|cansad|exaust|sem forca|sem energia|dificil|pesad|ansios|preocupad|medo|estress)/;
const HIGH_WORDS =
  /\b(feliz|otim|alegr|animad|grato|orgulh|consegui|tranquil|leve|content)/;
const SOCIAL_WORDS =
  /\b(sozinh|saudade|ningu[eé]m|isolad|queria conversar|sem amigos)/;

function deburr(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Infere o contexto emocional. Combina humor do dia, streak, hábitos, vínculo e
 * uma heurística leve do texto. Defaults neutros (0.5) quando faltam dados.
 */
export function inferEmotion(signals: EmotionalSignals): EmotionalContext {
  const valence = signals.mood !== undefined ? MOOD_VALENCE[signals.mood] : 0.5;
  const habitFactor = clamp01(signals.habitsToday / 4); // 4+ hábitos = pleno
  const streakFactor = clamp01(signals.streak / 14); // 2 semanas = forte
  const bond = clamp01(signals.friendship / 100);

  const text = signals.lastUserText ? deburr(signals.lastUserText) : "";
  const lowHit = text && LOW_WORDS.test(text) ? 1 : 0;
  const highHit = text && HIGH_WORDS.test(text) ? 1 : 0;
  const socialHit = text && SOCIAL_WORDS.test(text) ? 1 : 0;

  // positividade: humor + texto
  const positivity = clamp01(valence * 0.8 + highHit * 0.2 - lowHit * 0.3);

  // energia: humor + hábitos − sinais de cansaço no texto
  const energy = clamp01(0.4 + valence * 0.3 + habitFactor * 0.3 - lowHit * 0.2);

  // estresse: inverso da valência + sinais no texto, suavizado pela rotina
  const stress = clamp01(
    (1 - valence) * 0.6 + lowHit * 0.3 - streakFactor * 0.2,
  );

  // motivação: hábitos + streak + valência
  const motivation = clamp01(
    habitFactor * 0.4 + streakFactor * 0.3 + valence * 0.3,
  );

  // necessidade social: sinais sociais no texto + humor baixo; vínculo com o pet
  // NÃO substitui conexão humana (Safety), então humor baixo aumenta a need.
  const socialNeed = clamp01(socialHit * 0.5 + (1 - valence) * 0.4 + 0.1);

  // confiança: streak + vínculo + valência
  const confidence = clamp01(
    streakFactor * 0.35 + bond * 0.25 + valence * 0.4,
  );

  return { stress, energy, motivation, positivity, socialNeed, confidence };
}

/**
 * Traduz o contexto emocional em uma DICA DE TOM curta para o system prompt.
 * Linguagem de cuidado, nunca clínica.
 */
export function emotionToToneHint(ctx: EmotionalContext): string {
  const hints: string[] = [];
  if (ctx.stress > 0.6) hints.push("a pessoa parece tensa — seja calmo e acolhedor");
  if (ctx.energy < 0.35) hints.push("a energia parece baixa — vá devagar, sem cobrar");
  if (ctx.positivity > 0.7) hints.push("o clima está leve — celebre junto, com leveza");
  if (ctx.socialNeed > 0.6)
    hints.push("valorize a conexão humana real, sem substituí-la");
  if (ctx.motivation > 0.7) hints.push("há disposição — incentive um pequeno passo");
  if (ctx.confidence < 0.35) hints.push("reforce gentilmente o que ela já conquistou");
  if (!hints.length) return "tom acolhedor e tranquilo, no ritmo da pessoa";
  return hints.join("; ");
}

/** Sugere a emoção visual do pet a partir do contexto (para a cena reagir). */
export function emotionToPetMood(
  ctx: EmotionalContext,
): "happy" | "calm" | "comfort" | "curious" {
  if (ctx.positivity > 0.65 && ctx.energy > 0.5) return "happy";
  if (ctx.stress > 0.6 || ctx.positivity < 0.35) return "comfort";
  if (ctx.motivation > 0.65) return "curious";
  return "calm";
}

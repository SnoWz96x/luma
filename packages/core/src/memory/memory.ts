// Memory Engine — promoção de memórias importantes a partir das interações.
// A montagem de contexto (buildContext) é feita pela camada de aplicação, que lê
// os repositórios; aqui ficam as REGRAS puras de o que/quando memorizar.
// Veja docs/06-MEMORY-ENGINE.md.
import type { Memory, MemorySource } from "@luma/shared";

export interface MemoryCandidate {
  content: string;
  emotion?: string;
  importance: number; // 0..100
  source: MemorySource;
}

// Padrões que indicam fato pessoal compartilhado (vale memorizar).
const PERSONAL_FACT = [
  /\bmeu nome [ée]\s+([\p{L} ]{2,30})/iu,
  /\b(eu )?(gosto|amo|adoro|odeio|detesto)\s+(de\s+)?([\p{L} ]{2,40})/iu,
  /\b(meu|minha)\s+(anivers[áa]rio|trabalho|fam[íi]lia|amig[oa]|cachorro|gato|filh[oa])\b/iu,
  /\b(consegui|terminei|comecei|passei|me formei|fui promovid)\b/iu,
];

/**
 * Decide se a fala do usuário merece virar memória importante.
 * Retorna null quando não há nada digno de nota.
 */
export function extractMemory(
  userText: string,
  opts: { emotion?: string; sourceRef?: string } = {},
): MemoryCandidate | null {
  const text = userText.trim();
  if (text.length < 4) return null;

  const isFact = PERSONAL_FACT.some((re) => re.test(text));
  const strongEmotion =
    opts.emotion === "comfort" || opts.emotion === "happy" ? 15 : 0;

  if (!isFact && strongEmotion === 0) return null;

  const importance = Math.min(
    100,
    (isFact ? 60 : 40) + strongEmotion + Math.min(text.length / 10, 20),
  );

  return {
    content: text,
    ...(opts.emotion !== undefined ? { emotion: opts.emotion } : {}),
    importance: Math.round(importance),
    source: "conversation",
  };
}

/**
 * Cria uma memória a partir de uma entrada de diário (sempre memoriza — foi o
 * usuário que escolheu registrar). Importância base alta; sobe com emoção.
 */
export function diaryMemory(
  text: string,
  opts: { emotion?: string } = {},
): MemoryCandidate | null {
  const content = text.trim();
  if (content.length < 2) return null;
  const emotionBoost = opts.emotion === "great" || opts.emotion === "sad" ? 15 : 0;
  return {
    content,
    ...(opts.emotion !== undefined ? { emotion: opts.emotion } : {}),
    importance: Math.min(100, 65 + emotionBoost + Math.min(content.length / 12, 20)),
    source: "manual",
  };
}

/** Ordena memórias por relevância para caber no orçamento do prompt. */
export function rankMemories(memories: Memory[], limit = 8): Memory[] {
  return [...memories]
    .sort((a, b) => {
      if (b.importance !== a.importance) return b.importance - a.importance;
      return b.createdAt.localeCompare(a.createdAt); // mais recente desempata
    })
    .slice(0, limit);
}

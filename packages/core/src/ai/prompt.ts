// Prompt builder — monta o system prompt a partir da persona + contexto + safety.
// O VALOR está aqui (memória/contexto/relação), não no modelo. Veja docs/06.
import type { CharacterDef, PromptContext } from "@luma/shared";
import { SAFETY_SYSTEM_RULES } from "../safety/safety.js";
import { relationshipStage } from "../relationship/relationship.js";

/** Descrição qualitativa do humor do dia (sem números). */
function moodPhrase(ctx: PromptContext): string {
  const m = ctx.todayMood?.mood;
  if (!m) return "ainda não sei como foi o dia dele(a) hoje";
  const map: Record<string, string> = {
    great: "o dia dele(a) foi ótimo",
    good: "o dia dele(a) foi bom",
    ok: "o dia dele(a) foi normal",
    low: "o dia dele(a) foi meio difícil",
    sad: "o dia dele(a) foi pesado",
  };
  return map[m] ?? "o dia dele(a) foi normal";
}

function traitsPhrase(ctx: PromptContext): string {
  const top = [...ctx.traits]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((t) => t.trait);
  return top.length ? `Parece gostar de: ${top.join(", ")}.` : "";
}

function memoriesBlock(ctx: PromptContext): string {
  if (!ctx.memories.length) return "";
  const items = ctx.memories
    .slice(0, 8)
    .map((m) => `- ${m.content}`)
    .join("\n");
  return `O que você lembra sobre essa pessoa:\n${items}`;
}

/** Monta o system prompt completo (persona + regras de segurança + contexto). */
export function buildSystemPrompt(
  character: CharacterDef,
  ctx: PromptContext,
): string {
  const stage = relationshipStage(ctx.relationship);
  const stagePhrase: Record<string, string> = {
    stranger: "Vocês estão se conhecendo agora.",
    acquaintance: "Vocês já se conhecem um pouco.",
    friend: "Vocês são amigos.",
    close: "Vocês são amigos próximos.",
    bonded: "Vocês têm um vínculo forte e antigo.",
  };

  const personaTraits = character.personality.traits.join(", ");

  return [
    `Você é ${character.name}, ${character.species}. ${character.story}`,
    `Personalidade: ${personaTraits}. Tom: ${character.personality.tone}.`,
    `Fale em primeira pessoa, com frases curtas e calorosas. Em português do Brasil.`,
    `Use no máximo 2-3 frases por resposta.`,
    "",
    `REGRAS DE SEGURANÇA (inquebráveis): ${SAFETY_SYSTEM_RULES}`,
    "",
    `Sobre a pessoa com quem você fala:`,
    `${stagePhrase[stage]} Hoje, ${moodPhrase(ctx)}. ${traitsPhrase(ctx)}`,
    memoriesBlock(ctx),
  ]
    .filter(Boolean)
    .join("\n");
}

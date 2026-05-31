// System Motivator — vida interior do pet: sonhos, curiosidades, objetivos.
// PURO e determinístico (seleção por seed). Gera falas proativas GENTIS.
// Sempre incentiva autocuidado/conexão humana, nunca culpa (Safety Layer).
import type {
  InnerSpark,
  ProactiveLine,
  EmotionalContext,
} from "@luma/shared";

// Banco de impulsos internos (em 1ª pessoa, fofo). Adaptável por personagem depois.
export const INNER_SPARKS: InnerSpark[] = [
  { id: "d1", kind: "dream", text: "Sonhei que a gente via as estrelas juntos." },
  { id: "d2", kind: "dream", text: "Queria um dia ver o mar com você." },
  { id: "c1", kind: "curiosity", text: "Fiquei curioso: qual sua música favorita?" },
  { id: "c2", kind: "curiosity", text: "Será que hoje tem sol lá fora?" },
  { id: "g1", kind: "goal", text: "Hoje quero te ver sorrir pelo menos uma vez." },
  { id: "g2", kind: "goal", text: "Vamos beber água juntos hoje?" },
  { id: "p1", kind: "project", text: "Tô juntando vaga-lumes pro nosso mundo crescer." },
  { id: "p2", kind: "project", text: "Quero deixar nosso cantinho mais bonito com você." },
];

function seedFrom(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Escolhe um impulso interno do dia (estável por dia — não fica trocando). */
export function sparkOfTheDay(dateISO: string): InnerSpark {
  const idx = seedFrom(dateISO.slice(0, 10)) % INNER_SPARKS.length;
  return INNER_SPARKS[idx]!;
}

/**
 * Gera a fala proativa do pet a partir do contexto emocional + impulso do dia.
 * Prioriza acolhimento quando o contexto pede; senão, partilha a vida interior.
 * Retorna null se não for um bom momento para falar (ex.: contexto muito tenso
 * em que é melhor só acolher via chat).
 */
export function proactiveLine(
  ctx: EmotionalContext,
  dateISO: string,
): ProactiveLine | null {
  // estresse alto: uma palavra de acolhimento, sem cobrar nada
  if (ctx.stress > 0.7) {
    return {
      text: "Tô aqui com você, no seu tempo. Respira fundo comigo?",
      emotion: "comfort",
      source: "care",
    };
  }
  // necessidade social alta: incentiva conexão humana real (Safety)
  if (ctx.socialNeed > 0.7) {
    return {
      text: "Que tal mandar um oi pra alguém de quem você gosta hoje?",
      emotion: "calm",
      source: "care",
    };
  }
  // caso geral: partilha um impulso interno (sonho/curiosidade/objetivo)
  const spark = sparkOfTheDay(dateISO);
  const emotion = spark.kind === "curiosity" ? "curious" : "happy";
  return { text: spark.text, emotion, source: "spark" };
}

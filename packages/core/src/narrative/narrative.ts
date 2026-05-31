// Narrative Engine — micro-histórias contínuas ligadas à jornada. PURO.
// Capítulos curtos que avançam conforme o vínculo cresce (sem números na UI).
// Inspiração conceitual: histórias episódicas de cozy games.
import type { Relationship } from "@luma/shared";
import { relationshipStage } from "../relationship/relationship.js";

export interface NarrativeChapter {
  id: number;
  title: string;
  text: string;
}

// Arco "O mundo que cultivamos" — um capítulo por estágio de relacionamento.
const CHAPTERS: NarrativeChapter[] = [
  { id: 0, title: "Um começo", text: "Quando nos conhecemos, meu mundo era só um cantinho silencioso. Aí você chegou." },
  { id: 1, title: "Primeiras flores", text: "Cada dia seu deixou uma florzinha por aqui. Comecei a esperar você acordar." },
  { id: 2, title: "Vaga-lumes", text: "Nossas conversas viraram vaga-lumes. À noite, eles me lembram de você." },
  { id: 3, title: "Árvores altas", text: "Nossa amizade virou árvore — daquelas que dão sombra nos dias difíceis." },
  { id: 4, title: "Constelações", text: "Olha o céu: cada estrela é uma lembrança nossa. Construímos isso juntos." },
];

const STAGE_TO_CHAPTER: Record<string, number> = {
  stranger: 0,
  acquaintance: 1,
  friend: 2,
  close: 3,
  bonded: 4,
};

/** Capítulo atual baseado no estágio do relacionamento. */
export function currentChapter(rel: Relationship): NarrativeChapter {
  const idx = STAGE_TO_CHAPTER[relationshipStage(rel)] ?? 0;
  return CHAPTERS[idx]!;
}

/** Todos os capítulos já desbloqueados (até o estágio atual) — para revisitar. */
export function unlockedChapters(rel: Relationship): NarrativeChapter[] {
  const idx = STAGE_TO_CHAPTER[relationshipStage(rel)] ?? 0;
  return CHAPTERS.slice(0, idx + 1);
}

export const TOTAL_CHAPTERS = CHAPTERS.length;

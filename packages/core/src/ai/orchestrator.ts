// AI Orchestrator — catálogo de modelos locais + escolha do melhor por hardware.
// PURO e determinístico. A consulta ao Ollama (modelos instalados, RAM real) é
// feita pela app; aqui ficam os dados e a lógica de seleção. Veja docs/00-IMPLEMENTATION-PLAN.
import type { ModelInfo, ModelStatus } from "@luma/shared";

/** Modelos locais recomendados (todos rodam via Ollama, offline). */
export const MODEL_CATALOG: ModelInfo[] = [
  { id: "tinyllama", name: "TinyLlama", ramGb: 2, sizeGb: 0.6, quality: "basic", note: "Bem leve — roda em quase tudo." },
  { id: "gemma2:2b", name: "Gemma 2 (2B)", ramGb: 4, sizeGb: 1.6, quality: "good", note: "Leve e simpático." },
  { id: "phi3:mini", name: "Phi-3 Mini", ramGb: 4, sizeGb: 2.3, quality: "good", note: "Ótimo equilíbrio (padrão)." },
  { id: "llama3.2:3b", name: "Llama 3.2 (3B)", ramGb: 6, sizeGb: 2.0, quality: "good", note: "Conversa natural." },
  { id: "qwen2.5:3b", name: "Qwen 2.5 (3B)", ramGb: 6, sizeGb: 1.9, quality: "good", note: "Bom em português." },
  { id: "mistral", name: "Mistral 7B", ramGb: 8, sizeGb: 4.1, quality: "great", note: "Mais rico — pede mais RAM." },
];

const byId = new Map(MODEL_CATALOG.map((m) => [m.id, m]));

export function getModelInfo(id: string): ModelInfo | undefined {
  return byId.get(id);
}

const QUALITY_RANK: Record<ModelInfo["quality"], number> = {
  basic: 0,
  good: 1,
  great: 2,
};

export interface OrchestratorInput {
  /** RAM total detectada (GB). Se ausente, assume 8. */
  ramGb?: number;
  /** modelos já instalados no Ollama (tags) */
  installed?: string[];
}

/** Anota o catálogo com installed/fitsRam para a UI (Model Manager). */
export function describeModels(input: OrchestratorInput = {}): ModelStatus[] {
  const ram = input.ramGb ?? 8;
  const installed = new Set(input.installed ?? []);
  return MODEL_CATALOG.map((m) => ({
    ...m,
    installed: installed.has(m.id),
    fitsRam: m.ramGb <= ram,
  }));
}

/**
 * Escolhe o melhor modelo: maior qualidade que (1) já está instalado e (2) cabe
 * na RAM. Se nada instalado couber, recomenda o melhor que CABE (para baixar).
 * Se nada couber, devolve o mais leve. Determinístico.
 */
export function pickBestModel(input: OrchestratorInput = {}): {
  use: string | null; // instalado e pronto p/ usar agora
  recommend: string; // melhor escolha (baixar se != use)
  reason: string;
} {
  const ram = input.ramGb ?? 8;
  const installed = new Set(input.installed ?? []);

  const fits = MODEL_CATALOG.filter((m) => m.ramGb <= ram);
  const pool = fits.length ? fits : [MODEL_CATALOG[0]!]; // ao menos o mais leve

  const best = (list: ModelInfo[]) =>
    [...list].sort(
      (a, b) =>
        QUALITY_RANK[b.quality] - QUALITY_RANK[a.quality] || a.ramGb - b.ramGb,
    )[0]!;

  const recommend = best(pool);
  const installedFit = pool.filter((m) => installed.has(m.id));
  const use = installedFit.length ? best(installedFit).id : null;

  const reason = !fits.length
    ? "Pouca RAM detectada — sugerindo o modelo mais leve."
    : use
      ? "Usando o melhor modelo instalado que cabe na sua RAM."
      : `Recomendo baixar ${recommend.name} para a sua RAM.`;

  return { use, recommend: recommend.id, reason };
}

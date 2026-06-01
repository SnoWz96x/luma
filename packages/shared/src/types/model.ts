// Catálogo de modelos de IA local. Veja docs/00-IMPLEMENTATION-PLAN.md (Sprint C).
// Metadados ajudam o usuário e o Orchestrator a escolher por hardware.

export type ModelQuality = "basic" | "good" | "great";

export interface ModelInfo {
  /** tag do modelo no Ollama (ex.: "phi3:mini") */
  id: string;
  /** nome amigável */
  name: string;
  /** RAM recomendada em GB (mínimo confortável) */
  ramGb: number;
  /** tamanho aproximado do download em GB */
  sizeGb: number;
  /** qualidade subjetiva de conversa */
  quality: ModelQuality;
  /** descrição curta */
  note: string;
}

/** Estado de um modelo do ponto de vista do app. */
export interface ModelStatus extends ModelInfo {
  /** já está baixado no Ollama local? */
  installed: boolean;
  /** roda confortavelmente na RAM detectada? */
  fitsRam: boolean;
}

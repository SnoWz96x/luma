// Contrato do AI Engine. Veja docs/01-ARQUITETURA.md seção 5.
import type { PromptContext, ChatTurn } from "../types/memory.js";

export interface GenerateRequest {
  /** system prompt = persona do personagem + regras da Safety Layer */
  system: string;
  context: PromptContext;
  messages: ChatTurn[];
  temperature?: number;
}

export interface GenerateResponse {
  text: string;
  emotion?: string;
}

export interface AIProvider {
  readonly id: "mock" | "ollama" | "openai" | "anthropic";
  isAvailable(): Promise<boolean>;
  generate(req: GenerateRequest): Promise<GenerateResponse>;
  /** streaming opcional (token a token) */
  stream?(req: GenerateRequest): AsyncIterable<string>;
}

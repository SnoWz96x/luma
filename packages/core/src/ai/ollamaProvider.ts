// LocalOllamaProvider — IA 100% local via Ollama (padrão em produção).
// Veja docs/01-ARQUITETURA.md (AI Providers) e docs/STACK IA.
// Não depende de SDK: usa fetch contra a API HTTP local do Ollama.
import type {
  AIProvider,
  GenerateRequest,
  GenerateResponse,
  ChatTurn,
} from "@luma/shared";

export interface OllamaConfig {
  /** URL base do servidor Ollama local */
  baseUrl?: string;
  /** modelo (ex.: 'phi3:mini', 'llama3.2', 'gemma2:2b') */
  model?: string;
}

function toOllamaMessages(req: GenerateRequest) {
  const mapped = req.messages.map((m: ChatTurn) => ({
    role: m.role === "pet" ? "assistant" : m.role,
    content: m.content,
  }));
  return [{ role: "system", content: req.system }, ...mapped];
}

export class LocalOllamaProvider implements AIProvider {
  readonly id = "ollama" as const;
  private readonly baseUrl: string;
  private readonly model: string;

  constructor(config: OllamaConfig = {}) {
    this.baseUrl = config.baseUrl ?? "http://localhost:11434";
    this.model = config.model ?? "phi3:mini";
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`);
      return res.ok;
    } catch {
      return false;
    }
  }

  async generate(req: GenerateRequest): Promise<GenerateResponse> {
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        messages: toOllamaMessages(req),
        stream: false,
        options: { temperature: req.temperature ?? 0.8 },
      }),
    });
    if (!res.ok) {
      throw new Error(`Ollama respondeu ${res.status}`);
    }
    const data = (await res.json()) as { message?: { content?: string } };
    return { text: data.message?.content?.trim() ?? "" };
  }

  async *stream(req: GenerateRequest): AsyncIterable<string> {
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        messages: toOllamaMessages(req),
        stream: true,
        options: { temperature: req.temperature ?? 0.8 },
      }),
    });
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line) as { message?: { content?: string } };
          if (json.message?.content) yield json.message.content;
        } catch {
          /* linha parcial — ignora */
        }
      }
    }
  }
}

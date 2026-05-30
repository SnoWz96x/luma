// MockProvider — provider de IA sem modelo (dev/test e fallback offline).
// Gera respostas plausíveis a partir da persona/contexto, respeitando o tom.
// Veja docs/01-ARQUITETURA.md (AI Providers) e docs/06-MEMORY-ENGINE.md.
import type {
  AIProvider,
  GenerateRequest,
  GenerateResponse,
} from "@luma/shared";

function lastUserMessage(req: GenerateRequest): string {
  for (let i = req.messages.length - 1; i >= 0; i--) {
    if (req.messages[i]!.role === "user") return req.messages[i]!.content;
  }
  return "";
}

// Banco de respostas por intenção, no tom acolhedor do LUMA (sem culpa).
const REPLIES = {
  greeting: ["Oi! Que bom te ver por aqui. 🌙", "Ei, você chegou! Tava no meu cantinho te esperando."],
  feeling_bad: [
    "Sinto muito que o dia tenha pesado. Tô aqui com você, sem pressa.",
    "Dias difíceis acontecem. Respira fundo comigo? Você não está sozinho.",
  ],
  feeling_good: ["Que delícia te ver assim! Me conta o que deixou o dia bom.", "Fico cheio de luz quando você está bem. 🌟"],
  question: ["Hmm, boa pergunta. O que você acha?", "Gosto de pensar nisso com você."],
  default: ["Tô aqui, te ouvindo.", "Me conta mais?", "Que bom poder conversar com você."],
};

function pick(arr: string[], seed: number): string {
  return arr[seed % arr.length]!;
}

function classify(text: string): keyof typeof REPLIES {
  const t = text.toLowerCase();
  if (/\b(oi|ol[áa]|ei|bom dia|boa (tarde|noite))\b/.test(t)) return "greeting";
  if (/\b(triste|mal|cansad|difícil|p[ée]ssimo|sozinh|ansios)\b/.test(t)) return "feeling_bad";
  if (/\b(feliz|bem|[óo]timo|incr[íi]vel|alegr|content)\b/.test(t)) return "feeling_good";
  if (/\?\s*$/.test(text)) return "question";
  return "default";
}

export class MockProvider implements AIProvider {
  readonly id = "mock" as const;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  async generate(req: GenerateRequest): Promise<GenerateResponse> {
    const userMsg = lastUserMessage(req);
    const kind = classify(userMsg);
    const seed = userMsg.length + req.messages.length;
    const emotionByKind: Record<string, string> = {
      greeting: "happy",
      feeling_bad: "comfort",
      feeling_good: "happy",
      question: "curious",
      default: "calm",
    };
    return {
      text: pick(REPLIES[kind], seed),
      emotion: emotionByKind[kind] ?? "calm",
    };
  }
}

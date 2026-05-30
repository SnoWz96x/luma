// ChatService — orquestra o fluxo de conversa com a Safety Layer envolvendo a IA.
// Fluxo (docs/01-ARQUITETURA.md §4): inspectInput -> buildPrompt -> generate
// -> inspectOutput -> (anexa recursos se preciso).
import type {
  AIProvider,
  CharacterDef,
  PromptContext,
  ChatTurn,
} from "@luma/shared";
import { buildSystemPrompt } from "./prompt.js";
import {
  inspectInput,
  inspectOutput,
  resourceInvite,
} from "../safety/safety.js";

export interface ChatResult {
  reply: string;
  emotion: string;
  /** sinais levantados pela Safety Layer (para persistir como safety_flags) */
  flags: { signal: string; severity: string }[];
  /** se ofereceu recursos reais (Help Hub / rede de apoio) */
  offeredResources: boolean;
}

export interface TalkOptions {
  character: CharacterDef;
  context: PromptContext;
  history: ChatTurn[];
  userMessage: string;
  provider: AIProvider;
  temperature?: number;
}

export async function talkToPet(opts: TalkOptions): Promise<ChatResult> {
  const { character, context, history, userMessage, provider } = opts;

  // 1. Safety na entrada
  const input = inspectInput(userMessage);

  // 2. Monta prompt (persona + contexto + safety) e mensagens
  const system = buildSystemPrompt(character, context);
  const messages: ChatTurn[] = [
    ...history,
    { role: "user", content: input.text },
  ];

  // 3. Gera (provider pode ser Mock/Ollama/...)
  let rawText = "";
  let emotion = "calm";
  try {
    const res = await provider.generate({
      system,
      context,
      messages,
      ...(opts.temperature !== undefined ? { temperature: opts.temperature } : {}),
    });
    rawText = res.text;
    if (res.emotion) emotion = res.emotion;
  } catch {
    rawText = "Tô com a cabeça um pouco lenta agora, mas continuo aqui com você.";
  }

  // 4. Safety na saída
  const output = inspectOutput(rawText, input.flags);
  let reply = output.text;
  if (output.appendResources) {
    reply = `${reply}\n\n${resourceInvite()}`;
  }

  return {
    reply,
    emotion,
    flags: input.flags,
    offeredResources: output.appendResources,
  };
}

// Chat store — conversa com o pet usando o ChatService + Safety + Memory do core.
// O provider de IA (Mock offline ou Ollama local) vem do aiStore, que faz
// fallback automático para o Mock se o Ollama não estiver disponível.
import { create } from "zustand";
import {
  talkToPet,
  extractMemory,
  applyRelationshipInteraction,
  inferEmotion,
  emotionToToneHint,
  recallRelevant,
} from "@luma/core";
import type {
  CharacterDef,
  ChatTurn,
  PromptContext,
  Memory,
  Relationship,
} from "@luma/shared";
import { useMemoryStore } from "./memoryStore";
import { useAiStore } from "./aiStore";
import { useProgressStore } from "./progressStore";
import { useHabitsStore } from "./habitsStore";

// Relacionamento inicial em memória (persistência via repo entra depois).
function freshRelationship(): Relationship {
  return {
    id: "rel-active",
    userId: "local",
    characterId: "active",
    friendship: 5,
    trust: 5,
    familiarity: 5,
    sharedMemories: 0,
    sharedAdventures: 0,
    firstMetAt: new Date().toISOString(),
    totalTimeSeconds: 0,
  };
}

interface ChatStore {
  messages: ChatTurn[];
  relationship: Relationship;
  sending: boolean;
  /** Safety Layer ofereceu recursos reais na última resposta (sinal sensível) */
  offeredResources: boolean;
  send: (character: CharacterDef, text: string) => Promise<string>;
  greet: (character: CharacterDef) => void;
  dismissResources: () => void;
}

function buildContext(
  memories: Memory[],
  relationship: Relationship,
  recentTurns: ChatTurn[],
  toneHint: string,
): PromptContext {
  return {
    profile: { userId: "local" },
    traits: [],
    relationship,
    // recupera por relevância (decaimento) em vez de só importância (Memory v2)
    memories: recallRelevant(memories, new Date().toISOString(), 8),
    recentTurns,
    summaries: [],
    safetyFlags: [],
    toneHint,
  };
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  relationship: freshRelationship(),
  sending: false,
  offeredResources: false,

  dismissResources: () => set({ offeredResources: false }),

  greet: (character) => {
    if (get().messages.length > 0) return;
    const hello = character.phrases.greeting[0] ?? "Oi!";
    set({ messages: [{ role: "pet", content: hello, emotion: "happy" }] });
  },

  send: async (character, text) => {
    const clean = text.trim();
    if (!clean || get().sending) return "calm";
    set({ sending: true });

    const { messages, relationship } = get();
    const memories = useMemoryStore.getState().memories;
    const history = messages.slice(-12);
    const provider = await useAiStore.getState().resolveProvider();

    // Emotional Context Engine: infere o TOM a partir de sinais reais do app.
    const emotion = inferEmotion({
      streak: useProgressStore.getState().streak.current,
      habitsToday: useHabitsStore.getState().doneToday(),
      friendship: relationship.friendship,
      lastUserText: clean,
    });
    const toneHint = emotionToToneHint(emotion);

    const result = await talkToPet({
      character,
      context: buildContext(memories, relationship, history, toneHint),
      history,
      userMessage: clean,
      provider,
    });

    // memória importante? grava no store compartilhado (alimenta o Mundo Espelho)
    const candidate = extractMemory(clean, { emotion: result.emotion });
    if (candidate) {
      useMemoryStore.getState().add({
        id: `m-${Date.now()}`,
        userId: "local",
        content: candidate.content,
        importance: candidate.importance,
        source: candidate.source,
        createdAt: new Date().toISOString(),
        ...(candidate.emotion !== undefined ? { emotion: candidate.emotion } : {}),
      } satisfies Memory);
    }

    // evolui o relacionamento (conversar)
    const { relationship: nextRel } = applyRelationshipInteraction(
      relationship,
      "talk",
    );

    set({
      messages: [
        ...messages,
        { role: "user", content: clean },
        { role: "pet", content: result.reply, emotion: result.emotion },
      ],
      relationship: nextRel,
      sending: false,
      offeredResources: result.offeredResources,
    });

    return result.emotion;
  },
}));

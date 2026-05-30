// Chat store — conversa com o pet usando o ChatService + Safety + Memory do core.
// No MVP usa MockProvider (sem servidor); troca p/ Ollama via settings depois.
import { create } from "zustand";
import {
  talkToPet,
  MockProvider,
  extractMemory,
  applyRelationshipInteraction,
} from "@luma/core";
import type {
  CharacterDef,
  ChatTurn,
  PromptContext,
  Memory,
  Relationship,
} from "@luma/shared";

const provider = new MockProvider();

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
  memories: Memory[];
  relationship: Relationship;
  sending: boolean;
  send: (character: CharacterDef, text: string) => Promise<string>;
  greet: (character: CharacterDef) => void;
}

function buildContext(
  memories: Memory[],
  relationship: Relationship,
  recentTurns: ChatTurn[],
): PromptContext {
  return {
    profile: { userId: "local" },
    traits: [],
    relationship,
    memories,
    recentTurns,
    summaries: [],
    safetyFlags: [],
  };
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  memories: [],
  relationship: freshRelationship(),
  sending: false,

  greet: (character) => {
    if (get().messages.length > 0) return;
    const hello = character.phrases.greeting[0] ?? "Oi!";
    set({ messages: [{ role: "pet", content: hello, emotion: "happy" }] });
  },

  send: async (character, text) => {
    const clean = text.trim();
    if (!clean || get().sending) return "calm";
    set({ sending: true });

    const { messages, memories, relationship } = get();
    const history = messages.slice(-12);

    const result = await talkToPet({
      character,
      context: buildContext(memories, relationship, history),
      history,
      userMessage: clean,
      provider,
    });

    // memória importante?
    const candidate = extractMemory(clean, { emotion: result.emotion });
    const newMemories = candidate
      ? [
          ...memories,
          {
            id: `m-${Date.now()}`,
            userId: "local",
            content: candidate.content,
            importance: candidate.importance,
            source: candidate.source,
            createdAt: new Date().toISOString(),
            ...(candidate.emotion !== undefined ? { emotion: candidate.emotion } : {}),
          } satisfies Memory,
        ]
      : memories;

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
      memories: newMemories,
      relationship: nextRel,
      sending: false,
    });

    return result.emotion;
  },
}));

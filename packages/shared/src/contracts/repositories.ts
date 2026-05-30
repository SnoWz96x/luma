// Contratos de persistência. A Infra (SQLite no Desktop, Postgres na nuvem)
// implementa estas interfaces. O domínio (packages/core) depende só delas.
import type { CharacterDef, CharacterInstance } from "../types/character.js";
import type { VitalState } from "../types/state.js";
import type {
  Memory,
  MoodEntry,
  UserProfile,
  UserTrait,
  ConversationSummary,
  ChatTurn,
  SafetyFlag,
} from "../types/memory.js";
import type { Relationship } from "../types/relationship.js";
import type { WorldState } from "../types/world.js";

export interface CharacterRepository {
  getDef(defId: string): Promise<CharacterDef | null>;
  listDefs(): Promise<CharacterDef[]>;
  getActiveInstance(userId: string): Promise<CharacterInstance | null>;
  saveInstance(instance: CharacterInstance): Promise<void>;
}

export interface VitalStateRepository {
  get(characterId: string): Promise<(VitalState & { lastTickAt: string }) | null>;
  save(characterId: string, state: VitalState, lastTickAt: string): Promise<void>;
}

export interface MemoryRepository {
  getProfile(userId: string): Promise<UserProfile | null>;
  getTraits(userId: string): Promise<UserTrait[]>;
  upsertTrait(userId: string, trait: UserTrait): Promise<void>;
  topMemories(userId: string, limit: number): Promise<Memory[]>;
  addMemory(m: Memory): Promise<void>;
  updateMemory(id: string, patch: Partial<Memory>): Promise<void>;
  deleteMemory(id: string): Promise<void>;
  getTodayMood(userId: string, date: string): Promise<MoodEntry | null>;
  addMood(userId: string, mood: MoodEntry): Promise<void>;
  recentTurns(conversationId: string, limit: number): Promise<ChatTurn[]>;
  relevantSummaries(userId: string): Promise<ConversationSummary[]>;
  openSafetyFlags(userId: string): Promise<SafetyFlag[]>;
  addSafetyFlag(userId: string, flag: SafetyFlag): Promise<void>;
}

export interface RelationshipRepository {
  get(userId: string, characterId: string): Promise<Relationship | null>;
  save(rel: Relationship): Promise<void>;
}

export interface WorldRepository {
  get(userId: string): Promise<WorldState | null>;
  save(state: WorldState): Promise<void>;
}

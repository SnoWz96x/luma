// Memória e contexto. Veja docs/06-MEMORY-ENGINE.md
import type { Relationship } from "./relationship.js";

export interface UserProfile {
  userId: string;
  favoriteActivity?: string;
  sleepQuality?: "good" | "bad" | "mixed";
  bio?: string;
}

export interface UserTrait {
  trait: string; // 'creative','adventurous','calm',...
  weight: number; // 0..1
}

export type MoodLabel = "great" | "good" | "ok" | "low" | "sad";

export interface MoodEntry {
  date: string; // YYYY-MM-DD
  mood: MoodLabel;
  energy?: string;
  sleep?: string;
  note?: string;
}

export type MemorySource = "conversation" | "habit" | "mood" | "manual";

export interface Memory {
  id: string;
  userId: string;
  clusterId?: string;
  content: string;
  emotion?: string;
  importance: number; // 0..100
  source: MemorySource;
  sourceRef?: string;
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  summary: string;
  coversUntil: string;
}

export interface ChatTurn {
  role: "user" | "pet" | "system";
  content: string;
  emotion?: string;
}

/** Contexto montado pelo Memory Engine e injetado no prompt da IA. */
export interface PromptContext {
  profile: UserProfile;
  traits: UserTrait[];
  todayMood?: MoodEntry;
  relationship: Relationship;
  memories: Memory[];
  recentTurns: ChatTurn[];
  summaries: ConversationSummary[];
  safetyFlags: SafetyFlag[];
}

export interface SafetyFlag {
  id: string;
  signal: string;
  severity: "info" | "gentle" | "offer_resources";
  handled: boolean;
}

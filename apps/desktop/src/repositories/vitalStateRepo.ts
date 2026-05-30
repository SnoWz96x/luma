// Repositório de estado vital. Implementa VitalStateRepository de @luma/shared.
// Usa SQLite (Tauri) quando disponível; senão, memória (dev no browser).
import type { VitalStateRepository, VitalState } from "@luma/shared";
import { db } from "./db";

type StoredState = VitalState & { lastTickAt: string };

const memory = new Map<string, StoredState>();

export const vitalStateRepo: VitalStateRepository = {
  async get(characterId) {
    const database = await db();
    if (!database) return memory.get(characterId) ?? null;

    const rows = await database.select<StoredState[]>(
      `SELECT energy, mood, curiosity, bond, comfort, trust, sleep, progress,
              last_tick_at as lastTickAt
       FROM character_states WHERE character_id = ?`,
      [characterId],
    );
    return rows[0] ?? null;
  },

  async save(characterId, state, lastTickAt) {
    const database = await db();
    if (!database) {
      memory.set(characterId, { ...state, lastTickAt });
      return;
    }
    await database.execute(
      `INSERT INTO character_states
         (character_id, energy, mood, curiosity, bond, comfort, trust, sleep, progress, last_tick_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)
       ON CONFLICT(character_id) DO UPDATE SET
         energy=excluded.energy, mood=excluded.mood, curiosity=excluded.curiosity,
         bond=excluded.bond, comfort=excluded.comfort, trust=excluded.trust,
         sleep=excluded.sleep, progress=excluded.progress,
         last_tick_at=excluded.last_tick_at, updated_at=excluded.updated_at`,
      [
        characterId,
        state.energy,
        state.mood,
        state.curiosity,
        state.bond,
        state.comfort,
        state.trust,
        state.sleep,
        state.progress,
        lastTickAt,
        new Date().toISOString(),
      ],
    );
  },
};

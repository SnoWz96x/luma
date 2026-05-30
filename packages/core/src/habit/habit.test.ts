import { describe, it, expect } from "vitest";
import {
  SEED_HABITS,
  completeHabit,
  isDoneToday,
  habitStreak,
  habitProgress,
  doneCountToday,
} from "./habit.js";
import type { HabitLogEntry } from "@luma/shared";

const TODAY = "2026-05-30";

describe("completeHabit", () => {
  it("conclui um hábito e dá fagulhas", () => {
    const r = completeHabit([], "water", TODAY);
    expect(r.completed).toBe(true);
    expect(r.reward).toBeGreaterThan(0);
    expect(isDoneToday(r.logs, "water", TODAY)).toBe(true);
  });

  it("é idempotente no mesmo dia (sem recompensa dupla)", () => {
    const once = completeHabit([], "water", TODAY).logs;
    const twice = completeHabit(once, "water", TODAY);
    expect(twice.completed).toBe(false);
    expect(twice.reward).toBe(0);
  });

  it("ignora hábito inexistente", () => {
    expect(completeHabit([], "xyz", TODAY).completed).toBe(false);
  });
});

describe("habitStreak", () => {
  it("conta dias consecutivos", () => {
    const logs: HabitLogEntry[] = [
      { habitId: "water", date: "2026-05-28" },
      { habitId: "water", date: "2026-05-29" },
      { habitId: "water", date: "2026-05-30" },
    ];
    expect(habitStreak(logs, "water", TODAY)).toBe(3);
  });

  it("zera se a sequência foi interrompida há mais de 1 dia", () => {
    const logs: HabitLogEntry[] = [{ habitId: "water", date: "2026-05-20" }];
    expect(habitStreak(logs, "water", TODAY)).toBe(0);
  });

  it("mantém se o último foi ontem", () => {
    const logs: HabitLogEntry[] = [{ habitId: "water", date: "2026-05-29" }];
    expect(habitStreak(logs, "water", TODAY)).toBe(1);
  });
});

describe("habitProgress & doneCountToday", () => {
  it("monta progresso de todos os hábitos", () => {
    const logs = completeHabit([], "water", TODAY).logs;
    const prog = habitProgress(SEED_HABITS, logs, TODAY);
    expect(prog).toHaveLength(SEED_HABITS.length);
    expect(prog.find((p) => p.def.id === "water")?.doneToday).toBe(true);
  });

  it("conta hábitos únicos concluídos hoje", () => {
    let logs = completeHabit([], "water", TODAY).logs;
    logs = completeHabit(logs, "walk", TODAY).logs;
    expect(doneCountToday(logs, TODAY)).toBe(2);
  });
});

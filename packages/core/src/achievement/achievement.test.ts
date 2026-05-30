import { describe, it, expect } from "vitest";
import {
  DEFAULT_STREAK,
  BADGES,
  unlockBadge,
  registerStreakDay,
  streakBadges,
  getBadge,
} from "./achievement.js";

describe("badges", () => {
  it("desbloqueia um badge novo", () => {
    const r = unlockBadge([], "first_talk");
    expect(r.isNew).toBe(true);
    expect(r.list).toHaveLength(1);
  });

  it("é idempotente (não duplica)", () => {
    const once = unlockBadge([], "first_talk").list;
    const twice = unlockBadge(once, "first_talk");
    expect(twice.isNew).toBe(false);
    expect(twice.list).toHaveLength(1);
  });

  it("ignora id inexistente", () => {
    expect(unlockBadge([], "nao_existe").isNew).toBe(false);
  });

  it("todo badge tem título e emoji", () => {
    for (const b of BADGES) {
      expect(b.title.length).toBeGreaterThan(0);
      expect(b.emoji.length).toBeGreaterThan(0);
    }
    expect(getBadge("bonded")?.group).toBe("bond");
  });
});

describe("streak com proteção gentil", () => {
  it("primeiro dia inicia em 1", () => {
    const r = registerStreakDay(DEFAULT_STREAK, "2026-05-01");
    expect(r.streak.current).toBe(1);
    expect(r.grew).toBe(true);
  });

  it("dia seguinte incrementa", () => {
    let s = registerStreakDay(DEFAULT_STREAK, "2026-05-01").streak;
    const r = registerStreakDay(s, "2026-05-02");
    expect(r.streak.current).toBe(2);
  });

  it("mesmo dia não muda", () => {
    const s = registerStreakDay(DEFAULT_STREAK, "2026-05-01").streak;
    const r = registerStreakDay(s, "2026-05-01");
    expect(r.grew).toBe(false);
    expect(r.streak.current).toBe(1);
  });

  it("pular 1 dia usa uma folga (streak freeze) e mantém", () => {
    let s = registerStreakDay(DEFAULT_STREAK, "2026-05-01").streak; // current 1, freezes 2
    s = registerStreakDay(s, "2026-05-02").streak; // current 2
    const r = registerStreakDay(s, "2026-05-04"); // pulou dia 03
    expect(r.usedFreeze).toBe(true);
    expect(r.streak.current).toBe(3);
    expect(r.streak.freezes).toBe(1);
  });

  it("sem folga e pulando muito, recomeça gentilmente", () => {
    const noFreeze = { ...DEFAULT_STREAK, current: 5, lastDate: "2026-05-01", freezes: 0, best: 5 };
    const r = registerStreakDay(noFreeze, "2026-05-10");
    expect(r.streak.current).toBe(1);
    expect(r.streak.best).toBe(5); // mantém o recorde
  });

  it("badges de hábito por melhor sequência", () => {
    expect(streakBadges({ ...DEFAULT_STREAK, best: 7 })).toContain("habit_7");
    expect(streakBadges({ ...DEFAULT_STREAK, best: 2 })).not.toContain("habit_3");
  });
});

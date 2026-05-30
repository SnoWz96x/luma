import { describe, it, expect } from "vitest";
import {
  DEFAULT_GROWTH,
  addCare,
  addDay,
  eligibleStage,
  advanceGrowth,
  decideBranch,
  stageScale,
} from "./growth.js";
import type { GrowthState, UserTrait } from "@luma/shared";

describe("crescimento (estágios de vida)", () => {
  it("começa como ovo", () => {
    expect(DEFAULT_GROWTH.stage).toBe("egg");
    expect(eligibleStage(DEFAULT_GROWTH)).toBe("egg");
  });

  it("vira bebê com 1 dia + cuidado mínimo", () => {
    let s: GrowthState = { ...DEFAULT_GROWTH };
    s = addDay(s);
    s = addCare(s, "habitDone"); // 5 pts
    expect(eligibleStage(s)).toBe("baby");
  });

  it("não regride o estágio (monotônico, sem punição)", () => {
    const teen: GrowthState = { stage: "teen", daysTogether: 0, carePoints: 0, branch: "balanced" };
    const { evolved } = advanceGrowth(teen);
    expect(evolved).toBe(false); // não volta para egg mesmo sem requisitos
  });

  it("evolui e sinaliza a mudança", () => {
    const s: GrowthState = { stage: "egg", daysTogether: 3, carePoints: 30, branch: "balanced" };
    const r = advanceGrowth(s);
    expect(r.evolved).toBe(true);
    expect(r.from).toBe("egg");
    expect(r.state.stage).toBe("child");
  });

  it("define ramo de evolução ao virar teen, pelos traços", () => {
    const traits: UserTrait[] = [{ trait: "creative", weight: 0.9 }];
    const s: GrowthState = { stage: "child", daysTogether: 10, carePoints: 100, branch: "balanced" };
    const r = advanceGrowth(s, traits);
    expect(r.state.stage).toBe("teen");
    expect(r.state.branch).toBe("creative");
  });

  it("o tamanho cresce com o estágio (crescimento é sentido)", () => {
    expect(stageScale("egg")).toBeLessThan(stageScale("adult"));
  });
});

describe("decideBranch", () => {
  it("sem traços -> balanced", () => {
    expect(decideBranch([])).toBe("balanced");
  });
  it("aventureiro -> adventurous", () => {
    expect(decideBranch([{ trait: "adventurous", weight: 0.8 }])).toBe("adventurous");
  });
  it("traço fraco -> balanced", () => {
    expect(decideBranch([{ trait: "creative", weight: 0.2 }])).toBe("balanced");
  });
});

import { describe, it, expect } from "vitest";
import {
  applyRelationshipInteraction,
  relationshipStage,
} from "./relationship.js";
import type { Relationship } from "@luma/shared";

const base: Relationship = {
  id: "r1", userId: "u1", characterId: "c1",
  friendship: 0, trust: 0, familiarity: 0,
  sharedMemories: 0, sharedAdventures: 0,
  firstMetAt: "2026-01-01T00:00:00Z", totalTimeSeconds: 0,
};

describe("relationshipStage", () => {
  it("começa como stranger", () => {
    expect(relationshipStage(base)).toBe("stranger");
  });
  it("vínculo alto -> bonded", () => {
    expect(relationshipStage({ ...base, friendship: 90, trust: 80, familiarity: 80 })).toBe("bonded");
  });
});

describe("applyRelationshipInteraction", () => {
  it("conversar aumenta amizade e familiaridade", () => {
    const { relationship } = applyRelationshipInteraction(base, "talk");
    expect(relationship.friendship).toBeGreaterThan(base.friendship);
    expect(relationship.familiarity).toBeGreaterThan(base.familiarity);
  });

  it("aconchego aumenta confiança", () => {
    const { relationship } = applyRelationshipInteraction(base, "comfort");
    expect(relationship.trust).toBeGreaterThan(base.trust);
  });

  it("detecta subida de estágio", () => {
    const almost: Relationship = { ...base, friendship: 11, trust: 11, familiarity: 11 };
    const { stageUp } = applyRelationshipInteraction(almost, "talk");
    expect(stageUp).toBe(true);
  });

  it("não muta o original", () => {
    const snapshot = { ...base };
    applyRelationshipInteraction(base, "play");
    expect(base).toEqual(snapshot);
  });
});

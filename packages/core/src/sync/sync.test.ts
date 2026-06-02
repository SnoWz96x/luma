import { describe, it, expect } from "vitest";
import {
  remoteWins,
  mergeRecords,
  nextCursor,
  makeOutboxEntry,
  compactOutbox,
  ackOutbox,
} from "./sync.js";
import type { Syncable, OutboxEntry } from "@luma/shared";

const rec = (over: Partial<Syncable>): Syncable => ({
  id: "a",
  updatedAt: "2026-01-01T00:00:00Z",
  syncVersion: 1,
  ...over,
});

describe("remoteWins (last-write-wins)", () => {
  it("maior syncVersion vence", () => {
    expect(remoteWins(rec({ syncVersion: 1 }), rec({ syncVersion: 2 }))).toBe(true);
    expect(remoteWins(rec({ syncVersion: 3 }), rec({ syncVersion: 2 }))).toBe(false);
  });
  it("empate de versão -> updatedAt mais recente vence", () => {
    const local = rec({ syncVersion: 5, updatedAt: "2026-05-01T00:00:00Z" });
    const remote = rec({ syncVersion: 5, updatedAt: "2026-05-02T00:00:00Z" });
    expect(remoteWins(local, remote)).toBe(true);
  });
});

describe("mergeRecords", () => {
  it("insere registros novos do remoto", () => {
    const local = new Map<string, Syncable>();
    const { merged, changed } = mergeRecords(local, [rec({ id: "x" })]);
    expect(merged.has("x")).toBe(true);
    expect(changed).toContain("x");
  });

  it("remoto mais novo sobrescreve o local", () => {
    const local = new Map([["a", rec({ id: "a", syncVersion: 1 })]]);
    const { merged } = mergeRecords(local, [rec({ id: "a", syncVersion: 2 })]);
    expect(merged.get("a")!.syncVersion).toBe(2);
  });

  it("local mais novo NÃO é sobrescrito", () => {
    const local = new Map([["a", rec({ id: "a", syncVersion: 5 })]]);
    const { merged, changed } = mergeRecords(local, [rec({ id: "a", syncVersion: 2 })]);
    expect(merged.get("a")!.syncVersion).toBe(5);
    expect(changed).not.toContain("a");
  });

  it("remoção remota mais nova vence (deletedAt)", () => {
    const local = new Map([["a", rec({ id: "a", syncVersion: 1 })]]);
    const { merged } = mergeRecords(local, [
      rec({ id: "a", syncVersion: 2, deletedAt: "2026-06-01T00:00:00Z" }),
    ]);
    expect(merged.get("a")!.deletedAt).toBeTruthy();
  });
});

describe("nextCursor", () => {
  it("retorna a maior versão", () => {
    expect(nextCursor([rec({ syncVersion: 3 }), rec({ syncVersion: 7 })])).toBe(7);
  });
  it("respeita o cursor atual", () => {
    expect(nextCursor([rec({ syncVersion: 2 })], 5)).toBe(5);
  });
});

describe("makeOutboxEntry", () => {
  it("upsert para registro normal", () => {
    expect(makeOutboxEntry("moods", rec({})).op).toBe("upsert");
  });
  it("delete quando deletedAt presente", () => {
    expect(makeOutboxEntry("moods", rec({ deletedAt: "2026-06-01T00:00:00Z" })).op).toBe("delete");
  });
});

describe("compactOutbox", () => {
  it("mantém só a última operação por entidade+id", () => {
    const e: OutboxEntry[] = [
      makeOutboxEntry("moods", rec({ id: "a", syncVersion: 1 })),
      makeOutboxEntry("moods", rec({ id: "a", syncVersion: 2 })),
      makeOutboxEntry("moods", rec({ id: "b", syncVersion: 1 })),
    ];
    const c = compactOutbox(e);
    expect(c).toHaveLength(2);
    expect(c.find((x) => x.payload.id === "a")!.payload.syncVersion).toBe(2);
  });
});

describe("ackOutbox", () => {
  it("remove entradas confirmadas pelo servidor", () => {
    const e: OutboxEntry[] = [
      makeOutboxEntry("moods", rec({ id: "a", syncVersion: 2 })),
      makeOutboxEntry("moods", rec({ id: "b", syncVersion: 1 })),
    ];
    const rest = ackOutbox(e, [{ entity: "moods", id: "a", syncVersion: 2 }]);
    expect(rest.map((x) => x.payload.id)).toEqual(["b"]);
  });

  it("mantém entrada se a local for mais nova que a confirmada", () => {
    const e: OutboxEntry[] = [makeOutboxEntry("moods", rec({ id: "a", syncVersion: 3 }))];
    const rest = ackOutbox(e, [{ entity: "moods", id: "a", syncVersion: 2 }]);
    expect(rest).toHaveLength(1);
  });
});

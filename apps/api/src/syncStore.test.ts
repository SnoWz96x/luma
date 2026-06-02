import { describe, it, expect } from "vitest";
import { InMemorySyncStore } from "./syncStore.js";
import { makeOutboxEntry, mergeRecords } from "@luma/core";
import type { Syncable } from "@luma/shared";

const rec = (over: Partial<Syncable>): Syncable => ({
  id: "a",
  updatedAt: "2026-01-01T00:00:00Z",
  syncVersion: 0,
  ...over,
});

describe("InMemorySyncStore", () => {
  it("push atribui syncVersion monotônica e confirma", () => {
    const s = new InMemorySyncStore();
    const r = s.push("moods", [
      makeOutboxEntry("moods", rec({ id: "a" })),
      makeOutboxEntry("moods", rec({ id: "b" })),
    ]);
    expect(r.acked).toHaveLength(2);
    expect(r.acked[0]!.syncVersion).toBe(1);
    expect(r.acked[1]!.syncVersion).toBe(2);
    expect(r.cursor).toBe(2);
  });

  it("pull retorna só o que é mais novo que o cursor", () => {
    const s = new InMemorySyncStore();
    s.push("moods", [makeOutboxEntry("moods", rec({ id: "a" }))]); // v1
    s.push("moods", [makeOutboxEntry("moods", rec({ id: "b" }))]); // v2
    const since1 = s.pull("moods", 1);
    expect(since1.records.map((r) => r.id)).toEqual(["b"]);
    expect(since1.cursor).toBe(2);
  });

  it("delete propaga no pull (deletedAt preenchido)", () => {
    const s = new InMemorySyncStore();
    s.push("moods", [makeOutboxEntry("moods", rec({ id: "a" }))]);
    s.push("moods", [
      makeOutboxEntry("moods", rec({ id: "a", deletedAt: "2026-06-01T00:00:00Z" }), "delete"),
    ]);
    const pulled = s.pull("moods", 1);
    expect(pulled.records.find((r) => r.id === "a")?.deletedAt).toBeTruthy();
  });

  it("isolamento por entidade", () => {
    const s = new InMemorySyncStore();
    s.push("moods", [makeOutboxEntry("moods", rec({ id: "a" }))]);
    s.push("habits", [makeOutboxEntry("habits", rec({ id: "x" }))]);
    expect(s.pull("moods", 0).records).toHaveLength(1);
    expect(s.pull("habits", 0).records).toHaveLength(1);
  });

  it("ciclo completo: push servidor -> pull cliente -> merge (core)", () => {
    const server = new InMemorySyncStore();
    // cliente A envia um registro
    server.push("moods", [makeOutboxEntry("moods", rec({ id: "a", updatedAt: "2026-05-01T00:00:00Z" }))]);
    // cliente B (vazio) faz pull e mescla
    const pulled = server.pull("moods", 0);
    const local = new Map<string, Syncable>();
    const { merged } = mergeRecords(local, pulled.records);
    expect(merged.get("a")).toBeTruthy();
    expect(merged.get("a")!.syncVersion).toBe(1);
  });
});

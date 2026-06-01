import { describe, it, expect } from "vitest";
import {
  MODEL_CATALOG,
  describeModels,
  pickBestModel,
  getModelInfo,
} from "./orchestrator.js";

describe("catálogo de modelos", () => {
  it("tem os modelos do briefing", () => {
    const ids = MODEL_CATALOG.map((m) => m.id);
    expect(ids).toContain("phi3:mini");
    expect(ids).toContain("tinyllama");
    expect(ids.some((i) => i.startsWith("llama3.2"))).toBe(true);
  });
  it("getModelInfo encontra por id", () => {
    expect(getModelInfo("phi3:mini")?.name).toBe("Phi-3 Mini");
  });
});

describe("describeModels", () => {
  it("marca fitsRam conforme a RAM", () => {
    const low = describeModels({ ramGb: 4 });
    expect(low.find((m) => m.id === "mistral")?.fitsRam).toBe(false);
    expect(low.find((m) => m.id === "phi3:mini")?.fitsRam).toBe(true);
  });
  it("marca installed", () => {
    const d = describeModels({ installed: ["phi3:mini"] });
    expect(d.find((m) => m.id === "phi3:mini")?.installed).toBe(true);
    expect(d.find((m) => m.id === "mistral")?.installed).toBe(false);
  });
});

describe("pickBestModel", () => {
  it("usa o melhor modelo instalado que cabe na RAM", () => {
    const r = pickBestModel({ ramGb: 16, installed: ["phi3:mini", "mistral"] });
    expect(r.use).toBe("mistral"); // great > good
  });

  it("sem instalado, recomenda baixar (use=null)", () => {
    const r = pickBestModel({ ramGb: 8, installed: [] });
    expect(r.use).toBeNull();
    expect(r.recommend).toBeTruthy();
  });

  it("RAM baixa não recomenda modelo pesado", () => {
    const r = pickBestModel({ ramGb: 4, installed: [] });
    const rec = getModelInfo(r.recommend)!;
    expect(rec.ramGb).toBeLessThanOrEqual(4);
  });

  it("instalado que não cabe na RAM não é usado", () => {
    const r = pickBestModel({ ramGb: 4, installed: ["mistral"] });
    expect(r.use).not.toBe("mistral");
  });

  it("é determinístico", () => {
    const a = pickBestModel({ ramGb: 8, installed: ["phi3:mini"] });
    const b = pickBestModel({ ramGb: 8, installed: ["phi3:mini"] });
    expect(a).toEqual(b);
  });
});

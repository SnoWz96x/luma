import { describe, it, expect } from "vitest";
import { validateManifest, PluginRegistry } from "./plugin.js";

const spritePack = {
  id: "luma-sprites",
  kind: "sprite-pack" as const,
  name: "Sprites da Luma",
  version: "1.0.0",
  license: "CC-BY-4.0",
  data: { sprites: [{ characterId: "luma", frames: { idle: "luma_idle.png", happy: "luma_happy.png" } }] },
};

describe("validateManifest", () => {
  it("aceita um sprite-pack válido", () => {
    expect(validateManifest(spritePack).ok).toBe(true);
  });
  it("rejeita id inválido", () => {
    expect(validateManifest({ ...spritePack, id: "Bad Id" }).ok).toBe(false);
  });
  it("rejeita kind desconhecido", () => {
    const r = validateManifest({ ...spritePack, kind: "xpto" });
    expect(r.ok).toBe(false);
    expect(r.errors.join(" ")).toMatch(/kind/);
  });
  it("sprite-pack exige license", () => {
    const { license, ...noLicense } = spritePack;
    void license;
    expect(validateManifest(noLicense).ok).toBe(false);
  });
  it("sprite-pack exige sprites não vazio", () => {
    expect(validateManifest({ ...spritePack, data: { sprites: [] } }).ok).toBe(false);
  });
  it("rejeita manifesto vazio", () => {
    expect(validateManifest(null).ok).toBe(false);
  });
});

describe("PluginRegistry", () => {
  it("registra e indexa sprites por personagem", () => {
    const reg = new PluginRegistry();
    expect(reg.register(spritePack).ok).toBe(true);
    expect(reg.has("luma-sprites")).toBe(true);
    expect(reg.spriteFrame("luma", "idle")).toBe("luma_idle.png");
    expect(reg.spriteFor("luma")?.happy).toBe("luma_happy.png");
  });

  it("não registra manifesto inválido", () => {
    const reg = new PluginRegistry();
    expect(reg.register({ id: "x" }).ok).toBe(false);
    expect(reg.has("x")).toBe(false);
  });

  it("remove plugin e limpa o índice de sprites", () => {
    const reg = new PluginRegistry();
    reg.register(spritePack);
    reg.remove("luma-sprites");
    expect(reg.has("luma-sprites")).toBe(false);
    expect(reg.spriteFor("luma")).toBeUndefined();
  });

  it("lista por tipo", () => {
    const reg = new PluginRegistry();
    reg.register(spritePack);
    expect(reg.list("sprite-pack")).toHaveLength(1);
    expect(reg.list("biome")).toHaveLength(0);
  });

  it("personagem sem sprite -> undefined (fallback vetorial)", () => {
    const reg = new PluginRegistry();
    expect(reg.spriteFrame("desconhecido", "idle")).toBeUndefined();
  });
});

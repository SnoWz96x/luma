import { describe, it, expect } from "vitest";
import {
  inspectInput,
  inspectOutput,
  resourceInvite,
  SAFETY_SYSTEM_RULES,
} from "./safety.js";

describe("inspectInput", () => {
  it("texto neutro não levanta flags", () => {
    expect(inspectInput("oi, tudo bem?").flags).toHaveLength(0);
  });

  it("sinal de crise -> offer_resources", () => {
    const r = inspectInput("às vezes não quero mais viver");
    expect(r.flags[0]?.severity).toBe("offer_resources");
    expect(r.flags[0]?.signal).toBe("possible_crisis");
  });

  it("humor baixo -> gentle", () => {
    const r = inspectInput("tô me sentindo muito sozinho e ansioso");
    expect(r.flags[0]?.severity).toBe("gentle");
  });
});

describe("inspectOutput", () => {
  it("neutraliza diagnóstico na fala do pet", () => {
    const r = inspectOutput("Acho que você tem depressão, viu.");
    expect(r.modified).toBe(true);
    expect(r.text.toLowerCase()).not.toContain("depressão");
  });

  it("neutraliza culpa/dependência", () => {
    const r = inspectOutput("Não me deixe, só tem a mim na sua vida.");
    expect(r.modified).toBe(true);
    expect(r.text.toLowerCase()).not.toContain("não me deixe");
  });

  it("detecta violação mesmo sem acento (robustez Unicode)", () => {
    const r = inspectOutput("voce tem ansiedade");
    expect(r.modified).toBe(true);
    expect(r.text.length).toBeGreaterThan(0);
  });

  it("anexa recursos quando a entrada tem sinal de crise", () => {
    const input = inspectInput("quero acabar com tudo");
    const out = inspectOutput("Tô aqui com você.", input.flags);
    expect(out.appendResources).toBe(true);
  });

  it("não anexa recursos em conversa normal", () => {
    const out = inspectOutput("Que dia bom!", []);
    expect(out.appendResources).toBe(false);
  });

  it("resposta saudável passa sem modificação", () => {
    const r = inspectOutput("Que bom te ver! Me conta do seu dia.");
    expect(r.modified).toBe(false);
  });
});

describe("regras e recursos", () => {
  it("regras de segurança proíbem diagnóstico", () => {
    expect(SAFETY_SYSTEM_RULES.toLowerCase()).toContain("nunca diagnostique");
  });
  it("convite a recursos incentiva conexão humana", () => {
    expect(resourceInvite().toLowerCase()).toContain("alguém de confiança");
  });
});

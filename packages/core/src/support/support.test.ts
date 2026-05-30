import { describe, it, expect } from "vitest";
import {
  DEFAULT_EMERGENCY_PREFS,
  sortByPriority,
  decideAlert,
  buildAlert,
  ALERT_MESSAGE,
} from "./support.js";
import {
  getHelpProvider,
  crisisResources,
  resourcesByKind,
} from "../help/providers.js";
import type { SupportContact, EmergencyPreferences } from "@luma/shared";

const contacts: SupportContact[] = [
  { id: "c1", name: "Ana", relation: "friend", priority: 2 },
  { id: "c2", name: "Mãe", relation: "family", priority: 1 },
  { id: "c3", name: "Dra. Lia", relation: "therapist", priority: 3 },
];

describe("Help Hub", () => {
  it("BrazilProvider tem CVV (188) como linha de crise", () => {
    const cvv = getHelpProvider("BR").resources.find((r) => r.id === "cvv");
    expect(cvv?.phone).toBe("188");
  });

  it("país desconhecido cai no provedor internacional", () => {
    expect(getHelpProvider("ZZ").country).toBe("INT");
  });

  it("crisisResources prioriza linha de apoio", () => {
    const r = crisisResources("BR");
    expect(r[0]?.kind).toBe("crisis_line");
  });

  it("filtra recursos por tipo", () => {
    const emerg = resourcesByKind(getHelpProvider("BR"), "emergency");
    expect(emerg.some((r) => r.id === "samu")).toBe(true);
  });
});

describe("Rede de apoio", () => {
  it("ordena por prioridade (1 = mais alta)", () => {
    expect(sortByPriority(contacts).map((c) => c.id)).toEqual(["c2", "c1", "c3"]);
  });
});

describe("Emergency Hub — consentimento", () => {
  it("modo 'never' nunca envia (apenas sugere)", () => {
    const d = decideAlert("help", DEFAULT_EMERGENCY_PREFS, contacts);
    expect(d.action).toBe("suggest");
    expect(d.contacts).toHaveLength(0);
  });

  it("'ask_first' pede confirmação antes de enviar", () => {
    const prefs: EmergencyPreferences = { mode: "ask_first", allowedContactIds: [] };
    const d = decideAlert("help", prefs, contacts);
    expect(d.action).toBe("confirm");
    expect(d.contacts.length).toBeGreaterThan(0);
  });

  it("'allow_selected' só considera contatos autorizados", () => {
    const prefs: EmergencyPreferences = { mode: "allow_selected", allowedContactIds: ["c2"] };
    const d = decideAlert("help", prefs, contacts);
    expect(d.action).toBe("confirm");
    expect(d.contacts.map((c) => c.id)).toEqual(["c2"]);
  });

  it("'allow_selected' sem autorizados não envia", () => {
    const prefs: EmergencyPreferences = { mode: "allow_selected", allowedContactIds: [] };
    expect(decideAlert("help", prefs, contacts).action).toBe("suggest");
  });

  it("'show_plan' nunca envia nada", () => {
    const prefs: EmergencyPreferences = { mode: "allow_selected", allowedContactIds: ["c2"] };
    expect(decideAlert("show_plan", prefs, contacts).action).toBe("suggest");
  });

  it("alerta tem mensagem fixa e neutra (sem dados pessoais)", () => {
    const alert = buildAlert("talk", contacts);
    expect(alert.message).toBe(ALERT_MESSAGE);
    expect(alert.message).not.toMatch(/conversa|diário|memória/i);
  });
});

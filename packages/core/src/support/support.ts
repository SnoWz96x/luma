// Support Network + Emergency Hub — contatos de confiança e alertas opt-in.
// PURO. Nada automático sem consentimento. O alerta NUNCA contém conversa/diário.
// Veja docs/07-SAFETY-LAYER.md.
import type {
  SupportContact,
  EmergencyPreferences,
  EmergencyMode,
} from "@luma/shared";

export const DEFAULT_EMERGENCY_PREFS: EmergencyPreferences = {
  mode: "never",
  allowedContactIds: [],
};

/** Ordena contatos por prioridade (1 = mais alta). */
export function sortByPriority(contacts: SupportContact[]): SupportContact[] {
  return [...contacts].sort((a, b) => a.priority - b.priority);
}

/** Mensagem fixa e neutra do alerta. JAMAIS inclui conversa/diário/memórias. */
export const ALERT_MESSAGE =
  "O usuário solicitou apoio e gostaria de ser contatado.";

export type AlertKind = "talk" | "help" | "show_plan";

export interface AlertRequest {
  kind: AlertKind;
  /** contatos que receberiam o alerta (já filtrados por consentimento) */
  contacts: SupportContact[];
  message: string;
}

export interface AlertDecision {
  /** o que a UI deve fazer */
  action: "blocked" | "suggest" | "confirm" | "send";
  /** contatos elegíveis para receber (vazio se não aplicável) */
  contacts: SupportContact[];
  message: string;
}

/**
 * Decide o que acontece quando o usuário pede apoio, respeitando as preferências.
 * NUNCA envia sozinho: 'send' só sai quando o modo permite e há contatos.
 * 'show_plan' apenas exibe o plano de apoio — nunca dispara nada.
 */
export function decideAlert(
  kind: AlertKind,
  prefs: EmergencyPreferences,
  contacts: SupportContact[],
): AlertDecision {
  // "Mostrar meu plano de apoio" nunca envia nada
  if (kind === "show_plan") {
    return { action: "suggest", contacts: sortByPriority(contacts), message: "" };
  }

  const mode: EmergencyMode = prefs.mode;

  if (mode === "never" || mode === "suggest_only") {
    return { action: "suggest", contacts: [], message: ALERT_MESSAGE };
  }

  const eligible =
    mode === "allow_selected"
      ? contacts.filter((c) => prefs.allowedContactIds.includes(c.id))
      : contacts;

  if (eligible.length === 0) {
    return { action: "suggest", contacts: [], message: ALERT_MESSAGE };
  }

  // ask_first sempre confirma; allow_selected envia aos autorizados (após confirmação na UI)
  return {
    action: mode === "ask_first" ? "confirm" : "confirm",
    contacts: sortByPriority(eligible),
    message: ALERT_MESSAGE,
  };
}

/** Monta o alerta final (após o usuário confirmar na UI). */
export function buildAlert(
  kind: AlertKind,
  contacts: SupportContact[],
): AlertRequest {
  return { kind, contacts: sortByPriority(contacts), message: ALERT_MESSAGE };
}

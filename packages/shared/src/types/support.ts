// Rede de apoio, recursos de ajuda e emergência. Veja docs/07-SAFETY-LAYER.md.
// Tudo OPCIONAL. Nada automático sem consentimento. Nunca expõe conversa/diário.

// ---- Help Hub (recursos por país, via plugins) ----
export type ResourceKind =
  | "crisis_line" // linha de apoio emocional (ex.: CVV)
  | "health" // saúde mental pública (ex.: CAPS/SUS)
  | "emergency" // emergência (ex.: SAMU)
  | "urgent_care" // pronto-atendimento (ex.: UPA)
  | "ngo"; // ONGs, universidades

export interface HelpResource {
  id: string;
  name: string;
  kind: ResourceKind;
  /** telefone (curto, p/ discar) */
  phone?: string;
  /** site / chat online */
  url?: string;
  /** descrição curta, acolhedora */
  description: string;
  /** disponibilidade (ex.: "24h, todos os dias") */
  availability?: string;
}

export interface HelpProvider {
  /** código do país ISO (ex.: 'BR') */
  country: string;
  countryName: string;
  resources: HelpResource[];
}

// ---- Rede de apoio (contatos de confiança) ----
export type ContactRelation =
  | "family"
  | "friend"
  | "partner"
  | "therapist"
  | "mentor"
  | "other";

export interface SupportContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  relation: ContactRelation;
  /** prioridade 1 (mais alta) .. 5 */
  priority: number;
}

// ---- Emergency Hub (preferências de alerta, 100% opt-in) ----
export type EmergencyMode =
  | "never" // nunca enviar alertas
  | "suggest_only" // apenas sugerir buscar ajuda
  | "ask_first" // perguntar antes de qualquer envio
  | "allow_selected"; // permitir alertas p/ contatos escolhidos

export interface EmergencyPreferences {
  mode: EmergencyMode;
  /** ids de contatos autorizados (quando allow_selected) */
  allowedContactIds: string[];
}

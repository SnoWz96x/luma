// Help Hub — recursos de ajuda por país (arquitetura de plugins).
// Veja docs/07-SAFETY-LAYER.md. Os dados são públicos e oficiais.
// IMPORTANTE: LUMA não é serviço de emergência; apenas aponta recursos reais.
import type { HelpProvider, HelpResource, ResourceKind } from "@luma/shared";

// --- Brasil ---
const BrazilProvider: HelpProvider = {
  country: "BR",
  countryName: "Brasil",
  resources: [
    {
      id: "cvv",
      name: "CVV — Centro de Valorização da Vida",
      kind: "crisis_line",
      phone: "188",
      url: "https://www.cvv.org.br/",
      description: "Apoio emocional e prevenção do suicídio, sigiloso e gratuito.",
      availability: "24h, todos os dias",
    },
    {
      id: "caps",
      name: "CAPS — Centro de Atenção Psicossocial",
      kind: "health",
      url: "https://www.gov.br/saude/pt-br",
      description: "Atendimento em saúde mental pública pelo SUS, perto de você.",
      availability: "Horário comercial (varia por unidade)",
    },
    {
      id: "samu",
      name: "SAMU — Emergências médicas",
      kind: "emergency",
      phone: "192",
      description: "Emergências de saúde com risco à vida.",
      availability: "24h",
    },
    {
      id: "upa",
      name: "UPA — Unidade de Pronto Atendimento",
      kind: "urgent_care",
      description: "Pronto-atendimento do SUS para urgências.",
      availability: "24h",
    },
  ],
};

// --- Genérico/internacional (fallback) ---
const GenericProvider: HelpProvider = {
  country: "INT",
  countryName: "Internacional",
  resources: [
    {
      id: "findahelpline",
      name: "Find A Helpline",
      kind: "crisis_line",
      url: "https://findahelpline.com/",
      description: "Encontre linhas de apoio emocional gratuitas no seu país.",
      availability: "Varia por país",
    },
  ],
};

const PROVIDERS: Record<string, HelpProvider> = {
  BR: BrazilProvider,
  INT: GenericProvider,
};

/** Retorna o provedor de recursos do país (fallback internacional). */
export function getHelpProvider(country: string): HelpProvider {
  return PROVIDERS[country.toUpperCase()] ?? GenericProvider;
}

/** Filtra recursos por tipo (ex.: só linhas de crise). */
export function resourcesByKind(
  provider: HelpProvider,
  kind: ResourceKind,
): HelpResource[] {
  return provider.resources.filter((r) => r.kind === kind);
}

/** Linha(s) de crise priorizadas — usadas quando a Safety Layer pede recursos. */
export function crisisResources(country: string): HelpResource[] {
  const p = getHelpProvider(country);
  const crisis = resourcesByKind(p, "crisis_line");
  return crisis.length ? crisis : p.resources.slice(0, 1);
}

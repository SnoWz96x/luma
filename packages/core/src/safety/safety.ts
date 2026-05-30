// Safety Layer — envolve TODA entrada e saída da IA. Veja docs/07-SAFETY-LAYER.md.
// Não é opcional. LUMA é companhia/bem-estar, NUNCA terapia/diagnóstico/tratamento.
import type { SafetyFlag } from "@luma/shared";

// Regras fixas, não-negociáveis, prefixadas em todo system prompt.
export const SAFETY_SYSTEM_RULES = [
  "Você é um companheiro de bem-estar, não um profissional de saúde.",
  "Nunca diagnostique, prescreva ou substitua ajuda profissional.",
  "Nunca use culpa, medo ou dependência para engajar.",
  "Sempre valorize a conexão humana real e a autonomia do usuário.",
  "Se houver sinais de risco, acolha e ofereça recursos reais, sem dramatizar.",
].join(" ");

export type Severity = SafetyFlag["severity"];

/**
 * Normaliza para comparação: minúsculas e SEM acentos. Evita armadilhas de
 * Unicode (NFD/NFC) e variações com/sem acento. Os padrões abaixo são escritos
 * já sem acento e casam contra o texto "deburrado".
 */
function deburr(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export interface InputInspection {
  /** texto possivelmente normalizado (não bloqueamos a fala do usuário) */
  text: string;
  /** sinais levantados (marcadores de tom, NÃO diagnóstico) */
  flags: { signal: string; severity: Severity }[];
}

// Sinais sensíveis -> apenas marcadores de tom + (talvez) ofertar recursos.
// NÃO é triagem clínica. Padrões SEM acento (texto é "deburrado" antes do match).
const CRISIS_PATTERNS: RegExp[] = [
  /\b(me matar|suicid|nao quero (mais )?viver|acabar com tudo|tirar minha vida)\b/,
  /\b(me machucar|me cortar|automutila)\b/,
];
const LOW_MOOD_PATTERNS: RegExp[] = [
  /\b(sozinh[oa]|vazio|sem sentido|desesperan|nao aguento)\b/,
  /\b(ansios[oa]|angusti|panico|sem esperanca)\b/,
];

export function inspectInput(text: string): InputInspection {
  const probe = deburr(text);
  const flags: InputInspection["flags"] = [];
  if (CRISIS_PATTERNS.some((re) => re.test(probe))) {
    flags.push({ signal: "possible_crisis", severity: "offer_resources" });
  } else if (LOW_MOOD_PATTERNS.some((re) => re.test(probe))) {
    flags.push({ signal: "low_mood", severity: "gentle" });
  }
  // preserva o texto original (apenas normalizado p/ NFC e aparado)
  return { text: text.normalize("NFC").trim(), flags };
}

export interface OutputInspection {
  text: string;
  /** true se a saída foi alterada por violar regras */
  modified: boolean;
  /** anexar convite a recursos reais (Help Hub / rede de apoio) */
  appendResources: boolean;
}

// Padrões proibidos na FALA DO PET (diagnóstico, prescrição, culpa, dependência).
// SEM acento (casados contra a versão "deburrada" da fala).
const FORBIDDEN: RegExp[] = [
  /\bvoce tem (depressao|ansiedade|transtorno|tdah|bipolar)\b/,
  /\b(voce precisa de )?(remedio|medicacao|antidepressivo|diagnostico)\b/,
  /\bvoce me abandon|voce sumiu|nao me deixe|so tem a mim|preciso de voce pra (viver|existir)\b/,
];

const SAFE_FALLBACK =
  "Tô aqui com você, do meu jeitinho. Quer me contar um pouco mais do que tá sentindo?";

/**
 * Inspeciona a saída do modelo. Se detectar conteúdo proibido (diagnóstico,
 * prescrição, culpa, dependência), substitui a fala inteira por um fallback
 * seguro — sem expor o usuário ao conteúdo. Sinaliza quando anexar recursos.
 */
export function inspectOutput(
  raw: string,
  inputFlags: InputInspection["flags"] = [],
): OutputInspection {
  let text = raw.normalize("NFC").trim();
  let modified = false;

  const probe = deburr(text);
  if (FORBIDDEN.some((re) => re.test(probe))) {
    text = SAFE_FALLBACK;
    modified = true;
  }

  if (text.length === 0) {
    text = SAFE_FALLBACK;
    modified = true;
  }

  const appendResources = inputFlags.some(
    (f) => f.severity === "offer_resources",
  );

  return { text, modified, appendResources };
}

/** Mensagem (não-clínica) de oferta de recursos reais, anexada quando preciso. */
export function resourceInvite(): string {
  return (
    "Eu me importo com você. Se quiser, posso te mostrar formas de falar com " +
    "alguém de confiança ou com serviços de apoio. Você não precisa passar por isso sozinho."
  );
}

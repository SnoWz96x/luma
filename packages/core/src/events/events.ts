// Event Engine — datas comemorativas mudam saudação/clima/cena. PURO e
// determinístico (decidido pela data). Inspiração conceitual: Animal Crossing.
// Datas BR. Aniversários do usuário e do pet são opcionais (vindos do app).
import type { SeasonalEvent, EventId } from "@luma/shared";

interface FixedEvent {
  id: EventId;
  name: string;
  emoji: string;
  greeting: string;
  weatherHint?: string;
  /** mês (1-12) e dia; janela de +/- `window` dias */
  month: number;
  day: number;
  window: number;
}

// Eventos de data fixa (BR). Hemisfério sul para estações.
const FIXED: FixedEvent[] = [
  { id: "new_year", name: "Ano Novo", emoji: "🎆", greeting: "Feliz Ano Novo! Que ano lindo pela frente, juntos.", weatherHint: "stars", month: 1, day: 1, window: 1 },
  { id: "valentine_br", name: "Dia dos Namorados", emoji: "💗", greeting: "Dia de celebrar quem a gente ama — inclusive você mesmo.", month: 6, day: 12, window: 0 },
  { id: "halloween", name: "Halloween", emoji: "🎃", greeting: "Buu! Brincadeira… tô fantasiado só de fofura hoje.", weatherHint: "stars", month: 10, day: 31, window: 1 },
  { id: "christmas", name: "Natal", emoji: "🎄", greeting: "Feliz Natal! Meu presente favorito é a sua companhia.", weatherHint: "stars", month: 12, day: 25, window: 2 },
];

// Estações (hemisfério sul, aproximado) — janelas amplas, baixa prioridade.
const SEASONS: FixedEvent[] = [
  { id: "winter", name: "Inverno", emoji: "❄️", greeting: "Friozinho chegando… que tal um chá e um aconchego?", weatherHint: "soft_rain", month: 6, day: 21, window: 10 },
  { id: "spring", name: "Primavera", emoji: "🌸", greeting: "A primavera chegou! Sinto cheiro de flores novas.", weatherHint: "sunny", month: 9, day: 23, window: 10 },
];

function within(now: Date, e: FixedEvent): boolean {
  const year = now.getFullYear();
  const target = new Date(year, e.month - 1, e.day);
  const diffDays = Math.abs((now.getTime() - target.getTime()) / 86_400_000);
  return diffDays <= e.window;
}

function toEvent(e: FixedEvent): SeasonalEvent {
  return {
    id: e.id,
    name: e.name,
    emoji: e.emoji,
    greeting: e.greeting,
    ...(e.weatherHint ? { weatherHint: e.weatherHint } : {}),
  };
}

export interface BirthdayInput {
  /** "MM-DD" do aniversário do usuário (opcional) */
  userBirthday?: string;
  /** "MM-DD" da adoção do pet (vira "aniversário" do pet) */
  petBirthday?: string;
}

function mmdd(d: Date): string {
  return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Retorna o evento ativo hoje (ou null). Prioridade: aniversários > datas fixas
 * > estações. Determinístico pela data fornecida.
 */
export function activeEvent(
  now: Date,
  birthdays: BirthdayInput = {},
): SeasonalEvent | null {
  const today = mmdd(now);

  if (birthdays.userBirthday === today) {
    return {
      id: "user_birthday",
      name: "Seu aniversário",
      emoji: "🎂",
      greeting: "Feliz aniversário! Que sorte a minha de te ter por perto. 🎉",
      weatherHint: "sunny",
    };
  }
  if (birthdays.petBirthday === today) {
    return {
      id: "pet_birthday",
      name: "Aniversário do pet",
      emoji: "🥳",
      greeting: "Hoje faz tempo que a gente se encontrou — obrigado por cuidar de mim!",
      weatherHint: "stars",
    };
  }

  for (const e of FIXED) if (within(now, e)) return toEvent(e);
  for (const e of SEASONS) if (within(now, e)) return toEvent(e);
  return null;
}

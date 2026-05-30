// Gerador procedural determinístico (seed fixa -> catálogo reprodutível).
// Veja docs/05-CHARACTER-ENGINE.md. Regras de tom respeitam a Safety Layer:
// "missedYou" jamais usa culpa.
import type {
  CharacterDef,
  CharacterCategory,
  Rarity,
  Emotion,
} from "@luma/shared";
import { NAME_BANK, CATEGORY_CONFIG, TONES } from "./data.js";

// ---- RNG determinístico (mulberry32) ----
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CATEGORIES = Object.keys(CATEGORY_CONFIG) as CharacterCategory[];

// Curva de raridade (peso). Muitos common, pouquíssimos legendary.
const RARITY_TABLE: { rarity: Rarity; weight: number }[] = [
  { rarity: "common", weight: 50 },
  { rarity: "uncommon", weight: 25 },
  { rarity: "rare", weight: 15 },
  { rarity: "epic", weight: 8 },
  { rarity: "legendary", weight: 2 },
];

function slugify(name: string, taken: Set<string>): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  let id = base;
  let n = 2;
  while (taken.has(id)) id = `${base}-${n++}`;
  taken.add(id);
  return id;
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function pickMany<T>(rng: () => number, arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && pool.length; i++) {
    out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]!);
  }
  return out;
}

function pickRarity(rng: () => number): Rarity {
  const total = RARITY_TABLE.reduce((s, r) => s + r.weight, 0);
  let roll = rng() * total;
  for (const r of RARITY_TABLE) {
    if ((roll -= r.weight) <= 0) return r.rarity;
  }
  return "common";
}

function buildPhrases() {
  // SEM culpa em missedYou (Safety Layer).
  return {
    greeting: [`Oi, que bom te ver.`, `Você chegou — o dia ficou mais leve.`],
    idle: [`Tô aqui, no seu ritmo.`, `Que silêncio gostoso.`, `*observa o cantinho*`],
    happy: [`Senti sua alegria daqui!`, `Isso me deixou cheio de luz.`],
    sleepy: [`Tô ficando soninho...`, `Vamos descansar um pouquinho?`],
    missedYou: [`Que bom te ver de novo.`, `Guardei um cantinho pra você.`, `Senti sua falta — e tá tudo bem.`],
    encourage: [`Que tal um gole de água?`, `Manda um oi pra alguém que você gosta hoje?`, `Respira fundo comigo?`],
  };
}

const BASE_EMOTIONS: Emotion[] = ["happy", "calm", "curious", "comfort"];

function buildEvolution(id: string, rng: () => number) {
  const stageNames = [
    ["Faísca", "Brilho", "Estrela"],
    ["Filhote", "Jovem", "Crescido"],
    ["Semente", "Broto", "Florescido"],
    ["Eco", "Forma", "Pleno"],
  ];
  const set = pick(rng, stageNames);
  const count = 2 + Math.floor(rng() * 2); // 2 ou 3 estágios
  const stages = set.slice(0, count).map((name, i) => ({
    id: i,
    name,
    visual: `${id}_s${i}`,
  }));
  // evolução baseada na VIDA do usuário (traços), não só XP
  const triggers = pickMany(rng, ["creative", "adventurous", "calm", "social"], 2).map(
    (trait) => ({ trait, minWeight: 0.6, branch: `${trait}` }),
  );
  return { stages, triggers };
}

export interface GenerateOptions {
  count?: number;
  seed?: number;
}

/** Gera o catálogo de personagens de forma determinística. */
export function generateCharacters(opts: GenerateOptions = {}): CharacterDef[] {
  const count = opts.count ?? 100;
  const rng = mulberry32(opts.seed ?? 1234);
  const takenIds = new Set<string>();
  const out: CharacterDef[] = [];

  for (let i = 0; i < count; i++) {
    const name = NAME_BANK[i % NAME_BANK.length]!;
    const id = slugify(name, takenIds);
    // distribuição equilibrada entre categorias (round-robin)
    const category = CATEGORIES[i % CATEGORIES.length]!;
    const cfg = CATEGORY_CONFIG[category];

    const energy = pick(rng, ["calm", "balanced", "lively"] as const);
    const traits = pickMany(rng, cfg.traits, 3);
    const archetype = pick(rng, cfg.archetypes);
    const species = pick(rng, cfg.species);

    out.push({
      id,
      name,
      species,
      category,
      rarity: pickRarity(rng),
      biome: cfg.biome,
      archetype,
      personality: { traits, tone: TONES[energy]!, energy },
      story: `${name} é ${species.replace(/-/g, " ")} que escolheu crescer junto de você. ${archetype[0]!.toUpperCase()}${archetype.slice(1)}.`,
      phrases: buildPhrases(),
      emotions: pickMany(rng, [...BASE_EMOTIONS, "sleepy", "excited"] as Emotion[], 4 + Math.floor(rng() * 2)),
      preferences: {
        likes: pickMany(rng, cfg.likes, 3),
        dislikes: pickMany(rng, cfg.dislikes, 2),
      },
      animations: {
        idle: `${id}_idle`,
        happy: `${id}_happy`,
        sleep: `${id}_sleep`,
        curious: `${id}_curious`,
        comfort: `${id}_comfort`,
      },
      evolution: buildEvolution(id, rng),
    });
  }

  return out;
}

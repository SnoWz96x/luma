// Bancos criativos para geração procedural. Veja docs/05-CHARACTER-ENGINE.md
import type { CharacterCategory } from "@luma/shared";

// Nomes-semente pedidos no briefing vêm primeiro (garantidos no catálogo),
// seguidos de um banco grande de nomes curtos e fofos (>100 únicos).
export const NAME_BANK: string[] = [
  // pedidos no briefing
  "Luma", "Momo", "Nami", "Sprout", "Orbit", "Bibo", "Koko", "Tiko", "Vee", "Pingo",
  // banco adicional
  "Mochi", "Pip", "Nuvi", "Tofu", "Bubu", "Lumi", "Pixu", "Dodo", "Fofo", "Yumi",
  "Suki", "Tato", "Coco", "Mimo", "Bobo", "Zuzu", "Plim", "Nino", "Tuto", "Gigi",
  "Wawa", "Kiki", "Lalo", "Popo", "Riri", "Sasa", "Tati", "Uba", "Vovo", "Wibo",
  "Xixi", "Yaya", "Zazu", "Aki", "Belo", "Cami", "Duda", "Eko", "Fubá", "Gomo",
  "Hibi", "Indi", "Juju", "Kibo", "Lila", "Mira", "Nuno", "Olo", "Puff", "Quel",
  "Roro", "Simo", "Tibo", "Umi", "Vivi", "Waki", "Xum", "Yumo", "Zeze", "Abi",
  "Bobi", "Cuco", "Dami", "Elo", "Faro", "Guga", "Halo", "Ivo", "Joia", "Kuro",
  "Lume", "Mau", "Nita", "Ovo", "Pomo", "Quim", "Rumo", "Sol", "Teo", "Uni",
  "Vela", "Wim", "Xara", "Yoko", "Zumi", "Aço", "Brisa", "Cris", "Dindo", "Estê",
  "Flor", "Gota", "Haru", "Iris", "Jaca", "Kako", "Lola", "Mar", "Nuvem", "Onda",
  "Pena", "Ravi", "Seto", "Tuca", "Urso", "Vento", "Wuf", "Xis", "Yara", "Zen",
];

export interface CategoryConfig {
  species: string[];
  biome: string;
  archetypes: string[];
  traits: string[];
  likes: string[];
  dislikes: string[];
}

export const CATEGORY_CONFIG: Record<CharacterCategory, CategoryConfig> = {
  animal: {
    species: ["cachorro-corajoso", "lobinho-lua", "tigre-brasa", "raposa-fogo", "urso-montanha", "gato-nuvem", "panda-soneca", "lontra-rio"],
    biome: "quarto",
    archetypes: ["o companheiro leal", "o protetor valente", "o aventureiro fiel", "o brincalhão destemido"],
    traits: ["leal", "corajoso", "protetor", "brincalhão", "valente", "afetuoso"],
    likes: ["aventuras", "correr", "petiscos", "explorar o quintal"],
    dislikes: ["ficar preso", "tédio", "ficar sozinho demais"],
  },
  robot: {
    species: ["robozinho-lata", "andróide-bolso", "bot-coração", "mecha-mini"],
    biome: "estacao-espacial",
    archetypes: ["o ajudante gentil", "o lógico curioso", "o protetor calmo"],
    traits: ["prestativo", "organizado", "curioso", "leal"],
    likes: ["organizar coisas", "aprender", "rotinas", "luzes piscando"],
    dislikes: ["bagunça", "imprevistos bruscos", "bateria fraca"],
  },
  ghost: {
    species: ["fantasminha-lençol", "espírito-vela", "assombro-fofo", "alma-brisa"],
    biome: "biblioteca",
    archetypes: ["o tímido acolhedor", "o sonhador noturno", "o guardião silencioso"],
    traits: ["tímido", "gentil", "sonhador", "calmo"],
    likes: ["noites calmas", "histórias", "esconde-esconde", "velas"],
    dislikes: ["gritos", "luz forte demais", "solidão prolongada"],
  },
  plant: {
    species: ["brotinho-mágico", "cacto-abraço", "flor-sino", "samambaia-dança"],
    biome: "jardim",
    archetypes: ["o crescente esperançoso", "o paciente sereno", "o otimista verde"],
    traits: ["otimista", "paciente", "curioso", "constante"],
    likes: ["sol", "água", "constância", "manhãs"],
    dislikes: ["esquecimento", "frio demais", "pressa"],
  },
  dragon: {
    species: ["dragão-brasa", "dragão-trovão", "wyvern-sombrio", "draco-vulcão", "serpente-relâmpago", "draco-gelo"],
    biome: "ilha",
    archetypes: ["o guerreiro destemido", "o protetor flamejante", "o aventureiro indomável", "o guardião corajoso"],
    traits: ["corajoso", "destemido", "protetor", "forte", "aventureiro", "leal"],
    likes: ["aventuras", "tesouros", "voar alto", "fogueiras", "desafios"],
    dislikes: ["covardia", "tédio", "ficar preso"],
  },
  alien: {
    species: ["alienígena-geleia", "visitante-orbe", "et-bolso", "estrangeiro-cosmo"],
    biome: "espaco",
    archetypes: ["o curioso viajante", "o gentil explorador", "o observador amigável"],
    traits: ["curioso", "amigável", "explorador", "observador"],
    likes: ["descobrir coisas", "estrelas", "perguntas", "novidades"],
    dislikes: ["rotina rígida", "preconceito", "barulho caótico"],
  },
  star: {
    species: ["estrelinha-de-luz", "cometa-fofo", "constelação-mini", "brilho-noturno"],
    biome: "ceu",
    archetypes: ["a guardiã gentil", "o guia luminoso", "o sonhador brilhante"],
    traits: ["gentil", "acolhedor", "sonhador", "calmo"],
    likes: ["noites estreladas", "conversas calmas", "desejos", "silêncio bom"],
    dislikes: ["pressa", "barulho demais", "escuridão total"],
  },
  slime: {
    species: ["slime-geleia", "blob-arco-íris", "gosma-feliz", "pudim-vivo"],
    biome: "aquario",
    archetypes: ["o elástico alegre", "o tranquilo maleável", "o brincalhão macio"],
    traits: ["alegre", "flexível", "brincalhão", "tranquilo"],
    likes: ["pular", "água", "abraços moles", "cores"],
    dislikes: ["cantos duros", "calor demais", "regras rígidas"],
  },
  cloud: {
    species: ["nuvenzinha-fofa", "cúmulo-soneca", "névoa-doce", "trovão-tímido"],
    biome: "ceu",
    archetypes: ["o sonhador flutuante", "o calmo passageiro", "o gentil chuvisco"],
    traits: ["sonhador", "calmo", "gentil", "leve"],
    likes: ["flutuar", "céu aberto", "chuvinha", "preguiça boa"],
    dislikes: ["vento forte", "pressa", "dias secos demais"],
  },
  mushroom: {
    species: ["cogumelo-lanterna", "shitake-sábio", "fungo-fada", "tampinha-feliz"],
    biome: "floresta",
    archetypes: ["o sábio acolhedor", "o quietinho curioso", "o guardião da floresta"],
    traits: ["sábio", "quieto", "curioso", "acolhedor"],
    likes: ["sombra", "chuva", "florestas", "histórias antigas"],
    dislikes: ["sol forte", "barulho", "ser pisado"],
  },
  magical: {
    species: ["criatura-fada", "espírito-cristal", "ser-aurora", "guardião-mágico"],
    biome: "floresta",
    archetypes: ["o encantador gentil", "o místico sereno", "o sonhador mágico"],
    traits: ["mágico", "gentil", "sonhador", "sereno"],
    likes: ["magia pequena", "auroras", "segredos bons", "luz suave"],
    dislikes: ["cinismo", "pressa", "frieza"],
  },
  monster: {
    species: ["monstrinho-peludo", "bicho-papão-fofo", "fera-bolso", "goblin-travesso", "ogro-mini", "kaiju-bebê", "bicho-dentuço"],
    biome: "floresta",
    archetypes: ["o bagunceiro leal", "o valentão de bom coração", "o aventureiro destemido", "o protetor durão"],
    traits: ["travesso", "corajoso", "leal", "destemido", "brincalhão", "protetor"],
    likes: ["bagunça boa", "aventuras", "lutinhas de brincadeira", "comer bastante"],
    dislikes: ["regras chatas", "tédio", "banho"],
  },
  "pixel-mascot": {
    species: ["mascote-pixel", "herói-8bit", "bichinho-retrô", "sprite-feliz"],
    biome: "casinha",
    archetypes: ["o nostálgico animado", "o aventureiro retrô", "o leal pixelado"],
    traits: ["animado", "nostálgico", "corajoso", "leal"],
    likes: ["jogos", "moedinhas", "fases novas", "música chiptune"],
    dislikes: ["game over", "lag", "tédio"],
  },
  "minimal-mascot": {
    species: ["mascote-mínimo", "forminha-feliz", "traço-vivo", "ponto-gentil"],
    biome: "quarto",
    archetypes: ["o simples sereno", "o minimalista calmo", "o gentil essencial"],
    traits: ["sereno", "simples", "calmo", "gentil"],
    likes: ["espaço limpo", "silêncio", "linhas suaves", "respiro"],
    dislikes: ["excesso", "bagunça", "ruído"],
  },
};

export const TONES: Record<string, string> = {
  calm: "fala macia e serena, sem pressa",
  balanced: "fala leve e calorosa, no seu ritmo",
  lively: "fala animada e brilhante, cheia de energia gentil",
};

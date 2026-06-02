// Renderizador de pet PURO (sem framework): gera SVG + classe de animação a
// partir do estado sensorial. Reutilizado por Desktop (Tauri/React) e Web (Next).
// Veja docs/09-ARTE.md. Estilo: kawaii vetorial (soft).
//
// Cada personagem tem: (1) silhueta + traços CARACTERÍSTICOS da categoria
// (dragão tem chifres/asas, ET antenas, animal orelhas...) e (2) uma COR ÚNICA
// derivada do id — então dois personagens da mesma categoria não ficam iguais.
import type {
  CharacterDef,
  SensorySignals,
  LifeStage,
  EvolutionBranch,
} from "@luma/shared";

export type PetAnimation = SensorySignals["animation"];

/** Mapa estado -> classe CSS de animação (definida em PET_ANIMATION_CSS). */
export const ANIMATION_CLASS: Record<PetAnimation, string> = {
  idle: "luma-breathe",
  happy: "luma-hop",
  curious: "luma-sway",
  comfort: "luma-breathe",
  sleep: "luma-snooze",
};

/** CSS das animações (injete uma vez no app). Respeita prefers-reduced-motion. */
export const PET_ANIMATION_CSS = `
.luma-breathe{animation:luma-breathe 3.4s ease-in-out infinite;transform-origin:50% 90%}
@keyframes luma-breathe{0%,100%{transform:scale(1,1)}50%{transform:scale(1.04,.97)}}
.luma-hop{animation:luma-hop .7s ease-in-out infinite;transform-origin:50% 90%}
@keyframes luma-hop{0%,100%{transform:translateY(0) scale(1,1)}30%{transform:translateY(-18px) scale(.96,1.05)}60%{transform:translateY(0) scale(1.08,.92)}}
.luma-sway{animation:luma-sway 4s ease-in-out infinite;transform-origin:50% 90%}
@keyframes luma-sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
.luma-snooze{animation:luma-snooze 4s ease-in-out infinite;transform-origin:50% 90%}
@keyframes luma-snooze{0%,100%{transform:scale(1,1) translateY(0)}50%{transform:scale(1.05,.95) translateY(3px)}}
.luma-blink{animation:luma-blink 4.5s infinite;transform-origin:center}
@keyframes luma-blink{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}
@media (prefers-reduced-motion: reduce){
  .luma-breathe,.luma-hop,.luma-sway,.luma-snooze,.luma-blink{animation:none!important}
}
`;

// ----------------------------------------------------------------------------
// COR — base por categoria (HSL) + variação única por personagem (id)
// ----------------------------------------------------------------------------

/** Matiz/saturação/luz base por categoria. A matiz varia por personagem. */
const CATEGORY_HSL: Record<string, { h: number; s: number; l: number; range: number }> = {
  star: { h: 45, s: 100, l: 68, range: 25 },
  slime: { h: 152, s: 60, l: 60, range: 60 },
  animal: { h: 28, s: 80, l: 72, range: 50 },
  plant: { h: 96, s: 55, l: 60, range: 40 },
  cloud: { h: 222, s: 55, l: 85, range: 30 },
  robot: { h: 222, s: 15, l: 72, range: 200 },
  ghost: { h: 260, s: 50, l: 86, range: 40 },
  dragon: { h: 8, s: 80, l: 70, range: 180 },
  alien: { h: 122, s: 60, l: 70, range: 80 },
  mushroom: { h: 0, s: 70, l: 78, range: 30 },
  magical: { h: 285, s: 65, l: 75, range: 60 },
  monster: { h: 210, s: 60, l: 68, range: 200 },
  "pixel-mascot": { h: 45, s: 90, l: 65, range: 200 },
  "minimal-mascot": { h: 222, s: 10, l: 84, range: 200 },
};

function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${((h % 360) + 360) % 360} ${s}% ${l}%)`;
}

/** Cores [claro, escuro, contorno] únicas do personagem (variação por id). */
function characterColors(def: CharacterDef): [string, string, string] {
  const base = CATEGORY_HSL[def.category] ?? CATEGORY_HSL.star!;
  const r = hashId(def.id);
  // desloca a matiz dentro do "range" da categoria (centrado), determinístico
  const shift = (r % (base.range + 1)) - base.range / 2;
  const h = base.h + shift;
  // leve variação de saturação/luz para diferenciar ainda mais
  const s = Math.max(12, Math.min(100, base.s + ((r >> 8) % 16) - 8));
  const l = base.l;
  return [hsl(h, s, l + 8), hsl(h, s, l - 10), hsl(h, Math.min(100, s + 10), l - 30)];
}

interface FaceParts {
  eyes: string;
  mouth: string;
  extra: string;
}

function faceFor(state: PetAnimation, ink = "#3a2d12"): FaceParts {
  switch (state) {
    case "happy":
      return {
        eyes: `<path d="M44 58 Q49 52 54 58" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M66 58 Q71 52 76 58" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
        mouth: `<path d="M53 67 Q60 76 67 67 Z" fill="#7a3b3b"/>`,
        extra: "",
      };
    case "sleep":
      return {
        eyes: `<path d="M44 59 Q49 63 54 59" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M66 59 Q71 63 76 59" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
        mouth: `<circle cx="60" cy="70" r="3" fill="#7a3b3b" opacity=".5"/>`,
        extra: `<text x="84" y="40" font-size="16" fill="#cdbff5">z</text>`,
      };
    case "curious":
      return {
        eyes: `<g class="luma-blink"><circle cx="51" cy="58" r="6.5" fill="${ink}"/><circle cx="73" cy="58" r="6.5" fill="${ink}"/><circle cx="53" cy="57" r="2" fill="#fff"/><circle cx="75" cy="57" r="2" fill="#fff"/></g>`,
        mouth: `<circle cx="60" cy="69" r="3" fill="#7a3b3b"/>`,
        extra: "",
      };
    default: // idle, comfort
      return {
        eyes: `<g class="luma-blink"><circle cx="49" cy="58" r="6.5" fill="${ink}"/><circle cx="71" cy="58" r="6.5" fill="${ink}"/><circle cx="51" cy="56" r="2" fill="#fff"/><circle cx="73" cy="56" r="2" fill="#fff"/></g>`,
        mouth: `<path d="M55 68 Q60 73 65 68" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
        extra: "",
      };
  }
}

/** Silhueta do corpo por categoria (path SVG em viewBox 0 0 120 120). */
function bodyPath(category: string): string {
  switch (category) {
    case "star":
    case "pixel-mascot":
      return `M60 14 L74 46 L108 50 L82 73 L90 107 L60 88 L30 107 L38 73 L12 50 L46 46 Z`;
    case "slime":
      return `M22 86 Q18 44 60 40 Q102 44 98 86 Q98 100 60 100 Q22 100 22 86 Z`;
    case "cloud":
      return `M30 78 Q20 78 22 66 Q14 58 26 52 Q28 38 46 42 Q54 30 70 40 Q92 36 92 56 Q104 60 96 74 Q98 86 82 84 Q60 92 30 78 Z`;
    case "ghost":
      return `M30 60 Q30 28 60 28 Q90 28 90 60 L90 96 L80 88 L70 96 L60 88 L50 96 L40 88 L30 96 Z`;
    case "alien":
      // cabeça grande e oval (vibe ET)
      return `M60 30 Q92 30 92 64 Q92 100 60 102 Q28 100 28 64 Q28 30 60 30 Z`;
    case "robot":
      // corpo com cantos arredondados (lata)
      return `M30 40 Q30 34 36 34 L84 34 Q90 34 90 40 L90 96 Q90 102 84 102 L36 102 Q30 102 30 96 Z`;
    case "dragon":
    case "monster":
      // corpo robusto com barriga
      return `M28 64 Q28 36 60 36 Q92 36 92 64 Q92 102 60 102 Q28 102 28 64 Z`;
    default: // blob arredondado padrão (plant, etc.)
      return `M26 70 Q26 36 60 34 Q94 36 94 70 Q94 102 60 102 Q26 102 26 70 Z`;
  }
}

/**
 * Traços característicos por categoria. Retorna SVG desenhado ATRÁS (`behind`,
 * ex.: orelhas, asas, antenas) e NA FRENTE (`front`, ex.: barriga, manchas).
 * `c1` é a cor escura do corpo (para os apêndices casarem). `stroke` o contorno.
 */
function categoryFeatures(
  category: string,
  c0: string,
  c1: string,
  stroke: string,
): { behind: string; front: string } {
  const sw = `stroke="${stroke}" stroke-width="3" stroke-linejoin="round"`;
  switch (category) {
    case "animal":
      return {
        behind:
          `<path d="M34 42 Q30 16 48 30 Z" fill="${c1}" ${sw}/>` + // orelha esq
          `<path d="M86 42 Q90 16 72 30 Z" fill="${c1}" ${sw}/>`, // orelha dir
        front:
          `<circle cx="60" cy="74" r="3.2" fill="${stroke}"/>` + // focinho
          `<path d="M60 77 Q56 82 52 80 M60 77 Q64 82 68 80" stroke="${stroke}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
      };
    case "dragon":
      return {
        behind:
          `<path d="M34 40 L24 22 L42 34 Z" fill="${c1}" ${sw}/>` + // chifre esq
          `<path d="M86 40 L96 22 L78 34 Z" fill="${c1}" ${sw}/>` + // chifre dir
          `<path d="M30 70 Q4 58 10 86 Q22 78 34 84 Z" fill="${c1}" ${sw}/>` + // asa esq
          `<path d="M90 70 Q116 58 110 86 Q98 78 86 84 Z" fill="${c1}" ${sw}/>` + // asa dir
          `<path d="M92 96 Q112 98 110 112 Q100 108 94 102 Z" fill="${c1}" ${sw}/>`, // cauda
        front:
          `<path d="M44 96 Q60 108 76 96 Q60 104 44 96 Z" fill="${c0}" opacity=".85"/>` + // barriga
          `<path d="M52 96 L56 100 L60 96 L64 100 L68 96" stroke="${stroke}" stroke-width="1.6" fill="none"/>`, // dentinhos
      };
    case "monster":
      return {
        behind:
          `<path d="M36 38 L30 20 L48 32 Z" fill="${c1}" ${sw}/>` + // chifre esq
          `<path d="M84 38 L90 20 L72 32 Z" fill="${c1}" ${sw}/>`, // chifre dir
        front: `<path d="M48 92 L52 98 L56 92 L60 98 L64 92 L68 98 L72 92" stroke="#fff" stroke-width="2.2" fill="none"/>`, // dentes ziguezague
      };
    case "alien":
      return {
        behind:
          `<line x1="48" y1="30" x2="42" y2="14" stroke="${stroke}" stroke-width="2.5"/>` +
          `<circle cx="41" cy="12" r="4" fill="${c1}" ${sw}/>` + // antena esq
          `<line x1="72" y1="30" x2="78" y2="14" stroke="${stroke}" stroke-width="2.5"/>` +
          `<circle cx="79" cy="12" r="4" fill="${c1}" ${sw}/>`, // antena dir
        front:
          `<circle cx="44" cy="82" r="3" fill="${c1}" opacity=".7"/>` + // manchas
          `<circle cx="74" cy="86" r="2.5" fill="${c1}" opacity=".7"/>` +
          `<circle cx="60" cy="90" r="2" fill="${c1}" opacity=".7"/>`,
      };
    case "robot":
      return {
        behind:
          `<line x1="60" y1="34" x2="60" y2="20" stroke="${stroke}" stroke-width="2.5"/>` +
          `<circle cx="60" cy="17" r="4" fill="${c1}" ${sw}/>`, // antena
        front:
          `<circle cx="36" cy="40" r="2.4" fill="${stroke}"/>` + // parafusos
          `<circle cx="84" cy="40" r="2.4" fill="${stroke}"/>` +
          `<circle cx="36" cy="96" r="2.4" fill="${stroke}"/>` +
          `<circle cx="84" cy="96" r="2.4" fill="${stroke}"/>` +
          `<rect x="50" y="84" width="20" height="8" rx="2" fill="${stroke}" opacity=".25"/>`, // painel
      };
    case "plant":
      return {
        behind:
          `<path d="M60 36 Q60 14 74 12 Q72 28 60 34 Z" fill="#7cc46a" ${sw}/>` + // folha dir
          `<path d="M60 36 Q60 18 48 14 Q50 28 60 34 Z" fill="#8fd676" ${sw}/>`, // folha esq
        front: "",
      };
    case "mushroom":
      return {
        behind: `<path d="M24 56 Q24 22 60 22 Q96 22 96 56 Q60 66 24 56 Z" fill="${c1}" ${sw}/>`, // chapéu
        front:
          `<circle cx="44" cy="44" r="4" fill="#fff" opacity=".85"/>` + // pintas do chapéu
          `<circle cx="72" cy="40" r="5" fill="#fff" opacity=".85"/>` +
          `<circle cx="60" cy="52" r="3" fill="#fff" opacity=".85"/>`,
      };
    case "ghost":
      return {
        behind: "",
        front:
          `<ellipse cx="40" cy="74" rx="5" ry="7" fill="${c0}" opacity=".5"/>` + // bracinhos
          `<ellipse cx="80" cy="74" rx="5" ry="7" fill="${c0}" opacity=".5"/>`,
      };
    case "magical":
      return {
        behind:
          `<path d="M30 64 Q8 60 14 84 Q24 76 34 80 Z" fill="${c1}" opacity=".8" ${sw}/>` + // asinha esq
          `<path d="M90 64 Q112 60 106 84 Q96 76 86 80 Z" fill="${c1}" opacity=".8" ${sw}/>`, // asinha dir
        front:
          `<text x="40" y="44" font-size="11" fill="#fff" opacity=".9">✦</text>` +
          `<text x="74" y="50" font-size="8" fill="#fff" opacity=".8">✦</text>`,
      };
    case "slime":
      return {
        behind: "",
        front: `<ellipse cx="46" cy="56" rx="6" ry="9" fill="#fff" opacity=".35"/>`, // brilho gelatina
      };
    case "cloud":
      return {
        behind: "",
        front: `<path d="M48 92 q3 8 9 4 q3 8 9 2" stroke="#bcd0ff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>`, // chuvinha
      };
    default:
      return { behind: "", front: "" };
  }
}

export interface RenderOptions {
  /** estado de animação; se omitido usa o do SensorySignals */
  animation?: PetAnimation;
  /** brilho 0..1 (light do SensorySignals) */
  light?: number;
  size?: number;
  /** sobrescreve as cores do corpo: [claro, escuro] (skin equipada da loja) */
  skinColors?: [string, string];
  /** estágio de vida — muda a forma (ovo, olhos de bebê, corpo adulto) */
  stage?: LifeStage;
  /** ramo de evolução — adiciona um detalhe ao adulto (criativo, aventureiro...) */
  branch?: EvolutionBranch;
  /** estilo "rico": sombreamento, brilho/gloss e profundidade extras (mesma arte SVG) */
  rich?: boolean;
}

/** SVG do OVO (estágio inicial). Casca com manchinhas, sem rosto ainda. */
function eggSVG(
  size: number,
  stroke: string,
  c0: string,
  c1: string,
  light: number,
  name: string,
): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" role="img" aria-label="ovo de ${name}">
  <defs><radialGradient id="egg" cx="50%" cy="38%" r="70%">
    <stop offset="0%" stop-color="${c0}"/><stop offset="100%" stop-color="${c1}"/>
  </radialGradient></defs>
  <ellipse cx="60" cy="112" rx="24" ry="5" fill="#000" opacity="${0.18 * light}"/>
  <path d="M60 18 C86 18 96 54 96 74 C96 98 80 108 60 108 C40 108 24 98 24 74 C24 54 34 18 60 18 Z"
        fill="url(#egg)" stroke="${stroke}" stroke-width="3"/>
  <ellipse cx="50" cy="60" rx="6" ry="9" fill="#fff" opacity="0.25"/>
  <circle cx="70" cy="80" r="4" fill="${stroke}" opacity="0.2"/>
  <circle cx="48" cy="86" r="3" fill="${stroke}" opacity="0.2"/>
</svg>`;
}

/** Detalhe visual por ramo de evolução (aparece em teen/adult/elder). */
function branchDecor(branch: EvolutionBranch | undefined, light: number): string {
  switch (branch) {
    case "creative":
      return `<text x="86" y="34" font-size="16" fill="#ffe08a" opacity="${light}">✦</text>`;
    case "adventurous":
      return `<path d="M44 84 Q60 92 76 84 L74 92 Q60 98 46 92 Z" fill="#ff7a7a" opacity="${0.85 * light}"/>`;
    case "serene":
      return `<path d="M60 14 Q70 6 76 16 Q66 22 60 18 Z" fill="#8fd65c" opacity="${light}"/>`;
    case "social":
      return `<text x="84" y="40" font-size="14" fill="#ff9ec7" opacity="${light}">♥</text>`;
    default:
      return "";
  }
}

/** Estágios que já têm rosto/corpo (egg é tratado à parte). */
function isHatched(stage: LifeStage | undefined): boolean {
  return stage !== undefined && stage !== "egg";
}

/** Raio dos olhos por estágio: bebês têm olhos proporcionalmente maiores. */
function eyeScale(stage: LifeStage | undefined): number {
  switch (stage) {
    case "baby":
      return 1.35;
    case "child":
      return 1.18;
    case "teen":
      return 1.05;
    default:
      return 1;
  }
}

// Categorias "amorfas" — corpo é uma forma única, sem membros (slime, nuvem...).
const BLOB_CATEGORIES = new Set([
  "slime",
  "cloud",
  "ghost",
  "star",
  "pixel-mascot",
  "minimal-mascot",
]);

/** Corpo chibi (tronco + braços + pernas) desenhado abaixo da cabeça grande. */
function chibiBody(c1: string, stroke: string, gid: string): string {
  const sw = `stroke="${stroke}" stroke-width="2.6" stroke-linejoin="round"`;
  return (
    // pernas (atrás)
    `<ellipse cx="50" cy="115" rx="7.5" ry="6" fill="${c1}" ${sw}/>` +
    `<ellipse cx="70" cy="115" rx="7.5" ry="6" fill="${c1}" ${sw}/>` +
    // braços
    `<ellipse cx="33" cy="92" rx="6" ry="11" fill="${c1}" ${sw} transform="rotate(14 33 92)"/>` +
    `<ellipse cx="87" cy="92" rx="6" ry="11" fill="${c1}" ${sw} transform="rotate(-14 87 92)"/>` +
    // tronco (gradiente do corpo)
    `<ellipse cx="60" cy="94" rx="20" ry="22" fill="url(#${gid})" ${sw}/>`
  );
}

/** Gera o markup SVG do pet. Determinístico e testável. */
export function renderPetSVG(def: CharacterDef, opts: RenderOptions = {}): string {
  const animation = opts.animation ?? "idle";
  const size = opts.size ?? 150;
  const light = opts.light ?? 1;
  const auto = characterColors(def);
  const [c0, c1] = opts.skinColors ?? [auto[0], auto[1]];
  const stroke = auto[2];

  // Estágio OVO: ainda não nasceu — desenha a casca.
  if (opts.stage === "egg") {
    return eggSVG(size, stroke, c0, c1, light, def.name);
  }

  const face = faceFor(animation);
  const features = categoryFeatures(def.category, c0, c1, stroke);
  const gid = `g-${def.id}-${animation}`;
  const op = `${0.6 + 0.4 * light}`;

  // olhos maiores em filhotes; detalhe do ramo de vida em estágios avançados
  const es = eyeScale(opts.stage);
  const eyes =
    es === 1
      ? face.eyes
      : `<g transform="translate(60 58) scale(${es}) translate(-60 -58)">${face.eyes}</g>`;
  const showBranch =
    isHatched(opts.stage) &&
    (opts.stage === "teen" || opts.stage === "adult" || opts.stage === "elder");
  const decor = showBranch ? branchDecor(opts.branch, light) : "";

  const head = `<g opacity="${op}">`;
  const rich = opts.rich === true;
  // Estilo "rico" = visual de ADESIVO/sticker: contorno grosso branco-escuro,
  // gradiente profundo, gloss forte no topo, sombra inferior dentro do corpo e
  // sombra projetada no chão. Bem distinto do vetorial chapado.
  const richDefs = rich
    ? `<radialGradient id="gl-${gid}" cx="36%" cy="24%" r="55%">
         <stop offset="0%" stop-color="#fff" stop-opacity="0.85"/>
         <stop offset="35%" stop-color="#fff" stop-opacity="0.25"/>
         <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
       </radialGradient>
       <radialGradient id="ao-${gid}" cx="50%" cy="92%" r="55%">
         <stop offset="0%" stop-color="#000" stop-opacity="0.35"/>
         <stop offset="60%" stop-color="#000" stop-opacity="0"/>
       </radialGradient>
       <filter id="sh-${gid}" x="-40%" y="-40%" width="180%" height="180%">
         <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000" flood-opacity="0.40"/>
       </filter>`
    : "";
  // contorno bem mais grosso no modo rico (cara de sticker)
  const sw = rich ? 5 : 3;
  const svgOpen = `<svg width="${size}" height="${size}" viewBox="0 0 120 120" role="img" aria-label="${def.name}, ${def.species}">
  <defs><radialGradient id="${gid}" cx="42%" cy="${rich ? 26 : 40}%" r="${rich ? 78 : 65}%">
    <stop offset="0%" stop-color="${c0}"/><stop offset="${rich ? 70 : 100}%" stop-color="${c1}"/>
    ${rich ? `<stop offset="100%" stop-color="${stroke}"/>` : ""}
  </radialGradient>${richDefs}</defs>`;

  // gloss (brilho de luz por cima do corpo) só no modo rico
  const bodyFilter = rich ? ` filter="url(#sh-${gid})"` : "";

  // BLOB: forma única (sem membros) — como os amorfos.
  if (BLOB_CATEGORIES.has(def.category)) {
    const blobPath = bodyPath(def.category);
    const gloss = rich
      ? `<path d="${blobPath}" fill="url(#gl-${gid})"/>`
      : "";
    const ao = rich ? `<path d="${blobPath}" fill="url(#ao-${gid})"/>` : "";
    return `${svgOpen}
  <ellipse cx="60" cy="${rich ? 113 : 112}" rx="${rich ? 30 : 28}" ry="${rich ? 6 : 5}" fill="#000" opacity="${(rich ? 0.28 : 0.18) * light}"/>
  ${features.behind}
  <path d="${blobPath}" fill="url(#${gid})" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" opacity="${op}"${bodyFilter}/>
  ${ao}${gloss}
  <circle cx="42" cy="68" r="${rich ? 6 : 5}" fill="#ff9aa2" opacity="${(rich ? 0.7 : 0.55) * light}"/>
  <circle cx="78" cy="68" r="${rich ? 6 : 5}" fill="#ff9aa2" opacity="${(rich ? 0.7 : 0.55) * light}"/>
  ${features.front}
  ${eyes}${face.mouth}${face.extra}${decor}
</svg>`;
  }

  // CRIATURA chibi: cabeça grande + tronco + braços + pernas.
  // Cabeça é um círculo (alien um pouco mais oval). As features (orelhas/chifres/
  // antenas) já ficam na região da cabeça; barriga/dentes/manchas no tronco.
  const headShape =
    def.category === "alien"
      ? `<ellipse cx="60" cy="50" rx="36" ry="33" fill="url(#${gid})" stroke="${stroke}" stroke-width="${sw}"${bodyFilter}/>`
      : `<circle cx="60" cy="50" r="34" fill="url(#${gid})" stroke="${stroke}" stroke-width="${sw}"${bodyFilter}/>`;
  const headGloss = rich
    ? def.category === "alien"
      ? `<ellipse cx="60" cy="50" rx="36" ry="33" fill="url(#ao-${gid})"/><ellipse cx="60" cy="50" rx="36" ry="33" fill="url(#gl-${gid})"/>`
      : `<circle cx="60" cy="50" r="34" fill="url(#ao-${gid})"/><circle cx="60" cy="50" r="34" fill="url(#gl-${gid})"/>`
    : "";

  return `${svgOpen}
  <ellipse cx="60" cy="116" rx="26" ry="5" fill="#000" opacity="${0.18 * light}"/>
  ${head}
  ${features.behind}
  ${chibiBody(c1, stroke, gid)}
  ${headShape}
  ${headGloss}
  </g>
  ${features.front}
  <circle cx="40" cy="64" r="5" fill="#ff9aa2" opacity="${0.5 * light}"/>
  <circle cx="80" cy="64" r="5" fill="#ff9aa2" opacity="${0.5 * light}"/>
  ${eyes}${face.mouth}${face.extra}${decor}
</svg>`;
}

/** Conveniência: deriva animação a partir dos sinais sensoriais. */
export interface FromSignalsOptions {
  size?: number;
  skinColors?: [string, string];
  stage?: LifeStage;
  branch?: EvolutionBranch;
  rich?: boolean;
}

export function renderFromSignals(
  def: CharacterDef,
  signals: SensorySignals,
  opts: FromSignalsOptions | number = {},
): string {
  const o: FromSignalsOptions = typeof opts === "number" ? { size: opts } : opts;
  return renderPetSVG(def, {
    animation: signals.animation,
    light: signals.light,
    ...(o.size !== undefined ? { size: o.size } : {}),
    ...(o.skinColors !== undefined ? { skinColors: o.skinColors } : {}),
    ...(o.stage !== undefined ? { stage: o.stage } : {}),
    ...(o.branch !== undefined ? { branch: o.branch } : {}),
    ...(o.rich !== undefined ? { rich: o.rich } : {}),
  });
}

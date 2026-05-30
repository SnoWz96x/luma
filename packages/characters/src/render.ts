// Renderizador de pet PURO (sem framework): gera SVG + classe de animação a
// partir do estado sensorial. Reutilizado por Desktop (Tauri/React) e Web (Next).
// Veja docs/09-ARTE.md. Estilo: kawaii vetorial (soft).
import type { CharacterDef, SensorySignals } from "@luma/shared";

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

/** Cor base do corpo por categoria (kawaii pastel). */
const BODY_COLOR: Record<string, [string, string, string]> = {
  // [gradiente claro, gradiente escuro, contorno]
  star: ["#fff3b0", "#ffcf5c", "#e7a92e"],
  slime: ["#bdf5d6", "#5fd6a0", "#39b07e"],
  animal: ["#ffe1c2", "#ffb27a", "#e08a4e"],
  plant: ["#d4f5b0", "#8fd65c", "#5fae2e"],
  cloud: ["#eef3ff", "#c7d4f5", "#9fb0e7"],
  robot: ["#d8dbe6", "#aab0c6", "#7e86a6"],
  ghost: ["#efeaff", "#d3c7f5", "#b0a0e7"],
  dragon: ["#ffd0c2", "#ff9a7a", "#e0654e"],
  alien: ["#d6ffd0", "#8fe88a", "#4eae4e"],
  mushroom: ["#ffd6d6", "#f59a9a", "#c25e5e"],
  magical: ["#f0d6ff", "#cf8fe8", "#9a4eae"],
  monster: ["#cfe6ff", "#6aa3e0", "#3f6fb0"],
  "pixel-mascot": ["#fff3b0", "#ffcf5c", "#e7a92e"],
  "minimal-mascot": ["#eef0f5", "#cfd3dd", "#a6acbb"],
};

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
      return `M30 60 Q30 30 60 30 Q90 30 90 60 L90 96 L80 88 L70 96 L60 88 L50 96 L40 88 L30 96 Z`;
    case "monster":
    case "dragon":
      // corpo arredondado com chifrinhos (vibe corajosa, ainda fofa)
      return `M40 30 L34 16 L48 28 Q60 24 72 28 L86 16 L80 30 Q96 42 94 70 Q94 102 60 102 Q26 102 26 70 Q24 42 40 30 Z`;
    default: // blob arredondado padrão (animal, plant, robot, etc.)
      return `M26 70 Q26 36 60 34 Q94 36 94 70 Q94 102 60 102 Q26 102 26 70 Z`;
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
}

/** Gera o markup SVG do pet. Determinístico e testável. */
export function renderPetSVG(def: CharacterDef, opts: RenderOptions = {}): string {
  const animation = opts.animation ?? "idle";
  const size = opts.size ?? 150;
  const light = opts.light ?? 1;
  const base = BODY_COLOR[def.category] ?? BODY_COLOR.star!;
  const [c0, c1] = opts.skinColors ?? [base[0], base[1]];
  const stroke = base[2];
  const face = faceFor(animation);
  const path = bodyPath(def.category);
  const gid = `g-${def.id}-${animation}`;

  return `<svg width="${size}" height="${size}" viewBox="0 0 120 120" role="img" aria-label="${def.name}">
  <defs><radialGradient id="${gid}" cx="50%" cy="40%" r="65%">
    <stop offset="0%" stop-color="${c0}"/><stop offset="100%" stop-color="${c1}"/>
  </radialGradient></defs>
  <ellipse cx="60" cy="112" rx="28" ry="5" fill="#000" opacity="${0.18 * light}"/>
  <path d="${path}" fill="url(#${gid})" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" opacity="${0.55 + 0.45 * light}"/>
  <circle cx="42" cy="68" r="5" fill="#ff9aa2" opacity="${0.6 * light}"/>
  <circle cx="78" cy="68" r="5" fill="#ff9aa2" opacity="${0.6 * light}"/>
  ${face.eyes}${face.mouth}${face.extra}
</svg>`;
}

/** Conveniência: deriva animação a partir dos sinais sensoriais. */
export function renderFromSignals(
  def: CharacterDef,
  signals: SensorySignals,
  size?: number,
  skinColors?: [string, string],
): string {
  return renderPetSVG(def, {
    animation: signals.animation,
    light: signals.light,
    ...(size !== undefined ? { size } : {}),
    ...(skinColors !== undefined ? { skinColors } : {}),
  });
}

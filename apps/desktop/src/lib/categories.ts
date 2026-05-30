// Rótulos amigáveis (pt-BR) das categorias de personagem, para a seleção.
import type { CharacterCategory } from "@luma/shared";

export const CATEGORY_LABEL: Record<CharacterCategory, { label: string; emoji: string }> = {
  animal: { label: "Animais", emoji: "🐾" },
  robot: { label: "Robôs", emoji: "🤖" },
  ghost: { label: "Fantasmas", emoji: "👻" },
  plant: { label: "Plantas", emoji: "🌱" },
  dragon: { label: "Dragões", emoji: "🐲" },
  alien: { label: "Alienígenas", emoji: "👽" },
  star: { label: "Estrelas", emoji: "⭐" },
  slime: { label: "Slimes", emoji: "🟢" },
  cloud: { label: "Nuvens", emoji: "☁️" },
  mushroom: { label: "Cogumelos", emoji: "🍄" },
  magical: { label: "Mágicos", emoji: "✨" },
  monster: { label: "Monstrinhos", emoji: "👾" },
  "pixel-mascot": { label: "Pixel", emoji: "🕹️" },
  "minimal-mascot": { label: "Minimalistas", emoji: "⚪" },
};

export const RARITY_STYLE: Record<string, string> = {
  common: "text-luma-muted",
  uncommon: "text-emerald-300",
  rare: "text-sky-300",
  epic: "text-fuchsia-300",
  legendary: "text-amber-300",
};

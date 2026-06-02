// PetView — renderiza o pet animado a partir do estado sensorial.
// Reusa o renderizador puro de @luma/characters (mesma fonte que a Web).
import { useEffect } from "react";
import {
  renderFromSignals,
  ANIMATION_CLASS,
  PET_ANIMATION_CSS,
} from "@luma/characters";
import { pluginRegistry } from "@luma/core";
import { useArtStore } from "../stores/artStore";
import type {
  CharacterDef,
  SensorySignals,
  LifeStage,
  EvolutionBranch,
} from "@luma/shared";

let cssInjected = false;
function usePetAnimationCSS() {
  useEffect(() => {
    if (cssInjected) return;
    const style = document.createElement("style");
    style.textContent = PET_ANIMATION_CSS;
    document.head.appendChild(style);
    cssInjected = true;
  }, []);
}

interface PetViewProps {
  character: CharacterDef;
  signals: SensorySignals;
  size?: number;
  /** multiplicador de tamanho por estágio de vida (crescimento é sentido) */
  scale?: number;
  /** cores [claro, escuro] da skin equipada (loja); null = padrão do personagem */
  skinColors?: [string, string] | null;
  /** estágio de vida — muda a forma do pet (ovo, bebê, adulto...) */
  stage?: LifeStage;
  /** ramo de evolução — adiciona um detalhe ao adulto */
  branch?: EvolutionBranch;
  onPet?: () => void;
}

export function PetView({ character, signals, size = 200, scale = 1, skinColors, stage, branch, onPet }: PetViewProps) {
  usePetAnimationCSS();
  const artStyle = useArtStore((s) => s.style);
  const animClass = ANIMATION_CLASS[signals.animation];
  const px = Math.round(size * scale);

  // Arte híbrida: no estilo "ai", se um sprite-pack fornecer arte para este pet
  // (e já nasceu), usa o sprite; caso contrário (ou estilo "vector"), cai no
  // renderizador vetorial — que sempre funciona. Alterna com um clique nos Ajustes.
  const sprite =
    artStyle === "ai" && stage !== "egg"
      ? pluginRegistry.spriteFrame(character.id, signals.animation)
      : undefined;

  const inner = sprite ? (
    <img
      src={sprite}
      width={px}
      height={px}
      alt={character.name}
      draggable={false}
      style={{ filter: `brightness(${0.7 + signals.light * 0.5})` }}
    />
  ) : (
    <div
      style={{ filter: `brightness(${0.7 + signals.light * 0.5})` }}
      dangerouslySetInnerHTML={{
        __html: renderFromSignals(character, signals, {
          size: px,
          ...(skinColors ? { skinColors } : {}),
          ...(stage ? { stage } : {}),
          ...(branch ? { branch } : {}),
        }),
      }}
    />
  );

  return (
    <button
      type="button"
      onClick={onPet}
      aria-label={`Fazer carinho em ${character.name}`}
      className="bg-transparent border-0 cursor-pointer p-0"
      style={{ transform: `translateY(${(1 - signals.closeness) * 8}px)` }}
    >
      <div className={animClass}>{inner}</div>
    </button>
  );
}

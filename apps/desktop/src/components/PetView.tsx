// PetView — renderiza o pet animado a partir do estado sensorial.
// Reusa o renderizador puro de @luma/characters (mesma fonte que a Web).
import { useEffect } from "react";
import {
  renderFromSignals,
  ANIMATION_CLASS,
  PET_ANIMATION_CSS,
} from "@luma/characters";
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
  const svg = renderFromSignals(character, signals, {
    size: Math.round(size * scale),
    ...(skinColors ? { skinColors } : {}),
    ...(stage ? { stage } : {}),
    ...(branch ? { branch } : {}),
  });
  const animClass = ANIMATION_CLASS[signals.animation];

  return (
    <button
      type="button"
      onClick={onPet}
      aria-label={`Fazer carinho em ${character.name}`}
      className="bg-transparent border-0 cursor-pointer p-0"
      style={{ transform: `translateY(${(1 - signals.closeness) * 8}px)` }}
    >
      <div
        className={animClass}
        style={{ filter: `brightness(${0.7 + signals.light * 0.5})` }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </button>
  );
}

// Ritual de nascimento — o ovo chacoalha, racha (3 toques) e o pet nasce.
// Momento mágico do primeiro encontro. Respeita prefers-reduced-motion.
import { useState } from "react";
import type { CharacterDef } from "@luma/shared";
import { toSensorySignals, DEFAULT_STATE } from "@luma/core";
import { PetView } from "./PetView";

const idleSignals = toSensorySignals(DEFAULT_STATE);

interface EggHatchProps {
  character: CharacterDef;
  petName: string;
  onHatched: () => void;
}

export function EggHatch({ character, petName, onHatched }: EggHatchProps) {
  const [taps, setTaps] = useState(0);
  const [born, setBorn] = useState(false);

  const crack = () => {
    if (born) return;
    const next = taps + 1;
    setTaps(next);
    if (next >= 3) setTimeout(() => setBorn(true), 350);
  };

  // estágios visuais da casca conforme os toques
  const cracks = ["🥚", "🥚", "🐣", "🐣"][Math.min(taps, 3)];

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-luma-bg to-luma-bg0 px-6 text-center">
      <div className="aura opacity-60" />

      {!born ? (
        <>
          <h2 className="text-lg font-extrabold text-luma-ink">
            Algo está chegando…
          </h2>
          <button
            type="button"
            onClick={crack}
            aria-label="Chocar o ovo"
            className="relative grid h-44 w-44 place-items-center rounded-full"
          >
            <span
              className="select-none text-[120px] leading-none"
              style={{
                display: "inline-block",
                animation: "luma-wobble 0.5s ease-in-out infinite",
              }}
            >
              {cracks}
            </span>
          </button>
          <p className="text-sm text-luma-muted">
            {taps === 0 && "Toque no ovo com carinho…"}
            {taps === 1 && "Está se mexendo! Continue…"}
            {taps === 2 && "Quase lá… mais um toque!"}
          </p>
          <style>{`
            @keyframes luma-wobble {
              0%,100% { transform: rotate(-6deg); }
              50% { transform: rotate(6deg); }
            }
            @media (prefers-reduced-motion: reduce) {
              [style*="luma-wobble"] { animation: none !important; }
            }
          `}</style>
        </>
      ) : (
        <div className="pop flex flex-col items-center gap-3">
          <PetView character={character} signals={idleSignals} size={150} />
          <h2 className="text-xl font-extrabold text-luma-ink">
            {petName} nasceu! ✨
          </h2>
          <p className="max-w-xs text-sm text-luma-muted">
            Cuide bem e ele(a) vai crescer com você — do seu jeitinho.
          </p>
          <button
            type="button"
            onClick={onHatched}
            className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-6 py-2.5 text-sm font-bold text-luma-bg0 shadow-glow transition hover:brightness-110"
          >
            Conhecer {petName} 💗
          </button>
        </div>
      )}
    </div>
  );
}

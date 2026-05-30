// Onboarding — o "primeiro encontro": escolher um companheiro e dar um nome.
// Momento mágico (sem pressa, sem números). Usa o catálogo real dos 100.
import { useMemo, useState } from "react";
import { catalog } from "../stores/petStore";
import { useAppStore } from "../stores/appStore";
import { useProgressStore } from "../stores/progressStore";
import { PetView } from "./PetView";
import { TitleBar } from "./TitleBar";
import { toSensorySignals, DEFAULT_STATE } from "@luma/core";

const idleSignals = toSensorySignals(DEFAULT_STATE);

const SUGGESTED_IDS = [
  "luma", "momo", "sprout", "orbit", "pip", "bibo", "koko", "tiko", "vee", "pingo",
];

const RARITY_STYLE: Record<string, string> = {
  common: "text-luma-muted",
  uncommon: "text-emerald-300",
  rare: "text-sky-300",
  epic: "text-fuchsia-300",
  legendary: "text-amber-300",
};

export function Onboarding() {
  const adopt = useAppStore((s) => s.adopt);
  const award = useProgressStore((s) => s.award);

  const handleAdopt = (id: string, name: string) => {
    adopt(id, name);
    award("first_meeting"); // 🥚 primeiro encontro
  };
  const suggestions = useMemo(
    () =>
      SUGGESTED_IDS.map((id) => catalog.find((c) => c.id === id)).filter(
        (c): c is NonNullable<typeof c> => Boolean(c),
      ),
    [],
  );
  const [selectedId, setSelectedId] = useState(suggestions[0]?.id ?? "luma");
  const [name, setName] = useState("");

  const selected = catalog.find((c) => c.id === selectedId) ?? suggestions[0]!;

  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-luma-bg to-luma-bg0 text-luma-ink">
      <TitleBar title="LUMA" />

      <div className="flex min-h-0 flex-1 flex-col items-center gap-4 overflow-auto px-5 pb-5">
        <header className="text-center fade-up">
          <h1 className="bg-gradient-to-r from-luma-accent to-luma-accent2 bg-clip-text text-xl font-extrabold text-transparent">
            Um novo amigo chegou
          </h1>
          <p className="mt-0.5 text-xs text-luma-muted">
            Escolha quem vai morar com você — e dê um nome.
          </p>
        </header>

        {/* palco do escolhido */}
        <div
          key={selected.id}
          className="pop relative flex w-full flex-col items-center gap-1 rounded-[22px] border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent py-5 shadow-soft"
        >
          <div className="aura opacity-70" />
          <PetView character={selected} signals={idleSignals} size={140} />
          <p className="text-base font-bold">{selected.name}</p>
          <p className="max-w-[15rem] text-center text-[11px] text-luma-muted">
            {selected.species.replace(/-/g, " ")} · {selected.archetype}
          </p>
          <span
            className={`mt-0.5 text-[10px] font-semibold uppercase tracking-wide ${RARITY_STYLE[selected.rarity] ?? ""}`}
          >
            {selected.rarity}
          </span>
        </div>

        {/* galeria de escolha */}
        <div className="grid grid-cols-5 gap-2">
          {suggestions.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              aria-pressed={c.id === selectedId}
              className={`rounded-2xl p-1 transition ${
                c.id === selectedId
                  ? "scale-105 bg-white/10 ring-2 ring-luma-accent"
                  : "bg-white/[0.04] hover:bg-white/[0.08]"
              }`}
              title={c.name}
            >
              <PetView character={c} signals={idleSignals} size={44} />
            </button>
          ))}
        </div>

        {/* nome + adotar */}
        <div className="flex w-full max-w-xs flex-col gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Que nome combina com ${selected.name}?`}
            maxLength={20}
            className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-luma-ink outline-none transition focus:border-luma-accent/60 placeholder:text-luma-muted/60"
          />
          <button
            type="button"
            onClick={() => handleAdopt(selected.id, name)}
            className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-4 py-2.5 text-sm font-bold text-luma-bg0 shadow-glow transition hover:brightness-110 active:scale-[0.99]"
          >
            Adotar {name.trim() || selected.name} 💗
          </button>
        </div>
      </div>
    </div>
  );
}

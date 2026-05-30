// Onboarding — o "primeiro encontro": escolher CATEGORIA → personagem e dar nome.
// Expõe todos os 100+ personagens do catálogo. Momento mágico, sem números.
import { useMemo, useState } from "react";
import type { CharacterCategory } from "@luma/shared";
import { catalog } from "../stores/petStore";
import { useAppStore } from "../stores/appStore";
import { useProgressStore } from "../stores/progressStore";
import { PetView } from "./PetView";
import { TitleBar } from "./TitleBar";
import { CATEGORY_LABEL, RARITY_STYLE } from "../lib/categories";
import { toSensorySignals, DEFAULT_STATE } from "@luma/core";

const idleSignals = toSensorySignals(DEFAULT_STATE);

export function Onboarding() {
  const adopt = useAppStore((s) => s.adopt);
  const award = useProgressStore((s) => s.award);

  // categorias presentes no catálogo, na ordem do mapa de rótulos
  const categories = useMemo(() => {
    const present = new Set(catalog.map((c) => c.category));
    return (Object.keys(CATEGORY_LABEL) as CharacterCategory[]).filter((c) =>
      present.has(c),
    );
  }, []);

  const [category, setCategory] = useState<CharacterCategory>(categories[0]!);
  const inCategory = useMemo(
    () => catalog.filter((c) => c.category === category),
    [category],
  );

  const [selectedId, setSelectedId] = useState(inCategory[0]?.id ?? catalog[0]!.id);
  const [name, setName] = useState("");

  const selected =
    catalog.find((c) => c.id === selectedId) ?? inCategory[0] ?? catalog[0]!;

  const pickCategory = (c: CharacterCategory) => {
    setCategory(c);
    const first = catalog.find((x) => x.category === c);
    if (first) setSelectedId(first.id);
  };

  const handleAdopt = () => {
    adopt(selected.id, name);
    award("first_meeting"); // 🥚 primeiro encontro
  };

  return (
    <div className="flex h-full w-full flex-col bg-gradient-to-b from-luma-bg to-luma-bg0 text-luma-ink">
      <TitleBar title="LUMA" />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-auto px-4 pb-4">
        <header className="text-center fade-up">
          <h1 className="bg-gradient-to-r from-luma-accent to-luma-accent2 bg-clip-text text-xl font-extrabold text-transparent">
            Encontre seu companheiro
          </h1>
          <p className="mt-0.5 text-xs text-luma-muted">
            {catalog.length} criaturas esperando — escolha um tipo e conheça.
          </p>
        </header>

        {/* palco do escolhido */}
        <div
          key={selected.id}
          className="pop relative flex flex-col items-center gap-1 rounded-[22px] border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent py-4 shadow-soft"
        >
          <div className="aura opacity-70" />
          <PetView character={selected} signals={idleSignals} size={120} />
          <p className="text-base font-bold">{selected.name}</p>
          <p className="max-w-[16rem] text-center text-[11px] text-luma-muted">
            {selected.species.replace(/-/g, " ")} · {selected.archetype}
          </p>
          <span
            className={`text-[10px] font-semibold uppercase tracking-wide ${RARITY_STYLE[selected.rarity] ?? ""}`}
          >
            {selected.rarity}
          </span>
        </div>

        {/* seletor de categoria */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => pickCategory(c)}
              className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] transition ${
                category === c
                  ? "bg-gradient-to-r from-luma-accent to-luma-accent2 text-luma-bg0"
                  : "border border-white/10 bg-white/[0.05] text-luma-muted hover:bg-white/[0.1]"
              }`}
            >
              <span aria-hidden>{CATEGORY_LABEL[c].emoji}</span>
              {CATEGORY_LABEL[c].label}
            </button>
          ))}
        </div>

        {/* personagens da categoria */}
        <div className="grid grid-cols-5 gap-2">
          {inCategory.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              aria-pressed={c.id === selectedId}
              title={c.name}
              className={`flex flex-col items-center rounded-2xl p-1 transition ${
                c.id === selectedId
                  ? "scale-105 bg-white/10 ring-2 ring-luma-accent"
                  : "bg-white/[0.04] hover:bg-white/[0.08]"
              }`}
            >
              <PetView character={c} signals={idleSignals} size={40} />
              <span className="mt-0.5 max-w-full truncate text-[9px] text-luma-muted">
                {c.name}
              </span>
            </button>
          ))}
        </div>

        {/* nome + adotar */}
        <div className="flex flex-col gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Que nome combina com ${selected.name}?`}
            maxLength={20}
            className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-luma-ink outline-none transition focus:border-luma-accent/60 placeholder:text-luma-muted/60"
          />
          <button
            type="button"
            onClick={handleAdopt}
            className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-4 py-2.5 text-sm font-bold text-luma-bg0 shadow-glow transition hover:brightness-110 active:scale-[0.99]"
          >
            Adotar {name.trim() || selected.name} 💗
          </button>
        </div>
      </div>
    </div>
  );
}

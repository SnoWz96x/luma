"use client";

import { useMemo, useState } from "react";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { CreaturePet, type Category } from "../../components/CreaturePet";

const CATEGORIES: { id: Category; label: string; emoji: string }[] = [
  { id: "animal", label: "Animais", emoji: "🐾" },
  { id: "dragon", label: "Dragões", emoji: "🐲" },
  { id: "alien", label: "Alienígenas", emoji: "👽" },
  { id: "robot", label: "Robôs", emoji: "🤖" },
  { id: "monster", label: "Monstrinhos", emoji: "👾" },
  { id: "plant", label: "Plantas", emoji: "🌱" },
  { id: "mushroom", label: "Cogumelos", emoji: "🍄" },
  { id: "star", label: "Estrelas", emoji: "⭐" },
  { id: "slime", label: "Slimes", emoji: "🟢" },
  { id: "cloud", label: "Nuvens", emoji: "☁️" },
  { id: "ghost", label: "Fantasmas", emoji: "👻" },
  { id: "magical", label: "Mágicos", emoji: "✨" },
];

// nomes curtos e fofos para a vitrine (amostra do catálogo de 100)
const NAMES = [
  "Luma", "Momo", "Nami", "Sprout", "Orbit", "Bibo", "Koko", "Tiko", "Vee", "Pingo",
  "Mochi", "Pip", "Nuvi", "Tofu", "Bubu", "Lumi", "Pixu", "Dodo", "Fofo", "Yumi",
  "Suki", "Tato", "Coco", "Mimo", "Bobo", "Zuzu", "Plim", "Nino", "Tuto", "Gigi",
];

interface Pet {
  name: string;
  category: Category;
}

// monta uma vitrine determinística distribuindo nomes pelas categorias
const PETS: Pet[] = NAMES.map((name, i) => ({
  name,
  category: CATEGORIES[i % CATEGORIES.length]!.id,
}));

export default function Personagens() {
  const [filter, setFilter] = useState<Category | "all">("all");

  const list = useMemo(
    () => (filter === "all" ? PETS : PETS.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-luma-bg to-luma-bg0 text-luma-ink">
      <SiteNav />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold md:text-5xl">Conheça os companheiros</h1>
          <p className="mt-2 text-luma-muted">
            São mais de 100 criaturas — cada uma com sua cor, personalidade e história.
          </p>
        </header>

        {/* filtros */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              filter === "all"
                ? "bg-gradient-to-r from-luma-accent to-luma-accent2 text-luma-bg0"
                : "border border-white/10 bg-white/5 text-luma-muted hover:bg-white/10"
            }`}
          >
            ✦ Todos
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                filter === c.id
                  ? "bg-gradient-to-r from-luma-accent to-luma-accent2 text-luma-bg0"
                  : "border border-white/10 bg-white/5 text-luma-muted hover:bg-white/10"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* grade */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center rounded-4xl border border-white/10 bg-luma-card/60 p-5 shadow-soft transition hover:-translate-y-1 hover:border-luma-accent/30"
            >
              <CreaturePet category={p.category} seed={p.name} size={92} />
              <p className="mt-3 font-bold">{p.name}</p>
              <p className="text-xs text-luma-muted">
                {CATEGORIES.find((c) => c.id === p.category)?.label}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-luma-muted">
          Esta é uma amostra. No app, você escolhe entre os 100 — e pode criar novos
          via{" "}
          <a
            href="https://github.com/SnoWz96x/luma/blob/main/CONTRIBUTING.md"
            className="text-luma-accent underline"
          >
            Plugin Engine
          </a>
          .
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}

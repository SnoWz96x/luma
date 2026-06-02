"use client";

import { useMemo, useState } from "react";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { CreaturePet, type Category } from "../../components/CreaturePet";
import catalog from "../../data/catalog.json";

interface Char {
  id: string;
  name: string;
  species: string;
  category: string;
  rarity: string;
  archetype: string;
}

const PETS = catalog as Char[];

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
  { id: "pixel-mascot", label: "Pixel", emoji: "🕹️" },
  { id: "minimal-mascot", label: "Minimal", emoji: "⚪" },
];

const RARITY: Record<string, string> = {
  common: "text-luma-muted",
  uncommon: "text-emerald-300",
  rare: "text-sky-300",
  epic: "text-fuchsia-300",
  legendary: "text-amber-300",
};

export default function Personagens() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PETS.filter(
      (p) =>
        (filter === "all" || p.category === filter) &&
        (q === "" || p.name.toLowerCase().includes(q) || p.species.toLowerCase().includes(q)),
    );
  }, [filter, query]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-luma-bg to-luma-bg0 text-luma-ink">
      <SiteNav />

      <section className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold md:text-5xl">Conheça os companheiros</h1>
          <p className="mt-2 text-luma-muted">
            <b className="text-luma-ink">{PETS.length}</b> criaturas — cada uma com
            sua cor, espécie e história.
          </p>
        </header>

        {/* busca */}
        <div className="mx-auto mb-5 max-w-sm">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou espécie…"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm outline-none transition focus:border-luma-accent/60 placeholder:text-luma-muted/60"
          />
        </div>

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

        {/* contagem */}
        <p className="mb-4 text-center text-xs text-luma-muted">
          {list.length} {list.length === 1 ? "companheiro" : "companheiros"}
        </p>

        {/* grade */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((p) => (
            <div
              key={p.id}
              className="flex flex-col items-center rounded-4xl border border-white/10 bg-luma-card/60 p-5 shadow-soft transition hover:-translate-y-1 hover:border-luma-accent/30"
            >
              <CreaturePet category={p.category as Category} seed={p.id} size={88} />
              <p className="mt-3 font-bold">{p.name}</p>
              <p className="text-center text-[11px] text-luma-muted">
                {p.species.replace(/-/g, " ")}
              </p>
              <span className={`mt-1 text-[10px] font-semibold uppercase ${RARITY[p.rarity] ?? ""}`}>
                {p.rarity}
              </span>
            </div>
          ))}
        </div>

        {list.length === 0 && (
          <p className="py-10 text-center text-luma-muted">Nada encontrado — tente outro termo. 🔍</p>
        )}

        <p className="mt-10 text-center text-sm text-luma-muted">
          Quer criar o seu? O{" "}
          <a
            href="https://github.com/SnoWz96x/luma/blob/main/CONTRIBUTING.md"
            className="text-luma-accent underline"
          >
            Plugin Engine
          </a>{" "}
          aceita novos personagens e sprites. 🎨
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}

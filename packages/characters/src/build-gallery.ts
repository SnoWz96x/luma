// Gera uma galeria HTML usando o renderizador REAL (render.ts) sobre o catálogo.
// Prova o pipeline ponta a ponta. Rode: pnpm --filter @luma/characters gallery
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateCharacters } from "./generate.js";
import { renderPetSVG, ANIMATION_CLASS, PET_ANIMATION_CSS, type PetAnimation } from "./render.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "../../../docs/art/catalog-gallery.html");

const catalog = generateCharacters();
// estado de animação alterna por personagem só para demonstrar variedade
const states: PetAnimation[] = ["idle", "happy", "curious", "comfort", "sleep"];

const cards = catalog
  .map((c, i) => {
    const st = states[i % states.length]!;
    const svg = renderPetSVG(c, { animation: st, size: 110 });
    return `<div class="card">
      <div class="stage"><div class="${ANIMATION_CLASS[st]}">${svg}</div></div>
      <h3>${c.name}</h3>
      <p>${c.species} · ${c.category}<br><span class="r ${c.rarity}">${c.rarity}</span></p>
    </div>`;
  })
  .join("\n");

const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LUMA — Galeria do catálogo (${catalog.length} personagens)</title>
<style>
:root{--bg:#1c1b29;--card:#262438;--ink:#efeaff;--muted:#a79fce}
body{margin:0;font-family:system-ui,Segoe UI,sans-serif;background:var(--bg);color:var(--ink);padding:24px}
h1{margin:0 0 4px} .sub{color:var(--muted);margin:0 0 20px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
.card{background:var(--card);border-radius:16px;padding:12px;text-align:center}
.card h3{margin:6px 0 0;font-size:14px} .card p{margin:2px 0 0;color:var(--muted);font-size:11px}
.stage{background:radial-gradient(120% 90% at 50% 35%,#34315a,#211f33 70%);border-radius:12px;height:130px;display:flex;align-items:center;justify-content:center}
.r{display:inline-block;margin-top:4px;padding:1px 7px;border-radius:8px;font-size:10px}
.common{background:#3a3658} .uncommon{background:#2e6b4e} .rare{background:#2e4e8a}
.epic{background:#6b2e8a} .legendary{background:#8a6b2e}
${PET_ANIMATION_CSS}
</style></head><body>
<h1>LUMA — Galeria do catálogo 🐾</h1>
<p class="sub">${catalog.length} personagens gerados pelo código e renderizados pelo render.ts (animados, kawaii vetorial).</p>
<div class="grid">
${cards}
</div></body></html>`;

writeFileSync(out, html, "utf8");
console.log(`✓ Galeria com ${catalog.length} personagens em ${out}`);

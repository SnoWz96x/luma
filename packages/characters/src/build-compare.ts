import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateCharacters } from "./generate.js";
import { renderPetSVG, PET_ANIMATION_CSS } from "./render.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, "../../../docs/art/style-compare.html");
const cat = generateCharacters();
const pick = ["luma", "momo", "sprout", "orbit", "pip", "koko"]
  .map((id) => cat.find((c) => c.id === id))
  .filter((c): c is NonNullable<typeof c> => Boolean(c));

const rows = pick
  .map(
    (c) =>
      `<div class="card"><div class="pair"><div><div class="lbl">vetorial</div>${renderPetSVG(c, { size: 120 })}</div><div><div class="lbl">rico (IA)</div>${renderPetSVG(c, { size: 120, rich: true })}</div></div><p>${c.name} · ${c.species}</p></div>`,
  )
  .join("");

const html = `<!doctype html><meta charset="utf8"><title>LUMA — vetorial vs rico</title><style>body{margin:0;background:#14131f;color:#f3efff;font-family:system-ui;padding:24px}h1{text-align:center}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}.card{background:#262438;border-radius:18px;padding:14px;text-align:center}.pair{display:flex;gap:10px;justify-content:center}.pair>div{background:radial-gradient(120% 90% at 50% 35%,#34315a,#211f33 70%);border-radius:14px;padding:8px}.lbl{font-size:10px;color:#a79fce;margin-bottom:2px}${PET_ANIMATION_CSS}</style><h1>vetorial vs rico (IA) — mesmo personagem</h1><div class="grid">${rows}</div>`;
writeFileSync(out, html);
console.log("ok:", out);

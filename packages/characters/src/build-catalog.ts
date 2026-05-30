// Gera data/characters.json (catálogo dos 100). Rode: pnpm --filter @luma/characters generate
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateCharacters } from "./generate.js";
import { catalogSchema } from "./schema.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../data/characters.json");

const catalog = catalogSchema.parse(generateCharacters());
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(catalog, null, 2) + "\n", "utf8");

console.log(`✓ ${catalog.length} personagens gerados em ${outPath}`);

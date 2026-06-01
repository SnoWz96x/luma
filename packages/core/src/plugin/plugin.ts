// Plugin Engine — registra/valida manifestos que estendem o LUMA (packs de
// personagens, sprites de arte rica, biomas, eventos). PURO, sem deps externas:
// validação manual leve (o core não importa zod, mantém-se offline/testável).
// Veja docs/15-ARTE-PIPELINE-HIBRIDO.md e docs/00-IMPLEMENTATION-PLAN.md (Sprint D).
import type {
  PluginManifest,
  PluginKind,
  SpriteEntry,
  SpritePackData,
} from "@luma/shared";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

const KINDS: PluginKind[] = ["character-pack", "sprite-pack", "biome", "event"];
const ID_RE = /^[a-z0-9][a-z0-9-]*$/;

/** Valida a forma básica de um manifesto (sem framework). */
export function validateManifest(input: unknown): ValidationResult {
  const errors: string[] = [];
  const m = input as Partial<PluginManifest> | null;
  if (!m || typeof m !== "object") return { ok: false, errors: ["manifesto vazio"] };
  if (typeof m.id !== "string" || !ID_RE.test(m.id)) errors.push("id inválido (use kebab-case)");
  if (typeof m.name !== "string" || !m.name) errors.push("name obrigatório");
  if (typeof m.version !== "string" || !m.version) errors.push("version obrigatório");
  if (!m.kind || !KINDS.includes(m.kind)) errors.push("kind inválido");
  if (m.data === undefined) errors.push("data ausente");
  // sprite-pack exige conteúdo coerente + licença (arte de terceiros → NOTICE)
  if (m.kind === "sprite-pack") {
    const d = m.data as Partial<SpritePackData> | undefined;
    if (!d || !Array.isArray(d.sprites) || d.sprites.length === 0) {
      errors.push("sprite-pack precisa de data.sprites não vazio");
    }
    if (!m.license) errors.push("sprite-pack precisa declarar license");
  }
  return { ok: errors.length === 0, errors };
}

/** Registry em memória: indexa plugins válidos e expõe consultas. */
export class PluginRegistry {
  private plugins = new Map<string, PluginManifest>();
  /** characterId -> frames (sprite). Última carga vence. */
  private spriteIndex = new Map<string, SpriteEntry["frames"]>();

  /** Registra um manifesto. Retorna o resultado da validação. */
  register(manifest: unknown): ValidationResult {
    const res = validateManifest(manifest);
    if (!res.ok) return res;
    const m = manifest as PluginManifest;
    this.plugins.set(m.id, m);
    if (m.kind === "sprite-pack") {
      for (const s of (m.data as SpritePackData).sprites) {
        this.spriteIndex.set(s.characterId, s.frames);
      }
    }
    return res;
  }

  remove(id: string): void {
    const m = this.plugins.get(id);
    if (m?.kind === "sprite-pack") {
      for (const s of (m.data as SpritePackData).sprites) {
        this.spriteIndex.delete(s.characterId);
      }
    }
    this.plugins.delete(id);
  }

  list(kind?: PluginKind): PluginManifest[] {
    const all = [...this.plugins.values()];
    return kind ? all.filter((p) => p.kind === kind) : all;
  }

  has(id: string): boolean {
    return this.plugins.has(id);
  }

  /** Sprite (frames) de um personagem, se algum sprite-pack o fornecer. */
  spriteFor(characterId: string): SpriteEntry["frames"] | undefined {
    return this.spriteIndex.get(characterId);
  }

  /** Asset de um estado específico (ex.: idle) com fallback p/ undefined. */
  spriteFrame(characterId: string, state: string): string | undefined {
    return this.spriteIndex.get(characterId)?.[state];
  }
}

/** Registry global padrão do app. */
export const pluginRegistry = new PluginRegistry();

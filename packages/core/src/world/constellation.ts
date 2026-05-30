// Constelações de memória — memórias importantes viram estrelas posicionadas no
// céu, revisitáveis. PURO e determinístico. Veja docs/01-ARQUITETURA.md.
import type { Memory } from "@luma/shared";

export interface ConstellationStar {
  memoryId: string;
  content: string;
  emotion?: string;
  x: number; // 0..1
  y: number; // 0..1 (parte superior = céu)
  brightness: number; // 0..1 (importância)
}

// hash estável de string -> número (para posição determinística por memória)
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

/** Mapeia memórias em estrelas. Posição derivada do id (estável no tempo). */
export function buildConstellation(memories: Memory[]): ConstellationStar[] {
  return memories.map((m) => {
    const hx = hash(m.id);
    const hy = hash(m.id + "y");
    return {
      memoryId: m.id,
      content: m.content,
      ...(m.emotion !== undefined ? { emotion: m.emotion } : {}),
      x: 0.06 + hx * 0.88,
      y: 0.06 + hy * 0.5, // estrelas no terço superior
      brightness: Math.max(0.35, Math.min(1, m.importance / 100)),
    };
  });
}

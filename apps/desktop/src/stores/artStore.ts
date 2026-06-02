// Art store — preferência de estilo visual dos personagens.
// "vector" = renderizador SVG (padrão, sempre funciona, escala 100+).
// "ai"     = sprites/ilustração ricos (via Plugin Engine), com fallback vetorial
//            quando o personagem não tem sprite. Alterna com um clique.
import { create } from "zustand";
import { kvGet, kvSet } from "../repositories";

const LS_KEY = "luma.art";

export type ArtStyle = "vector" | "ai";

interface ArtStore {
  style: ArtStyle;
  setStyle: (s: ArtStyle) => void;
  toggle: () => void;
}

function load(): ArtStyle {
  const raw = kvGet(LS_KEY);
  return raw === "ai" ? "ai" : "vector";
}

export const useArtStore = create<ArtStore>((set, get) => ({
  style: load(),
  setStyle: (style) => {
    kvSet(LS_KEY, style);
    set({ style });
  },
  toggle: () => get().setStyle(get().style === "vector" ? "ai" : "vector"),
}));

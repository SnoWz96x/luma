// Shop store — itens cosméticos comprados/equipados. Gasta fagulhas do habitsStore.
import { create } from "zustand";
import {
  DEFAULT_OWNED,
  purchase,
  equipSkin,
  equippedSkinColors,
} from "@luma/core";
import type { OwnedItems } from "@luma/shared";
import { useHabitsStore } from "./habitsStore";

const LS_KEY = "luma.shop";

function load(): OwnedItems {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as OwnedItems;
  } catch {
    /* ignore */
  }
  return DEFAULT_OWNED;
}

function persist(o: OwnedItems) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(o));
  } catch {
    /* ignore */
  }
}

interface ShopStore {
  owned: OwnedItems;
  /** compra; retorna true se deu certo (gasta fagulhas) */
  buy: (itemId: string) => boolean;
  equip: (skinId: string | null) => void;
  /** cores [claro, escuro] da skin equipada, ou null */
  skinColors: () => [string, string] | null;
}

export const useShopStore = create<ShopStore>((set, get) => ({
  owned: load(),

  buy: (itemId) => {
    const sparks = useHabitsStore.getState().sparks;
    const r = purchase(get().owned, sparks, itemId);
    if (!r.ok) return false;
    // debita as fagulhas (spend = addSparks negativo)
    useHabitsStore.getState().addSparks(r.sparks - sparks);
    persist(r.owned);
    set({ owned: r.owned });
    return true;
  },

  equip: (skinId) => {
    const next = equipSkin(get().owned, skinId);
    persist(next);
    set({ owned: next });
  },

  skinColors: () => equippedSkinColors(get().owned),
}));

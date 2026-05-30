// Economy — loja cosmética. PURO. Gastar fagulhas em skins/cenas. Sem p2w.
// Veja docs/14-ROADMAP-UNIFICADO.md.
import type { ShopItem, OwnedItems } from "@luma/shared";

// Catálogo da loja (cosmético). Skins trazem par de cores [claro, escuro].
export const SHOP_ITEMS: ShopItem[] = [
  { id: "skin_rose", name: "Rosé", emoji: "🌸", kind: "skin", price: 30, value: "#ffd4e8,#ff9ec7" },
  { id: "skin_mint", name: "Menta", emoji: "🌿", kind: "skin", price: 30, value: "#c8f5dd,#5fd6a0" },
  { id: "skin_sky", name: "Céu", emoji: "💙", kind: "skin", price: 30, value: "#cfe6ff,#6aa3e0" },
  { id: "skin_gold", name: "Dourado", emoji: "⭐", kind: "skin", price: 60, value: "#fff3b0,#ffcf5c" },
  { id: "skin_violet", name: "Violeta", emoji: "💜", kind: "skin", price: 60, value: "#e9d4ff,#b69cff" },
  { id: "skin_aurora", name: "Aurora", emoji: "🌌", kind: "skin", price: 120, value: "#c8f5dd,#b69cff" },
];

const itemIndex = new Map(SHOP_ITEMS.map((i) => [i.id, i]));

export function getShopItem(id: string): ShopItem | undefined {
  return itemIndex.get(id);
}

export const DEFAULT_OWNED: OwnedItems = { owned: [], equippedSkin: null };

export interface PurchaseResult {
  owned: OwnedItems;
  /** fagulhas restantes após a compra */
  sparks: number;
  ok: boolean;
  reason?: "already_owned" | "not_enough" | "not_found";
}

/** Compra um item se houver fagulhas e ainda não for possuído. */
export function purchase(
  owned: OwnedItems,
  sparks: number,
  itemId: string,
): PurchaseResult {
  const item = itemIndex.get(itemId);
  if (!item) return { owned, sparks, ok: false, reason: "not_found" };
  if (owned.owned.includes(itemId))
    return { owned, sparks, ok: false, reason: "already_owned" };
  if (sparks < item.price)
    return { owned, sparks, ok: false, reason: "not_enough" };
  return {
    owned: { ...owned, owned: [...owned.owned, itemId] },
    sparks: sparks - item.price,
    ok: true,
  };
}

/** Equipa uma skin possuída (ou null para voltar à padrão). */
export function equipSkin(owned: OwnedItems, skinId: string | null): OwnedItems {
  if (skinId === null) return { ...owned, equippedSkin: null };
  if (!owned.owned.includes(skinId)) return owned; // só equipa o que possui
  return { ...owned, equippedSkin: skinId };
}

/** Cores [claro, escuro] da skin equipada, ou null para usar a do personagem. */
export function equippedSkinColors(owned: OwnedItems): [string, string] | null {
  if (!owned.equippedSkin) return null;
  const item = itemIndex.get(owned.equippedSkin);
  if (!item || item.kind !== "skin") return null;
  const [light, dark] = item.value.split(",");
  if (!light || !dark) return null;
  return [light, dark];
}

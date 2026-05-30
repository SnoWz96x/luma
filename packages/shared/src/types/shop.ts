// Loja cosmética e skins. Veja docs/14-ROADMAP-UNIFICADO.md (Fase 4).
// Tudo cosmético: NUNCA pay-to-win, sem pressão de compra.

export type ShopItemKind = "skin" | "accessory" | "scene";

export interface ShopItem {
  id: string;
  name: string;
  emoji: string;
  kind: ShopItemKind;
  /** preço em fagulhas (moeda gentil) */
  price: number;
  /**
   * para skins: par de cores [claro, escuro] que sobrescreve a paleta do pet.
   * para scene: id de fundo. para accessory: id do adorno.
   */
  value: string;
}

export interface OwnedItems {
  /** ids de itens comprados */
  owned: string[];
  /** skin equipada (id) ou null para a padrão do personagem */
  equippedSkin: string | null;
}

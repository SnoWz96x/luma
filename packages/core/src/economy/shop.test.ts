import { describe, it, expect } from "vitest";
import {
  SHOP_ITEMS,
  DEFAULT_OWNED,
  purchase,
  equipSkin,
  equippedSkinColors,
  getShopItem,
} from "./shop.js";

describe("purchase", () => {
  it("compra um item quando há fagulhas", () => {
    const item = SHOP_ITEMS[0]!;
    const r = purchase(DEFAULT_OWNED, item.price, item.id);
    expect(r.ok).toBe(true);
    expect(r.sparks).toBe(0);
    expect(r.owned.owned).toContain(item.id);
  });

  it("recusa sem fagulhas suficientes", () => {
    const item = SHOP_ITEMS[0]!;
    const r = purchase(DEFAULT_OWNED, item.price - 1, item.id);
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("not_enough");
  });

  it("não compra item já possuído", () => {
    const item = SHOP_ITEMS[0]!;
    const once = purchase(DEFAULT_OWNED, item.price, item.id).owned;
    const twice = purchase(once, 999, item.id);
    expect(twice.ok).toBe(false);
    expect(twice.reason).toBe("already_owned");
  });

  it("ignora item inexistente", () => {
    expect(purchase(DEFAULT_OWNED, 999, "nope").reason).toBe("not_found");
  });
});

describe("equipSkin & equippedSkinColors", () => {
  it("só equipa skin possuída", () => {
    const notOwned = equipSkin(DEFAULT_OWNED, "skin_rose");
    expect(notOwned.equippedSkin).toBeNull();
  });

  it("equipa e devolve as cores", () => {
    const item = getShopItem("skin_rose")!;
    const owned = purchase(DEFAULT_OWNED, item.price, item.id).owned;
    const equipped = equipSkin(owned, "skin_rose");
    expect(equipped.equippedSkin).toBe("skin_rose");
    const colors = equippedSkinColors(equipped);
    expect(colors).toHaveLength(2);
    expect(colors![0]).toMatch(/^#/);
  });

  it("sem skin equipada -> null (usa cor do personagem)", () => {
    expect(equippedSkinColors(DEFAULT_OWNED)).toBeNull();
  });

  it("desequipar volta para a padrão", () => {
    const item = getShopItem("skin_mint")!;
    const owned = purchase(DEFAULT_OWNED, item.price, item.id).owned;
    const equipped = equipSkin(owned, "skin_mint");
    const off = equipSkin(equipped, null);
    expect(equippedSkinColors(off)).toBeNull();
  });
});

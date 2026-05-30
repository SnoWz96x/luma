// Loja cosmética — gastar fagulhas em skins. Comprar, equipar, desequipar.
import { SHOP_ITEMS } from "@luma/core";
import { useShopStore } from "../stores/shopStore";
import { useHabitsStore } from "../stores/habitsStore";

export function ShopPanel() {
  const owned = useShopStore((s) => s.owned);
  const buy = useShopStore((s) => s.buy);
  const equip = useShopStore((s) => s.equip);
  const sparks = useHabitsStore((s) => s.sparks);

  return (
    <div className="flex flex-col gap-2 overflow-auto pr-1">
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-luma-muted">Enfeites cosméticos 🎀</p>
        <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-200">
          ✨ {sparks}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {SHOP_ITEMS.map((item) => {
          const isOwned = owned.owned.includes(item.id);
          const isEquipped = owned.equippedSkin === item.id;
          const canAfford = sparks >= item.price;
          const [light, dark] = item.value.split(",");
          return (
            <div
              key={item.id}
              className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.05] p-3"
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-full text-lg shadow-soft"
                style={{ background: `linear-gradient(135deg, ${light}, ${dark})` }}
              >
                {item.emoji}
              </span>
              <p className="text-xs font-medium text-luma-ink">{item.name}</p>

              {!isOwned ? (
                <button
                  type="button"
                  onClick={() => buy(item.id)}
                  disabled={!canAfford}
                  className="w-full rounded-xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-2 py-1 text-[11px] font-bold text-luma-bg0 transition hover:brightness-110 disabled:opacity-40"
                >
                  ✨ {item.price}
                </button>
              ) : isEquipped ? (
                <button
                  type="button"
                  onClick={() => equip(null)}
                  className="w-full rounded-xl border border-emerald-300/30 bg-emerald-400/15 px-2 py-1 text-[11px] font-medium text-emerald-200"
                >
                  ✓ Equipado
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => equip(item.id)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.06] px-2 py-1 text-[11px] text-luma-ink transition hover:bg-white/[0.1]"
                >
                  Equipar
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

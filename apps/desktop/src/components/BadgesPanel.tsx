// Painel de conquistas — badges desbloqueados e bloqueados (sem comparação social).
import { BADGES } from "@luma/core";
import { useProgressStore } from "../stores/progressStore";

export function BadgesPanel() {
  const badges = useProgressStore((s) => s.badges);
  const unlocked = new Set(badges.map((b) => b.id));

  // badges secretos só aparecem depois de desbloqueados
  const visible = BADGES.filter((b) => !b.secret || unlocked.has(b.id));

  return (
    <div className="grid grid-cols-2 gap-2 overflow-auto pr-1">
      {visible.map((b) => {
        const has = unlocked.has(b.id);
        return (
          <div
            key={b.id}
            className={`flex items-center gap-2 rounded-2xl border p-2.5 transition ${
              has
                ? "border-white/15 bg-white/[0.08]"
                : "border-white/5 bg-white/[0.02] opacity-50"
            }`}
          >
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-lg ${
                has ? "bg-gradient-to-br from-luma-accent/40 to-luma-accent2/40" : "bg-white/5 grayscale"
              }`}
            >
              {has ? b.emoji : "🔒"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-luma-ink">{b.title}</p>
              <p className="truncate text-[10px] text-luma-muted">{b.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

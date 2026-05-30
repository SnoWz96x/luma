// Celebração gentil ao desbloquear um badge (toast suave, sem estridência).
import { useEffect } from "react";
import { getBadge } from "@luma/core";
import { useProgressStore } from "../stores/progressStore";

export function Celebration() {
  const justUnlocked = useProgressStore((s) => s.justUnlocked);
  const clear = useProgressStore((s) => s.clearCelebration);

  useEffect(() => {
    if (!justUnlocked) return;
    const t = setTimeout(clear, 3500);
    return () => clearTimeout(t);
  }, [justUnlocked, clear]);

  if (!justUnlocked) return null;
  const badge = getBadge(justUnlocked);
  if (!badge) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-14 z-50 flex justify-center">
      <div className="pop flex items-center gap-2 rounded-2xl border border-white/15 bg-luma-bg/90 px-4 py-2 shadow-glow backdrop-blur">
        <span className="text-xl">{badge.emoji}</span>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-luma-accent">
            Nova conquista
          </p>
          <p className="text-sm font-semibold text-luma-ink">{badge.title}</p>
        </div>
      </div>
    </div>
  );
}

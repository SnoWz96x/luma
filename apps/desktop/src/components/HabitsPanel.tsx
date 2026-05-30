// Painel de hábitos — check-in gentil. Concluir dá fagulhas + cuidado ao pet.
import { useState } from "react";
import { useHabitsStore } from "../stores/habitsStore";
import { useProgressStore } from "../stores/progressStore";

export function HabitsPanel() {
  const { complete } = useHabitsStore();
  const progress = useHabitsStore((s) => s.progress());
  const care = useProgressStore((s) => s.care);
  const [pulse, setPulse] = useState<string | null>(null);

  const handle = (id: string) => {
    const reward = complete(id);
    if (reward > 0) {
      care("habitDone");
      setPulse(id);
      setTimeout(() => setPulse(null), 600);
    }
  };

  return (
    <div className="flex flex-col gap-2 overflow-auto pr-1">
      <p className="px-1 text-[11px] text-luma-muted">
        Pequenos cuidados de hoje. Sem pressa, sem cobrança. 🌿
      </p>
      {progress.map((p) => (
        <button
          key={p.def.id}
          type="button"
          onClick={() => handle(p.def.id)}
          disabled={p.doneToday}
          className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition ${
            p.doneToday
              ? "border-emerald-300/20 bg-emerald-400/10"
              : "border-white/10 bg-white/[0.05] hover:bg-white/[0.1]"
          } ${pulse === p.def.id ? "pop" : ""}`}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-lg">
            {p.def.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-luma-ink">
              {p.def.title}
            </p>
            {p.streak > 0 && (
              <p className="text-[10px] text-orange-200">🔥 {p.streak} dias</p>
            )}
          </div>
          <span className="shrink-0 text-sm">
            {p.doneToday ? (
              <span className="text-emerald-300">✓ feito</span>
            ) : (
              <span className="text-luma-muted">✨ {p.def.reward}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

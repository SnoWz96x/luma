// Barra de interações (ações com o pet). Curtas, gentis, opcionais.
import type { InteractionKind } from "@luma/core";

const ACTIONS: { kind: InteractionKind; label: string; emoji: string }[] = [
  { kind: "talk", label: "Conversar", emoji: "💬" },
  { kind: "play", label: "Brincar", emoji: "🎾" },
  { kind: "comfort", label: "Aconchego", emoji: "🫂" },
  { kind: "rest", label: "Descansar", emoji: "😴" },
  { kind: "checkin", label: "Check-in", emoji: "✅" },
];

export function InteractionBar({
  onAction,
}: {
  onAction: (kind: InteractionKind) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {ACTIONS.map((a) => (
        <button
          key={a.kind}
          type="button"
          onClick={() => onAction(a.kind)}
          className="group flex flex-col items-center gap-0.5 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-luma-ink backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/[0.12] active:translate-y-0"
        >
          <span aria-hidden className="text-lg transition group-hover:scale-110">
            {a.emoji}
          </span>
          <span className="text-[11px] text-luma-muted">{a.label}</span>
        </button>
      ))}
    </div>
  );
}

// Mundo Espelho — a jornada do usuário desenhada como paisagem viva.
// Flores (dias bons), árvores (amizade), vaga-lumes (conversas), estrelas
// (memórias), pontes (conquistas). Sem números — tudo sentido.
import { useMemo } from "react";
import { buildWorld, buildConstellation, describeWorld } from "@luma/core";
import type { WorldElement } from "@luma/shared";
import { useChatStore } from "../stores/chatStore";
import { useHabitsStore } from "../stores/habitsStore";
import { useProgressStore } from "../stores/progressStore";

function Glyph({ el }: { el: WorldElement }) {
  const left = `${el.x * 100}%`;
  const top = `${el.y * 100}%`;
  const common = "absolute -translate-x-1/2 -translate-y-1/2 select-none";

  switch (el.kind) {
    case "star":
      return (
        <span
          className={`${common} text-amber-200`}
          style={{ left, top, fontSize: 11, animation: `luma-twinkle ${2 + (el.x * 3)}s ease-in-out infinite` }}
        >
          ✦
        </span>
      );
    case "firefly":
      return (
        <span
          className={`${common}`}
          style={{ left, top, animation: `luma-float ${3 + el.y * 2}s ease-in-out infinite` }}
        >
          <span className="block h-1.5 w-1.5 rounded-full bg-yellow-200 shadow-[0_0_6px_2px_rgba(255,240,150,0.7)]" />
        </span>
      );
    case "tree":
      return <span className={common} style={{ left, top, fontSize: 26 }}>🌳</span>;
    case "flower":
      return <span className={common} style={{ left, top, fontSize: 15 }}>🌸</span>;
    case "building":
      return <span className={common} style={{ left, top, fontSize: 18 }}>🏡</span>;
    case "bridge":
      return <span className={common} style={{ left, top, fontSize: 22 }}>🌉</span>;
    default:
      return null;
  }
}

export function WorldScene() {
  const memories = useChatStore((s) => s.memories);
  const relationship = useChatStore((s) => s.relationship);
  const messages = useChatStore((s) => s.messages);
  const logs = useHabitsStore((s) => s.logs);
  const badges = useProgressStore((s) => s.badges);
  const streak = useProgressStore((s) => s.streak);

  const journey = useMemo(
    () => ({
      positiveDays: streak.best,
      habitsDone: logs.length,
      friendship: relationship.friendship,
      memories: memories.length,
      conversations: messages.filter((m) => m.role === "user").length,
      milestones: badges.length,
    }),
    [streak.best, logs.length, relationship.friendship, memories.length, messages, badges.length],
  );

  const elements = useMemo(() => buildWorld(journey), [journey]);
  const stars = useMemo(() => buildConstellation(memories), [memories]);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[22px] border border-white/10 shadow-soft"
        style={{ background: "linear-gradient(180deg,#1b2540 0%,#243a52 45%,#2a3a2e 100%)" }}>
        {/* céu/chão */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-green-950/60 to-transparent" />

        {/* constelações de memória (estrelas brilhantes, clicáveis) */}
        {stars.map((s) => (
          <span
            key={s.memoryId}
            title={s.content}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-help text-amber-100"
            style={{
              left: `${s.x * 100}%`,
              top: `${s.y * 100}%`,
              fontSize: 10 + s.brightness * 8,
              opacity: 0.5 + s.brightness * 0.5,
              filter: `drop-shadow(0 0 ${2 + s.brightness * 4}px rgba(255,240,180,0.8))`,
            }}
          >
            ★
          </span>
        ))}

        {/* elementos da jornada */}
        {elements.map((el) => (
          <Glyph key={el.id} el={el} />
        ))}

        <style>{`
          @keyframes luma-twinkle{0%,100%{opacity:.4}50%{opacity:1}}
          @keyframes luma-float{0%,100%{transform:translate(-50%,-50%)}50%{transform:translate(-50%,-70%)}}
        `}</style>
      </div>

      <p className="px-1 text-center text-[11px] text-luma-muted">
        {describeWorld(journey)}
      </p>
    </div>
  );
}

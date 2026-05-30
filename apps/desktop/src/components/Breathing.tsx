// Mini-game de respiração guiada — a bolha infla/esvazia e o pet respira junto.
// Cozy, sem game-over. Recompensa em fagulhas ao concluir.
import { useEffect, useRef, useState } from "react";
import { createBreathingSession, bubbleScale } from "@luma/core";
import { useHabitsStore } from "../stores/habitsStore";
import { useProgressStore } from "../stores/progressStore";

type Status = "idle" | "running" | "done";

export function Breathing() {
  const session = useRef(createBreathingSession(3));
  const [status, setStatus] = useState<Status>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [scale, setScale] = useState(0.5);
  const addSparks = useHabitsStore((s) => s.addSparks);
  const care = useProgressStore((s) => s.care);
  const timer = useRef<number | null>(null);

  const steps = session.current.steps;
  const step = steps[stepIdx];

  useEffect(() => {
    if (status !== "running" || !step) return;
    const target = bubbleScale(step.phase);
    setScale(target.from);
    const raf = requestAnimationFrame(() => setScale(target.to));
    timer.current = window.setTimeout(() => {
      if (stepIdx + 1 < steps.length) {
        setStepIdx((i) => i + 1);
      } else {
        setStatus("done");
        addSparks(session.current.reward);
        care("interaction");
      }
    }, step.seconds * 1000);
    return () => {
      cancelAnimationFrame(raf);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [status, stepIdx, step, steps.length, addSparks, care]);

  const start = () => {
    session.current = createBreathingSession(3);
    setStepIdx(0);
    setStatus("running");
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
      <div className="relative grid h-44 w-44 place-items-center">
        <div
          className="absolute h-44 w-44 rounded-full bg-gradient-to-br from-luma-accent/40 to-luma-accent2/40 blur-md transition-transform ease-in-out"
          style={{
            transform: `scale(${scale})`,
            transitionDuration: `${(step?.seconds ?? 1) * 1000}ms`,
          }}
        />
        <div
          className="relative grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-luma-accent to-luma-accent2 text-3xl shadow-glow transition-transform ease-in-out"
          style={{
            transform: `scale(${0.7 + scale * 0.3})`,
            transitionDuration: `${(step?.seconds ?? 1) * 1000}ms`,
          }}
        >
          🌬️
        </div>
      </div>

      {status === "idle" && (
        <>
          <p className="max-w-xs text-sm text-luma-muted">
            Um momento só seu. Respire junto comigo por alguns ciclos.
          </p>
          <button
            type="button"
            onClick={start}
            className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-5 py-2.5 text-sm font-bold text-luma-bg0 shadow-glow transition hover:brightness-110"
          >
            Começar a respirar 🫧
          </button>
        </>
      )}

      {status === "running" && step && (
        <p className="text-lg font-medium text-luma-ink">{step.label}</p>
      )}

      {status === "done" && (
        <>
          <p className="text-sm text-luma-ink">Que bom respirar com você. 💗</p>
          <p className="text-[11px] text-luma-muted">
            +{session.current.reward} fagulhas ✨
          </p>
          <button
            type="button"
            onClick={start}
            className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-luma-ink transition hover:bg-white/[0.1]"
          >
            De novo
          </button>
        </>
      )}
    </div>
  );
}

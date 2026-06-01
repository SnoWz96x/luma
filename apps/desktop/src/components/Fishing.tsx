// Minigame de pescaria cozy. Lança a linha, espera fisgar, toca para puxar.
// Sem game-over: sempre pesca algo. Recompensa em fagulhas (Economy).
import { useRef, useState } from "react";
import { castLine, biteDelay, type CatchResult } from "@luma/core";
import { useHabitsStore } from "../stores/habitsStore";
import { useProgressStore } from "../stores/progressStore";

type Phase = "idle" | "waiting" | "bite" | "done";

export function Fishing() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<CatchResult | null>(null);
  const seedRef = useRef(Date.now());
  const timer = useRef<number | null>(null);
  const addSparks = useHabitsStore((s) => s.addSparks);
  const care = useProgressStore((s) => s.care);

  const cast = () => {
    const seed = Date.now() >>> 0;
    seedRef.current = seed;
    setResult(null);
    setPhase("waiting");
    timer.current = window.setTimeout(() => setPhase("bite"), biteDelay(seed));
  };

  const pull = () => {
    if (phase !== "bite") {
      // puxou cedo demais — sem peixe, sem punição
      if (timer.current) clearTimeout(timer.current);
      setPhase("idle");
      return;
    }
    const c = castLine(seedRef.current);
    setResult(c);
    setPhase("done");
    addSparks(c.reward);
    care("interaction");
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
      <div
        className="relative grid h-44 w-full max-w-xs place-items-center overflow-hidden rounded-[22px] border border-white/10"
        style={{ background: "linear-gradient(180deg,#243a52 0%,#1d2c40 60%,#16263a 100%)" }}
      >
        {/* ondas */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 opacity-40"
          style={{ background: "repeating-linear-gradient(90deg,#3b6ea5 0 12px,#34618f 12px 24px)" }} />
        <span className="relative text-5xl" style={{ animation: phase === "bite" ? "luma-hop .5s ease-in-out infinite" : "none" }}>
          {phase === "done" && result ? result.emoji : phase === "bite" ? "❗" : "🎣"}
        </span>
      </div>

      {phase === "idle" && (
        <>
          <p className="max-w-xs text-sm text-luma-muted">Um momento calmo à beira d'água. Lance a linha…</p>
          <button type="button" onClick={cast} className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-5 py-2.5 text-sm font-bold text-luma-bg0 shadow-glow transition hover:brightness-110">
            Lançar a linha 🎣
          </button>
        </>
      )}

      {phase === "waiting" && (
        <>
          <p className="text-sm text-luma-ink">Esperando fisgar… fique de olho!</p>
          <button type="button" onClick={pull} className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-2.5 text-sm text-luma-muted">
            Puxar
          </button>
        </>
      )}

      {phase === "bite" && (
        <button type="button" onClick={pull} className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-6 py-3 text-base font-bold text-luma-bg0 shadow-glow animate-pulse">
          PUXAR AGORA! ❗
        </button>
      )}

      {phase === "done" && result && (
        <>
          <p className="text-sm text-luma-ink">
            Você pescou: <b>{result.label}</b> {result.emoji}
          </p>
          <p className="text-[11px] text-luma-muted">+{result.reward} fagulhas ✨</p>
          <button type="button" onClick={cast} className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-5 py-2.5 text-sm font-bold text-luma-bg0 transition hover:brightness-110">
            Pescar de novo
          </button>
        </>
      )}
    </div>
  );
}

// Scene — o "mundo" ao redor do pet. Reflete o estado SEM barras:
// paleta (humor), clima, luz, hora do dia. O usuário sente, não lê números.
import type { SensorySignals } from "@luma/shared";
import type { ReactNode } from "react";

const PALETTE_BG: Record<SensorySignals["palette"], string> = {
  warm: "linear-gradient(180deg,#3a2f4e 0%,#2a2138 55%,#1c1b29 100%)",
  neutral: "linear-gradient(180deg,#2b2a45 0%,#222138 55%,#16151f 100%)",
  cool: "linear-gradient(180deg,#243a52 0%,#1d2a3d 55%,#141b27 100%)",
};

function Ground() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20">
      <div className="absolute inset-x-0 bottom-0 h-20 rounded-b-[22px] bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute inset-x-6 bottom-5 h-3 rounded-full bg-black/30 blur-md" />
    </div>
  );
}

function WeatherFX({ weather }: { weather: SensorySignals["weather"] }) {
  if (weather === "soft_rain" || weather === "rain") {
    const drops = weather === "rain" ? 46 : 22;
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
        {Array.from({ length: drops }).map((_, i) => (
          <span
            key={i}
            className="absolute block w-px bg-gradient-to-b from-transparent via-sky-200/40 to-sky-200/10"
            style={{
              left: `${(i * 100) / drops}%`,
              height: `${10 + (i % 4) * 5}px`,
              animation: `luma-rain ${0.9 + (i % 5) * 0.16}s linear ${i * 0.08}s infinite`,
            }}
          />
        ))}
        <style>{`@keyframes luma-rain{0%{transform:translateY(-24px);opacity:0}20%{opacity:1}100%{transform:translateY(420px);opacity:0}}`}</style>
      </div>
    );
  }
  if (weather === "sunny") {
    return (
      <div
        className="pointer-events-none absolute inset-0 rounded-[22px]"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 12%, rgba(255,221,140,.28), transparent 70%)",
        }}
      />
    );
  }
  return null;
}

function Stars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
      {Array.from({ length: 26 }).map((_, i) => (
        <span
          key={i}
          className="absolute block rounded-full bg-white"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 29) % 60}%`,
            width: i % 6 === 0 ? 3 : 2,
            height: i % 6 === 0 ? 3 : 2,
            opacity: 0.25 + ((i * 7) % 5) / 8,
            animation: `luma-twinkle ${2 + (i % 4)}s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`@keyframes luma-twinkle{0%,100%{opacity:.2}50%{opacity:.9}}`}</style>
    </div>
  );
}

interface SceneProps {
  signals: SensorySignals;
  children: ReactNode;
}

export function Scene({ signals, children }: SceneProps) {
  const night = signals.palette !== "warm";
  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[22px] border border-white/10 shadow-soft transition-all duration-700"
      style={{ background: PALETTE_BG[signals.palette] }}
    >
      {night && <Stars />}
      <WeatherFX weather={signals.weather} />
      <Ground />
      <div className="aura" style={{ opacity: signals.light }} />
      <div className="relative z-10 pb-6">{children}</div>
    </div>
  );
}

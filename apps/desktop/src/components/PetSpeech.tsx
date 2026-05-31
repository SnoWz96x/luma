// Balão de fala proativa do pet (Casa). Mostra saudação de evento sazonal, se
// houver, ou a vida interior do pet (System Motivator) conforme o contexto
// emocional. Gentil e opt-in — pode ser dispensado.
import { useEffect, useMemo, useState } from "react";
import {
  inferEmotion,
  proactiveLine,
  activeEvent,
} from "@luma/core";
import { useChatStore } from "../stores/chatStore";
import { useProgressStore } from "../stores/progressStore";
import { useHabitsStore } from "../stores/habitsStore";
import { useAppStore } from "../stores/appStore";

export function PetSpeech() {
  const relationship = useChatStore((s) => s.relationship);
  const streak = useProgressStore((s) => s.streak.current);
  const habitsToday = useHabitsStore((s) => s.doneToday());
  const petName = useAppStore((s) => s.petName);
  const [dismissed, setDismissed] = useState(false);

  const line = useMemo(() => {
    const now = new Date();
    const event = activeEvent(now);
    if (event) {
      return { text: `${event.emoji} ${event.greeting}`, source: "event" as const };
    }
    const emotion = inferEmotion({ streak, habitsToday, friendship: relationship.friendship });
    const pl = proactiveLine(emotion, now.toISOString());
    return pl ? { text: pl.text, source: pl.source } : null;
    // recalcula quando muda algo relevante do dia
  }, [streak, habitsToday, relationship.friendship]);

  // reaparece quando a fala muda
  useEffect(() => {
    setDismissed(false);
  }, [line?.text]);

  if (!line || dismissed) return null;

  return (
    <div className="fade-up mx-auto flex max-w-xs items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur">
      <p className="flex-1 text-center text-[12px] leading-relaxed text-luma-ink/90">
        <span className="mb-0.5 block text-[10px] font-semibold text-luma-accent">
          {petName}
        </span>
        {line.text}
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dispensar"
        className="text-luma-muted transition hover:text-luma-ink"
      >
        ×
      </button>
    </div>
  );
}

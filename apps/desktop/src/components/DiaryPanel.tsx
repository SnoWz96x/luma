// Diário digital — entradas viram memórias (estrelas no Mundo Espelho).
// Privacidade: tudo apagável. Opcional escolher um humor para a entrada.
import { useState } from "react";
import { useMemoryStore } from "../stores/memoryStore";
import { useProgressStore } from "../stores/progressStore";

const MOODS: { id: string; emoji: string; label: string }[] = [
  { id: "great", emoji: "😄", label: "Ótimo" },
  { id: "good", emoji: "🙂", label: "Bom" },
  { id: "ok", emoji: "😌", label: "Neutro" },
  { id: "low", emoji: "😕", label: "Difícil" },
  { id: "sad", emoji: "😢", label: "Pesado" },
];

function whenLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export function DiaryPanel() {
  const addDiary = useMemoryStore((s) => s.addDiary);
  const remove = useMemoryStore((s) => s.remove);
  const entries = useMemoryStore((s) => s.diaryEntries());
  const care = useProgressStore((s) => s.care);
  const [text, setText] = useState("");
  const [mood, setMood] = useState<string>("ok");

  const save = () => {
    if (!text.trim()) return;
    const mem = addDiary(text, mood);
    if (mem) {
      care("interaction"); // escrever no diário é autocuidado
      setText("");
    }
  };

  return (
    <div className="flex h-full flex-col gap-2">
      {/* escrever */}
      <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="O que te fez sentir algo hoje? Escreva sem pressa…"
          rows={3}
          className="resize-none rounded-xl bg-white/[0.06] px-3 py-2 text-sm text-luma-ink outline-none transition focus:bg-white/[0.09] placeholder:text-luma-muted/60"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMood(m.id)}
                title={m.label}
                aria-pressed={mood === m.id}
                className={`grid h-8 w-8 place-items-center rounded-lg text-base transition ${
                  mood === m.id ? "bg-white/15 ring-1 ring-luma-accent" : "hover:bg-white/10"
                }`}
              >
                {m.emoji}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={save}
            disabled={!text.trim()}
            className="rounded-xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-4 py-2 text-sm font-bold text-luma-bg0 transition hover:brightness-110 disabled:opacity-40"
          >
            Guardar ⭐
          </button>
        </div>
      </div>

      {/* entradas */}
      <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1">
        {entries.length === 0 ? (
          <p className="px-1 pt-4 text-center text-[12px] text-luma-muted">
            Cada lembrança guardada vira uma estrela no seu mundo. 🌌
          </p>
        ) : (
          entries.map((e) => (
            <div
              key={e.id}
              className="group flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-3"
            >
              <span className="text-base">
                {MOODS.find((m) => m.id === e.emotion)?.emoji ?? "⭐"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="whitespace-pre-wrap break-words text-sm text-luma-ink">
                  {e.content}
                </p>
                <p className="mt-0.5 text-[10px] text-luma-muted">{whenLabel(e.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => remove(e.id)}
                aria-label="Apagar lembrança"
                className="opacity-0 transition group-hover:opacity-100 text-luma-muted hover:text-red-300"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

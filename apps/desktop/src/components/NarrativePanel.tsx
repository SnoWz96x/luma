// Aba Narrativa — micro-história contínua que avança com o vínculo. Os capítulos
// desbloqueados podem ser revisitados. O capítulo atual fica em destaque.
import { unlockedChapters, currentChapter, TOTAL_CHAPTERS } from "@luma/core";
import { useChatStore } from "../stores/chatStore";

export function NarrativePanel() {
  const relationship = useChatStore((s) => s.relationship);
  const chapters = unlockedChapters(relationship);
  const current = currentChapter(relationship);

  return (
    <div className="flex h-full flex-col gap-2 overflow-auto pr-1">
      <p className="px-1 text-[11px] text-luma-muted">
        Nossa história ({chapters.length}/{TOTAL_CHAPTERS}) — cresce conforme nosso vínculo. 📖
      </p>
      {chapters
        .slice()
        .reverse()
        .map((c) => {
          const isCurrent = c.id === current.id;
          return (
            <div
              key={c.id}
              className={`rounded-2xl border p-3 ${
                isCurrent
                  ? "border-luma-accent/40 bg-luma-accent/10"
                  : "border-white/10 bg-white/[0.05]"
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-luma-ink">{c.title}</span>
                {isCurrent && (
                  <span className="rounded-full bg-luma-accent/20 px-2 py-0.5 text-[10px] text-luma-accent">
                    agora
                  </span>
                )}
              </div>
              <p className="text-[13px] leading-relaxed text-luma-ink/85">{c.text}</p>
            </div>
          );
        })}
    </div>
  );
}

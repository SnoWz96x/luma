// Chat — conversa com o pet. Usa o chatStore (Safety + Memory + Relationship).
import { useState, useRef, useEffect } from "react";
import type { CharacterDef } from "@luma/shared";
import { useChatStore } from "../stores/chatStore";
import { useProgressStore } from "../stores/progressStore";

interface ChatProps {
  character: CharacterDef;
  petName: string;
  onEmotion?: (emotion: string) => void;
}

export function Chat({ character, petName, onEmotion }: ChatProps) {
  const { messages, sending, send, greet } = useChatStore();
  const award = useProgressStore((s) => s.award);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    greet(character);
  }, [character, greet]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const handleSend = async () => {
    const value = text;
    if (!value.trim()) return;
    setText("");
    const emotion = await send(character, value);
    onEmotion?.(emotion);
    award("first_talk"); // badge de primeira conversa (idempotente)
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="min-h-0 flex-1 space-y-2.5 overflow-auto rounded-[22px] border border-white/10 bg-white/[0.03] p-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex fade-up ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed shadow-soft ${
                m.role === "user"
                  ? "rounded-br-md bg-gradient-to-br from-luma-accent to-luma-accent2 text-luma-bg0"
                  : "rounded-bl-md border border-white/10 bg-white/[0.07] text-luma-ink"
              }`}
            >
              {m.role === "pet" && (
                <span className="mb-0.5 block text-[10px] font-semibold text-luma-accent">
                  {petName}
                </span>
              )}
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.07] px-3.5 py-2.5">
              <Dot delay={0} />
              <Dot delay={150} />
              <Dot delay={300} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          placeholder={`Conversar com ${petName}…`}
          className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm text-luma-ink outline-none transition focus:border-luma-accent/60 placeholder:text-luma-muted/60"
        />
        <button
          type="button"
          onClick={() => void handleSend()}
          disabled={sending || !text.trim()}
          className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-4 py-2.5 text-sm font-bold text-luma-bg0 transition hover:brightness-110 disabled:opacity-40"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="block h-2 w-2 rounded-full bg-luma-muted"
      style={{ animation: `luma-bounce 1s ${delay}ms infinite ease-in-out` }}
    >
      <style>{`@keyframes luma-bounce{0%,80%,100%{transform:translateY(0);opacity:.5}40%{transform:translateY(-4px);opacity:1}}`}</style>
    </span>
  );
}

// Configurações — país (Help Hub), provider de IA (futuro) e PRIVACIDADE:
// exportar / importar / apagar todos os dados. Tudo local, do usuário.
import { useRef, useState } from "react";
import { useSupportStore } from "../stores/supportStore";
import { downloadBackup, importBackup, eraseAllData } from "../lib/dataPrivacy";

const COUNTRIES = [
  { code: "BR", label: "🇧🇷 Brasil" },
  { code: "INT", label: "🌍 Internacional" },
];

export function SettingsPanel() {
  const country = useSupportStore((s) => s.country);
  const setCountry = useSupportStore((s) => s.setCountry);
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const onImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importBackup(String(reader.result));
      setMsg(ok ? "Dados restaurados! Reabrindo…" : "Arquivo inválido.");
      if (ok) setTimeout(() => location.reload(), 900);
    };
    reader.readAsText(file);
  };

  const onErase = () => {
    const ok = window.confirm(
      "Apagar TODOS os dados do LUMA (pet, diário, hábitos, conquistas, contatos)?\n\nIsto é irreversível.",
    );
    if (ok) {
      eraseAllData();
      location.reload();
    }
  };

  return (
    <div className="flex flex-col gap-4 overflow-auto pr-1">
      {/* país */}
      <section>
        <h3 className="mb-1.5 px-1 text-xs font-semibold text-luma-ink">
          País (recursos de apoio)
        </h3>
        <div className="flex gap-2">
          {COUNTRIES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCountry(c.code)}
              className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
                country === c.code
                  ? "border-luma-accent bg-luma-accent/15 text-luma-ink"
                  : "border-white/10 bg-white/[0.05] text-luma-muted hover:bg-white/[0.1]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* IA (preparado) */}
      <section>
        <h3 className="mb-1.5 px-1 text-xs font-semibold text-luma-ink">
          Inteligência do pet
        </h3>
        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3 text-[12px] text-luma-muted">
          Modo atual: <b className="text-luma-ink">Local (offline)</b>. Em breve:
          conectar um modelo local (Ollama) para conversas mais ricas — 100% no seu
          computador.
        </div>
      </section>

      {/* privacidade */}
      <section>
        <h3 className="mb-1.5 px-1 text-xs font-semibold text-luma-ink">
          Seus dados
        </h3>
        <p className="mb-2 px-1 text-[11px] leading-relaxed text-luma-muted">
          Tudo fica no seu computador. Você pode levar seus dados embora ou apagá-los
          quando quiser.
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              downloadBackup();
              setMsg("Backup exportado 💾");
            }}
            className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-luma-ink transition hover:bg-white/[0.1]"
          >
            💾 Exportar meus dados
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-luma-ink transition hover:bg-white/[0.1]"
          >
            📂 Importar backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
            }}
          />
          <button
            type="button"
            onClick={onErase}
            className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 transition hover:bg-red-500/20"
          >
            🗑️ Apagar todos os dados
          </button>
        </div>
        {msg && (
          <p className="mt-2 rounded-xl border border-luma-accent/20 bg-luma-accent/10 p-2 text-[12px] text-luma-ink fade-up">
            {msg}
          </p>
        )}
      </section>

      <p className="px-1 pb-2 text-center text-[10px] text-luma-muted/70">
        LUMA é companhia e bem-estar — não substitui ajuda profissional. 💛
      </p>
    </div>
  );
}

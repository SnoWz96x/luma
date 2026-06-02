// Configurações — país (Help Hub), provider de IA (futuro) e PRIVACIDADE:
// exportar / importar / apagar todos os dados. Tudo local, do usuário.
import { useEffect, useRef, useState } from "react";
import { stageLabel, describeModels, pickBestModel } from "@luma/core";
import { useSupportStore } from "../stores/supportStore";
import { useProgressStore } from "../stores/progressStore";
import { useAiStore } from "../stores/aiStore";
import { useSyncStore } from "../stores/syncStore";
import type { SyncMode } from "@luma/shared";
import { downloadBackup, importBackup, eraseAllData } from "../lib/dataPrivacy";

const COUNTRIES = [
  { code: "BR", label: "🇧🇷 Brasil" },
  { code: "INT", label: "🌍 Internacional" },
];

export function SettingsPanel() {
  const country = useSupportStore((s) => s.country);
  const setCountry = useSupportStore((s) => s.setCountry);
  const growth = useProgressStore((s) => s.growth);
  const demoGrow = useProgressStore((s) => s.demoGrow);
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
      "Recomeçar do zero?\n\nIsto apaga TODOS os dados (pet, diário, hábitos, conquistas, contatos) e volta ao início — como um LUMA novo. Irreversível.",
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

      {/* demonstração de crescimento */}
      <section>
        <h3 className="mb-1.5 px-1 text-xs font-semibold text-luma-ink">
          Crescimento (demonstração)
        </h3>
        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-3">
          <p className="mb-2 text-[12px] text-luma-muted">
            Estágio atual:{" "}
            <b className="text-luma-ink">{stageLabel(growth.stage)}</b>. Use o
            botão para ver o pet evoluir na hora (no uso normal, ele cresce com o
            tempo e o cuidado).
          </p>
          <button
            type="button"
            onClick={() => demoGrow()}
            className="w-full rounded-xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-3 py-2 text-sm font-bold text-luma-bg0 transition hover:brightness-110"
          >
            ✨ Crescer agora
          </button>
        </div>
      </section>

      {/* IA */}
      <AiSection />

      {/* Sincronização */}
      <SyncSection />

      {/* privacidade */}
      <section>
        <h3 className="mb-1.5 px-1 text-xs font-semibold text-luma-ink">
          Seus dados
        </h3>
        <p className="mb-2 px-1 text-[11px] leading-relaxed text-luma-muted">
          Tudo fica no seu computador. Você pode levar seus dados embora ou
          apagá-los quando quiser.
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
            🔄 Recomeçar do zero (apagar tudo)
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

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  unknown: { text: "—", cls: "text-luma-muted" },
  checking: { text: "verificando…", cls: "text-amber-200" },
  online: { text: "● conectado", cls: "text-emerald-300" },
  offline: { text: "● offline (usando modo simples)", cls: "text-orange-200" },
};

function AiSection() {
  const {
    mode, baseUrl, model, status, installed, ramGb,
    setMode, setBaseUrl, setModel, checkOllama,
  } = useAiStore();

  // ao abrir em modo Ollama, verifica a conexão uma vez
  useEffect(() => {
    if (mode === "ollama") void checkOllama();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const st = STATUS_LABEL[status] ?? STATUS_LABEL.unknown!;
  const models = describeModels({ ramGb, installed });
  const best = pickBestModel({ ramGb, installed });

  return (
    <section>
      <h3 className="mb-1.5 px-1 text-xs font-semibold text-luma-ink">
        Inteligência do pet
      </h3>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("mock")}
          className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
            mode === "mock"
              ? "border-luma-accent bg-luma-accent/15 text-luma-ink"
              : "border-white/10 bg-white/[0.05] text-luma-muted hover:bg-white/[0.1]"
          }`}
        >
          🌙 Simples (offline)
        </button>
        <button
          type="button"
          onClick={() => setMode("ollama")}
          className={`flex-1 rounded-xl border px-3 py-2 text-sm transition ${
            mode === "ollama"
              ? "border-luma-accent bg-luma-accent/15 text-luma-ink"
              : "border-white/10 bg-white/[0.05] text-luma-muted hover:bg-white/[0.1]"
          }`}
        >
          🧠 IA local (Ollama)
        </button>
      </div>

      {mode === "ollama" && (
        <div className="mt-2 flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <p className="text-[11px] leading-relaxed text-luma-muted">
            100% no seu computador. Requer o{" "}
            <b className="text-luma-ink">Ollama</b> rodando e um modelo baixado
            (ex.: <code>ollama run phi3:mini</code>).
          </p>
          <label className="text-[10px] text-luma-muted">Endereço</label>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://localhost:11434"
            className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-sm text-luma-ink outline-none"
          />
          <label className="text-[10px] text-luma-muted">Modelo</label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="phi3:mini"
            className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-sm text-luma-ink outline-none"
          />
          <div className="flex items-center justify-between">
            <span className={`text-[11px] ${st.cls}`}>{st.text}</span>
            <button
              type="button"
              onClick={() => void checkOllama()}
              className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] text-luma-ink transition hover:bg-white/[0.1]"
            >
              Testar conexão
            </button>
          </div>

          {/* Model Manager */}
          <div className="mt-1 border-t border-white/10 pt-2">
            <p className="mb-1 text-[11px] text-luma-muted">
              Modelos (sua RAM: ~{ramGb} GB). 💡 {best.reason}
            </p>
            <div className="flex flex-col gap-1">
              {models.map((m) => {
                const active = m.id === model;
                return (
                  <div
                    key={m.id}
                    className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
                      active
                        ? "border-luma-accent/50 bg-luma-accent/10"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] text-luma-ink">
                        {m.name}
                        {m.id === best.recommend && (
                          <span className="ml-1 text-[9px] text-emerald-300">recomendado</span>
                        )}
                      </p>
                      <p className="text-[9px] text-luma-muted">
                        {m.sizeGb} GB · precisa ~{m.ramGb} GB RAM · {m.note}
                      </p>
                    </div>
                    {!m.fitsRam ? (
                      <span className="shrink-0 text-[9px] text-orange-200">pesado p/ sua RAM</span>
                    ) : m.installed ? (
                      active ? (
                        <span className="shrink-0 text-[10px] text-luma-accent">em uso</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setModel(m.id)}
                          className="shrink-0 rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-luma-ink hover:bg-white/20"
                        >
                          usar
                        </button>
                      )
                    ) : (
                      <span
                        className="shrink-0 cursor-help text-[9px] text-luma-muted"
                        title={`No terminal: ollama pull ${m.id}`}
                      >
                        ⬇ baixar
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="mt-1 text-[9px] text-luma-muted/70">
              Para baixar um modelo: <code>ollama pull &lt;nome&gt;</code> no terminal.
            </p>
          </div>
        </div>
      )}

      {mode === "mock" && (
        <p className="mt-1.5 px-1 text-[11px] text-luma-muted">
          Respostas acolhedoras pré-definidas. Sem servidor, funciona sempre.
        </p>
      )}
    </section>
  );
}

const SYNC_MODES: { id: SyncMode; label: string; desc: string }[] = [
  { id: "local", label: "🔒 Local", desc: "100% offline. Nada sai do seu PC (padrão)." },
  { id: "hybrid", label: "🔁 Híbrido", desc: "Local é a verdade; nuvem é backup." },
  { id: "cloud", label: "☁️ Nuvem", desc: "Espelha tudo no servidor de sync." },
];

const SYNC_STATUS: Record<string, string> = {
  idle: "text-luma-muted",
  syncing: "text-amber-200",
  ok: "text-emerald-300",
  offline: "text-orange-200",
  error: "text-red-300",
};

function SyncSection() {
  const { mode, baseUrl, status, message, lastSyncAt, setMode, setBaseUrl, syncNow } =
    useSyncStore();

  return (
    <section>
      <h3 className="mb-1.5 px-1 text-xs font-semibold text-luma-ink">
        Sincronização (opcional)
      </h3>

      <div className="flex flex-col gap-1.5">
        {SYNC_MODES.map((m) => (
          <label
            key={m.id}
            className="flex cursor-pointer items-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-[12px]"
          >
            <input
              type="radio"
              name="syncmode"
              checked={mode === m.id}
              onChange={() => setMode(m.id)}
              className="mt-0.5 accent-pink-400"
            />
            <span>
              <b className="text-luma-ink">{m.label}</b>
              <span className="block text-[11px] text-luma-muted">{m.desc}</span>
            </span>
          </label>
        ))}
      </div>

      {mode !== "local" && (
        <div className="mt-2 flex flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <label className="text-[10px] text-luma-muted">Servidor de sync</label>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="http://localhost:4000"
            className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-sm text-luma-ink outline-none"
          />
          <div className="flex items-center justify-between">
            <span className={`text-[11px] ${SYNC_STATUS[status] ?? "text-luma-muted"}`}>
              {message || (lastSyncAt ? `Última: ${new Date(lastSyncAt).toLocaleString("pt-BR")}` : "—")}
            </span>
            <button
              type="button"
              onClick={() => void syncNow()}
              disabled={status === "syncing"}
              className="rounded-lg bg-gradient-to-r from-luma-accent to-luma-accent2 px-3 py-1 text-[11px] font-bold text-luma-bg0 transition hover:brightness-110 disabled:opacity-50"
            >
              Sincronizar agora
            </button>
          </div>
          <p className="text-[10px] text-luma-muted/70">
            Rode o servidor com <code>LUMA-api.bat</code>. Conversas e diário só
            sincronizam se você escolher — nunca por padrão.
          </p>
        </div>
      )}
    </section>
  );
}

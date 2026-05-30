// Aba Apoio — ponte OPCIONAL para ajuda real. Recursos por país (Help Hub),
// botões de pedir apoio (consentimento explícito) e rede de contatos.
// NUNCA compartilha conversa/diário/memórias. Veja docs/07-SAFETY-LAYER.md.
import { useMemo, useState } from "react";
import {
  getHelpProvider,
  decideAlert,
  buildAlert,
  type AlertKind,
} from "@luma/core";
import type { ContactRelation, EmergencyMode } from "@luma/shared";
import { useSupportStore } from "../stores/supportStore";

const RELATION_LABEL: Record<ContactRelation, string> = {
  family: "Família",
  friend: "Amigo(a)",
  partner: "Parceiro(a)",
  therapist: "Terapeuta",
  mentor: "Mentor(a)",
  other: "Outro",
};

const MODE_LABEL: Record<EmergencyMode, string> = {
  never: "Nunca enviar alertas",
  suggest_only: "Apenas sugerir ajuda",
  ask_first: "Perguntar antes de enviar",
  allow_selected: "Permitir p/ contatos escolhidos",
};

export function SupportPanel() {
  const { contacts, prefs, country, addContact, removeContact, setPrefs } =
    useSupportStore();
  const provider = useMemo(() => getHelpProvider(country), [country]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleAlert = (kind: AlertKind) => {
    const decision = decideAlert(kind, prefs, contacts);
    if (kind === "show_plan") {
      setFeedback(
        contacts.length
          ? "Seu plano de apoio: " + contacts.map((c) => c.name).join(", ") + "."
          : "Você ainda não cadastrou contatos de confiança.",
      );
      return;
    }
    if (decision.action === "suggest") {
      setFeedback(
        "Que tal falar com alguém de confiança ou com um dos recursos abaixo? Você não está sozinho. 💛",
      );
      return;
    }
    if (decision.action === "confirm") {
      const names = decision.contacts.map((c) => c.name).join(", ");
      const ok = window.confirm(
        `Enviar a mensagem "${buildAlert(kind, decision.contacts).message}" para: ${names}?\n\n(Nenhuma conversa ou diário é compartilhado.)`,
      );
      setFeedback(
        ok
          ? `Tudo bem. Quando quiser, fale com ${names}. 💛`
          : "Sem problemas, nada foi enviado.",
      );
    }
  };

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto pr-1">
      {/* aviso */}
      <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-[11px] leading-relaxed text-luma-muted">
        O LUMA é companhia e bem-estar — não substitui ajuda profissional. Aqui é
        uma ponte <b>opcional</b> para apoio real. Nada é enviado sem você permitir.
      </p>

      {/* botões de apoio */}
      <div className="grid grid-cols-1 gap-2">
        <button
          type="button"
          onClick={() => handleAlert("talk")}
          className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-3 py-2.5 text-sm font-bold text-luma-bg0 transition hover:brightness-110"
        >
          💬 Preciso conversar com alguém
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleAlert("help")}
            className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-luma-ink transition hover:bg-white/[0.1]"
          >
            🆘 Preciso de ajuda
          </button>
          <button
            type="button"
            onClick={() => handleAlert("show_plan")}
            className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-luma-ink transition hover:bg-white/[0.1]"
          >
            📋 Meu plano
          </button>
        </div>
      </div>

      {feedback && (
        <p className="rounded-2xl border border-luma-accent/20 bg-luma-accent/10 p-2.5 text-[12px] text-luma-ink fade-up">
          {feedback}
        </p>
      )}

      {/* recursos do país */}
      <div>
        <h3 className="mb-1.5 px-1 text-xs font-semibold text-luma-ink">
          Recursos em {provider.countryName}
        </h3>
        <div className="space-y-2">
          {provider.resources.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-luma-ink">{r.name}</p>
                {r.phone && (
                  <a
                    href={`tel:${r.phone}`}
                    className="shrink-0 rounded-lg bg-emerald-400/15 px-2 py-0.5 text-xs font-bold text-emerald-200"
                  >
                    📞 {r.phone}
                  </a>
                )}
              </div>
              <p className="mt-0.5 text-[11px] text-luma-muted">{r.description}</p>
              {r.availability && (
                <p className="text-[10px] text-luma-muted/70">🕘 {r.availability}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* rede de apoio */}
      <div>
        <div className="mb-1.5 flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold text-luma-ink">Contatos de confiança</h3>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="text-xs text-luma-accent"
          >
            {showForm ? "fechar" : "+ adicionar"}
          </button>
        </div>

        {showForm && <ContactForm onAdd={(c) => { addContact(c); setShowForm(false); }} />}

        <div className="space-y-1.5">
          {contacts.length === 0 ? (
            <p className="px-1 text-[11px] text-luma-muted">
              Opcional: pessoas em quem você confia, para ter por perto.
            </p>
          ) : (
            contacts.map((c) => (
              <div
                key={c.id}
                className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] p-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-luma-ink">{c.name}</p>
                  <p className="text-[10px] text-luma-muted">
                    {RELATION_LABEL[c.relation]}
                    {c.phone ? ` · ${c.phone}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeContact(c.id)}
                  className="opacity-0 transition group-hover:opacity-100 text-luma-muted hover:text-red-300"
                  aria-label="Remover contato"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* preferências de emergência */}
      <div>
        <h3 className="mb-1.5 px-1 text-xs font-semibold text-luma-ink">
          Quando eu pedir ajuda…
        </h3>
        <div className="space-y-1">
          {(Object.keys(MODE_LABEL) as EmergencyMode[]).map((mode) => (
            <label
              key={mode}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2 text-[12px] text-luma-ink"
            >
              <input
                type="radio"
                name="emode"
                checked={prefs.mode === mode}
                onChange={() => setPrefs({ ...prefs, mode })}
                className="accent-pink-400"
              />
              {MODE_LABEL[mode]}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactForm({
  onAdd,
}: {
  onAdd: (c: { name: string; phone?: string; relation: ContactRelation; priority: number }) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState<ContactRelation>("friend");

  return (
    <div className="mb-2 flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2.5">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nome"
        className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-sm text-luma-ink outline-none placeholder:text-luma-muted/60"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Telefone (opcional)"
        className="rounded-lg bg-white/[0.06] px-2.5 py-1.5 text-sm text-luma-ink outline-none placeholder:text-luma-muted/60"
      />
      <div className="flex gap-2">
        <select
          value={relation}
          onChange={(e) => setRelation(e.target.value as ContactRelation)}
          className="flex-1 rounded-lg bg-white/[0.06] px-2 py-1.5 text-sm text-luma-ink outline-none"
        >
          {(Object.keys(RELATION_LABEL) as ContactRelation[]).map((r) => (
            <option key={r} value={r} className="bg-luma-bg">
              {RELATION_LABEL[r]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            if (!name.trim()) return;
            onAdd({ name: name.trim(), phone: phone.trim() || undefined, relation, priority: 2 });
          }}
          className="rounded-lg bg-gradient-to-r from-luma-accent to-luma-accent2 px-3 py-1.5 text-sm font-bold text-luma-bg0"
        >
          Salvar
        </button>
      </div>
    </div>
  );
}

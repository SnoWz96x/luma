import type { Metadata } from "next";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Apoio — LUMA",
  description:
    "Recursos de apoio emocional no Brasil. O LUMA é companhia e bem-estar, não substitui ajuda profissional.",
};

const RESOURCES = [
  {
    name: "CVV — Centro de Valorização da Vida",
    phone: "188",
    url: "https://www.cvv.org.br/",
    desc: "Apoio emocional e prevenção do suicídio, sigiloso e gratuito.",
    when: "24h, todos os dias",
    accent: true,
  },
  {
    name: "CAPS — Centro de Atenção Psicossocial",
    url: "https://www.gov.br/saude/pt-br",
    desc: "Atendimento em saúde mental pública pelo SUS, perto de você.",
    when: "Horário comercial (varia por unidade)",
  },
  {
    name: "SAMU — Emergências médicas",
    phone: "192",
    desc: "Emergências de saúde com risco à vida.",
    when: "24h",
  },
  {
    name: "UPA — Unidade de Pronto Atendimento",
    desc: "Pronto-atendimento do SUS para urgências.",
    when: "24h",
  },
];

export default function Apoio() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-luma-bg to-luma-bg0 text-luma-ink">
      <SiteNav />

      <section className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-luma-accent/30 to-luma-accent2/30 text-3xl">
            💛
          </div>
          <h1 className="text-3xl font-extrabold md:text-4xl">Você não está sozinho</h1>
          <p className="mx-auto mt-3 max-w-xl text-luma-muted">
            O LUMA é companhia e bem-estar — <b className="text-luma-ink">não substitui
            ajuda profissional</b>. Se você está passando por um momento difícil,
            falar com alguém pode ajudar muito. Abaixo, recursos reais e gratuitos no Brasil.
          </p>
        </header>

        <div className="space-y-3">
          {RESOURCES.map((r) => (
            <div
              key={r.name}
              className={`rounded-4xl border p-5 ${
                r.accent
                  ? "border-luma-accent/40 bg-luma-accent/10"
                  : "border-white/10 bg-luma-card/60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-bold">{r.name}</h2>
                  <p className="mt-1 text-sm text-luma-muted">{r.desc}</p>
                  {r.when && <p className="mt-1 text-xs text-luma-muted/70">🕘 {r.when}</p>}
                  {r.url && (
                    <a href={r.url} className="mt-1 inline-block text-xs text-luma-accent underline">
                      Saber mais →
                    </a>
                  )}
                </div>
                {r.phone && (
                  <a
                    href={`tel:${r.phone}`}
                    className="shrink-0 rounded-2xl bg-emerald-400/20 px-4 py-2 text-lg font-extrabold text-emerald-200"
                  >
                    📞 {r.phone}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-4xl border border-white/10 bg-white/[0.04] p-6 text-center">
          <p className="text-sm text-luma-muted">
            Cuidar de si também é pedir ajuda. Se puder, fale com alguém de
            confiança hoje — uma mensagem já é um começo. 💗
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

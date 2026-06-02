import type { Metadata } from "next";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { Mascot } from "../../components/Mascot";

export const metadata: Metadata = {
  title: "Baixar — LUMA",
  description: "Como rodar o LUMA no seu computador. Gratuito, offline e de código aberto.",
};

const REPO = "https://github.com/SnoWz96x/luma";

const STEPS = [
  {
    n: "01",
    title: "Pré-requisitos",
    body: (
      <ul className="ml-4 list-disc space-y-1 text-sm text-luma-muted">
        <li>Node.js 18+ e pnpm 9+</li>
        <li>Rust (rustup) — para o app desktop</li>
        <li>Opcional: Ollama, para IA local de verdade</li>
      </ul>
    ),
  },
  {
    n: "02",
    title: "Clonar e instalar",
    code: "git clone https://github.com/SnoWz96x/luma\ncd luma\npnpm install",
  },
  {
    n: "03",
    title: "Rodar o app desktop",
    code: "pnpm --filter @luma/desktop tauri dev",
  },
  {
    n: "04",
    title: "IA local (opcional)",
    code: "ollama pull phi3:mini\n# no app: ⚙️ Ajustes → IA local → Testar conexão",
  },
];

export default function Download() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-luma-bg to-luma-bg0 text-luma-ink">
      <SiteNav />

      <section className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10 text-center">
          <div className="float mx-auto mb-4 w-fit">
            <Mascot size={92} />
          </div>
          <h1 className="text-3xl font-extrabold md:text-5xl">Leve o LUMA pro seu PC</h1>
          <p className="mx-auto mt-3 max-w-lg text-luma-muted">
            Gratuito, offline e de código aberto. Hoje o LUMA roda em ambiente de
            desenvolvimento — siga os passos abaixo para conhecê-lo.
          </p>
        </header>

        <div className="space-y-4">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-4xl border border-white/10 bg-luma-card/60 p-6">
              <div className="mb-3 flex items-center gap-3">
                <span className="text-xl font-extrabold text-luma-accent2">{s.n}</span>
                <h2 className="text-lg font-bold">{s.title}</h2>
              </div>
              {s.body}
              {s.code && (
                <pre className="mt-1 overflow-x-auto rounded-2xl border border-white/10 bg-luma-bg0/80 p-4 text-xs leading-relaxed text-luma-mint">
                  <code>{s.code}</code>
                </pre>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={REPO}
            className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-6 py-3 font-bold text-luma-bg0 transition hover:brightness-110"
          >
            Abrir no GitHub ★
          </a>
          <a
            href={`${REPO}/blob/main/CONTRIBUTING.md`}
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-luma-ink transition hover:bg-white/10"
          >
            Quero contribuir 💗
          </a>
        </div>

        <p className="mt-8 text-center text-xs text-luma-muted/70">
          Em breve: instaladores prontos (.msi / .exe) para baixar com um clique.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
}

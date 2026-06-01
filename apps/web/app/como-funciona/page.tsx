import type { Metadata } from "next";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { Mascot } from "../../components/Mascot";

export const metadata: Metadata = {
  title: "Como funciona — LUMA",
  description:
    "Entenda como o LUMA cresce com você: adoção, autocuidado, memória viva e o mundo espelho. Tudo offline e privado.",
};

const STEPS = [
  { n: "01", emoji: "🥚", title: "Adote e choque o ovo", text: "Escolha entre 100+ criaturas por categoria. Seu companheiro nasce de um ovo — o primeiro encontro." },
  { n: "02", emoji: "🌿", title: "Cuide de si", text: "Beba água, respire, escreva no diário, mantenha hábitos. Pequenos gestos, no seu ritmo, sem cobrança." },
  { n: "03", emoji: "🌤️", title: "O LUMA sente", text: "O mundo responde ao seu dia: luz, clima e cores mudam. Sem barras, sem números — você sente." },
  { n: "04", emoji: "🌌", title: "Vocês crescem juntos", text: "O vínculo floresce, o pet evolui pela sua vida e o mundo espelho ganha estrelas, flores e pontes." },
];

const ENGINES = [
  { emoji: "🧠", title: "Memória viva", text: "Camadas de memória (curto, longo, emocional, marcos) que lembram do que importa pra você." },
  { emoji: "💬", title: "IA 100% local", text: "Converse via Ollama no seu computador — sem nuvem, sem enviar nada para fora." },
  { emoji: "🌱", title: "Crescimento real", text: "Ciclo de vida (ovo → adulto) que ramifica conforme seu estilo: criativo, aventureiro, sereno, social." },
  { emoji: "🛡️", title: "Segurança no núcleo", text: "Uma camada de ética filtra toda conversa: sem diagnóstico, sem culpa, sempre incentivando ajuda real." },
  { emoji: "🎣", title: "Momentos cozy", text: "Minigames calmos — respiração guiada, pescaria — que recompensam o autocuidado." },
  { emoji: "🔌", title: "Extensível", text: "Plugin Engine aceita novos personagens, sprites e biomas. A comunidade pode criar." },
];

export default function ComoFunciona() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-luma-bg to-luma-bg0 text-luma-ink">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-12 text-center">
          <div className="float mx-auto mb-4 w-fit">
            <Mascot size={96} />
          </div>
          <h1 className="text-3xl font-extrabold md:text-5xl">Como o LUMA funciona</h1>
          <p className="mx-auto mt-3 max-w-xl text-luma-muted">
            Não é um app de produtividade que cobra metas. É um companheiro que
            cresce junto, no seu tempo.
          </p>
        </header>

        {/* passos */}
        <div className="relative grid gap-4 md:grid-cols-2">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-4xl border border-white/10 bg-luma-card/60 p-6 shadow-soft transition hover:-translate-y-1 hover:border-luma-accent/30"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{s.emoji}</span>
                <span className="text-2xl font-extrabold text-luma-accent2">{s.n}</span>
              </div>
              <h2 className="mt-3 text-lg font-bold">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-luma-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* engines */}
      <section className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">O que move o LUMA</h2>
          <p className="mt-2 text-luma-muted">Engines pensadas para acolher, não para prender.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENGINES.map((e) => (
            <div key={e.title} className="rounded-4xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-2 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-luma-accent/30 to-luma-accent2/30 text-xl">
                {e.emoji}
              </div>
              <h3 className="font-bold">{e.title}</h3>
              <p className="mt-1 text-sm text-luma-muted">{e.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-20 pt-6 text-center">
        <div className="rounded-4xl border border-white/10 bg-gradient-to-br from-luma-accent/15 to-luma-accent2/15 p-10 shadow-glow">
          <h2 className="text-2xl font-extrabold md:text-3xl">Comece quando quiser</h2>
          <p className="mx-auto mt-3 max-w-md text-luma-muted">
            Gratuito, de código aberto e offline. Seu companheiro está esperando.
          </p>
          <a
            href="https://github.com/SnoWz96x/luma"
            className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-7 py-3 font-bold text-luma-bg0 transition hover:brightness-110"
          >
            Ver no GitHub ★
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

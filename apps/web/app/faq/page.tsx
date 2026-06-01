import type { Metadata } from "next";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Perguntas frequentes — LUMA",
  description: "Dúvidas comuns sobre o LUMA: privacidade, IA local, custo e bem-estar.",
};

const FAQ = [
  {
    q: "O LUMA é terapia?",
    a: "Não. O LUMA é companhia e bem-estar — ele não faz diagnóstico, não dá tratamento e não substitui um profissional de saúde, psicólogo ou amigo. Ele sempre incentiva a conexão humana real e, em momentos difíceis, oferece recursos de apoio como o CVV (188).",
  },
  {
    q: "Meus dados ficam seguros?",
    a: "Sim. O LUMA é offline-first: tudo fica no seu computador, em um banco local. Nada é enviado para a nuvem por padrão. Você pode exportar ou apagar todos os seus dados a qualquer momento, com um clique.",
  },
  {
    q: "Preciso de internet?",
    a: "Não para o essencial. O app funciona 100% offline. A IA também roda localmente (via Ollama) — opcional. Internet só é necessária se você quiser baixar um modelo de IA ou, no futuro, sincronizar com a web.",
  },
  {
    q: "O LUMA é gratuito?",
    a: "Sim, é gratuito e de código aberto sob licença MIT. Você pode usar, estudar e contribuir. Não há compras que pressionam nem 'pay-to-win' — a loja interna é só cosmética, com uma moeda gentil ganha cuidando de si.",
  },
  {
    q: "Como a IA conversa comigo?",
    a: "Por padrão, com respostas acolhedoras pré-definidas (modo simples, sempre funciona). Se você instalar o Ollama e um modelo local (ex.: Phi-3 Mini), o pet conversa de verdade — 100% no seu computador, com memória do que importa pra você.",
  },
  {
    q: "Ele vai me cobrar se eu sumir uns dias?",
    a: "Nunca. O LUMA não usa culpa nem manipulação. Se você ficar um tempo fora, ele sente sua falta com carinho ('que bom te ver de novo'), jamais com cobrança. Streaks têm proteção gentil e nada pune a ausência.",
  },
  {
    q: "Posso criar meu próprio personagem?",
    a: "Sim! O Plugin Engine aceita packs de personagens e até sprites com arte rica. Veja o guia de contribuição no GitHub — é uma das melhores formas de ajudar o projeto.",
  },
  {
    q: "Em quais sistemas roda?",
    a: "Hoje no Desktop (Windows, com Tauri). A arquitetura foi pensada para reusar o mesmo núcleo na Web e, futuramente, no Mobile.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-luma-bg to-luma-bg0 text-luma-ink">
      <SiteNav />

      <section className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold md:text-5xl">Perguntas frequentes</h1>
          <p className="mt-2 text-luma-muted">O que costumam perguntar sobre o LUMA. 💬</p>
        </header>

        <div className="space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-4xl border border-white/10 bg-luma-card/60 p-5 transition open:border-luma-accent/30"
            >
              <summary className="cursor-pointer list-none font-bold marker:hidden">
                <span className="mr-2 text-luma-accent transition group-open:rotate-90 inline-block">▸</span>
                {item.q}
              </summary>
              <p className="mt-3 pl-5 text-sm leading-relaxed text-luma-muted">{item.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 rounded-4xl border border-white/10 bg-white/[0.04] p-6 text-center">
          <p className="text-sm text-luma-muted">
            Ficou com outra dúvida? Abra uma issue no{" "}
            <a href="https://github.com/SnoWz96x/luma/issues" className="text-luma-accent underline">
              GitHub
            </a>{" "}
            — a gente adora conversar. 🌙
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

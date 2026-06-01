import { Mascot } from "../components/Mascot";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";

const REPO = "https://github.com/SnoWz96x/luma";

const FEATURES = [
  { emoji: "🥚", title: "Nasce e cresce", text: "Adote um ovo. Ele eclode e cresce — de bebê a adulto — conforme você cuida de si." },
  { emoji: "🧠", title: "Lembra de você", text: "Memória viva e IA 100% local: ele conhece seu jeito, seu dia, sua história." },
  { emoji: "🌌", title: "Mundo espelho", text: "Sua jornada vira paisagem: flores nos dias bons, estrelas nas memórias." },
  { emoji: "🌿", title: "Autocuidado gentil", text: "Hábitos, respiração e diário — sem cobrança, sem culpa, no seu ritmo." },
  { emoji: "💛", title: "Ponte para ajuda real", text: "Rede de apoio opcional e recursos como o CVV — você nunca está sozinho." },
  { emoji: "🔒", title: "Privacidade radical", text: "Tudo fica no seu computador. Seus dados são seus: exportáveis e apagáveis." },
];

const PETS = [
  { emoji: "⭐", name: "Luma", kind: "estrela" },
  { emoji: "🐲", name: "Brasa", kind: "dragão" },
  { emoji: "👽", name: "Orbit", kind: "alienígena" },
  { emoji: "🍄", name: "Tampi", kind: "cogumelo" },
  { emoji: "🤖", name: "Bibo", kind: "robô" },
  { emoji: "👾", name: "Zuzu", kind: "monstrinho" },
];

const CARE = [
  { n: "01", title: "Você se cuida", text: "Um copo d'água, uma respiração, uma linha no diário." },
  { n: "02", title: "O LUMA sente", text: "O humor do mundo muda — luz, clima, cores. Sem barras, só sentir." },
  { n: "03", title: "Vocês crescem", text: "O vínculo floresce, o pet evolui e o mundo ganha vida com você." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-luma-bg to-luma-bg0 text-luma-ink">
      <SiteNav />

      {/* ====== HERO ====== */}
      <section className="relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 pb-16 pt-10 text-center md:pt-16">
        {/* estrelinhas decorativas */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className="absolute block rounded-full bg-white"
              style={{
                left: `${(i * 53) % 100}%`,
                top: `${(i * 29) % 80}%`,
                width: i % 5 === 0 ? 3 : 2,
                height: i % 5 === 0 ? 3 : 2,
                opacity: 0.25 + ((i * 7) % 5) / 10,
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="aura absolute -inset-10 rounded-full" />
          <div className="float relative">
            <Mascot size={170} />
          </div>
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">
          Um{" "}
          <span className="bg-gradient-to-r from-luma-accent to-luma-accent2 bg-clip-text text-transparent">
            ser vivo digital
          </span>{" "}
          que mora no seu computador e cresce com você.
        </h1>
        <p className="max-w-xl text-lg text-luma-muted">
          Companhia, bem-estar e autocuidado — com um companheiro que lembra de
          você, sente o seu dia e constrói um mundinho ao seu lado.{" "}
          <b className="text-luma-ink">100% offline. 100% seu.</b>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={REPO}
            className="rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-6 py-3 text-base font-bold text-luma-bg0 shadow-glow transition hover:brightness-110"
          >
            Conhecer o LUMA 💗
          </a>
          <a
            href="#features"
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-base text-luma-ink transition hover:bg-white/10"
          >
            Ver como funciona
          </a>
        </div>

        <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs text-luma-muted">
          {["offline-first", "IA local", "sem culpa", "privado", "código aberto"].map((t) => (
            <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">Feito para fazer companhia</h2>
          <p className="mt-2 text-luma-muted">Pequenos cuidados, grandes vínculos — no seu tempo.</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-4xl border border-white/10 bg-luma-card/60 p-6 shadow-soft transition hover:-translate-y-1 hover:border-luma-accent/30"
            >
              <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-luma-accent/30 to-luma-accent2/30 text-2xl">
                {f.emoji}
              </div>
              <h3 className="mb-1 text-lg font-bold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-luma-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== COMO CUIDA ====== */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">Como o LUMA cuida de você</h2>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {CARE.map((c) => (
            <div key={c.n} className="rounded-4xl border border-white/10 bg-white/[0.04] p-6">
              <span className="text-3xl font-extrabold text-luma-accent2">{c.n}</span>
              <h3 className="mt-2 text-lg font-bold">{c.title}</h3>
              <p className="mt-1 text-sm text-luma-muted">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== PETS ====== */}
      <section id="pets" className="mx-auto max-w-6xl px-6 py-16">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">100 companheiros esperando</h2>
          <p className="mt-2 text-luma-muted">
            Animais, dragões, robôs, alienígenas, cogumelos, monstrinhos e muito mais.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PETS.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center rounded-4xl border border-white/10 bg-luma-card/60 p-5 transition hover:-translate-y-1"
            >
              <div className="float text-5xl">{p.emoji}</div>
              <p className="mt-3 font-bold">{p.name}</p>
              <p className="text-xs text-luma-muted">{p.kind}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-gradient-to-br from-luma-accent/15 to-luma-accent2/15 p-10 shadow-glow">
          <div className="aura absolute -inset-10" />
          <div className="relative">
            <div className="float mx-auto mb-4 w-fit">
              <Mascot size={88} />
            </div>
            <h2 className="text-3xl font-extrabold md:text-4xl">Pronto para conhecer alguém especial?</h2>
            <p className="mx-auto mt-3 max-w-lg text-luma-muted">
              O LUMA é gratuito e de código aberto. Adote seu companheiro e comece
              a cultivar o seu mundinho hoje.
            </p>
            <a
              href={REPO}
              className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-luma-accent to-luma-accent2 px-7 py-3 text-base font-bold text-luma-bg0 transition hover:brightness-110"
            >
              Começar no GitHub ★
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

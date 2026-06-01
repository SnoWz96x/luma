import Link from "next/link";

const REPO = "https://github.com/SnoWz96x/luma";

export function SiteNav() {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <Link href="/" className="text-xl font-extrabold tracking-wide">
        🌙 LUMA
      </Link>
      <div className="flex items-center gap-5 text-sm text-luma-muted">
        <Link href="/como-funciona" className="hidden hover:text-luma-ink sm:inline">
          Como funciona
        </Link>
        <Link href="/personagens" className="hidden hover:text-luma-ink sm:inline">
          Personagens
        </Link>
        <Link href="/faq" className="hidden hover:text-luma-ink sm:inline">
          FAQ
        </Link>
        <Link href="/apoio" className="hidden hover:text-luma-ink sm:inline">
          Apoio
        </Link>
        <a
          href={REPO}
          className="rounded-full bg-gradient-to-r from-luma-accent to-luma-accent2 px-4 py-2 font-bold text-luma-bg0 transition hover:brightness-110"
        >
          ★ GitHub
        </a>
      </div>
    </nav>
  );
}

// CreaturePet — mascote chibi por categoria, em SVG, com cor única por seed.
// Versão web-nativa (React) do conceito do renderizador do app: corpo inteiro,
// traços característicos por espécie e cor derivada do nome.

export type Category =
  | "star" | "animal" | "dragon" | "alien" | "robot" | "monster"
  | "plant" | "mushroom" | "slime" | "cloud" | "ghost" | "magical";

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const HSL: Record<Category, { h: number; s: number; l: number; range: number }> = {
  star: { h: 45, s: 100, l: 68, range: 25 },
  animal: { h: 28, s: 80, l: 72, range: 50 },
  dragon: { h: 8, s: 80, l: 70, range: 180 },
  alien: { h: 122, s: 60, l: 70, range: 80 },
  robot: { h: 222, s: 15, l: 72, range: 200 },
  monster: { h: 210, s: 60, l: 68, range: 200 },
  plant: { h: 96, s: 55, l: 60, range: 40 },
  mushroom: { h: 0, s: 70, l: 78, range: 30 },
  slime: { h: 152, s: 60, l: 60, range: 60 },
  cloud: { h: 222, s: 55, l: 85, range: 30 },
  ghost: { h: 260, s: 50, l: 86, range: 40 },
  magical: { h: 285, s: 65, l: 75, range: 60 },
};

function colors(cat: Category, seed: string): [string, string, string] {
  const base = HSL[cat];
  const r = hash(seed);
  const shift = (r % (base.range + 1)) - base.range / 2;
  const h = base.h + shift;
  const s = Math.max(12, Math.min(100, base.s + ((r >> 8) % 16) - 8));
  const L = (x: number) => `hsl(${((h % 360) + 360) % 360} ${s}% ${x}%)`;
  return [L(base.l + 8), L(base.l - 10), L(base.l - 30)];
}

const BLOB = new Set<Category>(["slime", "cloud", "ghost", "star"]);

function features(cat: Category, c1: string, stroke: string) {
  const sw = { stroke, strokeWidth: 2.6, strokeLinejoin: "round" as const };
  switch (cat) {
    case "animal":
      return (
        <>
          <path d="M34 42 Q30 16 48 30 Z" fill={c1} {...sw} />
          <path d="M86 42 Q90 16 72 30 Z" fill={c1} {...sw} />
        </>
      );
    case "dragon":
      return (
        <>
          <path d="M34 40 L24 22 L42 34 Z" fill={c1} {...sw} />
          <path d="M86 40 L96 22 L78 34 Z" fill={c1} {...sw} />
          <path d="M30 70 Q4 58 10 86 Q22 78 34 84 Z" fill={c1} {...sw} />
          <path d="M90 70 Q116 58 110 86 Q98 78 86 84 Z" fill={c1} {...sw} />
        </>
      );
    case "monster":
      return (
        <>
          <path d="M36 38 L30 20 L48 32 Z" fill={c1} {...sw} />
          <path d="M84 38 L90 20 L72 32 Z" fill={c1} {...sw} />
        </>
      );
    case "alien":
      return (
        <>
          <line x1="48" y1="30" x2="42" y2="14" stroke={stroke} strokeWidth={2.5} />
          <circle cx="41" cy="12" r="4" fill={c1} {...sw} />
          <line x1="72" y1="30" x2="78" y2="14" stroke={stroke} strokeWidth={2.5} />
          <circle cx="79" cy="12" r="4" fill={c1} {...sw} />
        </>
      );
    case "robot":
      return (
        <>
          <line x1="60" y1="34" x2="60" y2="20" stroke={stroke} strokeWidth={2.5} />
          <circle cx="60" cy="17" r="4" fill={c1} {...sw} />
        </>
      );
    case "plant":
      return (
        <>
          <path d="M60 34 Q60 14 74 12 Q72 28 60 32 Z" fill="#7cc46a" {...sw} />
          <path d="M60 34 Q60 18 48 14 Q50 28 60 32 Z" fill="#8fd676" {...sw} />
        </>
      );
    case "mushroom":
      return <path d="M22 48 Q22 20 60 20 Q98 20 98 48 Q60 60 22 48 Z" fill={c1} {...sw} />;
    default:
      return null;
  }
}

export function CreaturePet({
  category,
  seed,
  size = 96,
}: {
  category: Category;
  seed: string;
  size?: number;
}) {
  const [c0, c1, stroke] = colors(category, seed);
  const gid = `g-${category}-${hash(seed)}`;
  const blob = BLOB.has(category);

  const eyes = (
    <>
      <circle cx="49" cy="58" r="6.5" fill="#3a2d12" />
      <circle cx="71" cy="58" r="6.5" fill="#3a2d12" />
      <circle cx="51" cy="56" r="2" fill="#fff" />
      <circle cx="73" cy="56" r="2" fill="#fff" />
      <path d="M55 68 Q60 73 65 68" stroke="#3a2d12" strokeWidth={2.4} fill="none" strokeLinecap="round" />
    </>
  );

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={category}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor={c0} />
          <stop offset="100%" stopColor={c1} />
        </radialGradient>
      </defs>

      {blob ? (
        category === "star" ? (
          <path
            d="M60 14 L74 46 L108 50 L82 73 L90 107 L60 88 L30 107 L38 73 L12 50 L46 46 Z"
            fill={`url(#${gid})`} stroke={stroke} strokeWidth={3} strokeLinejoin="round"
          />
        ) : (
          <path
            d="M22 86 Q18 44 60 40 Q102 44 98 86 Q98 100 60 100 Q22 100 22 86 Z"
            fill={`url(#${gid})`} stroke={stroke} strokeWidth={3} strokeLinejoin="round"
          />
        )
      ) : (
        <>
          {features(category, c1, stroke)}
          {/* pernas + braços + tronco (chibi) */}
          <ellipse cx="50" cy="115" rx="7.5" ry="6" fill={c1} stroke={stroke} strokeWidth={2.6} />
          <ellipse cx="70" cy="115" rx="7.5" ry="6" fill={c1} stroke={stroke} strokeWidth={2.6} />
          <ellipse cx="33" cy="92" rx="6" ry="11" fill={c1} stroke={stroke} strokeWidth={2.6} transform="rotate(14 33 92)" />
          <ellipse cx="87" cy="92" rx="6" ry="11" fill={c1} stroke={stroke} strokeWidth={2.6} transform="rotate(-14 87 92)" />
          <ellipse cx="60" cy="94" rx="20" ry="22" fill={`url(#${gid})`} stroke={stroke} strokeWidth={2.6} />
          {/* cabeça */}
          {category === "alien" ? (
            <ellipse cx="60" cy="50" rx="36" ry="33" fill={`url(#${gid})`} stroke={stroke} strokeWidth={3} />
          ) : (
            <circle cx="60" cy="50" r="34" fill={`url(#${gid})`} stroke={stroke} strokeWidth={3} />
          )}
        </>
      )}

      <circle cx="42" cy="66" r="4.5" fill="#ff9aa2" opacity={0.5} />
      <circle cx="78" cy="66" r="4.5" fill="#ff9aa2" opacity={0.5} />
      {eyes}
    </svg>
  );
}

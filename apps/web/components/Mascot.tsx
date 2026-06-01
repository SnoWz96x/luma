// Mascote da Luma (estrelinha kawaii) em SVG — mesmo DNA visual do app.
export function Mascot({ size = 160 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Luma">
      <defs>
        <radialGradient id="petw" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="100%" stopColor="#ffcf5c" />
        </radialGradient>
      </defs>
      <path
        d="M60 14 L74 46 L108 50 L82 73 L90 107 L60 88 L30 107 L38 73 L12 50 L46 46 Z"
        fill="url(#petw)"
        stroke="#e7a92e"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="49" cy="58" r="6.5" fill="#3a2d12" />
      <circle cx="71" cy="58" r="6.5" fill="#3a2d12" />
      <circle cx="51" cy="56" r="2" fill="#fff" />
      <circle cx="73" cy="56" r="2" fill="#fff" />
      <circle cx="42" cy="68" r="5" fill="#ff9aa2" opacity=".6" />
      <circle cx="78" cy="68" r="5" fill="#ff9aa2" opacity=".6" />
      <path d="M55 68 Q60 73 65 68" stroke="#3a2d12" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

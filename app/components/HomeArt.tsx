import { HERO } from "../content/home-copy";

/**
 * The home hero drawing: a flyer with a code that stays as printed, a counter that rises (your analytics),
 * and an arrow that points the same code at a new page (your web address). The code itself never counts or changes.
 * Motion is CSS only and runs under no-preference; the final frame is the static one.
 */
export function HomeArt() {
  return (
    <svg className="hero-art home-art" data-balance-partner="1280" viewBox="0 0 480 320" role="img" aria-label={HERO.alt}>
      <g>
        <rect x="14" y="24" width="150" height="212" rx="12" fill="#ffffff" />
        <rect x="30" y="40" width="118" height="10" rx="3" fill="#1c1f26" />
        <rect x="30" y="58" width="80" height="8" rx="3" fill="#9aa3b0" />
        <g transform="translate(40 84)">
          {[
            [0, 0],
            [56, 0],
            [0, 56],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width="32" height="32" rx="4" fill="#1c1f26" />
              <rect x={x + 7} y={y + 7} width="18" height="18" rx="2" fill="#ffffff" />
              <rect x={x + 12} y={y + 12} width="8" height="8" fill="#1c1f26" />
            </g>
          ))}
          <rect x="40" y="6" width="6" height="6" fill="#1c1f26" />
          <rect x="40" y="40" width="6" height="6" fill="#1c1f26" />
          <rect x="52" y="48" width="6" height="6" fill="#1c1f26" />
          <rect x="66" y="40" width="6" height="6" fill="#1c1f26" />
          <rect x="62" y="62" width="22" height="22" rx="5" fill="#f2994a" />
        </g>
        <text x="89" y="262" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="600" fontFamily="Inter Variable, system-ui, sans-serif">
          {HERO.artCode[0]}
        </text>
        <text x="89" y="282" textAnchor="middle" fill="#e6e8ec" fontSize="16" fontFamily="Inter Variable, system-ui, sans-serif">
          {HERO.artCode[1]}
        </text>
      </g>

      <g className="art-count">
        <rect x="200" y="24" width="266" height="116" rx="12" fill="#262b35" stroke="#2ecdf5" strokeWidth="2" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} className={`bar bar-${i}`} x={222 + i * 34} y={112 - (i + 1) * 14} width="22" height={(i + 1) * 14} rx="3" fill="#2ecdf5" />
        ))}
      </g>
      <text x="333" y="162" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="600" fontFamily="Inter Variable, system-ui, sans-serif">
        {HERO.artCount}
      </text>

      <g className="art-arrow">
        <rect x="200" y="196" width="266" height="52" rx="12" fill="#262b35" stroke="#f2994a" strokeWidth="2" />
        <path d="M222 222h196m0 0-14-12m14 12-14 12" fill="none" stroke="#f2994a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x="333" y="278" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="600" fontFamily="Inter Variable, system-ui, sans-serif">
        {HERO.artAddress}
      </text>
    </svg>
  );
}

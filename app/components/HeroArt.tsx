import type { ArtKind } from "../lib/pages";

const ROWS: Record<ArtKind, [string, string, string]> = {
  count: ["Flyer", "Business card", "Window card"],
  expire: ["Printed once", "Still opens", "Years later"],
  compare: ["Holds the address", "Holds a short address", "Your own forward"],
  change: ["Printed code", "Your short address", "Any page you pick"],
};

/** A fixed pattern for the square, so every build draws the same picture. */
const CELLS: [number, number][] = [
  [3, 0], [5, 0], [6, 1], [3, 2], [4, 2], [0, 3], [2, 3], [5, 3], [6, 3], [1, 4], [3, 4], [4, 4], [6, 5], [3, 6], [5, 6], [2, 5],
];

/** The hero picture: a printed square on the left, three labeled steps on the right. The words are also in the page text. */
export function HeroArt({ kind }: { kind: ArtKind }) {
  const rows = ROWS[kind];
  return (
    <svg className="hero-art" data-balance-partner="1280" viewBox="0 0 480 300" aria-hidden="true" focusable="false">
      <g transform="translate(14 70)">
        <rect width="160" height="160" rx="16" fill="#ffffff" />
        {[
          [14, 14],
          [100, 14],
          [14, 100],
        ].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <rect x={x} y={y} width="46" height="46" rx="6" fill="#1c1f26" />
            <rect x={x + 10} y={y + 10} width="26" height="26" rx="3" fill="#ffffff" />
            <rect x={x + 17} y={y + 17} width="12" height="12" fill="#1c1f26" />
          </g>
        ))}
        {CELLS.map(([cx, cy]) => (
          <rect key={`${cx}-${cy}`} x={72 + cx * 8} y={72 + cy * 8} width="7" height="7" rx="1.5" fill="#1c1f26" />
        ))}
        <rect x="106" y="106" width="40" height="40" rx="8" fill="#f2994a" />
      </g>
      {rows.map((label, i) => (
        <g key={label} className={`art-row art-row-${i}`} transform={`translate(230 ${34 + i * 80})`}>
          <rect width="236" height="56" rx="12" fill="#262b35" stroke="#2ecdf5" strokeWidth="2" />
          <text x="118" y="35" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="600" fontFamily="Inter Variable, system-ui, sans-serif">
            {label}
          </text>
        </g>
      ))}
    </svg>
  );
}

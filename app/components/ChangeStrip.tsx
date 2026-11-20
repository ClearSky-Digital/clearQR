const FONT = "Inter Variable, system-ui, sans-serif";

function Mini({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="56" height="56" rx="8" fill="#ffffff" stroke="#1c1f26" strokeWidth="2" />
      <rect x="8" y="8" width="14" height="14" rx="2" fill="#1c1f26" />
      <rect x="34" y="8" width="14" height="14" rx="2" fill="#1c1f26" />
      <rect x="8" y="34" width="14" height="14" rx="2" fill="#1c1f26" />
      <rect x="30" y="30" width="6" height="6" fill="#1c1f26" />
      <rect x="40" y="38" width="8" height="8" rx="2" fill="#e07b12" />
    </g>
  );
}

function Line({ y, from, to, label }: { y: number; from: string; to: string; label: string }) {
  return (
    <g>
      <text x="16" y={y} fill="#1c1f26" fontSize="15" fontWeight="600" fontFamily={FONT}>
        {label}
      </text>
      <Mini x={16} y={y + 12} />
      <path d={`M76 ${y + 40} h14 m-6 -6 l6 6 l-6 6`} stroke="#1879a3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(96 ${y + 12})`}>
        <rect width="160" height="56" rx="10" fill="#eaf6fc" stroke="#1879a3" strokeWidth="2" />
        <text x="80" y="33" textAnchor="middle" fill="#1c1f26" fontSize="15" fontWeight="600" fontFamily={FONT}>
          {from}
        </text>
      </g>
      <path d={`M262 ${y + 40} h14 m-6 -6 l6 6 l-6 6`} stroke="#1879a3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g transform={`translate(284 ${y + 12})`}>
        <rect width="180" height="56" rx="10" fill="#eaf6fc" stroke="#e07b12" strokeWidth="2" />
        <text x="90" y="33" textAnchor="middle" fill="#1c1f26" fontSize="15" fontWeight="600" fontFamily={FONT}>
          {to}
        </text>
      </g>
    </g>
  );
}

/** Before and after: the same square and the same short address, with the forward changed. The words are also in the list beside it. */
export function ChangeStrip() {
  return (
    <svg
      className="svd-art"
      viewBox="0 0 480 220"
      role="img"
      aria-label="Before: the short address truck.example/menu forwards to the old specials page. After: the same short address and the same square forward to the new specials page."
      focusable="false"
    >
      <Line y={28} label="Before" from="truck.example/menu" to="Old specials page" />
      <Line y={128} label="After" from="truck.example/menu" to="New specials page" />
    </svg>
  );
}

const FONT = "Inter Variable, system-ui, sans-serif";

function Box({ x, y, lines, accent }: { x: number; y: number; lines: [string, string?]; accent?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="100" height="56" rx="10" fill="#eaf6fc" stroke={accent ? "#e07b12" : "#1879a3"} strokeWidth="2" />
      <text textAnchor="middle" fill="#1c1f26" fontSize="15" fontWeight="600" fontFamily={FONT}>
        <tspan x="50" y={lines[1] ? 24 : 33}>
          {lines[0]}
        </tspan>
        {lines[1] && (
          <tspan x="50" y="43">
            {lines[1]}
          </tspan>
        )}
      </text>
    </g>
  );
}

function Arrow({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y} h14 m-6 -6 l6 6 l-6 6`} stroke="#1879a3" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />;
}

/** The same square opened up, two rows. The words are also in the list beside it, as real text. */
export function SvdDiagram() {
  return (
    <svg className="svd-art" viewBox="0 0 480 300" role="img" aria-label="Two rows. First: a printed square, then the page address, then your page; you own the address. Second: a printed square, then a short address, then a forward, then your page; the forward belongs to you or to the service." focusable="false">
      <text x="16" y="30" fill="#1c1f26" fontSize="15" fontWeight="600" fontFamily={FONT}>
        A code that holds its own address
      </text>
      <Box x={16} y={42} lines={["Printed", "square"]} />
      <Arrow x={122} y={70} />
      <Box x={140} y={42} lines={["Page", "address"]} />
      <Arrow x={246} y={70} />
      <Box x={264} y={42} lines={["Your", "page"]} />
      <text x="386" y="75" fill="#1c1f26" fontSize="15" fontFamily={FONT}>
        Owner: you
      </text>
      <text x="16" y="136" fill="#1c1f26" fontSize="15" fontWeight="600" fontFamily={FONT}>
        A code that holds a short address
      </text>
      <Box x={16} y={162} lines={["Printed", "square"]} />
      <Arrow x={118} y={190} />
      <Box x={134} y={162} lines={["Short", "address"]} />
      <Arrow x={238} y={190} />
      <Box x={254} y={162} lines={["Forward"]} accent />
      <Arrow x={358} y={190} />
      <Box x={374} y={162} lines={["Your", "page"]} />
      <text x="16" y="266" fill="#1c1f26" fontSize="15" fontFamily={FONT}>
        Forward owner: you, or the service
      </text>
    </svg>
  );
}

import { COMPARISON, GUIDE, PATHS, PITCH, TIP } from "../lib/copy";
import { setupLink, tipLink } from "../lib/site";

export const GUIDE_ID = "guide";

/** Opens the guide when a jump link points at it, then lets the browser scroll there. */
export function openGuide(doc: { getElementById(id: string): unknown } = document): void {
  const el = doc.getElementById(GUIDE_ID) as { open: boolean } | null;
  if (el) el.open = true;
}

export function Pitch({ setup = setupLink() }: { setup?: string }) {
  return (
    <section className="card pitch" aria-labelledby="h-pitch">
      <h2 id="h-pitch">{PITCH.headline}</h2>
      <p>{PITCH.text}</p>
      <p className="pitch-links">
        <a className="btn primary" href="#h-guide" onClick={() => openGuide()}>
          {PITCH.how}
        </a>
        <a className="btn" href={setup} target="_blank" rel="noopener noreferrer">
          {PITCH.help}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </section>
  );
}

export function TipCard({ href = tipLink() }: { href?: string | null }) {
  if (!href) return null;
  return (
    <section className="card tip" aria-labelledby="h-tip">
      <h2 id="h-tip">{TIP.title}</h2>
      <p>{TIP.text}</p>
      <a className="btn primary" href={href} target="_blank" rel="noopener noreferrer">
        {TIP.button}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </section>
  );
}

export function Guide({ setup = setupLink() }: { setup?: string }) {
  return (
    <section className="card guide" aria-labelledby="h-guide">
      <details id={GUIDE_ID}>
        <summary>
          <h2 id="h-guide">{GUIDE.title}</h2>
          <span className="guide-hint">Campaign tags, Google Analytics, and codes you can change later</span>
        </summary>
        <p>{GUIDE.intro}</p>
        <h3>{GUIDE.tagsTitle}</h3>
        <ul>
          {GUIDE.tags.map(([name, text]) => (
            <li key={name}>
              <strong>{name}</strong> is {text}
            </li>
          ))}
        </ul>
        <h3>{GUIDE.analyticsTitle}</h3>
        {GUIDE.analytics.map((t) => (
          <p key={t}>{t}</p>
        ))}
        <h3>{GUIDE.limitsTitle}</h3>
        <p>{GUIDE.limits}</p>
        <h3>{GUIDE.changeableTitle}</h3>
        {GUIDE.changeable.map((t) => (
          <p key={t}>{t}</p>
        ))}
        <p>
          <a href={setup} target="_blank" rel="noopener noreferrer">
            {GUIDE.changeableCta}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
        {COMPARISON && (
          <>
            <h3>{COMPARISON.title}</h3>
            <p>{COMPARISON.text}</p>
          </>
        )}
      </details>
      <div className="paths" aria-labelledby="h-paths">
        <h3 id="h-paths">{PATHS.title}</h3>
        <div className="paths-grid">
          <div>
            <h4>{PATHS.freeTitle}</h4>
            <p>{PATHS.free}</p>
          </div>
          <div>
            <h4>{PATHS.helpTitle}</h4>
            <p>{PATHS.help}</p>
            <a className="btn" href={setup} target="_blank" rel="noopener noreferrer">
              {PATHS.helpLink}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
        <p className="partner">{PATHS.partnership}</p>
      </div>
    </section>
  );
}

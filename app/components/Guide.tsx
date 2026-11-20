import { CALLOUT, COMPARISON, GUIDE, PATHS, PITCH, TIP } from "../lib/copy";
import { GUIDE_PAGES, guideLink, setupLink, tipLink } from "../lib/site";

export const GUIDE_ID = "guide";

/** Opens the guide when a jump link points at it, then lets the browser scroll there. */
export function openGuide(doc: { getElementById(id: string): unknown } = document): void {
  const el = doc.getElementById(GUIDE_ID) as { open: boolean } | null;
  if (el) el.open = true;
}

/** The two buttons that sit in the hero, in its empty right side on wide screens and under the text on a phone. */
export function HeroActions({ setup = setupLink() }: { setup?: string }) {
  return (
    <p className="hero-actions">
      <a className="btn primary" href="#h-guide" onClick={() => openGuide()}>
        {PITCH.how}
      </a>
      <a className="btn" href={setup} target="_blank" rel="noopener noreferrer">
        {PITCH.help}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </p>
  );
}

export function Pitch() {
  return (
    <section className="card pitch" aria-labelledby="h-pitch">
      <h2 id="h-pitch">{PITCH.headline}</h2>
      <p>{PITCH.text}</p>
    </section>
  );
}

export function TipCard({ href = tipLink() }: { href?: string | null }) {
  if (!href) return null;
  return (
    <section className="card tip" aria-labelledby="h-tip">
      <div className="tip-text">
        <h2 id="h-tip">{TIP.title}</h2>
        <p>{TIP.text}</p>
      </div>
      <a className="btn primary" href={href} target="_blank" rel="noopener noreferrer">
        {TIP.button}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </section>
  );
}

/** The "Full step-by-step guide" link. It shows only when the guide site's address is set at build time. */
function FullGuide({ href, about }: { href: string | null; about: string }) {
  if (!href) return null;
  return (
    <p className="full-guide">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {GUIDE.fullGuide}
        <span className="sr-only">
          {" "}
          {about} (opens in a new tab)
        </span>
      </a>
    </p>
  );
}

function Steps({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <ol className="steps" role="list">
      {items.map(([title, text], i) => (
        <li key={title}>
          <span className="step-n" aria-hidden="true">
            {i + 1}
          </span>
          <h4>{title}</h4>
          <p>{text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Two small links with icons, shown next to the campaign tag fields. */
export function TagsCallout({ setup = setupLink() }: { setup?: string }) {
  return (
    <ul className="callout" role="list" aria-label="Two ways to set up campaign tags">
      <li>
        <a href="#h-guide" onClick={() => openGuide()}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5zM20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <span>
            <strong>{CALLOUT.diy}:</strong> {CALLOUT.diyNote}
          </span>
        </a>
      </li>
      <li>
        <a href={setup} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
            <path d="M14.7 6.3a4 4 0 0 0-5.4 5.1L4 16.7V20h3.3l5.3-5.3a4 4 0 0 0 5.1-5.4l-2.6 2.6-2.4-.6-.6-2.4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          <span>
            <strong>{CALLOUT.help}:</strong> {CALLOUT.helpNote}
            <span className="sr-only"> (opens in a new tab)</span>
          </span>
        </a>
      </li>
    </ul>
  );
}

export function Guide({
  setup = setupLink(),
  countHref = guideLink(GUIDE_PAGES.count),
  changeHref = guideLink(GUIDE_PAGES.change),
}: {
  setup?: string;
  countHref?: string | null;
  changeHref?: string | null;
}) {
  return (
    <section className="card guide" aria-labelledby="h-guide">
      <details id={GUIDE_ID}>
        <summary>
          <h2 id="h-guide">{GUIDE.title}</h2>
          <span className="guide-hint">{GUIDE.hint}</span>
        </summary>
        <div className="split">
          <p>{GUIDE.intro}</p>
          <div>
            <h3>{GUIDE.tagsTitle}</h3>
            <ul className="tag-list">
              {GUIDE.tags.map(([name, text]) => (
                <li key={name}>
                  <strong>{name}</strong> is {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <h3>{GUIDE.stepsTitle}</h3>
        <Steps items={GUIDE.steps} />
        <div className="split even">
          <div>
            <h3>{GUIDE.keyTitle}</h3>
            <p>{GUIDE.key}</p>
          </div>
          <div>
            <h3>{GUIDE.limitsTitle}</h3>
            <p>{GUIDE.limits}</p>
          </div>
        </div>
        <FullGuide href={countHref} about={GUIDE.fullGuideCount} />
        <h3 className="section-h">{GUIDE.changeableTitle}</h3>
        <p>{GUIDE.changeableIntro}</p>
        <Steps items={GUIDE.changeableSteps} />
        <FullGuide href={changeHref} about={GUIDE.fullGuideChange} />
        <p className="cta">
          <a href={setup} target="_blank" rel="noopener noreferrer">
            {GUIDE.changeableCta}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
        {COMPARISON && (
          <div className="split compare">
            <h3>{COMPARISON.title}</h3>
            <p>{COMPARISON.text}</p>
          </div>
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

"use client";

import { useId, useRef, useState } from "react";
import { CHOOSER, type LinkKey } from "../content/home-copy";

export type Hrefs = Partial<Record<LinkKey, string>>;

const NEW_TAB: LinkKey[] = ["setup"];

/**
 * The goal chooser: four rows beside one answer panel. The answers all sit in the same grid cell, so the panel is as
 * tall as the longest answer and never jumps. Without script, and in print, every answer shows as a list.
 * The "Try another" line is chosen on a press only and is stored nowhere.
 */
export function Chooser({ hrefs }: { hrefs: Hrefs }) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const [line, setLine] = useState<number[]>(() => CHOOSER.choices.map(() => 0));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const pick = (i: number) => {
    setActive(i);
    tabs.current[i]?.focus();
  };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = CHOOSER.choices.length;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (i + 1) % n
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (i + n - 1) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : -1;
    if (next >= 0) {
      e.preventDefault();
      pick(next);
    }
  };
  const another = (i: number) => {
    const pool = CHOOSER.choices[i].more;
    setLine((cur) => {
      const copy = [...cur];
      let n = Math.floor(Math.random() * pool.length);
      if (n === cur[i]) n = (n + 1) % pool.length;
      copy[i] = n;
      return copy;
    });
  };

  return (
    <div className="chooser">
      <div className="chooser-rows" role="tablist" aria-label={CHOOSER.title} aria-orientation="vertical">
        {CHOOSER.choices.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-t-${c.id}`}
            aria-selected={active === i}
            aria-controls={`${uid}-p-${c.id}`}
            tabIndex={active === i ? 0 : -1}
            className="choice-tab"
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {c.title}
          </button>
        ))}
      </div>
      <div className="chooser-answers">
        {CHOOSER.choices.map((c, i) => (
          <div
            key={c.id}
            role="tabpanel"
            id={`${uid}-p-${c.id}`}
            aria-labelledby={`${uid}-t-${c.id}`}
            className={`answer${active === i ? " on" : ""}`}
          >
            <h3 className="answer-title">{c.title}</h3>
            <p>{c.text}</p>
            <p className="answer-links">
              {c.links
                .filter((l) => hrefs[l.to])
                .map((l) => (
                  <a
                    key={l.to}
                    href={hrefs[l.to]}
                    {...(NEW_TAB.includes(l.to) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={l.to === "app" || l.to === "setup" ? "btn answer-btn" : "inline-link"}
                  >
                    {l.label}
                    {NEW_TAB.includes(l.to) && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                ))}
            </p>
            <div className="shuffle">
              <p className="shuffle-line" aria-live="polite">
                {c.more[line[i]]}
              </p>
              <button type="button" className="btn shuffle-btn" onClick={() => another(i)}>
                {CHOOSER.another}
              </button>
            </div>
            <div className="shuffle-all">
              <h4>{CHOOSER.examples}</h4>
              <ul>
                {c.more.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

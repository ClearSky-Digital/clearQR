"use client";

import { useEffect, useState } from "react";
import { CAUSE_HREF, CAUSE_LABEL, FIXED, POOL, VERDICT_TABLE, drawTwo, verdict, type Choice } from "../lib/expire-check";

function Q({ name, text, choices, value, onChange }: { name: string; text: string; choices: readonly Choice[]; value?: string; onChange: (v: string) => void }) {
  return (
    <fieldset className="q">
      <legend>{text}</legend>
      <div className="q-choices">
        {choices.map((c) => (
          <label key={c.value} className={value === c.value ? "on" : ""}>
            <input type="radio" name={name} value={c.value} checked={value === c.value} onChange={() => onChange(c.value)} />
            <span>{c.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** The quick check. Answers live in this component only: nothing is sent or stored, and a different pair of questions is drawn on press. */
export function ExpireCheck() {
  const [fixed, setFixed] = useState<Record<string, string>>({});
  const [pool, setPool] = useState<Record<number, string>>({});
  const [asked, setAsked] = useState<number[]>([1, 2]);
  useEffect(() => {
    setAsked(drawTwo(Math.random));
  }, []);
  const v = verdict(fixed, pool, asked);
  const redraw = () => {
    setAsked((now) => drawTwo(Math.random, now));
    setPool({});
  };
  return (
    <div className="expire-check">
      <div className="js-only">
        <p>Answer five questions about your code. Your answers stay on this page.</p>
        <div className="q-grid">
          {FIXED.map((q) => (
            <Q key={q.id} name={q.id} text={q.text} choices={q.choices} value={fixed[q.id]} onChange={(a) => setFixed((f) => ({ ...f, [q.id]: a }))} />
          ))}
          {asked.map((id) => {
            const q = POOL.find((p) => p.id === id)!;
            return <Q key={id} name={`pool-${id}`} text={q.text} choices={q.choices} value={pool[id]} onChange={(a) => setPool((p) => ({ ...p, [id]: a }))} />;
          })}
        </div>
        <p>
          <button type="button" className="btn" onClick={redraw}>
            Show me different questions
          </button>
        </p>
        <div className={`verdict${v ? ` verdict-${v.level}` : ""}`} role="status" aria-live="polite">
          {v ? (
            <>
              <h3>{v.title}</h3>
              {v.singleFlag && <p>One answer points to something worth a look, so see the <a href="#checklist">checklist</a> below.</p>}
              {v.triggers.length > 0 && (
                <ul>
                  {v.triggers.map((t) => (
                    <li key={t.question}>
                      {t.question} {t.answer}. See <a href={CAUSE_HREF[t.cause]}>{CAUSE_LABEL[t.cause]}</a>.
                    </li>
                  ))}
                </ul>
              )}
              <p className="fine">This rests on your answers above. Scan the printed code on your own phone to be sure.</p>
            </>
          ) : (
            <p>Your result shows here once all five questions have an answer.</p>
          )}
        </div>
      </div>
      <div className="verdict-table">
        <h3>How the check decides</h3>
        <p className="fine">The strictest verdict applies. The questions drawn from a pool of twelve count only when they are flagged.</p>
        <div className="table-scroll" role="region" aria-label="How each answer maps to a verdict" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Answer</th>
                <th scope="col">Verdict</th>
                <th scope="col">Cause</th>
              </tr>
            </thead>
            <tbody>
              {VERDICT_TABLE.map(([a, b, c]) => (
                <tr key={a}>
                  <th scope="row">{a}</th>
                  <td>{b}</td>
                  <td>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

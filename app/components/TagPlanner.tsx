"use client";

import { useEffect, useState } from "react";
import { EXAMPLE_NAMES, PLACES, listText, planRows, rowText, tooLong } from "../lib/tag-planner";

/** Builds a list to copy into ClearQR and a tally sheet to print. Everything stays in this component: no network call, no storage, no cookie. */
export function TagPlanner() {
  const [ticked, setTicked] = useState<Record<string, boolean>>({});
  const [copies, setCopies] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const rows = planRows(ticked, copies, name);
  const long = tooLong(name);

  useEffect(() => {
    const after = () => document.body.classList.remove("print-planner");
    window.addEventListener("afterprint", after);
    return () => window.removeEventListener("afterprint", after);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(listText(rows));
      setNote("Copied.");
    } catch {
      setNote("Your browser did not allow copying. Select the list and copy it by hand.");
    }
  };
  const print = () => {
    document.body.classList.add("print-planner");
    window.print();
  };
  const shuffle = () => setName(EXAMPLE_NAMES[Math.floor(Math.random() * EXAMPLE_NAMES.length)]);

  return (
    <div className="planner js-only">
      <div className="planner-form">
        <fieldset className="q">
          <legend>Where will you print it?</legend>
          <p className="fine">Tick all that apply.</p>
          <div className="planner-places">
            {PLACES.map((p) => (
              <div key={p} className="planner-place">
                <label>
                  <input type="checkbox" checked={!!ticked[p]} onChange={(e) => setTicked((t) => ({ ...t, [p]: e.target.checked }))} />
                  <span>{p}</span>
                </label>
                <label className="planner-count">
                  <span className="sr-only">How many {p}</span>
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={copies[p] ?? ""}
                    disabled={!ticked[p]}
                    placeholder="How many?"
                    onChange={(e) => setCopies((c) => ({ ...c, [p]: e.target.value }))}
                  />
                </label>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="planner-name">
          <label htmlFor="planner-name">Campaign name (optional)</label>
          <input id="planner-name" type="text" value={name} onChange={(e) => setName(e.target.value)} aria-describedby="planner-help" />
          <p className="fine" id="planner-help">
            Keep it short and lowercase, such as spring-sale.
          </p>
          {long && (
            <p className="warn" role="alert">
              This tag is over 100 characters, so shorten it before you use it.
            </p>
          )}
        </div>
      </div>

      <div id="planner" className="planner-output">
        <h3>Your list</h3>
        {rows.length === 0 ? (
          <p>Tick a place to see your list.</p>
        ) : (
          <ul>
            {rows.map((r) => (
              <li key={r.place}>{rowText(r)}</li>
            ))}
          </ul>
        )}
        <div className="table-scroll" role="region" aria-label="Tally sheet" tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col">Place</th>
                <th scope="col">Campaign</th>
                <th scope="col">Printed</th>
                <th scope="col">Visits</th>
              </tr>
            </thead>
            <tbody>
              {(rows.length ? rows : [{ place: "", copies: null, campaign: "" }]).map((r) => (
                <tr key={r.place || "blank"}>
                  <td>{r.place}</td>
                  <td>{r.campaign}</td>
                  <td>{r.copies ?? ""}</td>
                  <td />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="planner-buttons">
        <button type="button" className="btn" onClick={copy} disabled={rows.length === 0}>
          Copy list
        </button>
        <button type="button" className="btn" onClick={print} disabled={rows.length === 0}>
          Print list
        </button>
        <button type="button" className="btn" onClick={shuffle}>
          Shuffle the example
        </button>
        <span role="status" className="fine">
          {note}
        </span>
      </p>
    </div>
  );
}

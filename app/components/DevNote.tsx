"use client";

import { useEffect, useRef } from "react";
import { DEV } from "../content/home-copy";

/** Developer rows: open in the page as sent (so print and no-script show them), closed once script runs, open again for print. */
export function DevNote() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const all = () => [...(root.current?.querySelectorAll("details") ?? [])];
    all().forEach((d) => {
      d.open = false;
    });
    const was = new Map<Element, boolean>();
    const before = () =>
      all().forEach((d) => {
        was.set(d, d.open);
        d.open = true;
      });
    const after = () =>
      all().forEach((d) => {
        d.open = was.get(d) ?? false;
      });
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, []);
  return (
    <div ref={root} className="dev-rows">
      {DEV.rows.map((r) => (
        <details key={r.title} open>
          <summary>{r.title}</summary>
          <p>{r.body.map((part, i) => (typeof part === "string" ? part : <code key={i}>{part.code}</code>))}</p>
        </details>
      ))}
    </div>
  );
}

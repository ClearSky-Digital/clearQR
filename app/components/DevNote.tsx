"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { DEV } from "../content/home-copy";

/** Developer rows: open in the page as sent (so print and no-script show them), closed once script runs, open again for print. */
export type DevRowItem = { title: string; body: ReactNode };

/** `rows` replaces the home page rows; a row's body is already markup. */
export function DevNote({ rows }: { rows?: DevRowItem[] }) {
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
      {(rows ?? DEV.rows.map((r) => ({
        title: r.title,
        body: <p>{r.body.map((part, i) => (typeof part === "string" ? part : <code key={i}>{part.code}</code>))}</p>,
      }))).map((r) => (
        <details key={r.title} open>
          <summary>{r.title}</summary>
          {r.body}
        </details>
      ))}
    </div>
  );
}

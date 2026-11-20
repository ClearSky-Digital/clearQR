import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { CHOOSER, DEV, FREE, HERO } from "../app/content/home-copy";

const text = (parts: (string | { code: string })[]) => parts.map((p) => (typeof p === "string" ? p : p.code)).join("");
const all = [
  HERO.h1,
  ...HERO.lines,
  HERO.fine,
  ...CHOOSER.choices.flatMap((c) => [c.title, c.text, ...c.more]),
  FREE.text,
  ...FREE.facts,
  ...DEV.rows.flatMap((r) => [r.title, text(r.body)]),
];

describe("home page copy", () => {
  it("has four choices with at least six examples each, and no dashes", () => {
    expect(CHOOSER.choices).toHaveLength(4);
    for (const c of CHOOSER.choices) expect(c.more.length).toBeGreaterThanOrEqual(6);
    for (const s of all) expect(s, s).not.toMatch(/[\u2013\u2014]| - /);
  });
  it("the developer rows quote commands and addresses that the README also states", () => {
    const readme = readFileSync("README.md", "utf8");
    for (const row of DEV.rows) {
      for (const part of row.body) {
        if (typeof part !== "string" && part.code.length > 12 && !part.code.includes("<") && !part.code.startsWith("connect-src") && !part.code.startsWith("form-action")) expect(readme, part.code).toContain(part.code);
      }
    }
  });
  it("the connect-src claim is true in the page and in the image's header", () => {
    expect(DEV.rows.some((r) => text(r.body).includes("connect-src 'none'"))).toBe(true);
    expect(readFileSync("app/layout.tsx", "utf8")).toContain("connect-src 'none'");
    expect(readFileSync("deploy/nginx.conf", "utf8")).toContain("connect-src 'none'");
    expect(DEV.rows.some((r) => text(r.body).includes("form-action 'none'"))).toBe(true);
    expect(readFileSync("app/layout.tsx", "utf8")).toContain("form-action 'none'");
    expect(readFileSync("deploy/nginx.conf", "utf8")).toContain("form-action 'none'");
  });
  it("says visits for counts and never promises tracking by ClearQR", () => {
    const joined = all.join(" ");
    expect(joined).toContain("ClearQR tracks nothing; your own analytics counts.");
    expect(joined).not.toMatch(/ClearQR (counts|tracks) (your|the) (scans|visits)/i);
  });
});

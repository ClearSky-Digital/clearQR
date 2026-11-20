import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Generator from "../app/components/Generator";
import { Guide, TipCard } from "../app/components/Guide";
import { COMPARISON, GUIDE, PATHS, TIP } from "../app/lib/copy";
import { root } from "./helpers";

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const allCopy = () => JSON.stringify([GUIDE, PATHS, TIP]);

describe("guide, paths and tip card", () => {
  it("shows the guide and both paths, with the setup link tagged and no price", () => {
    const html = renderToStaticMarkup(
      createElement(Guide, { setup: "https://cscloud.digital/start/?utm_source=clearqr&utm_medium=app&utm_campaign=setup-help" }),
    );
    expect(html).toContain(GUIDE.title);
    expect(html).toContain(PATHS.freeTitle);
    expect(html).toContain(PATHS.helpTitle);
    expect(html).toContain(PATHS.partnership);
    expect(html).toContain('href="https://cscloud.digital/start/?utm_source=clearqr&amp;utm_medium=app&amp;utm_campaign=setup-help"');
    expect(text(html)).not.toMatch(/\$\s?\d|\bUSD\b|per month|\/mo\b|\bprice\b|\bfee\b/i);
  });
  it("hides the tip card without a link, and shows it with one", () => {
    expect(renderToStaticMarkup(createElement(TipCard, { href: null }))).toBe("");
    const html = renderToStaticMarkup(createElement(TipCard, { href: "https://buy.stripe.com/x?utm_campaign=tip" }));
    expect(html).toContain(TIP.button);
    expect(html).toContain("utm_campaign=tip");
    expect(text(html)).toContain("not donations");
  });
  it("the page shows no tip button while the tip address is unset", () => {
    const html = renderToStaticMarkup(createElement(Generator));
    expect(html).not.toContain(TIP.button);
    expect(html).not.toContain("buy.stripe.com");
    expect(html).toContain("Campaign tags (optional)");
    expect(html).toContain(GUIDE.title);
  });
  it("the new words use no em or en dashes and no spaced hyphens", () => {
    const c = allCopy();
    expect(c).not.toMatch(/[–—]/);
    expect(c).not.toMatch(/ - /);
  });
  it("states the limits honestly", () => {
    expect(GUIDE.limits).toMatch(/ad blockers/i);
    expect(GUIDE.limits).toMatch(/cookie banners/i);
    expect(GUIDE.intro).toMatch(/counts nothing and collects nothing/);
  });
  it("the comparison stays within what the dated evidence supports", () => {
    const c = COMPARISON;
    expect(c).not.toBeNull();
    const words = (c?.title ?? "") + " " + (c?.text ?? "");
    expect(words).toMatch(/November 2026/);
    expect(words).toMatch(/\bmost\b/);
    expect(words).toMatch(/\busually\b/);
    expect(words).not.toMatch(/\b(all|every|always|never|none)\b/i);
    expect(words).not.toMatch(/[$\u20ac\u00a3]|\bUSD\b|per month|\bprice/i);
    expect(words).not.toMatch(/[–—]| - /);
    expect(words).toContain("ClearQR tracks nothing, and your own analytics does the counting");
    expect(renderToStaticMarkup(createElement(Guide))).toContain("Why we made ClearQR free");
  });
});

describe("the no-tracking promise holds", () => {
  const walk = (dir: string): string[] =>
    readdirSync(dir).flatMap((n) => {
      const p = join(dir, n);
      return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(n) ? [p] : [];
    });
  it("no network call, beacon, analytics or third-party script in the app or the core", () => {
    for (const f of [...walk(join(root, "app")), ...walk(join(root, "src", "core"))]) {
      const s = readFileSync(f, "utf8");
      expect(s, f).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|<script|gtag|google-analytics|plausible|posthog|mixpanel/i);
    }
  });
});

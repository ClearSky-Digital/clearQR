import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Generator from "../app/components/Generator";
import { Guide, GUIDE_ID, HeroActions, Pitch, TipCard, openGuide } from "../app/components/Guide";
import { COMPARISON, GUIDE, PATHS, PITCH, TIP } from "../app/lib/copy";
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
  it("the tip button opens in a new tab and says so", () => {
    const tip = renderToStaticMarkup(createElement(TipCard, { href: "https://buy.stripe.com/x" }));
    expect(tip).toMatch(/<a [^>]*target="_blank"[^>]*rel="noopener noreferrer"|<a [^>]*rel="noopener noreferrer"[^>]*target="_blank"/);
    expect(tip).toContain("(opens in a new tab)");
  });
  it("the top message says what ClearQR is, without claiming hosted codes or charging for plain codes", () => {
    const html = renderToStaticMarkup(createElement(Pitch)) + renderToStaticMarkup(createElement(HeroActions));
    expect(html).toContain(PITCH.headline);
    expect(html).toContain('href="#h-guide"');
    expect(html).toMatch(/href="https:\/\/cscloud\.digital\/free-qr-code-generator\/\?utm_source=clearqr&amp;utm_medium=app&amp;utm_campaign=setup-help#setup-help"[^>]*target="_blank"/);
    expect(html).toContain("(opens in a new tab)");
    expect(PITCH.text).toMatch(/\bMany\b/);
    expect(PITCH.text).not.toMatch(/\b(dynamic|host|hosted|all|every|always|never)\b/i);
    expect(PITCH.text).not.toMatch(/[$\u20ac\u00a3]|\bUSD\b|\bprice|[\u2013\u2014]| - /i);
  });
  it("the page puts the buttons in the hero header and the message in the main area", () => {
    const page = renderToStaticMarkup(createElement(Generator));
    expect(page).toContain(PITCH.headline);
    const hero = page.slice(page.indexOf("<header"), page.indexOf("</header>"));
    expect(hero).toContain("hero-actions");
    expect(hero).toContain(PITCH.how);
    expect(hero).toContain(PITCH.help);
    const main = page.slice(page.indexOf("<main"));
    expect(main).not.toContain("hero-actions");
  });
  it("the guide carries the id the jump link needs, and the jump link opens it", () => {
    expect(renderToStaticMarkup(createElement(Guide))).toContain(`<details id="${GUIDE_ID}"`);
    const el = { open: false };
    openGuide({ getElementById: (id: string) => (id === GUIDE_ID ? el : null) });
    expect(el.open).toBe(true);
    expect(() => openGuide({ getElementById: () => null })).not.toThrow();
  });
  it("the jump link click handler opens the guide", () => {
    const find = (n: any): any => {
      if (!n || typeof n !== "object") return null;
      if (n.props?.href === "#h-guide") return n;
      const kids = [n.props?.children].flat(Infinity);
      for (const k of kids) { const r = find(k); if (r) return r; }
      return null;
    };
    const link = find(HeroActions({}));
    expect(typeof link?.props.onClick).toBe("function");
    const el = { open: false };
    const real = (globalThis as any).document;
    (globalThis as any).document = { getElementById: (id: string) => (id === GUIDE_ID ? el : null) };
    try { link.props.onClick(); } finally { (globalThis as any).document = real; }
    expect(el.open).toBe(true);
  });
  it("the changeable-code section links to the setup-help form in a new tab", () => {
    const html = renderToStaticMarkup(createElement(Guide));
    const at = html.indexOf(GUIDE.changeableCta);
    expect(at).toBeGreaterThan(0);
    const anchor = html.slice(html.lastIndexOf("<a ", at), at);
    expect(anchor).toContain("free-qr-code-generator/?utm_source=clearqr");
    expect(anchor).toContain('target="_blank"');
  });
  it("the footer tip link opens in a new tab and says so", () => {
    const src = readFileSync(join(root, "app", "components", "Generator.tsx"), "utf8");
    const m = src.match(/<a href=\{tipLink\(\) as string\}[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
    expect(m).toContain('target="_blank"');
    expect(m).toContain('rel="noopener noreferrer"');
    expect(m).toContain("(opens in a new tab)");
  });
  it("the setup help link opens in a new tab and says so", () => {
    const guide = renderToStaticMarkup(createElement(Guide));
    const a = guide.match(/<a [^>]*href="https:\/\/cscloud\.digital\/free-qr-code-generator\/[^"]*"[^>]*>[\s\S]*?<\/a>/)?.[0] ?? "";
    expect(a).toContain('target="_blank"');
    expect(a).toContain('rel="noopener noreferrer"');
    expect(a).toContain("(opens in a new tab)");
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

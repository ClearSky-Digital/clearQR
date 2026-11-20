import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { canonicalUrl, GUIDES, isPlaceholderPage, readyGuides } from "../app/lib/pages";
// @ts-expect-error plain script, no types
import { checkOut } from "../scripts/check-placeholders.mjs";

function site(files: Record<string, string>) {
  const dir = mkdtempSync(join(tmpdir(), "clearqr-site-"));
  for (const [f, body] of Object.entries(files)) {
    const p = join(dir, f);
    mkdirSync(join(p, ".."), { recursive: true });
    writeFileSync(p, body);
  }
  return dir;
}

describe("site routes and the placeholder guard", () => {
  it("canonical addresses sit at the root of the site, with a trailing slash", () => {
    expect(canonicalUrl("")).toBe("https://clearqr.app/");
    expect(canonicalUrl("count-your-scans")).toBe("https://clearqr.app/count-your-scans/");
  });
  it("a guide whose body file uses the placeholder is not ready; a real body is", () => {
    const root = site({ "app/content/count-your-scans.tsx": "export const Body = () => <Placeholder />;", "app/content/changeable-code.tsx": "export const Body = () => <p>Real copy</p>;" });
    try {
      expect(isPlaceholderPage("count-your-scans", root)).toBe(true);
      expect(isPlaceholderPage("changeable-code", root)).toBe(false);
      expect(isPlaceholderPage("static-vs-dynamic", root)).toBe(true); // no file at all
      expect(readyGuides(root).map((g) => g.slug)).toEqual(["changeable-code"]);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
  it("every guide has a unique slug and a title and description of sensible length", () => {
    expect(new Set(GUIDES.map((g) => g.slug)).size).toBe(GUIDES.length);
    for (const g of GUIDES) {
      expect(g.title.length).toBeLessThanOrEqual(70);
      expect(g.description.length).toBeLessThanOrEqual(160);
    }
  });
  it("the built-site check finds placeholder pages and a sitemap that lists one", () => {
    const sm = (paths: string[]) => `<urlset>${paths.map((p) => `<url><loc>https://clearqr.app${p}</loc></url>`).join("")}</urlset>`;
    const ok = site({ "index.html": "<p>home</p>", "a/index.html": '<section data-placeholder="copy"></section>', "sitemap.xml": sm(["/"]) });
    const bad = site({ "index.html": "<p>home</p>", "a/index.html": '<section data-placeholder="copy"></section>', "sitemap.xml": sm(["/", "/a/"]) });
    try {
      expect(checkOut(ok)).toEqual({ placeholders: ["/a/"], leaked: [] });
      expect(checkOut(bad)).toEqual({ placeholders: ["/a/"], leaked: ["/a/"] });
    } finally {
      rmSync(ok, { recursive: true, force: true });
      rmSync(bad, { recursive: true, force: true });
    }
  });
});

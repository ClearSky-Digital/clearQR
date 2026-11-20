import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { parseConfig, QR_TYPES } from "../src/core";
import { TYPE_META, contentToForm, emptyValues, formToContent } from "../app/lib/forms";
import { imageSize } from "../app/lib/browserRaster";
import Generator from "../app/components/Generator";
import { loadExample, root } from "./helpers";

describe("form mapping (what import and the form rely on)", () => {
  for (const name of ["link", "text", "vcard", "wifi", "email", "sms", "phone", "geo", "event"] as const) {
    it(`${name}: config content to form and back is the same content`, () => {
      const c = loadExample(name);
      const form = contentToForm(c.type, c.content as Record<string, unknown>);
      const back = parseConfig({ type: c.type, content: formToContent(c.type, form) });
      expect(back.ok, back.ok ? "" : back.errors.join("; ")).toBe(true);
      expect(back.ok && back.config.content).toEqual(c.content);
    });
  }

  it("an all-day event keeps its dates through the form", () => {
    const c = parseConfig({ type: "event", content: { title: "Day off", start: "2027-12-31", end: "2028-01-02" } });
    if (!c.ok) throw new Error(c.errors.join());
    const form = contentToForm("event", c.config.content as Record<string, unknown>);
    expect(form.allDay).toBe(true);
    const back = parseConfig({ type: "event", content: formToContent("event", form) });
    expect(back.ok && back.config.content).toEqual(c.config.content);
  });

  it("every type has a form with at least one field and starts valid or empty, never throwing", () => {
    for (const t of QR_TYPES) {
      expect(TYPE_META[t].fields.length).toBeGreaterThan(0);
      expect(() => parseConfig({ type: t, content: formToContent(t, emptyValues(t)) })).not.toThrow();
    }
  });
});

describe("image header size check (guards the upload against huge images)", () => {
  it("reads PNG, GIF, JPEG and WebP sizes without decoding", () => {
    const png = new Uint8Array(readFileSync(join(root, "examples", "assets", "sample-logo.png")));
    const s = imageSize(png);
    expect(s && s.width > 0 && s.width === s.height).toBe(true);
    const bigPng = new Uint8Array(png);
    new DataView(bigPng.buffer).setUint32(16, 30000);
    new DataView(bigPng.buffer).setUint32(20, 30000);
    expect(imageSize(bigPng)).toEqual({ width: 30000, height: 30000 });
    const gif = new Uint8Array([71, 73, 70, 56, 57, 97, 0x20, 0x03, 0x58, 0x02, 0, 0]);
    expect(imageSize(gif)).toEqual({ width: 800, height: 600 });
    const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 4, 0, 0, 0xff, 0xc0, 0, 11, 8, 0x02, 0x58, 0x03, 0x20, 1, 0, 0, 0]);
    expect(imageSize(jpeg)).toEqual({ width: 800, height: 600 });
    const webp = new Uint8Array(40);
    webp.set([82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80, 86, 80, 56, 88], 0);
    webp.set([0x1f, 0x03, 0x00], 24);
    webp.set([0x57, 0x02, 0x00], 27);
    expect(imageSize(webp)).toEqual({ width: 800, height: 600 });
    expect(imageSize(new Uint8Array([1, 2, 3, 4]))).toBeNull();
  });
});

describe("the page", () => {
  it("renders on the server without errors and states the privacy promise", () => {
    const html = renderToString(createElement(Generator));
    expect(html).toContain("Nothing leaves your device");
    for (const t of QR_TYPES) expect(html).toContain(TYPE_META[t].label);
    expect(html).toContain("Built and maintained by");
    expect(html).toContain("https://cscloud.digital");
    expect(html).not.toMatch(/google-analytics|gtag|plausible|segment\.com|hotjar/i);
  });
});

/* ---------- text contrast (WCAG AA) ---------- */

const css = readFileSync(join(root, "app", "generator.css"), "utf8");
const vars: Record<string, string> = {};
for (const m of css.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})/g)) vars[m[1]] = m[2];

function lum(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a: string, b: string) {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

describe("text contrast", () => {
  // [text, background, what it is]
  const pairs: [string, string, string][] = [
    ["ink", "page", "body text on the page"],
    ["ink", "card", "body text on cards"],
    ["ink-soft", "card", "help text on cards"],
    ["ink-soft", "page", "help text on the page tint"],
    ["blue-deep", "card", "links and secondary buttons"],
    ["blue-deep", "page", "links on the tint"],
    ["card", "blue-deep", "white text on primary buttons and step numbers"],
    ["on-dark", "dark", "header and footer text"],
    ["orange", "dark", "brand mark on dark"],
    ["sky", "dark", "footer link"],
    ["ok-ink", "ok-bg", "scans badge"],
    ["warn-ink", "warn-bg", "won't scan badge"],
    ["ink", "ok-bg", "text on the scans tint"],
  ];
  for (const [fg, bg, what] of pairs) {
    it(`${what} is at least 4.5:1`, () => {
      expect(vars[fg], fg).toBeTruthy();
      expect(vars[bg], bg).toBeTruthy();
      expect(ratio(vars[fg], vars[bg])).toBeGreaterThanOrEqual(4.5);
    });
  }
});

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Logo } from "../app/components/Logo";
import manifest from "../app/manifest";
import { root } from "./helpers";

const pngSize = (file: string) => {
  const b = readFileSync(join(root, file));
  expect(b.subarray(1, 4).toString(), file).toBe("PNG");
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
};
const shapes = (svg: string) => [...svg.matchAll(/<(?:path|rect)\b[^>]*>/g)].map((m) => m[0].replace(/fill-?[rR]ule=/g, "fillrule=").replace(/\s*\/?>$/, "").replace(/\s+/g, " "));

describe("logo and icons", () => {
  const source = readFileSync(join(root, "app", "icon.svg"), "utf8");

  it("uses only ClearSky colors and nothing external", () => {
    const colors = new Set([...source.matchAll(/#[0-9a-fA-F]{6}/g)].map((m) => m[0].toLowerCase()));
    expect([...colors].sort()).toEqual(["#145f80", "#f2994a", "#ffffff"]);
    expect(source).not.toMatch(/https?:\/\/(?!www\.w3\.org)|<image|<script|href=/);
  });

  it("header mark has the same shapes as icon.svg", () => {
    const inline = renderToStaticMarkup(createElement(Logo));
    const fromInline = shapes(inline);
    expect(fromInline.length).toBeGreaterThan(8);
    expect(fromInline).toEqual(shapes(source));
  });

  it("PNG icons exist at the sizes the page and the manifest ask for", () => {
    expect(pngSize("app/icon.png")).toEqual([96, 96]);
    expect(pngSize("app/apple-icon.png")).toEqual([180, 180]);
    expect(pngSize("public/icon-192.png")).toEqual([192, 192]);
    expect(pngSize("public/icon-512.png")).toEqual([512, 512]);
  });

  it("manifest points at icons that exist, with paths relative to itself", () => {
    const m = manifest();
    expect(m.icons?.length).toBeGreaterThanOrEqual(2);
    for (const icon of m.icons ?? []) {
      expect(icon.src.startsWith("/") || icon.src.includes("://")).toBe(false);
      expect(existsSync(join(root, "public", icon.src)), icon.src).toBe(true);
    }
  });
});

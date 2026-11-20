// Measured text contrast. For every visible text element the page is captured with all text made transparent,
// and the pixels under the element's box are compared with the element's computed text colour (worst pixel wins).
import { chromium } from "playwright-core";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { CHROME } from "./_paths.mjs";


const PAGES = ["/", "/make/", "/count-your-scans/", "/do-qr-codes-expire/", "/static-vs-dynamic/", "/changeable-code/"]; // adapted for ClearQR

const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };

export default async function ({ base, args }) {
  const widths = (args.find((a) => /^\d+(,\d+)*$/.test(a)) ? args.find((a) => /^\d+(,\d+)*$/.test(a)).split(",") : ["390", "1440"]).map(Number);
  const only = args.filter((a) => a.startsWith("/")); // optional: measure only these pages
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const results = [];
  try {
    for (const w of widths) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      for (const url of only.length ? PAGES.filter((u) => only.includes(u)) : PAGES) {
        await page.goto(base + url.replace(/#step-\d+$/, ""), { waitUntil: "load" });
        // every closed details block (the guide on the generator page) is opened so its text is measured too
        await page.evaluate(() => document.querySelectorAll("details").forEach((d) => { d.open = true; }));
        await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } window.scrollTo(0, 0); });
        await page.waitForTimeout(500);
        const items = await page.evaluate(() => {
          const out = [];
          const cv = document.createElement("canvas"); cv.width = cv.height = 1;
          const cx = cv.getContext("2d", { willReadFrequently: true });
          const toRgba = (c) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = "#000"; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0], d[1], d[2], d[3] / 255]; };
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          const seen = new Set();
          while (walker.nextNode()) {
            const n = walker.currentNode; const t = n.textContent.trim(); if (!t) continue;
            const el = n.parentElement; if (!el || seen.has(el)) continue;
            if (["SCRIPT", "STYLE", "NOSCRIPT", "OPTION", "TEXTAREA"].includes(el.tagName)) continue;
            if (el.closest("[aria-hidden='true'], .sr-only, .hp, [hidden], details:not([open]) > :not(summary)")) continue;
            const cs = getComputedStyle(el);
            if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) === 0) continue;
            if (cs.clipPath && cs.clipPath !== "none") continue; // screen-reader-only text (clipped to nothing) is not on screen
            const range = document.createRange(); range.selectNodeContents(n);
            const r = range.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
            seen.add(el);
            const m = toRgba(cs.color);
            out.push({ text: t.slice(0, 48), x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, color: m.slice(0, 3), alpha: m[3] ?? 1, size: parseFloat(cs.fontSize), weight: Number(cs.fontWeight) || 400, tag: el.tagName.toLowerCase() });
          }
          return out;
        });
        await page.addStyleTag({ content: "*,*::before,*::after{color:transparent !important;-webkit-text-fill-color:transparent !important;text-shadow:none !important;caret-color:transparent !important} svg text,svg tspan{fill:transparent !important}" });
        await page.waitForTimeout(150);
        // Chromium cannot capture a page taller than 16,384 px in one image (the bottom comes back blank), so long pages are captured in tiles and stitched.
        const pageH = await page.evaluate(() => Math.ceil(document.documentElement.scrollHeight));
        const TILE = 6000;
        const info = { width: w, height: pageH };
        const data = Buffer.alloc(w * pageH * 3);
        for (let t = 0; t < pageH; t += TILE) {
          const hh = Math.min(TILE, pageH - t);
          const tile = await page.screenshot({ fullPage: true, clip: { x: 0, y: t, width: w, height: hh } });
          const raw = await sharp(tile).removeAlpha().raw().toBuffer({ resolveWithObject: true });
          for (let row = 0; row < Math.min(hh, raw.info.height); row++) raw.data.copy(data, ((t + row) * w) * 3, row * raw.info.width * 3, row * raw.info.width * 3 + w * 3);
        }
        for (const it of items) {
          const x0 = Math.max(0, Math.floor(it.x)), y0 = Math.max(0, Math.floor(it.y));
          const x1 = Math.min(info.width - 1, Math.ceil(it.x + it.w)), y1 = Math.min(info.height - 1, Math.ceil(it.y + it.h));
          let worst = Infinity;
          for (let y = y0; y <= y1; y += 2) for (let x = x0; x <= x1; x += 2) {
            const i = (y * info.width + x) * 3; const bg = [data[i], data[i + 1], data[i + 2]];
            const fg = it.color.map((c, k) => Math.round(c * it.alpha + bg[k] * (1 - it.alpha)));
            const c = ratio(fg, bg); if (c < worst) worst = c;
          }
          if (!isFinite(worst)) continue;
          const large = it.size >= 24 || (it.size >= 18.66 && it.weight >= 700);
          results.push({ page: url, width: w, text: it.text, tag: it.tag, size: Math.round(it.size * 10) / 10, weight: it.weight, ratio: Math.round(worst * 100) / 100, need: large ? 3 : 4.5, pass: worst >= (large ? 3 : 4.5) });
        }
        await page.reload();
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
  fs.mkdirSync(path.resolve("evidence"), { recursive: true });
  fs.writeFileSync(path.resolve("evidence/contrast-report.json"), JSON.stringify(results, null, 1));
  const bad = results.filter((r) => !r.pass);
  const min = results.reduce((m, r) => Math.min(m, r.ratio / r.need), Infinity);
  console.log(`measured ${results.length} text elements; ${bad.length} below their threshold`);
  const uniq = new Map();
  for (const b of bad) { const k = `${b.page}|${b.text}`; if (!uniq.has(k) || uniq.get(k).ratio > b.ratio) uniq.set(k, b); }
  for (const b of [...uniq.values()].sort((a, c) => a.ratio - c.ratio).slice(0, 40)) console.log(`  ${b.ratio} < ${b.need}  ${b.page} @${b.width}  ${b.tag} ${b.size}px  "${b.text}"`);
  console.log(`lowest ratio relative to its threshold: ${min.toFixed(2)}`);
}

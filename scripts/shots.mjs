// Screenshots of each page at 1440 and 390 wide, for a look before showing a page: node scripts/run-check.mjs scripts/shots.mjs [/page/ ...]
import { chromium } from "playwright-core";
import fs from "node:fs";
import path from "node:path";
import { CHROME } from "./_paths.mjs";

export default async function ({ base, args }) {
  const pages = args.filter((a) => a.startsWith("/"));
  const list = pages.length ? pages : ["/", "/count-your-scans/"];
  const dir = path.resolve("evidence/shots");
  fs.mkdirSync(dir, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  try {
    for (const w of [1440, 390]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
      const page = await ctx.newPage();
      for (const u of list) {
        await page.goto(base + u, { waitUntil: "load" });
        await page.waitForTimeout(300);
        const name = (u.replace(/\//g, "_") || "_") + `-${w}.png`;
        await page.screenshot({ path: path.join(dir, name), fullPage: false });
        console.log("wrote", path.join(dir, name));
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
}

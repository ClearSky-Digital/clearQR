// Ship checks for the home page that no general check covers. Run after a build:
//   node scripts/run-check.mjs scripts/home-check.mjs
//   1. at 390 wide (667 high), the three hero buttons sit above the fold
//   2. at 1100 and wider, the chooser rows are level (same height), the answer panel is within 55 percent of the row column, and the
//      panel keeps one height whichever row is chosen
//   3. with script off, all four answers and all five developer rows are visible; the print view shows them too
//   4. the page carries a Content-Security-Policy meta tag with connect-src 'none'
//   5. no network request leaves the page after load
import { chromium } from "playwright-core";
import { CHROME } from "./_paths.mjs";

export default async function ({ base }) {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const fails = [];
  const ok = (cond, msg) => {
    console.log(`${cond ? "ok  " : "FAIL"} ${msg}`);
    if (!cond) fails.push(msg);
  };
  try {
    // 1 first screen at 390
    {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 667 } });
      const page = await ctx.newPage();
      await page.goto(base + "/", { waitUntil: "load" });
      const boxes = await page.$$eval(".hero-buttons .btn", (els) => els.map((e) => e.getBoundingClientRect().bottom));
      ok(boxes.length === 3 && boxes.every((b) => b <= 667), `hero buttons above the fold at 390x667 (bottoms ${boxes.map(Math.round).join(", ")})`);
      await ctx.close();
    }
    // 2 chooser levels at 1100 and 1440
    for (const w of [1100, 1440]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
      const page = await ctx.newPage();
      const requests = [];
      page.on("request", (r) => { if (!r.url().startsWith(base)) requests.push(r.url()); });
      await page.goto(base + "/", { waitUntil: "load" });
      await page.waitForTimeout(300);
      const hs = await page.$$eval(".choice-tab", (els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
      ok(new Set(hs).size === 1, `chooser rows share one height at ${w} (${hs.join(", ")})`);
      const rows = await page.$eval(".chooser-rows", (e) => e.getBoundingClientRect().height);
      const panelH = [];
      for (let i = 0; i < 4; i++) {
        await page.locator(".choice-tab").nth(i).click();
        panelH.push(Math.round(await page.$eval(".chooser-answers", (e) => e.getBoundingClientRect().height)));
      }
      ok(new Set(panelH).size === 1, `answer panel keeps one height whichever row is chosen at ${w} (${panelH.join(", ")})`);
      const lo = Math.min(rows, panelH[0]), hi = Math.max(rows, panelH[0]);
      ok(lo >= hi * 0.55, `rows column and answer panel are level within 55 percent at ${w} (${Math.round(rows)} and ${panelH[0]})`);
      const shown = await page.$$eval(".answer", (els) => els.filter((e) => getComputedStyle(e).visibility === "visible").length);
      ok(shown === 1, `one answer shows at a time with script on (${shown})`);
      ok(requests.length === 0, `no request leaves the page at ${w} (${requests.join(", ") || "none"})`);
      await ctx.close();
    }
    // 3 script off and print
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
      const page = await ctx.newPage();
      await page.goto(base + "/", { waitUntil: "load" });
      const answers = await page.$$eval(".answer", (els) => els.filter((e) => getComputedStyle(e).visibility === "visible" && e.getBoundingClientRect().height > 20).length);
      ok(answers === 4, `script off: all four answers show (${answers})`);
      const tabs = await page.$eval(".chooser-rows", (e) => getComputedStyle(e).display);
      ok(tabs === "none", `script off: the row buttons are hidden (${tabs})`);
      const rowsOpen = await page.$$eval(".dev-rows details", (els) => els.filter((d) => d.open).length);
      ok(rowsOpen === 5, `script off: all five developer rows are open (${rowsOpen})`);
      const all = await page.$eval(".shuffle-all", (e) => getComputedStyle(e).display);
      ok(all === "block", `script off: the example lists show (${all})`);
      await page.emulateMedia({ media: "print" });
      const printed = await page.$$eval(".answer", (els) => els.filter((e) => getComputedStyle(e).visibility === "visible").length);
      ok(printed === 4, `print: all four answers show (${printed})`);
      await ctx.close();
    }
    // 3b print with script on
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await ctx.newPage();
      await page.goto(base + "/", { waitUntil: "load" });
      await page.waitForTimeout(300);
      await page.emulateMedia({ media: "print" });
      const printed = await page.$$eval(".answer", (els) => els.filter((e) => getComputedStyle(e).visibility === "visible").length);
      ok(printed === 4, `print with script on: all four answers show (${printed})`);
      const closed = await page.$$eval(".dev-rows details", (els) => els.filter((d) => !d.open).length);
      ok(closed === 5, `script on: the developer rows start closed (${closed} closed)`);
      await ctx.close();
    }
    // 4 CSP meta
    {
      const ctx = await browser.newContext();
      const page = await ctx.newPage();
      await page.goto(base + "/", { waitUntil: "load" });
      const csp = await page.$eval('meta[http-equiv="Content-Security-Policy"]', (e) => e.getAttribute("content")).catch(() => "");
      ok(csp.includes("connect-src 'none'"), "the page carries a CSP meta tag with connect-src 'none'");
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
  console.log(fails.length ? `${fails.length} home checks failed` : "home checks passed");
  if (fails.length) process.exitCode = 1;
}

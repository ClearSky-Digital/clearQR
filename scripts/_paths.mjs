// Shared locations for the check scripts. Nothing here is a fixed drive path.
// CSD_ROOT: the CSD_ROOT environment variable, else the first folder above this repo that holds both home\ and env\.
// CHROME:   resolved in this order, and a missing browser never throws at import (CHROME is then undefined and CHROME_ERROR holds the reason; requireChrome() throws it):
//           1. the CHROME_PATH environment variable (the chrome executable itself),
//           2. the PLAYWRIGHT_BROWSERS_PATH environment variable (the folder that holds the chromium-NNNN folders; the newest one wins),
//           3. the newest Playwright chromium under CSD_ROOT\env\legends-geogrid-venv\playwright-browsers.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

function findRoot() {
  if (process.env.CSD_ROOT) return path.resolve(process.env.CSD_ROOT);
  let dir = path.resolve(here, "..");
  for (;;) {
    if (fs.existsSync(path.join(dir, "home")) && fs.existsSync(path.join(dir, "env"))) return dir;
    const up = path.dirname(dir);
    if (up === dir) throw new Error("CSD_ROOT not set and no folder above this repo holds both home and env. Set CSD_ROOT.");
    dir = up;
  }
}

function newestChromeIn(base) {
  const builds = fs.existsSync(base) ? fs.readdirSync(base).filter((d) => /^chromium-\d+$/.test(d)) : [];
  builds.sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
  for (const d of builds) {
    const exe = path.join(base, d, "chrome-win64", "chrome.exe");
    if (fs.existsSync(exe)) return exe;
  }
  return null;
}

function findChrome() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  if (process.env.PLAYWRIGHT_BROWSERS_PATH) {
    const hit = newestChromeIn(path.resolve(process.env.PLAYWRIGHT_BROWSERS_PATH));
    if (hit) return hit;
  }
  const base = path.join(CSD_ROOT, "env", "legends-geogrid-venv", "playwright-browsers");
  const hit = newestChromeIn(base);
  if (hit) return hit;
  throw new Error(`No Playwright chromium found (CHROME_PATH, PLAYWRIGHT_BROWSERS_PATH, or ${base}). Set CHROME_PATH.`);
}

export const CSD_ROOT = findRoot().replace(/\\/g, "/");
// A missing browser never throws at import: CHROME is undefined (Playwright then uses its own default) and CHROME_ERROR says why.
// Scripts that need a browser can call requireChrome() for a clear error.
let chrome, chromeError;
try { chrome = findChrome(); } catch (e) { chromeError = e.message; }
export const CHROME = chrome;
export const CHROME_ERROR = chromeError;
export function requireChrome() { if (!chrome) throw new Error(chromeError); return chrome; }

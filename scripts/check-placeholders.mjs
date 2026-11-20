// After `next build`: list every page in out/ that still shows the placeholder, and make sure the sitemap
// leaves those pages out. With CLEARQR_STRICT=1 (a release build), any placeholder page fails the build.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

const MARK = 'data-placeholder="copy"';

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

/** Returns { placeholders: page paths, leaked: placeholder pages that the sitemap lists }. */
export function checkOut(outDir) {
  const placeholders = [];
  for (const f of walk(outDir)) {
    if (readFileSync(f, "utf8").includes(MARK)) {
      const rel = relative(outDir, f).split(sep).join("/").replace(/index\.html$/, "");
      placeholders.push("/" + rel);
    }
  }
  const sm = join(outDir, "sitemap.xml");
  const xml = existsSync(sm) ? readFileSync(sm, "utf8") : "";
  const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const leaked = placeholders.filter((p) => listed.includes(p));
  return { placeholders, leaked };
}

const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === entry) {
  const { placeholders, leaked } = checkOut(join(process.cwd(), "out"));
  console.log(placeholders.length ? `pages still on the placeholder: ${placeholders.join(", ")}` : "no placeholder pages");
  if (leaked.length) {
    console.error(`FAIL: the sitemap lists placeholder pages: ${leaked.join(", ")}`);
    process.exit(1);
  }
  if (process.env.CLEARQR_STRICT === "1" && placeholders.length) {
    console.error("FAIL: a release build cannot ship a page that still shows the placeholder.");
    process.exit(1);
  }
}

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MAX_TAG, listText, planRows, tooLong } from "../app/lib/tag-planner";

const read = (f: string) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");

describe("tag planner", () => {
  it("builds one row per ticked place", () => {
    const rows = planRows({ Flyer: true, Mailer: true }, { Flyer: "200" }, " spring-sale ");
    expect(rows.map((r) => r.place)).toEqual(["Flyer", "Mailer"]);
    expect(rows[0].copies).toBe(200);
    expect(rows[1].copies).toBeNull();
    expect(listText(rows)).toContain("spring-sale");
  });
  it("warns past 100 characters", () => {
    expect(tooLong("a".repeat(MAX_TAG))).toBe(false);
    expect(tooLong("a".repeat(MAX_TAG + 1))).toBe(true);
  });
  it("makes no network, storage or cookie call and has no address field", () => {
    const src = read("app/components/TagPlanner.tsx") + read("app/lib/tag-planner.ts");
    expect(src).not.toMatch(/fetch\(|XMLHttpRequest|localStorage|sessionStorage|document\.cookie|sendBeacon/);
    expect(src).not.toMatch(/type="(url|email)"/);
  });
});

describe("guide bodies", () => {
  it("static-vs-dynamic never says permanent about a code", () => {
    expect(read("app/content/static-vs-dynamic.tsx").toLowerCase()).not.toContain("permanent code");
  });
  it("no body keeps the placeholder", () => {
    for (const f of ["do-qr-codes-expire", "static-vs-dynamic", "changeable-code", "count-your-scans"]) {
      expect(read(`app/content/${f}.tsx`)).not.toContain("<Placeholder");
    }
  });
});

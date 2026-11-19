import { copyFileSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import { MAX_IMAGE_FILE_BYTES, loadConfigFile } from "../src/node/files";
import { root } from "./helpers";

const dir = join(root, "tests", ".tmp", "paths");
const sub = join(dir, "cfg");

function write(name: string, image: unknown, folder = sub) {
  const file = join(folder, name);
  writeFileSync(file, JSON.stringify({ type: "link", content: { url: "https://example.com" }, image }));
  return file;
}
const errors = (r: ReturnType<typeof loadConfigFile>) => (r.ok ? "" : r.errors.join(" "));

beforeAll(() => {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(join(sub, "assets"), { recursive: true });
  copyFileSync(join(root, "examples", "assets", "sample-logo.png"), join(sub, "assets", "logo.png"));
  copyFileSync(join(root, "examples", "assets", "sample-logo.png"), join(dir, "outside.png"));
});

describe("image files named in a config (command line)", () => {
  it("reads a png inside the config's own folder", () => {
    expect(loadConfigFile(write("ok.json", { mode: "logo", src: "assets/logo.png" })).ok).toBe(true);
  });

  it("refuses a path that climbs out of the folder", () => {
    expect(errors(loadConfigFile(write("up.json", { mode: "logo", src: "../outside.png" })))).toContain("inside the config file's folder");
  });

  it("refuses absolute paths", () => {
    expect(errors(loadConfigFile(write("abs.json", { mode: "logo", src: join(dir, "outside.png") })))).toContain("inside the config file's folder");
  });

  it("refuses network share and extended paths without touching them", () => {
    for (const src of ["\\\\server\\share\\logo.png", "//server/share/logo.png", "\\\\?\\C:\\logo.png"]) {
      expect(errors(loadConfigFile(write("unc.json", { mode: "logo", src })))).toContain("inside the config file's folder");
    }
  });

  it("refuses SVG logos, from a file or inline, because the renderer could follow links inside them", () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><image href="file:///etc/hosts"/></svg>').toString("base64");
    expect(errors(loadConfigFile(write("svg1.json", { mode: "logo", src: `data:image/svg+xml;base64,${svg}` })))).toContain("only supported in the web app");
    writeFileSync(join(sub, "assets", "logo.svg"), "<svg/>");
    expect(errors(loadConfigFile(write("svg2.json", { mode: "logo", src: "assets/logo.svg" })))).toContain("Unsupported image type");
  });

  it("refuses an image file over the size cap before reading it", () => {
    writeFileSync(join(sub, "assets", "huge.png"), Buffer.alloc(MAX_IMAGE_FILE_BYTES + 1));
    expect(errors(loadConfigFile(write("huge.json", { mode: "logo", src: "assets/huge.png" })))).toContain("over 10 MB");
  });

  it("says plainly when the file is missing", () => {
    expect(loadConfigFile(write("missing.json", { mode: "logo", src: "assets/nope.png" })).ok).toBe(false);
  });
});

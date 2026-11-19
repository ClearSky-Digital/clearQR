import { readFileSync } from "node:fs";
import { dirname, extname, isAbsolute, resolve } from "node:path";
import { parseConfig, type Config, type ParseResult } from "../core/schema";

const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

/** Turns an image file into a base64 data: URI. */
export function fileToDataUri(file: string): string {
  const mime = MIME[extname(file).toLowerCase()];
  if (!mime) throw new Error(`Unsupported image type: ${extname(file) || "(none)"}. Use png, jpg, webp, gif or svg.`);
  return `data:${mime};base64,${readFileSync(file).toString("base64")}`;
}

/**
 * Reads a config file. An image `src` that is a file path (relative to the
 * config file) is converted to a data: URI so the core stays free of file access.
 */
export function loadConfigFile(path: string): ParseResult {
  const abs = resolve(path);
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(abs, "utf8"));
  } catch (e) {
    return { ok: false, errors: [`config: could not read ${path}: ${(e as Error).message}`] };
  }
  const img = (raw as { image?: { src?: unknown } } | null)?.image;
  if (img && typeof img.src === "string" && !img.src.startsWith("data:")) {
    const file = isAbsolute(img.src) ? img.src : resolve(dirname(abs), img.src);
    try {
      img.src = fileToDataUri(file);
    } catch (e) {
      return { ok: false, errors: [`image.src: ${(e as Error).message}`] };
    }
  }
  return parseConfig(raw);
}

export type { Config };

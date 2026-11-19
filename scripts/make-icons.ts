// Writes the PNG icons from app/icon.svg. Run with `npm run icons` after changing the logo.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "app", "icon.svg"));
const img = await loadImage(svg);

async function png(size: number, file: string, pad = 0) {
  const c = createCanvas(size, size);
  const ctx = c.getContext("2d");
  ctx.drawImage(img, pad, pad, size - 2 * pad, size - 2 * pad);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, c.toBuffer("image/png"));
}

await png(96, join(root, "app", "icon.png"));
await png(180, join(root, "app", "apple-icon.png"));
await png(192, join(root, "public", "icon-192.png"));
await png(512, join(root, "public", "icon-512.png"));
console.log("wrote app/icon.png, app/apple-icon.png, public/icon-192.png, public/icon-512.png");

// Draws two made-up sample images for the examples: a logo and a landscape "photo".
import { createCanvas } from "@napi-rs/canvas";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "examples", "assets");
mkdirSync(out, { recursive: true });

// Logo: a blue disc with a white cloud
{
  const c = createCanvas(256, 256);
  const g = c.getContext("2d");
  g.fillStyle = "#1879A3";
  g.beginPath();
  g.arc(128, 128, 124, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#FFFFFF";
  g.beginPath();
  g.arc(100, 138, 34, 0, Math.PI * 2);
  g.arc(136, 120, 42, 0, Math.PI * 2);
  g.arc(172, 140, 30, 0, Math.PI * 2);
  g.rect(100, 138, 72, 34);
  g.fill();
  writeFileSync(join(out, "sample-logo.png"), c.toBuffer("image/png"));
}

// Landscape: light sky, pale sun, soft hills
{
  const c = createCanvas(640, 640);
  const g = c.getContext("2d");
  const sky = g.createLinearGradient(0, 0, 0, 640);
  sky.addColorStop(0, "#BFE6F8");
  sky.addColorStop(1, "#F7FBFE");
  g.fillStyle = sky;
  g.fillRect(0, 0, 640, 640);
  g.fillStyle = "#FBD9B0";
  g.beginPath();
  g.arc(470, 190, 80, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#9FD3EA";
  g.beginPath();
  g.moveTo(0, 470);
  g.quadraticCurveTo(160, 330, 320, 450);
  g.quadraticCurveTo(480, 540, 640, 400);
  g.lineTo(640, 640);
  g.lineTo(0, 640);
  g.fill();
  g.fillStyle = "#CFE9F5";
  g.beginPath();
  g.moveTo(0, 540);
  g.quadraticCurveTo(200, 450, 380, 540);
  g.quadraticCurveTo(520, 610, 640, 520);
  g.lineTo(640, 640);
  g.lineTo(0, 640);
  g.fill();
  writeFileSync(join(out, "sample-photo.png"), c.toBuffer("image/png"));
}
console.log("wrote examples/assets/sample-logo.png and sample-photo.png");

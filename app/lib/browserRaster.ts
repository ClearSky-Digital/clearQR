import type { Pixels, Rasterizer } from "@/core";

async function draw(svg: string, size: number): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("This browser cannot draw the code.");
    ctx.drawImage(img, 0, 0, size, size);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Rasterizer for the browser: the SVG is drawn on a canvas, on this device. */
export const browserRasterizer: Rasterizer = {
  async toPixels(svg, size): Promise<Pixels> {
    const canvas = await draw(svg, size);
    const d = canvas.getContext("2d")!.getImageData(0, 0, size, size);
    return { data: d.data, width: size, height: size };
  },
  async toPng(svg, size) {
    const canvas = await draw(svg, size);
    const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
    if (!blob) throw new Error("Could not make the PNG.");
    return new Uint8Array(await blob.arrayBuffer());
  },
};

/** Reads an image file, shrinks it to fit `max` pixels, and returns a data: URI. Nothing is uploaded. */
export async function fileToDataUri(file: File, max: number, kind: "png" | "jpeg"): Promise<string> {
  if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) {
    throw new Error("Use a PNG, JPEG, WebP or GIF image.");
  }
  if (file.size > 20_000_000) throw new Error("That image is over 20 MB. Try a smaller one.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  if (kind === "jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return canvas.toDataURL(kind === "png" ? "image/png" : "image/jpeg", 0.88);
}

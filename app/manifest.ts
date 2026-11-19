import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Icon paths are relative to the manifest, so they follow the app under any base path.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ClearQR",
    short_name: "ClearQR",
    description: "Free QR codes that stay on your device.",
    start_url: "./",
    scope: "./",
    display: "standalone",
    background_color: "#eaf6fc",
    theme_color: "#145f80",
    icons: [
      { src: "icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

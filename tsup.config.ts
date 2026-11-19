import { defineConfig } from "tsup";

export default defineConfig({
  entry: { cli: "src/cli.ts" },
  format: ["esm"],
  outExtension: () => ({ js: ".mjs" }),
  target: "node20",
  platform: "node",
  clean: true,
  banner: { js: "#!/usr/bin/env node" },
  // Libraries stay as installed dependencies; only our own code is bundled.
  external: ["@napi-rs/canvas", "qrcode", "@zxing/library", "zod"],
});


import { build } from "esbuild";

build({
  entryPoints: ["./src/index.js"],
  platform: "neutral",
  bundle: true,
  minify: true,
  keepNames: true,
  outdir: "./dist",
});

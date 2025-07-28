import { build } from "esbuild";

build({
  entryPoints: ["./src/index.js"],
  platform: "neutral",
  format: "esm",
  outfile: "./index.js",
  legalComments: "inline",
  bundle: true,
});

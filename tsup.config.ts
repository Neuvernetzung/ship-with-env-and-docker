import { defineConfig } from "tsup";

const isDev = process.env.npm_lifecycle_event === "dev";

export default defineConfig({
  clean: true,
  dts: true,
  entry: ["src/index.ts", "src/cli/index.ts"],
  format: ["esm"],
  // minify: !isDev,
  metafile: !isDev,
  sourcemap: true,
  platform: "node",
  treeshake: true,
  target: "esnext",
  skipNodeModulesBundle: true,
  outDir: "dist",
});

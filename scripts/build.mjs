#!/usr/bin/env node
// Bundles src/index.ts (and its entry points) into a single self-contained
// dist/index.js using esbuild, so the compiled output works even when
// installed via a plain `git clone` with no `npm install` step (e.g. the
// Claude/VS Code agent-plugins mechanism).
//
// Native modules (node-pty, @resvg/resvg-js) cannot be bundled into a
// single JS file because they ship platform-specific .node binaries, so
// they remain external and must exist in node_modules at runtime.

import { build } from "esbuild";
import { chmod } from "fs/promises";

const external = [
  // Native / platform-specific — cannot be bundled.
  "node-pty",
  "@resvg/resvg-js",
];

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  external,
  banner: {
    js: "import { createRequire as __createRequire } from 'module';\nimport { fileURLToPath as __fileURLToPath } from 'url';\nimport { dirname as __dirname_fn } from 'path';\nconst require = __createRequire(import.meta.url);\nconst __filename = __fileURLToPath(import.meta.url);\nconst __dirname = __dirname_fn(__filename);",
  },
  sourcemap: true,
  logLevel: "info",
});

await chmod("dist/index.js", 0o755);

// Bootstrap for native (platform-specific) dependencies that esbuild must
// leave external: node-pty and @resvg/resvg-js. When this package is
// installed as a Claude Code / Copilot plugin from a git marketplace source,
// no `npm install` runs in the plugin directory, so node_modules is missing
// and the bundled dist/index.js would crash with ERR_MODULE_NOT_FOUND on
// its first static import of node-pty.
//
// Pattern mirrors context-mode's hooks/ensure-deps.mjs:
//   fast path  — existsSync check (sub-millisecond)
//   slow path  — one-time `npm install <pkg> --no-package-lock --no-save`
//                (first run only, best-effort, never fatal)
//
// This module is imported FIRST in src/index.ts, before any module that
// statically imports node-pty (src/terminal/session.ts). It is also emitted
// as the first import in the esbuild bundle, so the same ordering holds in
// dist/index.js.

import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Bundle: dist/index.js → root is one level up. Source: src/utils/ → root
// is two levels up. Detect by which layout exists.
const root = existsSync(resolve(__dirname, "..", "dist"))
  ? resolve(__dirname, "..")
  : resolve(__dirname, "..", "..");

const NATIVE_DEPS = ["node-pty", "@resvg/resvg-js"];

for (const pkg of NATIVE_DEPS) {
  const resolved = (() => {
    try {
      // Resolving the package's "main" entry also fails when the native
      // binding is missing, so this doubles as an install probe.
      const req = createRequire(resolve(root, "package.json"));
      req.resolve(pkg);
      return true;
    } catch {
      return false;
    }
  })();

  if (!resolved) {
    try {
      execSync(
        `${process.platform === "win32" ? "npm.cmd" : "npm"} install ${pkg} --no-package-lock --no-save --silent --ignore-scripts`,
        { cwd: root, stdio: "ignore", timeout: 120_000 },
      );
    } catch {
      // Best-effort: surface a readable error instead of a raw
      // ERR_MODULE_NOT_FOUND stack when the install also fails.
      const message = `[terminal-mcp] Native dependency "${pkg}" is missing and automatic installation failed.
Run \`npm install ${pkg}\` in ${root} and retry.`;
      process.stderr.write(message + "\n");
      process.exit(1);
    }
  }
}

export {}; // imported for side effect only

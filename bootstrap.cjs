#!/usr/bin/env node
// Claude Code plugin bootstrap: install platform-specific runtime dependencies locally.
const { createRequire } = require("node:module");
const { spawn, spawnSync } = require("node:child_process");
const { readFileSync, existsSync, mkdirSync } = require("node:fs");
const path = require("node:path");

const root = __dirname;
const dist = path.join(root, "dist");
const entry = path.join(dist, "index.js");
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const specs = {\n  "node-pty": manifest.dependencies?.["node-pty"],\n  "@resvg/resvg-js": manifest.optionalDependencies?.["@resvg/resvg-js"]\n};
if (Object.values(specs).some((spec) => !spec) || !existsSync(entry)) {
  console.error("terminal-mcp: missing node-pty declaration or dist/index.js");
  process.exit(1);
}
const localRequire = createRequire(entry);
function ready() {
  try {
    const installed = localRequire("node-pty/package.json").version;
    const expected = spec.replace(/^[~^]/, "");
    return installed === expected && typeof localRequire("node-pty").spawn === "function";
  } catch {
    return false;
  }
}
if (!allReady()) {
  mkdirSync(dist, { recursive: true });
  console.error("terminal-mcp: installing native dependencies in dist/node_modules...");
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npm, [
    "install", "--prefix", dist, "--no-save", "--no-package-lock",
    "--omit=dev", "--no-audit", "--no-fund", "--ignore-scripts=false",
    ...Object.entries(specs).map(([name, version]) => `${name}@${version}`)
  ], { stdio: ["ignore", "ignore", "inherit"], shell: process.platform === "win32" });
  if (result.error || result.status !== 0 || !allReady()) {
    console.error("terminal-mcp: native dependency installation or validation failed", result.error || "");
    process.exit(1);
  }
}
const child = spawn(process.execPath, [entry, "--mcp", ...process.argv.slice(2)], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit"
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}
child.on("error", (error) => {
  console.error("terminal-mcp: failed to launch MCP:", error);
  process.exitCode = 1;
});
child.on("exit", (code, signal) => {
  process.exitCode = code ?? (signal ? 1 : 0);
});

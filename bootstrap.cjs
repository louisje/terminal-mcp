#!/usr/bin/env node
// Claude Code plugin bootstrap: install the native node-pty dependency locally.
const { createRequire } = require("node:module");
const { spawn, spawnSync } = require("node:child_process");
const { readFileSync, existsSync, mkdirSync } = require("node:fs");
const path = require("node:path");

const root = __dirname;
const dist = path.join(root, "dist");
const entry = path.join(dist, "index.js");
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const spec = manifest.dependencies?.["node-pty"];
if (!spec || !existsSync(entry)) {
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
if (!ready()) {
  mkdirSync(dist, { recursive: true });
  console.error("terminal-mcp: installing node-pty in dist/node_modules...");
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npm, [
    "install", "--prefix", dist, "--no-save", "--no-package-lock",
    "--omit=dev", "--no-audit", "--no-fund", "--ignore-scripts=false",
    `node-pty@${spec}`
  ], { stdio: ["ignore", "ignore", "inherit"], shell: process.platform === "win32" });
  if (result.error || result.status !== 0 || !ready()) {
    console.error("terminal-mcp: node-pty installation or native binding validation failed", result.error || "");
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

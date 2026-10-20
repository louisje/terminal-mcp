#!/usr/bin/env node
// Claude Code plugin bootstrap: install native dependencies without changing npm/bunx entrypoints.
const { createRequire } = require("node:module");
const { spawn, spawnSync } = require("node:child_process");
const { readFileSync, existsSync, mkdirSync } = require("node:fs");
const path = require("node:path");

const root = __dirname;
const dist = path.join(root, "dist");
const entry = path.join(dist, "index.js");
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
const required = manifest.dependencies?.["node-pty"];
const optional = manifest.optionalDependencies?.["@resvg/resvg-js"];

if (!required || !existsSync(entry)) {
  console.error("terminal-mcp: missing node-pty declaration or dist/index.js");
  process.exit(1);
}

const localRequire = createRequire(entry);
function ready(name, spec) {
  if (!spec) return false;
  try {
    const installed = localRequire(name + "/package.json").version;
    if (installed !== spec.replace(/^[~^]/, "")) return false;
    const loaded = localRequire(name);
    return name === "node-pty"
      ? typeof loaded.spawn === "function"
      : typeof loaded.Resvg === "function";
  } catch {
    return false;
  }
}

function install(name, spec) {
  mkdirSync(dist, { recursive: true });
  console.error(`terminal-mcp: installing ${name} in dist/node_modules...`);
  const npm = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npm, [
    "install", "--prefix", dist, "--no-save", "--no-package-lock",
    "--omit=dev", "--no-audit", "--no-fund", "--ignore-scripts=false",
    `${name}@${spec}`
  ], { stdio: ["ignore", "ignore", "inherit"], shell: process.platform === "win32" });
  return !result.error && result.status === 0 && ready(name, spec);
}

if (!ready("node-pty", required) && !install("node-pty", required)) {
  console.error("terminal-mcp: required node-pty installation or validation failed");
  process.exit(1);
}

// resvg is optional: failure must not prevent the MCP server from starting.
if (optional && !ready("@resvg/resvg-js", optional)) {
  if (!install("@resvg/resvg-js", optional)) {
    console.error("terminal-mcp: optional resvg unavailable; continuing without it");
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

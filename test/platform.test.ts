import test from "node:test";
import assert from "node:assert/strict";
import * as os from "os";
import * as path from "path";
import { getDefaultSocketPath, resolveSocketPath } from "../src/utils/platform.ts";

function restoreEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

test("getDefaultSocketPath uses TERMINAL_MCP_SOCKET when set", () => {
  const previous = process.env.TERMINAL_MCP_SOCKET;
  process.env.TERMINAL_MCP_SOCKET = "/tmp/custom-terminal-mcp.sock";

  try {
    assert.equal(getDefaultSocketPath(), "/tmp/custom-terminal-mcp.sock");
  } finally {
    restoreEnv("TERMINAL_MCP_SOCKET", previous);
  }
});

test("getDefaultSocketPath falls back to the platform default when env is unset", () => {
  const previous = process.env.TERMINAL_MCP_SOCKET;
  delete process.env.TERMINAL_MCP_SOCKET;

  try {
    const expected = process.platform === "win32"
      ? "\\\\.\\pipe\\terminal-mcp"
      : path.join(os.tmpdir(), "terminal-mcp.sock");

    assert.equal(getDefaultSocketPath(), expected);
  } finally {
    restoreEnv("TERMINAL_MCP_SOCKET", previous);
  }
});

test("resolveSocketPath gives CLI value precedence over TERMINAL_MCP_SOCKET", () => {
  const previous = process.env.TERMINAL_MCP_SOCKET;
  process.env.TERMINAL_MCP_SOCKET = "/tmp/from-env.sock";

  try {
    assert.equal(resolveSocketPath("/tmp/from-cli.sock"), "/tmp/from-cli.sock");
  } finally {
    restoreEnv("TERMINAL_MCP_SOCKET", previous);
  }
});
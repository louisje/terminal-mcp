import * as path from "path";
import * as os from "os";

/**
 * Get the default recording directory.
 * Uses XDG_STATE_HOME or falls back to ~/.local/state/terminal-mcp/recordings.
 * Can be overridden with TERMINAL_MCP_RECORD_DIR environment variable.
 */
export function getDefaultRecordDir(): string {
  // Check env var override first
  if (process.env.TERMINAL_MCP_RECORD_DIR) {
    return process.env.TERMINAL_MCP_RECORD_DIR;
  }

  // Use XDG_STATE_HOME or fallback
  const stateHome = process.env.XDG_STATE_HOME
    || path.join(os.homedir(), '.local', 'state');

  return path.join(stateHome, 'terminal-mcp', 'recordings');
}

/**
 * Get the default IPC path for cross-platform communication.
 * Uses named pipes on Windows, Unix sockets elsewhere.
 * Can be overridden with TERMINAL_MCP_SOCKET environment variable.
 */
export function getDefaultSocketPath(): string {
  if (process.env.TERMINAL_MCP_SOCKET) {
    return process.env.TERMINAL_MCP_SOCKET;
  }

  if (process.platform === "win32") {
    return "\\\\.\\pipe\\terminal-mcp";
  }
  return path.join(os.tmpdir(), "terminal-mcp.sock");
}

/**
 * Resolve the IPC path, allowing a CLI-provided path to override env/defaults.
 */
export function resolveSocketPath(socketPath?: string): string {
  return socketPath || getDefaultSocketPath();
}

/**
 * Get the default shell for the current platform.
 */
export function getDefaultShell(): string {
  if (process.platform === "win32") {
    return process.env.COMSPEC || "cmd.exe";
  }
  return process.env.SHELL || "/bin/bash";
}

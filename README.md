<p align="center">
  <img src="logo.png" alt="Terminal MCP" width="600">
</p>

<p align="center">
  <strong>Let AI see and interact with your terminal.</strong>
</p>

<p align="center">
  Terminal MCP gives LLMs a shared view of your terminal session. Perfect for debugging CLIs and TUI applications in real-time, or letting AI drive terminal-based tools autonomously.
</p>

## Install

```bash
npm install -g @ellery/terminal-mcp
```

Or via install script:

```bash
curl -fsSL https://raw.githubusercontent.com/elleryfamilia/terminal-mcp/main/install.sh | bash
```

### Configure your AI tools

Wire `terminal-mcp` into the MCP config of every AI tool installed on your machine in one shot:

```bash
terminal-mcp setup                      # detect & install for all detected tools
terminal-mcp setup --dry-run            # preview without writing
terminal-mcp setup --client claude-code,gemini   # specific tools only
terminal-mcp setup --uninstall          # remove the entry from each tool
```

Supported clients (each gets the right schema for its config format):

| Client | Config file | Format |
|---|---|---|
| OpenAI Codex CLI | `~/.codex/config.toml` | TOML |
| GitHub Copilot CLI | `~/.copilot/mcp-config.json` | JSON |
| Gemini CLI | `~/.gemini/settings.json` | JSON |
| OpenCode | `~/.config/opencode/opencode.json` | JSON |
| Claude Code | `~/.claude/settings.json` | JSON |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) / `%APPDATA%\Claude\claude_desktop_config.json` (Windows) | JSON |

A `.bak` of any pre-existing config is written next to the original on first install. The `terminal-mcp` entry is added without disturbing other servers or unrelated keys; running `setup` again is a no-op.

### Upgrading

```bash
npm install -g @ellery/terminal-mcp@latest
```

Interactive mode will print a banner on next launch when a newer release is available — `terminal-mcp` checks the npm registry once per day and caches the result. Headless and MCP-client modes never check or print anything (so MCP stdio stays clean). To opt out entirely, set `NO_UPDATE_NOTIFIER=1` or pass `--no-update-notifier`.

## Features

- **Full Terminal Emulation**: Uses xterm.js headless for accurate VT100/ANSI emulation
- **Cross-Platform PTY**: Native pseudo-terminal support via node-pty (macOS, Linux, Windows)
- **MCP Protocol**: Implements Model Context Protocol for AI assistant integration
- **Session Recording**: Record terminal sessions to asciicast format for playback with asciinema
- **Simple API**: Intuitive tools covering input, observation, recording, and session lifecycle
- **Headless Mode**: Run as a standalone MCP server without a TTY — ideal for CI, containers, and non-interactive environments
- **Multi-Session**: Run multiple isolated terminal sessions in one process, addressed by `sessionId`
- **Sandbox Mode**: Optional security restrictions for filesystem and network access

## Building from Source

```bash
npm install
npm run build
```

## Usage

Terminal MCP can run in two modes:

1. **MCP Mode (Recommended)**: Direct MCP protocol communication via stdio. Use the `--mcp` flag for standard MCP server behavior.
   - Automatically detects and connects to existing interactive sessions if available
   - Falls back to creating a new virtual terminal (PTY) if no session exists
   
2. **Interactive Mode**: Dual-mode architecture where you run an interactive terminal session and MCP clients connect via Unix socket. See [Architecture Documentation](./docs/architecture.md) for details.

For most MCP integrations, use **MCP mode** with the `--mcp` flag.

### MCP Configuration

Add to your MCP client settings:

```json
{
  "mcpServers": {
    "terminal": {
      "command": "terminal-mcp",
      "args": ["--mcp", "--title", "Augment"]
    }
  }
}
```

Or use directly from GitHub (no installation required):

```json
{
  "mcpServers": {
    "terminal": {
      "command": "npx",
      "args": ["--yes", "github:louisje/terminal-mcp", "--mcp"]
    }
  }
}
```

With custom options:

```json
{
  "mcpServers": {
    "terminal": {
      "command": "terminal-mcp",
      "args": ["--mcp", "--cols", "100", "--rows", "30", "--shell", "/bin/zsh"]
    }
  }
}
```

### Command-Line Options

```
terminal-mcp [OPTIONS]

Options:
  --mcp                  Use MCP mode (connects to existing session or creates new PTY)
  --title <label>        Set the interactive terminal title when connecting as a client
  --cols <number>        Terminal width in columns (default: 120)
  --rows <number>        Terminal height in rows (default: 40)
  --shell <path>         Shell to use (default: $SHELL or bash)
  --socket <path>        IPC socket/pipe path for MCP
  --headless             Run in headless mode (embedded PTY + MCP over stdio, no TTY needed)
  --sandbox              Enable sandbox mode (restricts filesystem/network)
  --sandbox-config <path> Load sandbox config from JSON file
  --version, -v          Show version number
  --help, -h             Show help message

Recording Options:
  --record [mode]     Enable recording (default mode: always)
                      Modes: always, on-failure, off
  --record-dir <dir>  Recording output directory
                      (default: ~/.local/state/terminal-mcp/recordings)
  --idle-time-limit <sec>   Max idle time between events (default: 2s)
  --max-duration <sec>      Max recording duration (default: 3600s)
  --inactivity-timeout <sec>  Stop after no output (default: 600s)

Multi-Session Options:
  --max-sessions <n>           Max concurrent sessions (default: 5)
  --session-idle-timeout <sec> Idle non-default sessions are auto-destroyed
                               after this period (default: 600s)
```

Environment variables:

- `TERMINAL_MCP_SOCKET`: default socket/pipe path, overridden by `--socket`
- `TERMINAL_MCP_RECORD_DIR`: default recording output directory, overridden by `--record-dir`

## Headless Mode

By default, Terminal MCP uses a **dual-process architecture**: you run `terminal-mcp` in an interactive terminal (which creates a Unix socket), then your MCP client spawns a second instance that connects to that socket. This requires a TTY.

**Headless mode** (`--headless`) eliminates this requirement by spawning an embedded PTY internally and serving MCP directly over stdio in a single process. No interactive terminal session, no socket — just a self-contained MCP server with a built-in terminal.

### When to use headless mode

- **CI/CD pipelines** — no TTY available
- **Docker containers** — no interactive shell to run alongside
- **Remote/cloud environments** — MCP servers spawned by automation
- **Simplified setup** — single process, no socket coordination needed

### Configuration

```json
{
  "mcpServers": {
    "terminal": {
      "command": "terminal-mcp",
      "args": ["--headless", "--cols", "120", "--rows", "40"]
    }
  }
}
```

### How it works

```
MCP Client (Claude Code, etc.)
    │ STDIO (JSON-RPC)
    ▼
terminal-mcp --headless
    ├── MCP Server (stdio transport)
    ├── Terminal Emulator (@xterm/headless)
    └── Embedded PTY (node-pty)
            │
            ▼
        Shell Process (bash, zsh, etc.)
```

In headless mode, the terminal session is initialized eagerly at startup, so all tools (`type`, `sendKey`, `getContent`, `takeScreenshot`, `startRecording`, `stopRecording`, `createSession`, `listSessions`, `destroySession`) are available immediately.

## MCP Tools

All input/output tools (`type`, `sendKey`, `getContent`, `takeScreenshot`) accept an optional `sessionId` argument. Omit it to target the default session; pass the ID returned by `createSession` to drive a specific session.

### `type`
Send text input to the terminal.

**⭐ RECOMMENDED: Use `autoSubmit` for efficient command execution**

```json
{
  "name": "type",
  "arguments": {
    "text": "uptime",
    "autoSubmit": true
  }
}
```

With `autoSubmit: true`, the command is executed automatically and returns the output - no need to call `sendKey('Enter')`, `sleep()`, or `getContent()` separately.

**Alternative (manual control):**
```json
{
  "name": "type",
  "arguments": {
    "text": "echo hello"
  }
}
```

Without `autoSubmit`, text is typed but not executed - you need to call `sendKey('Enter')` separately.

### `sendKey`
Send special keys or key combinations.

```json
{
  "name": "sendKey",
  "arguments": {
    "key": "Enter"
  }
}
```

Supported keys:
- Basic: `Enter`, `Tab`, `Escape`, `Backspace`, `Delete`
- Arrow: `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`
- Navigation: `Home`, `End`, `PageUp`, `PageDown`, `Insert`
- Function: `F1` through `F12`
- Control: `Ctrl+A` through `Ctrl+Z`, `Ctrl+C`, `Ctrl+D`, etc.

### `sleep`
Pause execution for an extended duration.

**⚠️ WARNING: BLOCKING operation - use ONLY for long-running processes! Avoid frequent calls.**

```json
{
  "name": "sleep",
  "arguments": {
    "milliseconds": 5000
  }
}
```

- `milliseconds`: Wait duration in milliseconds (defaults to `5000` = 5 seconds)

**When to use:**
- Long-running builds, downloads, or installations that genuinely take time
- Waiting for slow background processes
- Operations where timing is critical

**When NOT to use:**
- After `type()` with `autoSubmit=true` (already includes a brief wait)
- For fast commands like `ls`, `pwd`, `cd`, `uptime`, etc.
- As a workaround - if you need `sleep()` frequently, something is wrong

### `getContent`
Get the terminal buffer as plain text. Optionally delay before reading to avoid separate sleep() call.

```json
{
  "name": "getContent",
  "arguments": {
    "visibleOnly": true,
    "delay": 0
  }
}
```

Read the latest 50 lines from scrollback:

```json
{
  "name": "getContent",
  "arguments": {
    "visibleOnly": false,
    "maxLines": 50
  }
}
```

- `visibleOnly` (default: `true`): return only the visible viewport
- `visibleOnly: false`: read from scrollback history; returns the last `100` lines by default
- `maxLines`: only applies when `visibleOnly: false`; set `0` to return the full scrollback buffer
- `delay`: wait briefly before reading output, avoiding a separate `sleep()` call

### `getBufferInfo`
Get lightweight metadata about the current terminal buffer.

```json
{
  "name": "getBufferInfo",
  "arguments": {}
}
```

Returns a JSON object with:
- `length`: total active buffer lines (scrollback + viewport)
- `scrollbackLines`: lines above the current viewport
- `viewportRows`: current terminal viewport height in rows

### `takeScreenshot`
Capture the terminal state. Supports three output formats:

| Format | Description |
|--------|-------------|
| `text` (default) | JSON with plain text content, cursor position, and dimensions |
| `ansi` | JSON with ANSI color escape codes preserved in the content field |
| `png` | Color screenshot as a PNG image (requires `@resvg/resvg-js`) |

```json
{
  "name": "takeScreenshot",
  "arguments": { "format": "text" }
}
```

The `ansi` format reconstructs SGR escape sequences from the terminal's cell buffer, preserving 16-color, 256-color, and 24-bit truecolor attributes along with bold, dim, italic, and underline styles.

The `png` format returns an MCP `image` content block with base64-encoded PNG data, rendered with the One Dark color theme and macOS-style window chrome.

### `startRecording`
Start recording terminal output to an asciicast v2 file.

```json
{
  "name": "startRecording",
  "arguments": {
    "mode": "always",
    "idleTimeLimit": 2,
    "maxDuration": 3600
  }
}
```

Options:
- `mode`: `always` (save all) or `on-failure` (save only on non-zero exit)
- `outputDir`: Custom output directory
- `idleTimeLimit`: Max seconds between events (caps pauses in playback)
- `maxDuration`: Auto-stop after N seconds
- `inactivityTimeout`: Auto-stop after N seconds of no output

### `stopRecording`
Stop a recording and finalize the asciicast file.

```json
{
  "name": "stopRecording",
  "arguments": {
    "recordingId": "abc123"
  }
}
```

### `createSession`
Create a new terminal session and return its metadata. Use the returned `sessionId` to target this session in subsequent tool calls.

```json
{
  "name": "createSession",
  "arguments": {
    "shell": "/bin/zsh",
    "cols": 100,
    "rows": 30
  }
}
```

All arguments are optional. Returns:

```json
{
  "sessionId": "3029d",
  "shell": "/bin/zsh",
  "cols": 100,
  "rows": 30,
  "createdAt": "2026-04-25T12:58:01.072Z",
  "lastActivityAt": "2026-04-25T12:58:01.072Z",
  "isDefault": false
}
```

### `listSessions`
List all active sessions including the default. Reports configured limits.

```json
{ "name": "listSessions", "arguments": {} }
```

### `destroySession`
Destroy a session by ID. The default session cannot be destroyed.

```json
{
  "name": "destroySession",
  "arguments": { "sessionId": "3029d" }
}
```

## Multi-Session

By default, every tool call without a `sessionId` targets a single auto-created **default session** — the same behavior the project has always had. Pass `sessionId` to drive multiple isolated PTYs from one process.

- The default session is created on first use and cannot be destroyed.
- Additional sessions are created by `createSession` and tracked until they're destroyed or idle-evicted (`--session-idle-timeout`, default 600s).
- Concurrent sessions are capped at `--max-sessions` (default 5).
- An active recording captures output from all sessions in the process.

Typical use case: an AI agent driving a long-running build in one session while running diagnostics in another, without command interleaving.

## Best Practices

### ✅ Efficient Command Execution

**Use `autoSubmit` for one-step command execution:**
```typescript
// Good: One call, instant result
type({ text: "ls -la", autoSubmit: true })

// Avoid: Multiple calls for simple commands
  type({ text: "ls -la" })
  sendKey({ key: "Enter" })
  sleep({ milliseconds: 2000 })  // Unnecessary!
getContent()
```

### ⚡ Minimize Sleep Time

**Most commands complete instantly - don't sleep unnecessarily:**
```typescript
// Good: No wait needed
type({ text: "pwd", autoSubmit: true })
type({ text: "cd /tmp", autoSubmit: true })
type({ text: "uptime", autoSubmit: true })

  // Bad: Wasting 6 seconds for fast commands
  type({ text: "pwd", autoSubmit: true })
  sleep({ milliseconds: 2000 })  // Why sleep?
  type({ text: "cd /tmp", autoSubmit: true })
  sleep({ milliseconds: 2000 })  // Unnecessary!
  type({ text: "uptime", autoSubmit: true })
  sleep({ milliseconds: 2000 })  // Don't do this!
```

**Only use `sleep()` when truly needed:**
```typescript
  // Good: Sleep for long-running process
  type({ text: "npm install", autoSubmit: true })
  sleep({ milliseconds: 30000 })  // Justified - installation takes time
  
  // Good: Sleep for build process
  type({ text: "npm run build", autoSubmit: true })
  sleep({ milliseconds: 10000 })  // Justified - build takes time
```

### 🎯 When to Use Each Tool

| Scenario | Recommended Approach | Avoid |
|----------|---------------------|-------|
| Execute simple command | `type(cmd, autoSubmit=true)` | Adding `sleep()` after |
| Check directory | `type('pwd', autoSubmit=true)` | Manual Enter + sleep |
| List files | `type('ls', autoSubmit=true)` | sleep() unnecessarily |
| Run build/install | `type(cmd, autoSubmit=true)` then `sleep(N)` | Short sleep times |
| Interactive input | `type(text)` then `sendKey('Enter')` | autoSubmit for prompts |

## Sandbox Mode

Run the terminal with restricted filesystem and network access:

```bash
# Interactive permission configuration
terminal-mcp --sandbox

# With a config file
terminal-mcp --sandbox --sandbox-config ~/.terminal-mcp-sandbox.json
```

The interactive mode shows a TUI dialog to configure permissions:

<p align="center">
  <img src="sandbox-permissions.png" alt="Sandbox Permissions Dialog" width="400">
</p>
- **Read/Write**: Full access (current directory, /tmp, caches)
- **Read-Only**: Can read but not modify (home directory)
- **Blocked**: No access (SSH keys, cloud credentials, auth tokens)

Example config file:

```json
{
  "filesystem": {
    "readWrite": [".", "/tmp", "~/.cache"],
    "readOnly": ["~"],
    "blocked": ["~/.ssh", "~/.aws", "~/.gnupg"]
  },
  "network": {
    "mode": "all"
  }
}
```

Platform support:
- **macOS**: Full support via sandbox-exec (Seatbelt)
- **Linux**: Full support via bubblewrap (requires `bwrap` installed)
- **Windows**: Graceful fallback (runs without sandbox)

See [Sandbox Documentation](./docs/sandbox.md) for detailed configuration options.

## Recording

Terminal MCP can record sessions to [asciicast v2](https://docs.asciinema.org/manual/asciicast/v2/) format, compatible with [asciinema](https://asciinema.org/) for playback.

### Quick Start

```bash
# Start with recording enabled
terminal-mcp --record

# Run your commands, then exit
exit

# Output shows the saved file path:
# Recordings saved:
#   ~/.local/state/terminal-mcp/recordings/20240115_143022.cast
#
# Play with: asciinema play <file>
```

### Playback

Install asciinema to play back recordings:

```bash
# macOS
brew install asciinema

# Linux/pip
pip install asciinema

# Play a recording
asciinema play ~/.local/state/terminal-mcp/recordings/20240115_143022.cast

# Play at 2x speed
asciinema play -s 2 recording.cast
```

### Recording Modes

- **`always`** (default): Save every recording
- **`on-failure`**: Only save if the session exits with a non-zero code (useful for debugging failed CI runs)

```bash
# Only save recordings when something fails
terminal-mcp --record=on-failure
```

### MCP Tool Recording

AI assistants can also control recording programmatically via MCP tools:

1. Call `startRecording` to begin capturing
2. Perform terminal operations
3. Call `stopRecording` to finalize and save

This enables AI-driven workflows like "record this debugging session" or "capture this demo".

## Architecture

Terminal MCP has three operating modes:

| Mode | Flag | Stdin | Description |
|------|------|-------|-------------|
| **Interactive** | *(default)* | TTY | User gets a shell; AI connects via Unix socket |
| **Client** | *(default)* | non-TTY | Connects to an interactive session's socket, serves MCP over stdio |
| **Headless** | `--headless` | any | Self-contained: embedded PTY + MCP server over stdio |

### Headless mode (recommended for MCP configs)

```
MCP Client (Claude Code, etc.)
    │ STDIO (JSON-RPC)
    ▼
terminal-mcp --headless
    ├── MCP SDK (@modelcontextprotocol/sdk)
    ├── Terminal Emulator (@xterm/headless)
    └── Embedded PTY (node-pty)
            │
            ▼
        Shell Process (bash, zsh, etc.)
```

### Interactive + Client mode (two-process)

```
terminal-mcp (interactive, in your terminal)
    ├── User shell (stdin/stdout)
    └── Unix socket server (/tmp/terminal-mcp.sock)
            ▲
            │ JSON-RPC over socket
            ▼
terminal-mcp (client, spawned by MCP client)
    └── MCP server (stdio transport)
```

## Example Session

```bash
# Type a command
{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"type","arguments":{"text":"ls -la"}}}

# Send Enter key
{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"sendKey","arguments":{"key":"Enter"}}}

# Get the output
{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"getContent","arguments":{}}}
```

## Development

```bash
npm run build    # Compile TypeScript
npm run dev      # Run with tsx (development)
```

## Documentation

See the [docs](./docs/) folder for detailed documentation:

- [Overview](./docs/index.md)
- [Installation](./docs/installation.md)
- [Tools Reference](./docs/tools.md)
- [Recording](./docs/recording.md)
- [Configuration](./docs/configuration.md)
- [Sandbox Mode](./docs/sandbox.md)
- [Examples](./docs/examples.md)
- [Architecture](./docs/architecture.md)

## Requirements

- Node.js 18.0.0 or later
- Windows 10 version 1809 or later (for ConPTY support)

## License

MIT

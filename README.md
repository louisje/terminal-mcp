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

## Features

- **Full Terminal Emulation**: Uses xterm.js headless for accurate VT100/ANSI emulation
- **Cross-Platform PTY**: Native pseudo-terminal support via node-pty (macOS, Linux, Windows)
- **MCP Protocol**: Implements Model Context Protocol for AI assistant integration
- **Session Recording**: Record terminal sessions to asciicast format for playback with asciinema
- **Simple API**: Six intuitive tools for complete terminal control
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
      "args": ["--mcp"]
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
  --cols <number>        Terminal width in columns (default: 120)
  --rows <number>        Terminal height in rows (default: 40)
  --shell <path>         Shell to use (default: $SHELL or bash)
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
```

## MCP Tools

### `type`
Send text input to the terminal.

```json
{
  "name": "type",
  "arguments": {
    "text": "echo hello"
  }
}
```

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

### `getContent`
Get the terminal buffer as plain text.

```json
{
  "name": "getContent",
  "arguments": {
    "visibleOnly": false
  }
}
```

### `takeScreenshot`
Capture the terminal state with cursor position and dimensions.

```json
{
  "name": "takeScreenshot",
  "arguments": {}
}
```

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

```
MCP Client (Claude Code, etc.)
    │ STDIO (JSON-RPC)
    ▼
Terminal MCP Server (Node.js)
    ├── MCP SDK (@modelcontextprotocol/sdk)
    ├── Terminal Emulator (@xterm/headless)
    └── PTY Manager (node-pty)
            │
            ▼
        Shell Process (bash, zsh, etc.)
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

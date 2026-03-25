# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm install        # Install dependencies (includes native node-pty compilation)
npm run build      # Compile TypeScript to dist/
npm run dev        # Run directly with tsx (no build needed)
npm test           # Run tests (node --test with tsx)
npm run lint       # Run ESLint
npm run lint:fix   # Run ESLint with auto-fix
```

## Architecture Overview

Terminal MCP is a headless terminal emulator exposed via Model Context Protocol (MCP). It has two operating modes:

### Dual-Mode Architecture

1. **Interactive Mode** (stdin is TTY): User runs `terminal-mcp` in their terminal
   - Spawns a PTY shell process, pipes I/O to user's terminal
   - Exposes a Unix socket (Unix: `/tmp/terminal-mcp.sock`, Windows: `\\.\pipe\terminal-mcp`) for AI tool access
   - `src/index.ts` → `startInteractiveMode()` → creates `TerminalManager` + `createToolProxyServer()`
   - Supports optional `--sandbox` mode and `--record` mode

2. **MCP Client Mode** (stdin is not TTY): Claude Code spawns `terminal-mcp` as MCP server
   - Connects to the Unix socket from interactive mode
   - Serves MCP protocol over stdio to Claude Code
   - `src/client.ts` → `startMcpClientMode()` → proxies tool calls to socket

3. **Direct MCP Mode** (`--mcp` flag): Standalone MCP server without socket proxy
   - Tries to connect to existing interactive session first; if none, creates its own PTY
   - `src/index.ts` → `startServer()` (via `src/server.ts`) → standard MCP over stdio

### Key Components

**Terminal Layer** (`src/terminal/`):
- `session.ts`: Core integration of `node-pty` (PTY process) + `@xterm/headless` (terminal emulation). Handles shell-specific prompt customization via temp rc files.
- `manager.ts`: Singleton wrapper managing session lifecycle, recording, and sandbox integration

**Tool Layer** (`src/tools/`):
- Each tool has: Zod schema, tool definition object, handler function
- Pattern: `export const fooTool = {...}` + `export function handleFoo(manager, args)`
- Tools: `type`, `sendKey`, `sleep`, `getContent`, `getBufferInfo`, `takeScreenshot`, `startRecording`, `stopRecording`
- `definitions.ts`: Shared tool schema definitions; `descriptions.ts`: Tool description strings

**Transport Layer** (`src/transport/`):
- `socket.ts`: Unix socket (or Windows named pipe) server for tool proxying between modes. Also has `SocketTransport` class implementing MCP's Transport interface.

**Server Layer** (`src/server.ts`):
- Factory functions for creating and connecting MCP servers: `createServer()`, `createServerWithManager()`, `connectServer()`, `startServer()`
- Used by direct MCP mode (`--mcp` flag)

**Recording Layer** (`src/recording/`):
- `recorder.ts`: Writes asciicast v2 format files frame-by-frame
- `manager.ts`: Manages recording lifecycle (start, stop, on-failure filtering)
- `types.ts`: Shared types (`RecordingMode`, `AsciicastEvent`, etc.)

**Sandbox Layer** (`src/sandbox/`):
- `controller.ts`: Platform detection and sandbox enforcement via OS-level sandboxing (macOS `sandbox-exec`, Linux `bwrap`)
- `config.ts`: Permission schema and config file loading (`SandboxPermissions`)
- `prompt.ts`: Interactive TUI permission prompt for sandbox setup

**Prompts Layer** (`src/prompts/`):
- `index.ts`: Registers MCP prompts (e.g., `tool-usage` guide)

**UI Layer** (`src/ui/`):
- `index.ts`: Generates the startup banner displayed in interactive mode

**Utils** (`src/utils/`):
- `keys.ts`: ANSI escape code key sequences
- `platform.ts`: Cross-platform helpers (`getDefaultSocketPath()`, `getDefaultShell()`, `getDefaultRecordDir()`)
- `title.ts`: Terminal title setting helpers
- `version.ts`: Version string export
- `stats.ts`: Buffer/session statistics helpers

### Data Flow

```
Interactive Mode:                    MCP Client Mode:
User Terminal                        Claude Code
    ↕ (raw PTY I/O)                     ↕ (MCP JSON-RPC over stdio)
TerminalSession                      MCP Server (client.ts)
    ↕                                   ↕ (custom JSON-RPC over socket)
Tool Proxy Server ←───────────────→ Socket Client
```

## Code Conventions

- ES Modules with `.js` extensions in imports (NodeNext module resolution)
- Zod for runtime validation of tool arguments
- Tools return `{ content: [{ type: "text", text: string }], isError?: boolean }`
- Key sequences are in `src/utils/keys.ts` (ANSI escape codes)
- Recording format is asciicast v2 (compatible with `asciinema play`)
- Socket path is resolved via `resolveSocketPath()` in `src/utils/platform.ts`; can be overridden with `TERMINAL_MCP_SOCKET` env var
- Recording output directory defaults to `~/.local/state/terminal-mcp/recordings`; can be overridden with `TERMINAL_MCP_RECORD_DIR` env var

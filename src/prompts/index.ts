import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const TOOL_USAGE_PROMPT = `# Terminal MCP Tool Usage Guide

## Overview
This MCP server provides tools to interact with a terminal emulator. Use these tools to execute commands and read output.

The terminal session is automatically initialized when the server starts - you can immediately start using tools.

## Tools

### type
Send text input to the terminal. Text is written exactly as provided - no Enter key is sent automatically.

To execute a command, use type() followed by sendKey('Enter').

**Example workflow:**
1. type('ls -la') - types the command
2. sendKey('Enter') - executes it
3. getContent() - reads the output

### sendKey
Send a special key or key combination to the terminal.

**Common keys:** Enter, Tab, Escape, Backspace, Delete, ArrowUp, ArrowDown, ArrowLeft, ArrowRight

**Navigation:** Home, End, PageUp, PageDown

**Control sequences:**
- Ctrl+C - interrupt current process
- Ctrl+D - EOF/exit
- Ctrl+Z - suspend process
- Ctrl+L - clear screen
- Ctrl+A - move to start of line
- Ctrl+E - move to end of line

**Function keys:** F1-F12

### getContent
Get terminal content as plain text. Use after sending commands to see output.

Returns full scrollback buffer by default (up to 1000 lines). Set visibleOnly=true for just the current viewport (useful when output is very long).

Prefer this over takeScreenshot when you only need text content.

### takeScreenshot
Capture terminal state as structured JSON with:
- content: visible text
- cursor: {x, y} position
- dimensions: {cols, rows}

Use when you need cursor position (e.g., for interactive apps, editors) or terminal dimensions. For simple command output, prefer getContent().

### startRecording
Start recording terminal output to an asciicast v2 file for playback with asciinema.

**Returns:** Recording ID and file path

**Example:**
- Start recording: startRecording({mode: 'always'})
- Perform terminal operations
- Stop recording: stopRecording({recordingId: '...'})

### stopRecording
Stop a recording and finalize the asciicast file.

**Arguments:** recordingId (returned from startRecording)

**Returns:** Metadata about the saved recording including file path and duration
`;

const prompts = [
  {
    name: "tool-usage",
    description: "Instructions for effectively using terminal-mcp tools",
  },
];

export function registerPrompts(server: Server): void {
  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts,
  }));

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name } = request.params;

    if (name === "tool-usage") {
      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: TOOL_USAGE_PROMPT,
            },
          },
        ],
      };
    }

    throw new Error(`Unknown prompt: ${name}`);
  });
}

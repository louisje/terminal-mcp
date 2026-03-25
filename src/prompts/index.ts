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

**IMPORTANT - Truncation warning:** With no arguments, only the visible viewport (~40 lines) is returned. Command output beyond that is silently lost.

**Rule of thumb:**
- After running any command: use maxLines: 100 or visibleOnly: false to read scrollback
- Checking interactive UI state (prompts, editors, menus): no arguments needed

**Shorthand:** Specifying maxLines alone implies visibleOnly: false. No need to set both.
If visibleOnly: true is explicitly set, maxLines is ignored.

Set delay (milliseconds) to wait before reading - avoids a separate sleep() call.

**Examples:**
- getContent() - viewport only (~40 lines), for checking prompts/UI
- getContent({maxLines: 100}) - last 100 lines from scrollback
- getContent({maxLines: 0}) - full buffer
- getContent({visibleOnly: true, maxLines: 200}) - viewport only (visibleOnly wins)

### getBufferInfo
Get lightweight metadata about the terminal buffer as structured JSON.

Returns:
- length: total active buffer lines
- scrollbackLines: lines above the current viewport
- viewportRows: current terminal height in rows

Use this when you need to know how much history is available without reading the buffer text.

**Example with delay:**
1. type('npm install')
2. sendKey('Enter')
3. getContent({visibleOnly: false, delay: 5000}) - waits 5 seconds, then reads scrollback output

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

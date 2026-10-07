---
name: terminal-mcp
description: |
  Use terminal-mcp instead of Bash when the user's real shell matters: its cwd,
  exported environment (including PATH), aliases, and tmux state persist, while
  built-in Bash runs a fresh subprocess. Also prefer it for interactive input,
  observable or risky commands, TUI/TTY programs, or when Bash is unavailable.
---

# Terminal MCP: When to Use the User's Real Shell Instead of Bash

## Default rule

When Pi operators are enabled, use `read`, `write`, and `edit` for direct text-file
operations and `bash` for ordinary one-shot, non-interactive commands. These avoid
unnecessary PTY interaction and return their result directly.

Use the PTY/session tools when the user's real shell matters. The five reasons below
are the main cases for switching from the stateless operators to the persistent PTY.
If Pi operators are not exposed by the MCP server, use the agent's own ordinary Bash
facility where available and apply the same decision rule.

## The five reasons to switch

### 1. Environment continuity

terminal-mcp's PTY tools drive the same session the user has been working in — their
current directory, exported environment variables, shell aliases, and tmux state
all persist across calls. The Pi `bash` operator is a fresh, stateless `/bin/sh`
subprocess every time, as are typical agent-provided Bash tools. If the user just `cd`'d or `export`'d something in their own
terminal and expects the next command to pick that up, switch to terminal-mcp even
if nothing is technically broken — staying consistent with the user's actual working
state is itself the reason.

### 2. Interactive / credential situations

Whenever a command needs a sudo password, an SSH/login prompt, or any mid-execution
human input (`npm login`, `gh pr create`, `git push` over HTTPS asking for
credentials), proactively switch to terminal-mcp so the **human types the secret
directly into their own terminal**. Never ask the user to paste a password into
chat, and never try to work around or suppress the prompt.

### 3. Observability / transparency to the user

terminal-mcp is a terminal the user can literally watch, live. For any sequence of
commands where visibility or trust matters — risky changes, destructive operations,
or anything the user should be able to see happening in real time rather than only
read about afterward in a summary — that's a reason to prefer it, independent of
whether the command technically requires a TTY.

### 4. TUI / TTY requirements

Programs that need a real terminal: `vim`, `less`, `htop`, `kubectl edit`, color
output, progress bars, `fzf`, `watch`, or anything that needs to be observed while
still running. This category is already covered in full detail by the MCP server's
own `instructions` field (delivered to every MCP client on connect) — see
`src/server.ts`'s `SERVER_INSTRUCTIONS` in this repo for the exact, up-to-date list.
Deliberately not re-copied here so this file doesn't drift out of sync with it.

### 5. Built-in Bash is unavailable

When the agent's built-in Bash tool is unavailable, disabled, or cannot execute the
required command, use terminal-mcp as the fallback terminal instead of stopping solely
because Bash cannot be used.

## Pi operators

When `--pi-operators` is enabled, four additional tools are exposed:

- `read`: read text files directly; `offset` is a 1-indexed line number.
- `write`: overwrite a text file and create missing parent directories.
- `edit`: exact, unique, non-overlapping string replacement against the original
  file. It is not an append/prepend primitive; include surrounding text when needed
  to anchor insertion at the beginning or end.
- `bash`: run one independent, non-interactive `/bin/sh` subprocess from
  terminal-mcp's startup working directory. It waits for completion and returns
  stdout/stderr directly, with an optional timeout. It does not inherit PTY cwd,
  exports, aliases, or other state changed during the terminal session.

Prefer these operators for routine file work and one-shot commands. Do not use the
PTY `type` → `getContent` loop merely to emulate what an operator can do directly.

## PTY tool workflow

First call `getContent()` without `sessionId` to check whether the default terminal
is already in use. Reuse it only when clearly idle and available. If someone is
using it, a command/TUI is running, or availability is unclear, call
`createSession()` and pass the returned `sessionId` to subsequent terminal calls.
Do not send input or interrupt work in an occupied terminal.

Basic loop in the chosen session: `type(<command>)` → `sendKey('Enter')` → `getContent()` to read the
result. For TUI programs, use `sendKey` for navigation and `takeScreenshot` to
inspect cursor position and on-screen state.

Multi-session: omit `sessionId` to drive the default session, or call
`createSession` for an isolated PTY to run parallel work (e.g. a build in one
session, diagnostics in another). The default session cannot be destroyed.

Default PTY/tool list: `type`, `sendKey`, `sleep`, `getContent`, `getBufferInfo`,
`takeScreenshot`, `startRecording`, `stopRecording`, `createSession`,
`listSessions`, `destroySession`, `resize`, `getClipboard`, `setClipboard`,
`notify` (OS-level desktop notification — useful to alert the user when a
long-running command finishes while they're not watching). With `--pi-operators`,
`read`, `write`, `edit`, and `bash` are additionally available.

## Anti-patterns

- Don't ask the user to paste a sudo/SSH password into chat — switch to
  terminal-mcp so they type it themselves.
- Don't drive the PTY for routine, invisible one-off commands where none of the five
  reasons above apply — use the Pi `bash` operator when available (or the agent's
  ordinary Bash facility otherwise).
- Don't silently keep using Bash after the user has visibly changed their own shell
  state (cd, export, activating a venv) mid-session — that's the continuity case.

/**
 * Shared tool descriptions to avoid duplication
 */

export const TOOL_DESCRIPTIONS = {
  type: {
    main: "Send text input to the terminal. Use autoSubmit=true to execute commands in one call (recommended). Alternative: type text without autoSubmit, then use sendKey('Enter') for manual control. IMPORTANT: In zsh, avoid '!' inside double quotes - use single quotes instead (e.g., echo 'Hello!' not echo \"Hello!\").",
    text: "The text to type into the terminal",
    autoSubmit: "If true, automatically send Enter and return terminal content. Recommended for most commands.",
  },
  sendKey: {
    main: "Send a special key to the terminal (e.g., enter, tab, ctrl+c)",
    key: "The key to send (e.g., enter, tab, escape, up, down, left, right, ctrl+c, ctrl+d)",
  },
  wait: {
    main: "Pause for a specified duration. Use sparingly - only for long-running processes, background tasks, or interactive prompts. Not needed after autoSubmit or for fast commands.",
    milliseconds: "Number of milliseconds to wait before returning (default: 5000 = 5 seconds)",
  },
  getContent: {
    main: "Get the current content of the terminal buffer",
    visibleOnly: "If true, only return visible content (default: false)",
  },
  takeScreenshot: {
    main: "Take a screenshot of the terminal showing current screen and cursor position",
  },
  startRecording: {
    main: "Start recording terminal output to an asciicast v2 file. Returns the recording ID and path where the file will be saved. Only one recording can be active at a time.",
    format: "Recording format (default: v2, asciicast v2 format)",
    mode: "Recording mode: always saves the recording, on-failure only saves if session exits with non-zero code (default: always)",
    outputDir: "Directory to save the recording (default: ~/.local/state/terminal-mcp/recordings, or TERMINAL_MCP_RECORD_DIR env var)",
    idleTimeLimit: "Max seconds between events in the recording (default: 2). Caps idle time to prevent long pauses during playback.",
    maxDuration: "Max recording duration in seconds (default: 3600 = 60 minutes). Recording will auto-stop when this limit is reached.",
    inactivityTimeout: "Stop recording after N seconds of no terminal output (default: 600 = 10 minutes). Resets on each output event.",
  },
  stopRecording: {
    main: "Stop a recording and finalize the asciicast file. Returns metadata about the saved recording including the file path and duration.",
    recordingId: "The recording ID returned by startRecording",
  },
} as const;

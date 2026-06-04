/**
 * Shared tool definitions used by both MCP client, server, and UI.
 * Single source of truth — derived from individual tool modules.
 */

import { typeTool } from "./type.js";
import { sendKeyTool } from "./sendKey.js";
import { sleepTool } from "./sleep.js";
import { getContentTool } from "./getContent.js";
import { getBufferInfoTool } from "./getBufferInfo.js";
import { screenshotTool } from "./screenshot.js";
import { startRecordingTool } from "./startRecording.js";
import { stopRecordingTool } from "./stopRecording.js";
import { createSessionTool } from "./createSession.js";
import { listSessionsTool } from "./listSessions.js";
import { destroySessionTool } from "./destroySession.js";
import { resizeTool } from "./resize.js";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export const toolDefinitions: ToolDefinition[] = [
  typeTool,
  sendKeyTool,
  sleepTool,
  getContentTool,
  getBufferInfoTool,
  screenshotTool,
  startRecordingTool,
  stopRecordingTool,
  createSessionTool,
  listSessionsTool,
  destroySessionTool,
  resizeTool,
];

/**
 * Get just the tool names as an array
 */
export function getToolNames(): string[] {
  return toolDefinitions.map((t) => t.name);
}

/**
 * Shared tool definitions used by both MCP client and UI
 */

import { TOOL_DESCRIPTIONS } from "./descriptions.js";

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
  {
    name: "type",
    description: TOOL_DESCRIPTIONS.type.main,
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: TOOL_DESCRIPTIONS.type.text,
        },
        autoSubmit: {
          type: "boolean",
          description: TOOL_DESCRIPTIONS.type.autoSubmit,
          default: false,
        },
      },
      required: ["text"],
    },
  },
  {
    name: "sendKey",
    description: TOOL_DESCRIPTIONS.sendKey.main,
    inputSchema: {
      type: "object",
      properties: {
        key: {
          type: "string",
          description: TOOL_DESCRIPTIONS.sendKey.key,
        },
      },
      required: ["key"],
    },
  },
  {
    name: "sleep",
    description: TOOL_DESCRIPTIONS.sleep.main,
    inputSchema: {
      type: "object",
      properties: {
        milliseconds: {
          type: "number",
          description: TOOL_DESCRIPTIONS.sleep.milliseconds,
          default: 5000,
          minimum: 0,
        },
      },
    },
  },
  {
    name: "getContent",
    description: TOOL_DESCRIPTIONS.getContent.main,
    inputSchema: {
      type: "object",
      properties: {
        visibleOnly: {
          type: "boolean",
          description: TOOL_DESCRIPTIONS.getContent.visibleOnly,
          default: true,
        },
        delay: {
          type: "number",
          description: TOOL_DESCRIPTIONS.getContent.delay,
          default: 0,
          minimum: 0,
        },
      },
    },
  },
  {
    name: "takeScreenshot",
    description: TOOL_DESCRIPTIONS.takeScreenshot.main,
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "startRecording",
    description: TOOL_DESCRIPTIONS.startRecording.main,
    inputSchema: {
      type: "object",
      properties: {
        format: {
          type: "string",
          enum: ["v2"],
          description: TOOL_DESCRIPTIONS.startRecording.format,
        },
        mode: {
          type: "string",
          enum: ["always", "on-failure"],
          description: TOOL_DESCRIPTIONS.startRecording.mode,
        },
        outputDir: {
          type: "string",
          description: TOOL_DESCRIPTIONS.startRecording.outputDir,
        },
        idleTimeLimit: {
          type: "number",
          description: TOOL_DESCRIPTIONS.startRecording.idleTimeLimit,
        },
        maxDuration: {
          type: "number",
          description: TOOL_DESCRIPTIONS.startRecording.maxDuration,
        },
        inactivityTimeout: {
          type: "number",
          description: TOOL_DESCRIPTIONS.startRecording.inactivityTimeout,
        },
      },
    },
  },
  {
    name: "stopRecording",
    description: TOOL_DESCRIPTIONS.stopRecording.main,
    inputSchema: {
      type: "object",
      properties: {
        recordingId: {
          type: "string",
          description: TOOL_DESCRIPTIONS.stopRecording.recordingId,
        },
      },
      required: ["recordingId"],
    },
  },
];

/**
 * Get just the tool names as an array
 */
export function getToolNames(): string[] {
  return toolDefinitions.map((t) => t.name);
}

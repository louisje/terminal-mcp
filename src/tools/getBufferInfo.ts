import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
import { TOOL_DESCRIPTIONS } from "./descriptions.js";

export const getBufferInfoSchema = z.object({});

export type GetBufferInfoArgs = z.infer<typeof getBufferInfoSchema>;

export const getBufferInfoTool = {
  name: "getBufferInfo",
  description: TOOL_DESCRIPTIONS.getBufferInfo.main,
  inputSchema: {
    type: "object" as const,
    properties: {},
    required: [],
  },
};

export function handleGetBufferInfo(manager: TerminalManager, args: unknown): { content: Array<{ type: "text"; text: string }> } {
  getBufferInfoSchema.parse(args ?? {});

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(manager.getBufferInfo(), null, 2),
      },
    ],
  };
}
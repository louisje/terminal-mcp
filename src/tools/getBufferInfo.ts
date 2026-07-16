import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
import { TOOL_DESCRIPTIONS, SESSION_ID_DESCRIPTION } from "./descriptions.js";

export const getBufferInfoSchema = z.object({
  sessionId: z.string().optional().describe(SESSION_ID_DESCRIPTION),
});

export type GetBufferInfoArgs = z.infer<typeof getBufferInfoSchema>;

export const getBufferInfoTool = {
  name: "getBufferInfo",
  description: TOOL_DESCRIPTIONS.getBufferInfo.main,
  inputSchema: {
    type: "object" as const,
    properties: {
      sessionId: {
        type: "string",
        description: SESSION_ID_DESCRIPTION,
      },
    },
    required: [],
  },
};

export function handleGetBufferInfo(manager: TerminalManager, args: unknown): { content: Array<{ type: "text"; text: string }> } {
  const parsed = getBufferInfoSchema.parse(args ?? {});

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(manager.getBufferInfo(parsed.sessionId), null, 2),
      },
    ],
  };
}
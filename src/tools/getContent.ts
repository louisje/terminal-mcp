import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
import { TOOL_DESCRIPTIONS } from "./descriptions.js";

export const getContentSchema = z.object({
  visibleOnly: z
    .boolean()
    .optional()
    .default(false)
    .describe(TOOL_DESCRIPTIONS.getContent.visibleOnly),
});

export type GetContentArgs = z.infer<typeof getContentSchema>;

export const getContentTool = {
  name: "getContent",
  description: TOOL_DESCRIPTIONS.getContent.main,
  inputSchema: {
    type: "object" as const,
    properties: {
      visibleOnly: {
        type: "boolean",
        description: TOOL_DESCRIPTIONS.getContent.visibleOnly,
        default: false,
      },
    },
    required: [],
  },
};

export function handleGetContent(manager: TerminalManager, args: unknown): { content: Array<{ type: "text"; text: string }> } {
  const parsed = getContentSchema.parse(args);

  const content = parsed.visibleOnly
    ? manager.getVisibleContent()
    : manager.getContent();

  return {
    content: [
      {
        type: "text",
        text: content || "(empty terminal)",
      },
    ],
  };
}

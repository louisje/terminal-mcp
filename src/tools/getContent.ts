import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
import { TOOL_DESCRIPTIONS } from "./descriptions.js";

export const getContentSchema = z.object({
  visibleOnly: z
    .boolean()
    .optional()
    .describe(TOOL_DESCRIPTIONS.getContent.visibleOnly),
  maxLines: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe(TOOL_DESCRIPTIONS.getContent.maxLines),
  delay: z
    .number()
    .finite()
    .nonnegative()
    .optional()
    .default(0)
    .describe(TOOL_DESCRIPTIONS.getContent.delay),
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
      },
      maxLines: {
        type: "number",
        description: TOOL_DESCRIPTIONS.getContent.maxLines,
        minimum: 0,
      },
      delay: {
        type: "number",
        description: TOOL_DESCRIPTIONS.getContent.delay,
        default: 0,
        minimum: 0,
      },
    },
    required: [],
  },
};

export async function handleGetContent(manager: TerminalManager, args: unknown): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const parsed = getContentSchema.parse(args ?? {});

  // If delay is specified, sleep before getting content
  if (parsed.delay > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, parsed.delay);
    });
  }

  // Resolve visibleOnly vs maxLines:
  // - visibleOnly explicitly true  → viewport only (ignore maxLines)
  // - visibleOnly explicitly false → scrollback with maxLines (default 100)
  // - visibleOnly unset + maxLines set → scrollback (maxLines implies visibleOnly=false)
  // - both unset → viewport only (backward compatible default)
  let content: string;
  if (parsed.visibleOnly === true) {
    content = manager.getVisibleContent();
  } else if (parsed.visibleOnly === false) {
    content = manager.getContent(parsed.maxLines ?? 100);
  } else if (parsed.maxLines !== undefined) {
    content = manager.getContent(parsed.maxLines);
  } else {
    content = manager.getVisibleContent();
  }

  return {
    content: [
      {
        type: "text",
        text: content || "(empty terminal)",
      },
    ],
  };
}

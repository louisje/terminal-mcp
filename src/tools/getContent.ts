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

  // visibleOnly and maxLines are orthogonal:
  // - visibleOnly: data source (viewport vs full scrollback)
  // - maxLines: cap on returned lines (applies to either source)
  //
  // Defaults:
  // - visibleOnly unset + maxLines unset → viewport, all lines
  // - visibleOnly unset + maxLines set   → scrollback (maxLines implies visibleOnly=false)
  // - visibleOnly true  + maxLines set   → viewport, last N lines
  // - visibleOnly false + maxLines unset → scrollback, last 100 lines
  // - visibleOnly false + maxLines set   → scrollback, last N lines
  const useVisible = parsed.visibleOnly === true
    || (parsed.visibleOnly === undefined && parsed.maxLines === undefined);

  let content: string;
  if (useVisible) {
    content = manager.getVisibleContent();
  } else {
    content = manager.getContent(parsed.maxLines ?? 100);
  }

  // Apply maxLines cap to visible content when both are specified
  if (useVisible && parsed.maxLines !== undefined && parsed.maxLines > 0) {
    const lines = content.split('\n');
    if (lines.length > parsed.maxLines) {
      content = lines.slice(-parsed.maxLines).join('\n');
    }
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

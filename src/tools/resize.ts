import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";

export const resizeSchema = z.object({
  cols: z.number().int().positive().describe("New terminal width in columns"),
  rows: z.number().int().positive().describe("New terminal height in rows"),
  sessionId: z.string().optional().describe("Target session ID. Omit to target the default session."),
});

export type ResizeArgs = z.infer<typeof resizeSchema>;

export const resizeTool = {
  name: "resize",
  description: "Resize the terminal to the specified dimensions. Affects both the virtual terminal and the underlying PTY process.",
  inputSchema: {
    type: "object" as const,
    properties: {
      cols: {
        type: "number",
        description: "New terminal width in columns",
      },
      rows: {
        type: "number",
        description: "New terminal height in rows",
      },
      sessionId: {
        type: "string",
        description: "Target session ID. Omit to target the default session.",
      },
    },
    required: ["cols", "rows"],
  },
};

export function handleResize(
  manager: TerminalManager,
  args: unknown
): { content: Array<{ type: "text"; text: string }> } {
  const parsed = resizeSchema.parse(args);
  manager.resize(parsed.cols, parsed.rows, parsed.sessionId);

  return {
    content: [
      {
        type: "text",
        text: `Terminal resized to ${parsed.cols}x${parsed.rows}`,
      },
    ],
  };
}

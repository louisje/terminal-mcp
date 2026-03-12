import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
import { getKeySequence } from "../utils/keys.js";
import { TOOL_DESCRIPTIONS } from "./descriptions.js";

export const typeSchema = z.object({
  text: z.string().describe(TOOL_DESCRIPTIONS.type.text),
  autoSubmit: z.boolean().optional().default(false).describe(TOOL_DESCRIPTIONS.type.autoSubmit),
});

export type TypeArgs = z.infer<typeof typeSchema>;

export const typeTool = {
  name: "type",
  description: TOOL_DESCRIPTIONS.type.main,
  inputSchema: {
    type: "object" as const,
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
};

export async function handleType(manager: TerminalManager, args: unknown): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const parsed = typeSchema.parse(args);
  manager.write(parsed.text);

  if (parsed.autoSubmit) {
    // Send Enter key
    const enterSequence = getKeySequence("Enter");
    if (enterSequence) {
      manager.write(enterSequence);
    }

    // Wait a brief moment for command to execute
    await new Promise(resolve => setTimeout(resolve, 250));

    // Get and return terminal content (visible only)
    const content = manager.getVisibleContent();
    return {
      content: [
        {
          type: "text",
          text: content || "(empty terminal)",
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: `Typed ${parsed.text.length} character(s) to terminal`,
      },
    ],
  };
}

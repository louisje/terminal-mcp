import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
import { getKeySequence } from "../utils/keys.js";

export const typeSchema = z.object({
  text: z.string().describe("The text to type into the terminal"),
  autoSubmit: z.boolean().optional().default(false).describe("If true, automatically send Enter key and return terminal content"),
});

export type TypeArgs = z.infer<typeof typeSchema>;

export const typeTool = {
  name: "type",
  description: "Send text input to the terminal. Text is written exactly as provided - no Enter key is sent automatically unless autoSubmit=true. To execute a command, use type() followed by sendKey('Enter'), OR use type() with autoSubmit=true. Example workflow: type('ls -la') → sendKey('Enter') → getContent(), OR simply type('ls -la', autoSubmit=true). IMPORTANT: In zsh, avoid '!' inside double quotes as it triggers history expansion - use single quotes instead (e.g., echo 'Hello!' not echo \"Hello!\").",
  inputSchema: {
    type: "object" as const,
    properties: {
      text: {
        type: "string",
        description: "The text to type into the terminal",
      },
      autoSubmit: {
        type: "boolean",
        description: "If true, automatically send Enter key and return terminal content",
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
    await new Promise(resolve => setTimeout(resolve, 100));

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

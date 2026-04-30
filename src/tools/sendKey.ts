import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
import { getKeySequence, getAvailableKeys } from "../utils/keys.js";
import { TOOL_DESCRIPTIONS } from "./descriptions.js";

export const sendKeySchema = z.object({
  key: z.string().describe(TOOL_DESCRIPTIONS.sendKey.key),
  sessionId: z.string().optional().describe("Target session ID. Omit to target the default session."),
});

export type SendKeyArgs = z.infer<typeof sendKeySchema>;

const availableKeys = getAvailableKeys();

export const sendKeyTool = {
  name: "sendKey",
  description: TOOL_DESCRIPTIONS.sendKey.main,
  inputSchema: {
    type: "object" as const,
    properties: {
      key: {
        type: "string",
        description: TOOL_DESCRIPTIONS.sendKey.key,
      },
      sessionId: {
        type: "string",
        description: "Target session ID. Omit to target the default session.",
      },
    },
    required: ["key"],
  },
};

export function handleSendKey(manager: TerminalManager, args: unknown): { content: Array<{ type: "text"; text: string }> } {
  const parsed = sendKeySchema.parse(args);
  const sequence = getKeySequence(parsed.key);

  if (sequence === null) {
    const available = getAvailableKeys();
    throw new Error(
      `Unknown key: "${parsed.key}". Available keys include: ${available.slice(0, 15).join(", ")}...`
    );
  }

  manager.write(sequence, parsed.sessionId);

  return {
    content: [
      {
        type: "text",
        text: `Sent key: ${parsed.key}`,
      },
    ],
  };
}

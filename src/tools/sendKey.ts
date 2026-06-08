import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
import { getKeySequence, getAvailableKeys } from "../utils/keys.js";
import { TOOL_DESCRIPTIONS } from "./descriptions.js";

export const sendKeySchema = z.object({
  key: z.string().describe(TOOL_DESCRIPTIONS.sendKey.key),
  repeat: z.number().int().min(1).default(1).describe(TOOL_DESCRIPTIONS.sendKey.repeat),
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
      repeat: {
        type: "number",
        description: TOOL_DESCRIPTIONS.sendKey.repeat,
        default: 1,
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

  const repeated = sequence.repeat(parsed.repeat);
  manager.write(repeated, parsed.sessionId);

  const repeatSuffix = parsed.repeat > 1 ? ` (repeated ${parsed.repeat} times)` : "";
  return {
    content: [
      {
        type: "text",
        text: `Sent key: ${parsed.key}${repeatSuffix}`,
      },
    ],
  };
}

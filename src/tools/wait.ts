import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
import { TOOL_DESCRIPTIONS } from "./descriptions.js";

export const waitSchema = z.object({
  seconds: z
    .number()
    .finite()
    .nonnegative()
    .optional()
    .default(5)
    .describe(TOOL_DESCRIPTIONS.wait.seconds),
});

export type WaitArgs = z.infer<typeof waitSchema>;

export const waitTool = {
  name: "wait",
  description: TOOL_DESCRIPTIONS.wait.main,
  inputSchema: {
    type: "object" as const,
    properties: {
      seconds: {
        type: "number",
        description: TOOL_DESCRIPTIONS.wait.seconds,
        default: 5,
        minimum: 0,
      },
    },
    required: [],
  },
};

function formatSeconds(seconds: number): string {
  const label = seconds === 1 ? "second" : "seconds";
  return `${seconds} ${label}`;
}

export async function handleWait(
  _manager: TerminalManager,
  args: unknown
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const parsed = waitSchema.parse(args ?? {});

  await new Promise((resolve) => {
    setTimeout(resolve, parsed.seconds * 1000);
  });

  return {
    content: [
      {
        type: "text",
        text: `Waited ${formatSeconds(parsed.seconds)}`,
      },
    ],
  };
}
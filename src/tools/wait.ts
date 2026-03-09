import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";

export const waitSchema = z.object({
  seconds: z
    .number()
    .finite()
    .nonnegative()
    .optional()
    .default(5)
    .describe("Number of seconds to wait before returning (default: 5)"),
});

export type WaitArgs = z.infer<typeof waitSchema>;

export const waitTool = {
  name: "wait",
  description:
    "Optional pause tool. Call only when a command needs time to produce output. Defaults to 5 seconds when no argument is provided.",
  inputSchema: {
    type: "object" as const,
    properties: {
      seconds: {
        type: "number",
        description: "Number of seconds to wait before returning (default: 5)",
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
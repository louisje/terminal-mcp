import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
import { TOOL_DESCRIPTIONS } from "./descriptions.js";

export const sleepSchema = z.object({
  milliseconds: z
    .number()
    .finite()
    .nonnegative()
    .optional()
    .default(5000)
    .describe(TOOL_DESCRIPTIONS.sleep.milliseconds),
});

export type SleepArgs = z.infer<typeof sleepSchema>;

export const sleepTool = {
  name: "sleep",
  description: TOOL_DESCRIPTIONS.sleep.main,
  inputSchema: {
    type: "object" as const,
    properties: {
      milliseconds: {
        type: "number",
        description: TOOL_DESCRIPTIONS.sleep.milliseconds,
        default: 5000,
        minimum: 0,
      },
    },
    required: [],
  },
};

function formatMilliseconds(milliseconds: number): string {
  if (milliseconds >= 1000) {
    const seconds = milliseconds / 1000;
    const label = seconds === 1 ? "second" : "seconds";
    return `${seconds} ${label}`;
  } else {
    const label = milliseconds === 1 ? "millisecond" : "milliseconds";
    return `${milliseconds} ${label}`;
  }
}

export async function handleSleep(
  _manager: TerminalManager,
  args: unknown
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const parsed = sleepSchema.parse(args ?? {});

  await new Promise((resolve) => {
    setTimeout(resolve, parsed.milliseconds);
  });

  return {
    content: [
      {
        type: "text",
        text: `Slept for ${formatMilliseconds(parsed.milliseconds)}`,
      },
    ],
  };
}
import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const sleepSchema: z.ZodObject<{
    milliseconds: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    milliseconds: number;
}, {
    milliseconds?: number | undefined;
}>;
export type SleepArgs = z.infer<typeof sleepSchema>;
export declare const sleepTool: {
    name: string;
    description: "Pause execution for an extended duration. This is a BLOCKING operation - use ONLY when absolutely necessary for long-running processes (builds, installations, downloads) or waiting for slow background tasks. AVOID frequent calls. Not needed after autoSubmit or for fast commands.";
    inputSchema: {
        type: "object";
        properties: {
            milliseconds: {
                type: string;
                description: "Number of milliseconds to sleep (default: 5000 = 5 seconds). Use for operations that genuinely require waiting, not as a workaround.";
                default: number;
                minimum: number;
            };
        };
        required: never[];
    };
};
export declare function handleSleep(_manager: TerminalManager, args: unknown): Promise<{
    content: Array<{
        type: "text";
        text: string;
    }>;
}>;
//# sourceMappingURL=sleep.d.ts.map
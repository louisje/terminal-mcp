import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const sendKeySchema: z.ZodObject<{
    key: z.ZodString;
    repeat: z.ZodDefault<z.ZodNumber>;
    sessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    repeat: number;
    key: string;
    sessionId?: string | undefined;
}, {
    key: string;
    repeat?: number | undefined;
    sessionId?: string | undefined;
}>;
export type SendKeyArgs = z.infer<typeof sendKeySchema>;
export declare const sendKeyTool: {
    name: string;
    description: "Send a special key to the terminal (e.g., enter, tab, ctrl+c)";
    inputSchema: {
        type: "object";
        properties: {
            key: {
                type: string;
                description: "The key to send (e.g., enter, tab, escape, up, down, left, right, ctrl+c, ctrl+d)";
            };
            repeat: {
                type: string;
                description: "Number of times to repeat the key (default: 1). Useful for pressing arrow keys or similar multiple times in one call.";
                default: number;
            };
            sessionId: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function handleSendKey(manager: TerminalManager, args: unknown): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
//# sourceMappingURL=sendKey.d.ts.map
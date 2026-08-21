import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const typeSchema: z.ZodObject<{
    text: z.ZodString;
    autoSubmit: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    sessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    text: string;
    autoSubmit: boolean;
    sessionId?: string | undefined;
}, {
    text: string;
    sessionId?: string | undefined;
    autoSubmit?: boolean | undefined;
}>;
export type TypeArgs = z.infer<typeof typeSchema>;
export declare const typeTool: {
    name: string;
    description: "Send text input to the terminal. Use autoSubmit=true to execute commands in one call (recommended). Alternative: type text without autoSubmit, then use sendKey('Enter') for manual control. IMPORTANT: In zsh, avoid '!' inside double quotes - use single quotes instead (e.g., echo 'Hello!' not echo \"Hello!\").";
    inputSchema: {
        type: "object";
        properties: {
            text: {
                type: string;
                description: "The text to type into the terminal";
            };
            autoSubmit: {
                type: string;
                description: "If true, automatically send Enter and return terminal content. Recommended for most commands.";
                default: boolean;
            };
            sessionId: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function handleType(manager: TerminalManager, args: unknown): Promise<{
    content: Array<{
        type: "text";
        text: string;
    }>;
}>;
//# sourceMappingURL=type.d.ts.map
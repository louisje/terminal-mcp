import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const destroySessionSchema: z.ZodObject<{
    sessionId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    sessionId: string;
}, {
    sessionId: string;
}>;
export declare const destroySessionTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            sessionId: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function handleDestroySession(manager: TerminalManager, args: unknown): {
    content: Array<{
        type: "text";
        text: string;
    }>;
    isError?: boolean;
};
//# sourceMappingURL=destroySession.d.ts.map
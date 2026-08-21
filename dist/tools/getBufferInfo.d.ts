import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const getBufferInfoSchema: z.ZodObject<{
    sessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    sessionId?: string | undefined;
}, {
    sessionId?: string | undefined;
}>;
export type GetBufferInfoArgs = z.infer<typeof getBufferInfoSchema>;
export declare const getBufferInfoTool: {
    name: string;
    description: "Get metadata about the current terminal buffer, including total length, scrollback lines, and viewport rows";
    inputSchema: {
        type: "object";
        properties: {
            sessionId: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
export declare function handleGetBufferInfo(manager: TerminalManager, args: unknown): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
//# sourceMappingURL=getBufferInfo.d.ts.map
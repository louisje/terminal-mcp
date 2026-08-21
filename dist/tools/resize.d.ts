import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const resizeSchema: z.ZodObject<{
    cols: z.ZodNumber;
    rows: z.ZodNumber;
    sessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    cols: number;
    rows: number;
    sessionId?: string | undefined;
}, {
    cols: number;
    rows: number;
    sessionId?: string | undefined;
}>;
export type ResizeArgs = z.infer<typeof resizeSchema>;
export declare const resizeTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            cols: {
                type: string;
                description: string;
            };
            rows: {
                type: string;
                description: string;
            };
            sessionId: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare function handleResize(manager: TerminalManager, args: unknown): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
//# sourceMappingURL=resize.d.ts.map
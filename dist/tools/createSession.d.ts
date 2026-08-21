import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const createSessionSchema: z.ZodObject<{
    shell: z.ZodOptional<z.ZodString>;
    cols: z.ZodOptional<z.ZodNumber>;
    rows: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    cols?: number | undefined;
    rows?: number | undefined;
    shell?: string | undefined;
}, {
    cols?: number | undefined;
    rows?: number | undefined;
    shell?: string | undefined;
}>;
export declare const createSessionTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            shell: {
                type: string;
                description: string;
            };
            cols: {
                type: string;
                description: string;
            };
            rows: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
export declare function handleCreateSession(manager: TerminalManager, args: unknown): Promise<{
    content: Array<{
        type: "text";
        text: string;
    }>;
}>;
//# sourceMappingURL=createSession.d.ts.map
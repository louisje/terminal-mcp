import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const getContentSchema: z.ZodObject<{
    visibleOnly: z.ZodOptional<z.ZodBoolean>;
    maxLines: z.ZodOptional<z.ZodNumber>;
    delay: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    sessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    delay: number;
    sessionId?: string | undefined;
    visibleOnly?: boolean | undefined;
    maxLines?: number | undefined;
}, {
    sessionId?: string | undefined;
    visibleOnly?: boolean | undefined;
    maxLines?: number | undefined;
    delay?: number | undefined;
}>;
export type GetContentArgs = z.infer<typeof getContentSchema>;
export declare const getContentTool: {
    name: string;
    description: "Get the current content of the terminal buffer. WARNING: Default visibleOnly=true only returns the viewport (~25 lines) and will truncate command output. Use visibleOnly=false or specify maxLines after running any command that produces output to avoid missing content.";
    inputSchema: {
        type: "object";
        properties: {
            visibleOnly: {
                type: string;
                description: "Controls data source: true = visible viewport only, false = full scrollback buffer. If omitted, defaults to true unless maxLines is specified (which implies false). Both visibleOnly and maxLines can be combined: e.g. visibleOnly=true with maxLines=10 returns the last 10 viewport lines.";
            };
            maxLines: {
                type: string;
                description: "Maximum number of lines to return (default: 100 when reading scrollback). Applies to both viewport and scrollback content. Specifying maxLines alone automatically reads from scrollback. Set to 0 to return all lines.";
                minimum: number;
            };
            delay: {
                type: string;
                description: "Optional delay in milliseconds before getting content (default: 0). Use this as a shortcut to avoid separate sleep() call when you need to wait briefly before reading output.";
                default: number;
                minimum: number;
            };
            sessionId: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
export declare function handleGetContent(manager: TerminalManager, args: unknown): Promise<{
    content: Array<{
        type: "text";
        text: string;
    }>;
}>;
//# sourceMappingURL=getContent.d.ts.map
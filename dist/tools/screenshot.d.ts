import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const screenshotSchema: z.ZodObject<{
    format: z.ZodOptional<z.ZodEnum<["text", "ansi", "png"]>>;
    sessionId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    format?: "text" | "ansi" | "png" | undefined;
    sessionId?: string | undefined;
}, {
    format?: "text" | "ansi" | "png" | undefined;
    sessionId?: string | undefined;
}>;
export type ScreenshotArgs = z.infer<typeof screenshotSchema>;
export declare const screenshotTool: {
    name: string;
    description: "Take a screenshot of the terminal showing current screen and cursor position";
    inputSchema: {
        type: "object";
        properties: {
            format: {
                type: string;
                enum: string[];
                description: string;
            };
            sessionId: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
export declare function handleScreenshot(manager: TerminalManager, args: unknown): {
    content: Array<{
        type: "text";
        text: string;
    } | {
        type: "image";
        data: string;
        mimeType: string;
    }>;
};
//# sourceMappingURL=screenshot.d.ts.map
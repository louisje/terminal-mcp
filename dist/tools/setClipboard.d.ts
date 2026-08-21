import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const setClipboardSchema: z.ZodObject<{
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
}, {
    text: string;
}>;
export type SetClipboardArgs = z.infer<typeof setClipboardSchema>;
export declare const setClipboardTool: {
    name: string;
    description: "Set the system clipboard to the given text, overwriting whatever is currently there. This affects the user's OS-wide clipboard, not just the terminal. Requires a clipboard utility to be available on the host (e.g. xclip/xsel/wl-clipboard on Linux); fails in headless environments without one.";
    inputSchema: {
        type: "object";
        properties: {
            text: {
                type: string;
                description: "The text to write to the clipboard";
            };
        };
        required: string[];
    };
};
export declare function handleSetClipboard(_manager: TerminalManager, args: unknown): Promise<{
    content: Array<{
        type: "text";
        text: string;
    }>;
}>;
//# sourceMappingURL=setClipboard.d.ts.map
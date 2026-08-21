import { TerminalManager } from "../terminal/index.js";
export declare const getClipboardTool: {
    name: string;
    description: "Get the current text content of the system clipboard (OS-wide, not terminal-specific). Requires a clipboard utility to be available on the host (e.g. xclip/xsel/wl-clipboard on Linux); fails in headless environments without one.";
    inputSchema: {
        type: "object";
        properties: {};
        required: never[];
    };
};
export declare function handleGetClipboard(_manager: TerminalManager, _args: unknown): Promise<{
    content: Array<{
        type: "text";
        text: string;
    }>;
}>;
//# sourceMappingURL=getClipboard.d.ts.map
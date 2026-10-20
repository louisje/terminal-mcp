import type { TerminalManager } from "../terminal/index.js";
import { type ToolDefinition } from "./definitions.js";
export declare const codemodeDefinition: ToolDefinition;
export declare function runCodemodeWithDispatch(args: unknown, definitions: ToolDefinition[], dispatch: (name: string, args: Record<string, unknown>, signal?: AbortSignal) => Promise<unknown>, signal?: AbortSignal): Promise<{
    content: ({
        type: "text";
        text: string;
        data?: undefined;
        mimeType?: undefined;
    } | {
        type: "image";
        data: string;
        mimeType: string;
        text?: undefined;
    })[];
    isError: boolean;
}>;
export declare function runCodemode(manager: TerminalManager, args: unknown, piOperators: boolean, piExtraOperators: boolean, signal?: AbortSignal): Promise<{
    content: ({
        type: "text";
        text: string;
        data?: undefined;
        mimeType?: undefined;
    } | {
        type: "image";
        data: string;
        mimeType: string;
        text?: undefined;
    })[];
    isError: boolean;
}>;
//# sourceMappingURL=codemode.d.ts.map
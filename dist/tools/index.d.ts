import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { TerminalManager } from "../terminal/index.js";
export declare function registerTools(server: Server, manager: TerminalManager, piOperators?: boolean, piExtraOperators?: boolean, codemode?: boolean): void;
export declare function dispatchTool(manager: TerminalManager, name: string, args: unknown, piOperators?: boolean, piExtraOperators?: boolean, signal?: AbortSignal): Promise<{
    content: Array<{
        type: "text";
        text: string;
    } | {
        type: "image";
        data: string;
        mimeType: string;
    }>;
}>;
//# sourceMappingURL=index.d.ts.map
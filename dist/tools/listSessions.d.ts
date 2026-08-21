import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const listSessionsSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const listSessionsTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {};
        required: never[];
    };
};
export declare function handleListSessions(manager: TerminalManager, _args: unknown): {
    content: Array<{
        type: "text";
        text: string;
    }>;
};
//# sourceMappingURL=listSessions.d.ts.map
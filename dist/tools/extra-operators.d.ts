import type { ToolDefinition } from "./definitions.js";
export declare const extraOperatorToolDefinitions: ToolDefinition[];
export declare function handleExtraOperatorTool(name: string, args: unknown): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;
//# sourceMappingURL=extra-operators.d.ts.map
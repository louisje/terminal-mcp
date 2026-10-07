import type { ToolDefinition } from "./definitions.js";
type TextResult = {
    content: Array<{
        type: "text";
        text: string;
    }>;
    isError?: boolean;
};
export declare const operatorToolDefinitions: ToolDefinition[];
export declare function handleOperatorTool(name: string, args: unknown): Promise<TextResult>;
export {};
//# sourceMappingURL=operators.d.ts.map
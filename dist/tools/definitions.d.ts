/**
 * Shared tool definitions used by both MCP client, server, and UI.
 * Single source of truth — derived from individual tool modules.
 */
export interface ToolDefinition {
    name: string;
    description: string;
    instruction?: string;
    inputSchema: {
        type: "object";
        properties: Record<string, unknown>;
        required?: string[];
    };
}
export declare const toolDefinitions: ToolDefinition[];
/** Canonical split fields for codemode. Legacy MCP descriptions are retained
 * unchanged as instruction text, avoiding a second copy of usage guidance. */
export declare function getCodemodeToolDefinitions(piOperators?: boolean, piExtraOperators?: boolean): ToolDefinition[];
export declare function getToolDefinitions(piOperators?: boolean, piExtraOperators?: boolean): ToolDefinition[];
/**
 * Get just the tool names as an array
 */
export declare function getToolNames(): string[];
//# sourceMappingURL=definitions.d.ts.map
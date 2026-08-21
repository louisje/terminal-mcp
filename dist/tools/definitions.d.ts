/**
 * Shared tool definitions used by both MCP client, server, and UI.
 * Single source of truth — derived from individual tool modules.
 */
export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: Record<string, unknown>;
        required?: string[];
    };
}
export declare const toolDefinitions: ToolDefinition[];
/**
 * Get just the tool names as an array
 */
export declare function getToolNames(): string[];
//# sourceMappingURL=definitions.d.ts.map
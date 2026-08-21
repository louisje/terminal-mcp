/**
 * Simple stats tracking for terminal MCP sessions
 */
export declare class Stats {
    private startTime;
    private toolCalls;
    private totalCalls;
    constructor();
    /**
     * Record a tool call
     */
    recordToolCall(toolName: string): void;
    /**
     * Get uptime in seconds
     */
    getUptimeSeconds(): number;
    /**
     * Get formatted uptime string
     */
    getFormattedUptime(): string;
    /**
     * Get total tool calls
     */
    getTotalCalls(): number;
    /**
     * Get tool calls breakdown
     */
    getToolCallsBreakdown(): Map<string, number>;
    /**
     * Get stats summary
     */
    getSummary(): {
        uptime: string;
        totalCalls: number;
        toolCalls: Record<string, number>;
    };
}
/**
 * Get or create the global stats instance
 */
export declare function getStats(): Stats;
/**
 * Reset stats (mainly for testing)
 */
export declare function resetStats(): void;
//# sourceMappingURL=stats.d.ts.map
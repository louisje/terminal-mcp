interface McpClientModeOptions {
    title?: string;
}
type SocketRequestSender = (method: string, params?: Record<string, unknown>) => Promise<unknown>;
export declare function notifyClientConnected(sendRequest: SocketRequestSender, options: {
    title?: string;
}): Promise<void>;
/**
 * MCP Client Mode - connects to existing terminal socket and serves MCP over stdio
 */
export declare function startMcpClientMode(socketPath: string, options?: McpClientModeOptions): Promise<void>;
export {};
//# sourceMappingURL=client.d.ts.map
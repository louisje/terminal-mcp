import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { TerminalManager } from "./terminal/index.js";
export interface ServerOptions {
    cols?: number;
    rows?: number;
    shell?: string;
    login?: boolean;
    tmux?: boolean | string;
    title?: string;
    maxSessions?: number;
    sessionIdleTimeout?: number;
}
export declare function createServerWithManager(manager: TerminalManager): Server;
/**
 * Create and configure the MCP server with a new terminal manager
 */
export declare function createServer(options?: ServerOptions): {
    server: Server;
    manager: TerminalManager;
};
/**
 * Connect an MCP server to a transport
 */
export declare function connectServer(server: Server, transport: Transport): Promise<void>;
/**
 * Start the MCP server with stdio transport (legacy mode)
 */
export declare function startServer(options?: ServerOptions): Promise<void>;
//# sourceMappingURL=server.d.ts.map
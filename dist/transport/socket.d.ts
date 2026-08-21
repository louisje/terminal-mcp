import { Server as NetServer, Socket } from "net";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
declare const clientConnectedSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
}, {
    title?: string | undefined;
}>;
export type ClientConnectedParams = z.infer<typeof clientConnectedSchema>;
/**
 * Transport that communicates over a Unix socket connection
 * (Used for full MCP protocol when needed)
 */
export declare class SocketTransport implements Transport {
    private socket;
    private buffer;
    onmessage?: (message: JSONRPCMessage) => void;
    onerror?: (error: Error) => void;
    onclose?: () => void;
    constructor(socket: Socket);
    private processBuffer;
    start(): Promise<void>;
    close(): Promise<void>;
    send(message: JSONRPCMessage): Promise<void>;
}
/**
 * Create a Unix socket server that accepts MCP connections
 */
export declare function createSocketServer(socketPath: string, onConnection: (transport: SocketTransport) => void): NetServer;
/**
 * Create a simple request/response socket server for tool proxying
 * This is the protocol used between interactive mode and MCP client mode
 */
export declare function createToolProxyServer(socketPath: string, manager: TerminalManager, onClientConnected?: (params: ClientConnectedParams) => void): NetServer;
export {};
//# sourceMappingURL=socket.d.ts.map
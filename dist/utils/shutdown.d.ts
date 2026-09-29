export interface ShutdownOptions {
    /**
     * Release anything the OS will NOT reclaim on exit — above all the PTY shell,
     * a separate process that outlives us. Do the synchronous, must-happen work
     * (dispose the PTY) FIRST and return any async tail as a promise: on the
     * process 'exit' path only the synchronous prefix can run.
     */
    cleanup: () => void | Promise<void>;
}
/**
 * Wire up shutdown for a stdio MCP server: SIGINT/SIGTERM/SIGHUP, stdin
 * end/close, and a synchronous-only last resort on process 'exit'.
 *
 * An MCP client signals shutdown by closing stdin, but StdioServerTransport
 * only listens for 'data'/'error', so EOF alone does nothing. Signals don't
 * help either: clients spawn us via npx (`npm exec` -> `sh -c` -> `node`), so a
 * SIGTERM hits `npm exec`, not us. Without this, the PTY fd (headless) or Unix
 * socket (client mode) keeps the event loop alive and the process is orphaned.
 *
 * NOT for interactive mode: there stdin is a TTY that never EOFs and SIGINT
 * must reach the shell as ^C (see src/index.ts). Hence "Stdio" in the name.
 */
export declare function installStdioShutdownHandlers({ cleanup }: ShutdownOptions): {
    isShuttingDown: () => boolean;
};
//# sourceMappingURL=shutdown.d.ts.map
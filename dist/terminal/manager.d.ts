import { TerminalSession, TerminalSessionOptions, ScreenshotResult, BufferInfoResult } from "./session.js";
import type { SandboxController } from "../sandbox/index.js";
import { RecordingManager } from "../recording/index.js";
import type { RecordingMode, RecordingFormat, RecordingMetadata } from "../recording/index.js";
export interface TerminalManagerOptions extends TerminalSessionOptions {
    sandboxController?: SandboxController;
    record?: RecordingMode;
    recordDir?: string;
    recordFormat?: RecordingFormat;
    idleTimeLimit?: number;
    maxDuration?: number;
    inactivityTimeout?: number;
    maxSessions?: number;
    sessionIdleTimeout?: number;
}
export interface CreateSessionOptions {
    shell?: string;
    cols?: number;
    rows?: number;
}
export interface SessionMetadata {
    sessionId: string;
    shell: string;
    cols: number;
    rows: number;
    createdAt: string;
    lastActivityAt: string;
    isDefault: boolean;
}
/**
 * Manages one or more terminal sessions in a single process.
 *
 * The "default" session is created lazily on first access and is never
 * idle-evicted; it's what the existing single-session API operates on
 * when no sessionId is passed. Additional sessions can be created via
 * createSession() and addressed by ID.
 */
export declare class TerminalManager {
    private sessions;
    private defaultSessionId;
    private defaultSessionPromise;
    private idleCheckInterval;
    private options;
    private sandboxController?;
    private recordingManager;
    private autoRecordingId;
    private maxSessions;
    private sessionIdleTimeoutMs;
    constructor(options?: TerminalManagerOptions);
    private generateSessionId;
    private touchSession;
    private cleanupIdleSessions;
    /**
     * Wire recording hooks onto a session so its output is captured by any
     * active recordings.
     */
    private wireRecording;
    /**
     * Get or create the default session. Idempotent and concurrency-safe.
     */
    getSessionAsync(): Promise<TerminalSession>;
    getCurrentSession(): TerminalSession | null;
    /**
     * @deprecated Use getSessionAsync(). Throws if the default session
     * hasn't been created yet.
     */
    getSession(): TerminalSession;
    initSession(): Promise<TerminalSession>;
    private startAutoRecording;
    /**
     * Create a new non-default session.
     */
    createSession(opts?: CreateSessionOptions): Promise<SessionMetadata>;
    destroySession(sessionId: string): {
        success: boolean;
        message: string;
    };
    listSessions(): {
        sessions: SessionMetadata[];
        maxSessions: number;
        sessionIdleTimeout: number;
    };
    /**
     * Resolve a session by ID. If sessionId is omitted/undefined, returns the
     * default session (creating it if needed).
     */
    resolveSession(sessionId?: string): Promise<TerminalSession>;
    /**
     * Synchronous variant of resolveSession() — requires the session to
     * already exist. Throws if not created yet (used by sync tool handlers).
     */
    resolveSessionSync(sessionId?: string): TerminalSession;
    hasActiveSession(): boolean;
    write(data: string, sessionId?: string): void;
    getContent(sessionId?: string): string;
    getVisibleContent(sessionId?: string): string;
    getBufferInfo(sessionId?: string): BufferInfoResult;
    getAnsiContent(visibleOnly?: boolean, sessionId?: string): string;
    getTerminal(sessionId?: string): import("@xterm/headless").Terminal;
    takeScreenshot(sessionId?: string): ScreenshotResult;
    clear(sessionId?: string): void;
    resize(cols: number, rows: number, sessionId?: string): void;
    getDimensions(sessionId?: string): {
        cols: number;
        rows: number;
    };
    /**
     * Update the terminal title prefix for the default session.
     * The shell's precmd hook reads this from a file on each prompt.
     */
    setTitle(title: string): void;
    getRecordingManager(): RecordingManager;
    finalizeRecordings(exitCode: number): Promise<RecordingMetadata[]>;
    dispose(): void;
    disposeAsync(): Promise<void>;
    getSandboxController(): SandboxController | undefined;
}
//# sourceMappingURL=manager.d.ts.map
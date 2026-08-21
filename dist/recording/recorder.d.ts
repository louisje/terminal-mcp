import type { RecordingMode, RecordingFormat, RecordingMetadata, StopReason } from "./types.js";
/**
 * Recorder handles writing asciicast v2 format recordings
 *
 * Asciicast v2 format:
 * - First line: JSON header with version, dimensions, timestamp
 * - Subsequent lines: JSON arrays [time, type, data]
 *   - time: seconds since start (float)
 *   - type: "o" for output, "r" for resize
 *   - data: string content
 */
export declare class Recorder {
    readonly id: string;
    private mode;
    private format;
    private outputDir;
    private tempPath;
    private finalPath;
    private writeStream;
    private startTime;
    private bytesWritten;
    private finalized;
    private idleTimeLimit;
    private lastEventTime;
    private adjustedElapsed;
    private maxDuration;
    private inactivityTimeout;
    private maxDurationTimer;
    private inactivityTimer;
    private stopReason;
    private onAutoFinalize?;
    constructor(id: string, mode: RecordingMode, outputDir: string, format?: RecordingFormat, idleTimeLimit?: number, maxDuration?: number, // 60 minutes default
    inactivityTimeout?: number);
    /**
     * Start the recording
     * Writes the asciicast header to the temp file
     */
    start(width: number, height: number, env?: {
        SHELL?: string;
        TERM?: string;
    }): void;
    /**
     * Record output data
     */
    recordOutput(data: string): void;
    /**
     * Record terminal resize event
     */
    recordResize(cols: number, rows: number): void;
    /**
     * Finalize the recording
     * - For 'always' mode: move temp file to output dir
     * - For 'on-failure' mode: move if exitCode !== 0, delete otherwise
     *
     * Returns metadata about the recording
     */
    finalize(exitCode: number | null, stopReason?: StopReason): Promise<RecordingMetadata>;
    /**
     * Check if recording is active
     */
    isActive(): boolean;
    /**
     * Get the temp file path (for debugging/testing)
     */
    getTempPath(): string;
    /**
     * Get the final file path
     */
    getFinalPath(): string;
    private getElapsedSeconds;
    private writeLine;
    /**
     * Clear all active timers
     */
    private clearTimers;
    /**
     * Auto-finalize the recording due to timeout
     * Called internally when max duration or inactivity timeout is reached
     */
    private _autoFinalize;
    /**
     * Set callback for auto-finalize events (timeout triggered)
     */
    setOnAutoFinalize(callback: (metadata: RecordingMetadata) => void): void;
    /**
     * Get timeout configuration and remaining time
     */
    getTimeoutInfo(): {
        maxDuration: number;
        inactivityTimeout: number;
        elapsedSeconds: number;
        remainingMaxDuration: number;
    };
}
//# sourceMappingURL=recorder.d.ts.map
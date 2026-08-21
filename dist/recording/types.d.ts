/**
 * Recording mode determines when recordings are saved
 * - 'always': Save all recordings
 * - 'on-failure': Only save recordings when the session exits with non-zero code
 * - 'off': Disable recording
 */
export type RecordingMode = 'always' | 'on-failure' | 'off';
/**
 * Recording format (asciicast v2 is the only supported format)
 */
export type RecordingFormat = 'v2';
/**
 * Options for creating a recording
 */
export interface RecordingOptions {
    mode: RecordingMode;
    format: RecordingFormat;
    outputDir: string;
    idleTimeLimit?: number;
    maxDuration?: number;
    inactivityTimeout?: number;
}
/**
 * Asciicast v2 header (first line of the .cast file)
 */
export interface AsciicastHeader {
    version: 2;
    width: number;
    height: number;
    timestamp: number;
    env?: {
        SHELL?: string;
        TERM?: string;
    };
    title?: string;
}
/**
 * Asciicast event types:
 * - 'o': output (data written to terminal)
 * - 'r': resize (terminal dimensions changed)
 */
export type AsciicastOutputEvent = [number, 'o', string];
export type AsciicastResizeEvent = [number, 'r', string];
export type AsciicastEvent = AsciicastOutputEvent | AsciicastResizeEvent;
/**
 * Reason why recording stopped
 */
export type StopReason = 'explicit' | 'session_exit' | 'max_duration' | 'inactivity';
/**
 * Metadata returned after finalizing a recording
 */
export interface RecordingMetadata {
    id: string;
    path: string;
    tempPath: string;
    startTime: number;
    endTime: number;
    durationMs: number;
    bytesWritten: number;
    exitCode: number | null;
    mode: RecordingMode;
    saved: boolean;
    stopReason?: StopReason;
}
//# sourceMappingURL=types.d.ts.map
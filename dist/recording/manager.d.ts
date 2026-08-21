import { Recorder } from "./recorder.js";
import { RecordingMode, RecordingOptions, RecordingMetadata, StopReason } from "./types.js";
/**
 * RecordingManager tracks and manages multiple recordings
 */
export declare class RecordingManager {
    private recordings;
    private defaultOptions;
    constructor(options?: Partial<RecordingOptions>);
    /**
     * Create a new recording
     * Returns the recorder instance
     */
    createRecording(options?: Partial<RecordingOptions>): Recorder;
    /**
     * Get a recording by ID
     */
    getRecording(id: string): Recorder | undefined;
    /**
     * Check if a recording exists
     */
    hasRecording(id: string): boolean;
    /**
     * Get all active recordings
     */
    getActiveRecordings(): Recorder[];
    /**
     * Get the count of active recordings
     */
    getActiveCount(): number;
    /**
     * Record output to all active recordings
     */
    recordOutputToAll(data: string): void;
    /**
     * Record resize to all active recordings
     */
    recordResizeToAll(cols: number, rows: number): void;
    /**
     * Finalize a specific recording
     */
    finalizeRecording(id: string, exitCode: number | null, stopReason?: StopReason): Promise<RecordingMetadata | undefined>;
    /**
     * Finalize all active recordings
     * Returns array of metadata for all finalized recordings
     */
    finalizeAll(exitCode: number | null, stopReason?: StopReason): Promise<RecordingMetadata[]>;
    /**
     * Get default recording mode
     */
    getDefaultMode(): RecordingMode;
    /**
     * Get default output directory
     */
    getDefaultOutputDir(): string;
    /**
     * Check if auto-recording is enabled (mode !== 'off')
     */
    isAutoRecordingEnabled(): boolean;
    private generateId;
}
//# sourceMappingURL=manager.d.ts.map
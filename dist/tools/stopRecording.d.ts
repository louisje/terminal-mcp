import { z } from "zod";
import { TerminalManager } from "../terminal/index.js";
export declare const stopRecordingSchema: z.ZodObject<{
    recordingId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    recordingId: string;
}, {
    recordingId: string;
}>;
export declare const stopRecordingTool: {
    name: string;
    description: "Stop a recording and finalize the asciicast file. Returns metadata about the saved recording including the file path and duration.";
    inputSchema: {
        type: "object";
        properties: {
            recordingId: {
                type: string;
                description: "The recording ID returned by startRecording";
            };
        };
        required: string[];
    };
};
export declare function handleStopRecording(manager: TerminalManager, args: unknown): Promise<{
    content: Array<{
        type: "text";
        text: string;
    }>;
    isError?: boolean;
}>;
//# sourceMappingURL=stopRecording.d.ts.map
/**
 * Renders the terminal buffer to a PNG image via SVG.
 * Uses @xterm/headless buffer cell API for color extraction
 * and @resvg/resvg-js for SVG-to-PNG conversion.
 */
import type { Terminal } from "@xterm/headless";
export interface RenderOptions {
    /** Font family name (must be available to resvg). Default: 'JetBrains Mono' */
    fontFamily?: string;
    /** Directories to search for font files */
    fontDirs?: string[];
    /** Show macOS-style window chrome (traffic lights). Default: true */
    windowChrome?: boolean;
    /** Output scale multiplier. Default: 2 (retina) */
    scale?: number;
}
/**
 * Render an xterm.js Terminal buffer to a PNG image buffer.
 */
export declare function renderTerminalToPng(terminal: Terminal, options?: RenderOptions): Buffer;
//# sourceMappingURL=render.d.ts.map
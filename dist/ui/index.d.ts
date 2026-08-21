export interface BannerOptions {
    socketPath: string;
    cols: number;
    rows: number;
    shell: string;
    sandboxEnabled?: boolean;
}
/**
 * Generate the startup banner string
 */
export declare function getBanner(options: BannerOptions): string;
//# sourceMappingURL=index.d.ts.map
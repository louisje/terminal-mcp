export interface InstallResult {
    client: string;
    label: string;
    configPath: string;
    status: "installed" | "updated" | "already-present" | "removed" | "not-present" | "would-install" | "would-update" | "would-remove" | "skipped" | "error";
    detail: string;
    restartHint?: string;
}
export interface ClientAdapter {
    name: string;
    label: string;
    detect(): boolean;
    configPath(): string;
    install(dryRun: boolean): InstallResult;
    uninstall(dryRun: boolean): InstallResult;
}
export declare const adapters: ClientAdapter[];
export declare const adaptersByName: Map<string, ClientAdapter>;
//# sourceMappingURL=clients.d.ts.map
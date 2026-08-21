/**
 * Sandbox filesystem permission configuration
 */
export interface FilesystemPermissions {
    /** Paths with full read/write access */
    readWrite: string[];
    /** Paths with read-only access */
    readOnly: string[];
    /** Paths completely blocked from access */
    blocked: string[];
}
/**
 * Sandbox network permission configuration
 */
export interface NetworkPermissions {
    /** Network access mode */
    mode: "all" | "none" | "allowlist";
    /** Allowed domains when mode is 'allowlist' */
    allowedDomains?: string[];
}
/**
 * Full sandbox permissions configuration
 */
export interface SandboxPermissions {
    filesystem: FilesystemPermissions;
    network: NetworkPermissions;
}
/**
 * Default permissions for sandbox mode
 * Provides reasonable defaults while blocking sensitive directories
 * Allows shell-related files to be writable for normal shell operation
 */
export declare const DEFAULT_PERMISSIONS: SandboxPermissions;
/**
 * Expand ~ to home directory in a path
 */
export declare function expandPath(p: string): string;
/**
 * Load sandbox configuration from a JSON file
 */
export declare function loadConfigFromFile(filePath: string): SandboxPermissions;
/**
 * Merge user selections with defaults
 */
export declare function mergePermissions(base: SandboxPermissions, overrides: Partial<SandboxPermissions>): SandboxPermissions;
//# sourceMappingURL=config.d.ts.map
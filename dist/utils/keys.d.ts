/**
 * Key code mappings for terminal special keys
 * Maps human-readable key names to their ANSI escape sequences
 */
export declare const KEY_SEQUENCES: Record<string, string>;
/**
 * Get the escape sequence for a key name
 * @param key - The key name (e.g., "Enter", "Ctrl+C", "ArrowUp")
 * @returns The escape sequence or null if not found
 */
export declare function getKeySequence(key: string): string | null;
/**
 * Get all available key names
 */
export declare function getAvailableKeys(): string[];
//# sourceMappingURL=keys.d.ts.map
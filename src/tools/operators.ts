import { exec } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { z } from "zod";
import type { ToolDefinition } from "./definitions.js";

const execAsync = promisify(exec);
const operatorCwd = process.cwd();
type TextResult = { content: Array<{ type: "text"; text: string }>; isError?: boolean };

const readSchema = z.object({ path: z.string(), offset: z.number().int().positive().optional(), limit: z.number().int().positive().optional() });
const writeSchema = z.object({ path: z.string(), content: z.string() });
const editSchema = z.object({ path: z.string(), edits: z.array(z.object({ oldText: z.string(), newText: z.string() })).min(1) });
const bashSchema = z.object({ command: z.string(), timeout: z.number().positive().optional() });

const result = (value: string, isError = false): TextResult => ({ content: [{ type: "text", text: value }], ...(isError ? { isError: true } : {}) });

export const operatorToolDefinitions: ToolDefinition[] = [
  { name: "read", description: "Read a text file directly without using the PTY or shell. offset is a 1-indexed line number.", inputSchema: { type: "object", properties: { path: { type: "string" }, offset: { type: "integer", minimum: 1 }, limit: { type: "integer", minimum: 1 } }, required: ["path"] } },
  { name: "write", description: "Write a text file directly, creating parent directories and overwriting the file. Prefer this over shell redirection for whole-file writes.", inputSchema: { type: "object", properties: { path: { type: "string" }, content: { type: "string" } }, required: ["path", "content"] } },
  { name: "edit", description: "Apply exact unique non-overlapping string replacements against a file's original content. This is replacement-only, not an append/prepend primitive.", inputSchema: { type: "object", properties: { path: { type: "string" }, edits: { type: "array", items: { type: "object", properties: { oldText: { type: "string" }, newText: { type: "string" } }, required: ["oldText", "newText"] } } }, required: ["path", "edits"] } },
  { name: "bash", description: "Execute a one-shot non-interactive command in a fresh stateless /bin/sh subprocess in the terminal-mcp startup working directory. Returns stdout/stderr after completion; prefer this over PTY type/sendKey/getContent unless persistent shell state, interaction, TTY behavior, or live observability is needed.", inputSchema: { type: "object", properties: { command: { type: "string" }, timeout: { type: "number", description: "Timeout in seconds" } }, required: ["command"] } },
];

const localPath = (path: string): string => resolve(operatorCwd, path);

export async function handleOperatorTool(name: string, args: unknown): Promise<TextResult> {
  switch (name) {
    case "read": {
      const parsed = readSchema.parse(args);
      const lines = (await readFile(localPath(parsed.path), "utf8")).split("\n");
      const start = (parsed.offset ?? 1) - 1;
      if (start >= lines.length) throw new Error(`Offset ${parsed.offset} is beyond end of file`);
      return result(lines.slice(start, parsed.limit === undefined ? undefined : start + parsed.limit).join("\n"));
    }
    case "write": {
      const parsed = writeSchema.parse(args);
      const target = localPath(parsed.path);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, parsed.content, "utf8");
      return result(`Wrote ${parsed.path}`);
    }
    case "edit": {
      const parsed = editSchema.parse(args);
      const target = localPath(parsed.path);
      const original = await readFile(target, "utf8");
      const ranges: Array<{ start: number; end: number; newText: string }> = [];
      for (const edit of parsed.edits) {
        if (!edit.oldText) throw new Error("Each oldText must be non-empty");
        const first = original.indexOf(edit.oldText);
        if (first < 0) throw new Error(`oldText was not found in ${parsed.path}`);
        if (first !== original.lastIndexOf(edit.oldText)) throw new Error(`oldText must match exactly once in ${parsed.path}`);
        ranges.push({ start: first, end: first + edit.oldText.length, newText: edit.newText });
      }
      ranges.sort((a, b) => a.start - b.start);
      for (let i = 1; i < ranges.length; i++) if (ranges[i - 1].end > ranges[i].start) throw new Error("Edits must not overlap");
      let updated = original;
      for (const edit of [...ranges].reverse()) updated = updated.slice(0, edit.start) + edit.newText + updated.slice(edit.end);
      await writeFile(target, updated, "utf8");
      return result(`Edited ${parsed.path}`);
    }
    case "bash": {
      const parsed = bashSchema.parse(args);
      try {
        const output = await execAsync(parsed.command, { cwd: operatorCwd, timeout: parsed.timeout === undefined ? undefined : parsed.timeout * 1000, maxBuffer: 10 * 1024 * 1024, shell: "/bin/sh" });
        return result(`${output.stdout}${output.stderr}`);
      } catch (error) {
        const failure = error as { stdout?: string; stderr?: string; code?: number | string; killed?: boolean; signal?: string };
        const output = `${failure.stdout ?? ""}${failure.stderr ?? ""}`;
        const suffix = failure.killed ? `Command timed out after ${parsed.timeout} second(s).` : `Command exited with code ${failure.code ?? failure.signal ?? "unknown"}.`;
        return result(output ? `${output}\n${suffix}` : suffix, true);
      }
    }
    default: throw new Error(`Unknown operator tool: ${name}`);
  }
}

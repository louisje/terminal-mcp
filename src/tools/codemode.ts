/** Opt-in QuickJS orchestration around the existing Terminal MCP tools. */
import { CodemodeSandbox, loadQuickJSWasm, type CodemodeTool } from "@earendil-works/pi-codemode";
import { fileURLToPath } from "node:url";
import type { TerminalManager } from "../terminal/index.js";
import { getToolDefinitions, type ToolDefinition } from "./definitions.js";
import { dispatchTool } from "./index.js";

export const codemodeDefinition: ToolDefinition = {
  name: "codemode",
  description: "Execute JavaScript in an isolated QuickJS sandbox. Available functions: tools.<name>(args), ALL_TOOLS, text(value), image(value), exit(). Discover tool names and descriptions with ALL_TOOLS.filter(...). Nested tool output stays out of the model context unless emitted with text().",
  inputSchema: { type: "object", properties: { code: { type: "string", description: "JavaScript body; use await tools.name(args) and text(result)." } }, required: ["code"] },
};

type ToolResult = { content?: Array<{ type: string; text?: string; data?: string; mimeType?: string }>; isError?: boolean; structuredContent?: unknown };

export async function runCodemodeWithDispatch(
  args: unknown,
  definitions: ToolDefinition[],
  dispatch: (name: string, args: Record<string, unknown>) => Promise<unknown>,
) {
  const code = (args as { code?: unknown } | undefined)?.code;
  if (typeof code !== "string" || !code.trim()) throw new Error("codemode requires nonempty code");
  const tools: CodemodeTool[] = definitions.map((definition) => ({
    name: definition.name,
    description: definition.description,
    inputSchema: definition.inputSchema,
    execute: async (value) => {
      const result = await dispatch(definition.name, (value ?? {}) as Record<string, unknown>) as ToolResult;
      if (result.isError) throw new Error(result.content?.filter(c => c.type === "text").map(c => c.text).join("\n") || `Tool ${definition.name} failed`);
      if (result.structuredContent !== undefined) return result.structuredContent;
      const content = result.content ?? [];
      if (content.length === 1 && content[0].type === "text") return content[0].text;
      return content;
    },
  }));
  const sandbox = new CodemodeSandbox({
    timeoutMs: 60_000,
    tools,
    wasm: loadQuickJSWasm(fileURLToPath(new URL("./quickjs.wasm", import.meta.url))),
    workerUrl: new URL("./codemode-worker.js", import.meta.url),
  });
  try {
    const result = await sandbox.execute(code);
    const content = result.output.map(item => item.type === "text"
      ? { type: "text" as const, text: item.text }
      : { type: "image" as const, data: item.data, mimeType: item.mimeType });
    if (result.ok && result.value !== undefined) content.push({ type: "text", text: JSON.stringify(result.value) });
    if (!result.ok) content.push({ type: "text", text: result.error.stack ?? result.error.message });
    return { content, isError: !result.ok };
  } finally {
    await sandbox.close();
  }
}

export function runCodemode(manager: TerminalManager, args: unknown, piOperators: boolean, piExtraOperators: boolean) {
  return runCodemodeWithDispatch(args, getToolDefinitions(piOperators, piExtraOperators),
    (name, params) => dispatchTool(manager, name, params, piOperators, piExtraOperators));
}

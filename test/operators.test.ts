import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { getToolDefinitions } from "../src/tools/definitions.ts";
import { handleOperatorTool } from "../src/tools/operators.ts";

test("tool definitions keep 15 by default and expose 19 with pi operators", () => {
  assert.equal(getToolDefinitions().length, 15);
  assert.equal(getToolDefinitions(true).length, 19);
  assert.deepEqual(getToolDefinitions(true).slice(-4).map((tool) => tool.name), ["read", "write", "edit", "bash"]);
});

test("read, write, and edit implement the basic operator semantics", async () => {
  const dir = await mkdtemp(join(tmpdir(), "terminal-mcp-operators-"));
  const path = join(dir, "nested", "file.txt");
  try {
    await handleOperatorTool("write", { path, content: "one\ntwo\nthree" });
    const read = await handleOperatorTool("read", { path, offset: 2, limit: 1 });
    assert.equal(read.content[0]?.text, "two");
    await handleOperatorTool("edit", { path, edits: [{ oldText: "two", newText: "TWO" }, { oldText: "three", newText: "THREE" }] });
    assert.equal(await readFile(path, "utf8"), "one\nTWO\nTHREE");
    await assert.rejects(() => handleOperatorTool("edit", { path, edits: [{ oldText: "one", newText: "x" }, { oldText: "one\nTWO", newText: "y" }] }), /overlap/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("bash returns output, exit failures, and timeout failures", async () => {
  const ok = await handleOperatorTool("bash", { command: "printf operator-ok" });
  assert.equal(ok.content[0]?.text, "operator-ok");

  const failed = await handleOperatorTool("bash", { command: "printf failed >&2; exit 7" });
  assert.equal(failed.isError, true);
  assert.match(failed.content[0]?.text ?? "", /failed/);
  assert.match(failed.content[0]?.text ?? "", /code 7/);

  const timedOut = await handleOperatorTool("bash", { command: "sleep 1", timeout: 0.05 });
  assert.equal(timedOut.isError, true);
  assert.match(timedOut.content[0]?.text ?? "", /timed out/);
});

import test from "node:test";
import assert from "node:assert/strict";
import { handleGetContent, getContentSchema } from "../src/tools/getContent.ts";
import type { TerminalManager } from "../src/terminal/index.ts";

// Mock TerminalManager
const mockManager = {
  getContent: () => "test content",
  getVisibleContent: () => "visible content",
} as TerminalManager;

test("getContentSchema defaults: visibleOnly=true, delay=0", () => {
  const parsed = getContentSchema.parse({});
  assert.equal(parsed.visibleOnly, true);
  assert.equal(parsed.delay, 0);
});

test("getContentSchema rejects negative delay", () => {
  assert.throws(() => getContentSchema.parse({ delay: -1 }));
});

test("getContentSchema accepts valid delay", () => {
  const parsed = getContentSchema.parse({ delay: 100 });
  assert.equal(parsed.delay, 100);
});

test("handleGetContent returns visible content by default", async () => {
  const result = await handleGetContent(mockManager, {});
  assert.equal(result.content[0]?.text, "visible content");
});

test("handleGetContent returns visible content when visibleOnly=true", async () => {
  const result = await handleGetContent(mockManager, { visibleOnly: true });
  assert.equal(result.content[0]?.text, "visible content");
});

test("handleGetContent delays when delay > 0", async () => {
  const start = Date.now();
  const result = await handleGetContent(mockManager, { delay: 50 });
  const elapsed = Date.now() - start;

  assert.ok(elapsed >= 40, `Expected at least 40ms, got ${elapsed}ms`);
  assert.equal(result.content[0]?.text, "visible content");
});

test("handleGetContent returns immediately when delay=0", async () => {
  const start = Date.now();
  await handleGetContent(mockManager, { delay: 0 });
  const elapsed = Date.now() - start;

  assert.ok(elapsed < 20, `Expected less than 20ms, got ${elapsed}ms`);
});

import test from "node:test";
import assert from "node:assert/strict";
import { handleGetContent, getContentSchema } from "../src/tools/getContent.ts";
import type { TerminalManager } from "../src/terminal/index.ts";
import { TerminalSession } from "../src/terminal/session.ts";

// Mock TerminalManager
const mockManager = {
  getContent: () => "test content",
  getVisibleContent: () => "visible content",
} as TerminalManager;

function createSessionWithLines(lines: string[]): TerminalSession {
  const session = Object.create(TerminalSession.prototype) as TerminalSession;
  const mutableSession = session as unknown as {
    disposed: boolean;
    terminal: {
      buffer: {
        active: {
          length: number;
          getLine: (index: number) => { translateToString: (_trimRight: boolean) => string } | undefined;
        };
      };
    };
  };

  mutableSession.disposed = false;
  mutableSession.terminal = {
    buffer: {
      active: {
        length: lines.length,
        getLine: (index: number) => {
          const line = lines[index];
          return line === undefined
            ? undefined
            : { translateToString: () => line };
        },
      },
    },
  };

  return session;
}

test("getContentSchema defaults: visibleOnly=undefined, maxLines=undefined, delay=0", () => {
  const parsed = getContentSchema.parse({});
  assert.equal(parsed.visibleOnly, undefined);
  assert.equal(parsed.maxLines, undefined);
  assert.equal(parsed.delay, 0);
});

test("getContentSchema rejects negative delay", () => {
  assert.throws(() => getContentSchema.parse({ delay: -1 }));
});

test("getContentSchema rejects invalid maxLines", () => {
  assert.throws(() => getContentSchema.parse({ maxLines: -1 }));
  assert.throws(() => getContentSchema.parse({ maxLines: 1.5 }));
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

test("handleGetContent passes default maxLines when visibleOnly=false", async () => {
  let receivedMaxLines: number | undefined;
  const manager = {
    getContent: (maxLines?: number) => {
      receivedMaxLines = maxLines;
      return "full content";
    },
    getVisibleContent: () => "visible content",
  } as TerminalManager;

  const result = await handleGetContent(manager, { visibleOnly: false });

  assert.equal(receivedMaxLines, 100);
  assert.equal(result.content[0]?.text, "full content");
});

test("handleGetContent passes maxLines=0 through when requesting full buffer", async () => {
  let receivedMaxLines: number | undefined;
  const manager = {
    getContent: (maxLines?: number) => {
      receivedMaxLines = maxLines;
      return "all content";
    },
    getVisibleContent: () => "visible content",
  } as TerminalManager;

  const result = await handleGetContent(manager, { visibleOnly: false, maxLines: 0 });

  assert.equal(receivedMaxLines, 0);
  assert.equal(result.content[0]?.text, "all content");
});

test("handleGetContent applies maxLines to visible content when visibleOnly=true", async () => {
  const manager = {
    getContent: () => "full content",
    getVisibleContent: () => "line 1\nline 2\nline 3\nline 4\nline 5",
  } as TerminalManager;

  const result = await handleGetContent(manager, { visibleOnly: true, maxLines: 2 });

  assert.equal(result.content[0]?.text, "line 4\nline 5");
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

test("TerminalSession.getContent returns only the last N lines", () => {
  const session = createSessionWithLines(["line 1", "line 2", "line 3"]);

  assert.equal(session.getContent(2), "line 2\nline 3");
});

test("TerminalSession.getContent trims trailing empty lines before applying maxLines", () => {
  const session = createSessionWithLines(["line 1", "line 2", "", ""]);

  assert.equal(session.getContent(1), "line 2");
});

test("TerminalSession.getContent returns the full buffer when maxLines=0", () => {
  const session = createSessionWithLines(["line 1", "line 2", "line 3"]);

  assert.equal(session.getContent(0), "line 1\nline 2\nline 3");
});

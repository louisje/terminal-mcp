import test from "node:test";
import assert from "node:assert/strict";
import { getBufferInfoSchema, handleGetBufferInfo } from "../src/tools/getBufferInfo.ts";
import type { TerminalManager } from "../src/terminal/index.ts";
import { TerminalSession } from "../src/terminal/session.ts";

function createSessionWithBufferInfo(length: number, scrollbackLines: number, viewportRows: number): TerminalSession {
  const session = Object.create(TerminalSession.prototype) as TerminalSession;
  const mutableSession = session as unknown as {
    disposed: boolean;
    terminal: {
      rows: number;
      buffer: {
        active: {
          length: number;
          baseY: number;
        };
      };
    };
  };

  mutableSession.disposed = false;
  mutableSession.terminal = {
    rows: viewportRows,
    buffer: {
      active: {
        length,
        baseY: scrollbackLines,
      },
    },
  };

  return session;
}

test("getBufferInfoSchema accepts empty arguments", () => {
  const parsed = getBufferInfoSchema.parse({});
  assert.deepEqual(parsed, {});
});

test("handleGetBufferInfo returns serialized buffer metadata", () => {
  const manager = {
    getBufferInfo: () => ({
      length: 125,
      scrollbackLines: 100,
      viewportRows: 25,
    }),
  } as TerminalManager;

  const result = handleGetBufferInfo(manager, undefined);

  assert.deepEqual(JSON.parse(result.content[0]?.text ?? "{}"), {
    length: 125,
    scrollbackLines: 100,
    viewportRows: 25,
  });
});

test("TerminalSession.getBufferInfo returns raw buffer metrics", () => {
  const session = createSessionWithBufferInfo(125, 100, 25);

  assert.deepEqual(session.getBufferInfo(), {
    length: 125,
    scrollbackLines: 100,
    viewportRows: 25,
  });
});
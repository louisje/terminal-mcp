import test from "node:test";
import assert from "node:assert/strict";
import { notifyClientConnected } from "../src/client.ts";

test("notifyClientConnected sends the internal connection notice", async () => {
  const calls: Array<{ method: string; params?: Record<string, unknown> }> = [];

  await notifyClientConnected(async (method, params) => {
    calls.push({ method, params });
    return undefined;
  }, {
    title: "Augment",
  });

  assert.deepEqual(calls, [
    {
      method: "clientConnected",
      params: { title: "Augment" },
    },
  ]);
});

test("notifyClientConnected omits title when not provided", async () => {
  const calls: Array<{ method: string; params?: Record<string, unknown> }> = [];

  await notifyClientConnected(async (method, params) => {
    calls.push({ method, params });
    return undefined;
  }, {});

  assert.deepEqual(calls, [
    {
      method: "clientConnected",
      params: undefined,
    },
  ]);
});
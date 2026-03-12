import test from "node:test";
import assert from "node:assert/strict";
import { handleSleep, sleepSchema } from "../src/tools/sleep.ts";

test("sleepSchema defaults to 5000 milliseconds", () => {
  assert.equal(sleepSchema.parse({}).milliseconds, 5000);
});

test("sleepSchema rejects negative values", () => {
  assert.throws(() => sleepSchema.parse({ milliseconds: -1 }));
});

test("handleSleep sleeps approximately the requested duration", async () => {
  const start = Date.now();
  const result = await handleSleep({} as never, { milliseconds: 50 });
  const elapsed = Date.now() - start;

  assert.ok(elapsed >= 40, `Expected at least 40ms, got ${elapsed}ms`);
  assert.match(result.content[0]?.text ?? "", /^Slept for 50 milliseconds$/);
});
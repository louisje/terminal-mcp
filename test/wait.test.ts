import test from "node:test";
import assert from "node:assert/strict";
import { handleWait, waitSchema } from "../src/tools/wait.ts";

test("waitSchema defaults to 5000 milliseconds", () => {
  assert.equal(waitSchema.parse({}).milliseconds, 5000);
});

test("waitSchema rejects negative values", () => {
  assert.throws(() => waitSchema.parse({ milliseconds: -1 }));
});

test("handleWait waits approximately the requested duration", async () => {
  const start = Date.now();
  const result = await handleWait({} as never, { milliseconds: 50 });
  const elapsed = Date.now() - start;

  assert.ok(elapsed >= 40, `Expected at least 40ms, got ${elapsed}ms`);
  assert.match(result.content[0]?.text ?? "", /^Waited 50 milliseconds$/);
});
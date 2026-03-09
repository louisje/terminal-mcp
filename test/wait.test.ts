import test from "node:test";
import assert from "node:assert/strict";
import { handleWait, waitSchema } from "../src/tools/wait.ts";

test("waitSchema defaults to 5 seconds", () => {
  assert.equal(waitSchema.parse({}).seconds, 5);
});

test("waitSchema rejects negative values", () => {
  assert.throws(() => waitSchema.parse({ seconds: -1 }));
});

test("handleWait waits approximately the requested duration", async () => {
  const start = Date.now();
  const result = await handleWait({} as never, { seconds: 0.05 });
  const elapsed = Date.now() - start;

  assert.ok(elapsed >= 40, `Expected at least 40ms, got ${elapsed}ms`);
  assert.match(result.content[0]?.text ?? "", /^Waited 0\.05 seconds$/);
});
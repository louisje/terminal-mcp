import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { handleOperatorTool } from '../src/tools/operators.ts';

// Aborting the host signal must cancel a running one-shot command.
test('bash operator respects abort signal', { timeout: 12000 }, async () => {
  const controller = new AbortController();
  const pending = handleOperatorTool('bash', { command: 'sleep 10' }, undefined, controller.signal);
  setTimeout(() => controller.abort(), 80);
  await assert.rejects(pending, /Command aborted/);
});

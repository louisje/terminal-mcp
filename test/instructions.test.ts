import test from 'node:test';
import assert from 'node:assert/strict';
import { getServerInstructions } from '../src/server.ts';

test('codemode retains terminal safety and session guidance', () => {
  const value = getServerInstructions({ codemode: true, piOperators: true });
  assert.match(value, /First call tools.getContent\(\{\}\)/);
  assert.match(value, /ALL_TOOLS/);
  assert.match(value, /Promise\.allSettled/);
  assert.match(value, /stateless/);
  assert.doesNotMatch(getServerInstructions(), /QuickJS/);
  assert.doesNotMatch(getServerInstructions({ codemode: true }), /Pi operators are enabled/);
});

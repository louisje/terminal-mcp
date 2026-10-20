import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function connect(args) {
  const client = new Client({ name: 'codemode-test', version: '1.0.0' });
  await client.connect(new StdioClientTransport({ command: process.execPath, args: ['dist/index.js', '--headless', ...args], stderr: 'pipe' }));
  return client;
}

test('codemode exposes only one tool and invokes opted-in operators', { timeout: 20000 }, async () => {
  const client = await connect(['--codemode', '--pi-operators']);
  try {
    assert.deepEqual((await client.listTools()).tools.map(t => t.name), ['codemode']);
    const result = await client.callTool({ name: 'codemode', arguments: { code: 'text(await tools.bash({command:"printf codemode-ok"}))' } });
    assert.equal(result.isError, false);
    assert.equal(result.content[0].text, 'codemode-ok');
    const names = await client.callTool({ name: 'codemode', arguments: { code: 'text(ALL_TOOLS.map(x=>x.name).includes("bash"))' } });
    assert.equal(names.content[0].text, 'true');
    const failure = await client.callTool({ name: 'codemode', arguments: { code: 'throw new Error("intentional")' } });
    assert.equal(failure.isError, true);
  } finally { await client.close(); }
});

test('codemode does not grant disabled operators', { timeout: 20000 }, async () => {
  const client = await connect(['--codemode']);
  try {
    const result = await client.callTool({ name: 'codemode', arguments: { code: 'text(ALL_TOOLS.some(x=>x.name==="bash"))' } });
    assert.equal(result.content[0].text, 'false');
  } finally { await client.close(); }
});

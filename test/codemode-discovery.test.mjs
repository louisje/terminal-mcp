import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function evaluate(code, pi = false) {
  const client = new Client({ name: 'discovery-test', version: '1' });
  await client.connect(new StdioClientTransport({command:process.execPath,args:['dist/index.js','--headless','--codemode',...(pi ? ['--pi-operators'] : [])],stderr:'pipe'}));
  try {
    const result = await client.callTool({name:'codemode',arguments:{code}});
    assert.equal(result.isError, false, JSON.stringify(result));
    return JSON.parse(result.content[0].text);
  } finally { await client.close(); }
}

test('codemode discovery functions identify tools, schemas and namespace', {timeout:20000}, async () => {
  const found = await evaluate('text(await searchTools("terminal", {limit:3, namespace:"terminal"}))');
  assert.ok(found.length <= 3 && found.length > 0);
  const tool = await evaluate('text(await describeTool("bash"))', true);
  assert.equal(tool.name, 'bash');
  assert.ok(tool.inputSchema.required.includes('command'));
  assert.equal(await evaluate('text(await describeTool("bash"))'), null);
  const ns = await evaluate('text(await describeNamespace("terminal"))');
  assert.equal(ns.name, 'terminal');
  assert.equal(ns.tools.includes('bash'), false);
  assert.deepEqual(await evaluate('text(await searchTools("anything", {namespace:"another"}))'), []);
});

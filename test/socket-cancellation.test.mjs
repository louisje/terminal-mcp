import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { connect } from 'node:net';
import { createToolProxyServer } from '../src/transport/socket.ts';
import { TerminalManager } from '../src/terminal/index.ts';

test('socket cancellation aborts an in-flight bash command', { timeout: 12000 }, async () => {
  const dir = mkdtempSync(join(tmpdir(), 'tmcp-socket-abort-'));
  const marker = join(dir, 'should-not-exist');
  const server = createToolProxyServer(join(dir, 'socket'), new TerminalManager(), undefined, true);
  let socket;
  try {
    await new Promise(resolve => server.once('listening', resolve));
    socket = connect(join(dir, 'socket'));
    await new Promise(resolve => socket.once('connect', resolve));
    socket.write(JSON.stringify({id:1,method:'bash',params:{command:`sleep 2; touch '${marker}'`}}) + '\n');
    await new Promise(resolve => setTimeout(resolve, 100));
    socket.write(JSON.stringify({id:2,method:'cancel',params:{requestId:1}}) + '\n');
    await new Promise(resolve => setTimeout(resolve, 2400));
    assert.equal(existsSync(marker), false, 'cancelled shell must not finish delayed side effect');
  } finally {
    socket?.destroy();
    await new Promise(resolve => server.close(resolve));
    rmSync(dir,{recursive:true,force:true});
  }
});

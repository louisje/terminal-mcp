import test from "node:test";
import assert from "node:assert/strict";
import * as net from "net";
import * as os from "os";
import * as path from "path";
import * as fs from "fs/promises";
import { once } from "events";
import { createToolProxyServer } from "../src/transport/socket.ts";
import { TerminalManager } from "../src/terminal/index.js";

test("createToolProxyServer forwards clientConnected notifications to the interactive notifier", async () => {
  const socketPath = path.join(os.tmpdir(), `terminal-mcp-test-${process.pid}-${Date.now()}.sock`);
  const notifications: Array<{ title?: string }> = [];
  const server = createToolProxyServer(
    socketPath,
    {} as TerminalManager,
    (params) => notifications.push(params)
  );

  const socketsToClose: net.Socket[] = [];

  try {
    if (!server.listening) {
      await once(server, "listening");
    }

    const client = net.createConnection(socketPath);
    socketsToClose.push(client);
    await once(client, "connect");

    const responsePromise = new Promise<string>((resolve, reject) => {
      let buffer = "";
      client.on("data", (chunk) => {
        buffer += chunk.toString();
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        if (lines[0]) {
          resolve(lines[0]);
        }
      });
      client.on("error", reject);
    });

    client.write(JSON.stringify({
      id: 1,
      method: "clientConnected",
      params: { title: "Augment" },
    }) + "\n");

    const response = JSON.parse(await responsePromise) as { id: number; result?: unknown };

    assert.equal(response.id, 1);
    assert.deepEqual(response.result, { ok: true });
    assert.deepEqual(notifications, [{ title: "Augment" }]);
  } finally {
    for (const socket of socketsToClose) {
      socket.destroy();
    }

    await new Promise<void>((resolve) => server.close(() => resolve()));
    await fs.unlink(socketPath).catch(() => undefined);
  }
});
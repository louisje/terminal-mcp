import test from "node:test";
import assert from "node:assert/strict";
import { buildClientInitMessage } from "../src/client.ts";

test("buildClientInitMessage omits from suffix when not provided", () => {
  const message = buildClientInitMessage({
    version: "2.2.0",
    hostname: "louis-iMac.local",
    timestamp: "2026-03-18T08:34:03.100Z",
  });

  assert.equal(message, ": client 2.2.0 louis-iMac.local 2026-03-18T08:34:03.100Z");
});

test("buildClientInitMessage appends from suffix when provided", () => {
  const message = buildClientInitMessage({
    version: "2.2.0",
    hostname: "louis-iMac.local",
    timestamp: "2026-03-18T08:34:03.100Z",
    from: "Augment",
  });

  assert.equal(message, ": client 2.2.0 louis-iMac.local 2026-03-18T08:34:03.100Z from Augment");
});

test("buildClientInitMessage shell-escapes unsafe from values", () => {
  const message = buildClientInitMessage({
    version: "2.2.0",
    hostname: "louis-iMac.local",
    timestamp: "2026-03-18T08:34:03.100Z",
    from: "Augment Agent",
  });

  assert.equal(message, ": client 2.2.0 louis-iMac.local 2026-03-18T08:34:03.100Z from 'Augment Agent'");
});
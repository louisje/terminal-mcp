import test from "node:test";
import assert from "node:assert/strict";
import { handleType, typeSchema } from "../src/tools/type.ts";
import { TerminalManager } from "../src/terminal/index.js";

test("typeSchema parses text correctly", () => {
  const result = typeSchema.parse({ text: "echo hello" });
  assert.equal(result.text, "echo hello");
  assert.equal(result.autoSubmit, false);
});

test("typeSchema defaults autoSubmit to false", () => {
  const result = typeSchema.parse({ text: "ls" });
  assert.equal(result.autoSubmit, false);
});

test("typeSchema accepts autoSubmit true", () => {
  const result = typeSchema.parse({ text: "pwd", autoSubmit: true });
  assert.equal(result.autoSubmit, true);
});

test("typeSchema rejects invalid input", () => {
  assert.throws(() => typeSchema.parse({}));
  assert.throws(() => typeSchema.parse({ text: 123 }));
  assert.throws(() => typeSchema.parse({ autoSubmit: true }));
});

test("handleType without autoSubmit returns typed message", async () => {
  // Create a mock terminal manager
  const mockManager = {
    write: () => {},
    getContent: () => "mock content",
  } as TerminalManager;

  const result = await handleType(mockManager, { text: "echo test" });
  
  assert.equal(result.content[0]?.type, "text");
  assert.match(result.content[0]?.text ?? "", /Typed \d+ character\(s\) to terminal/);
});

test("handleType with autoSubmit returns terminal content", async () => {
  // Create a mock terminal manager
  const mockContent = "$ echo test\ntest\n$ ";
  const mockManager = {
    write: () => {},
    getContent: () => mockContent,
  } as TerminalManager;

  const result = await handleType(mockManager, { 
    text: "echo test", 
    autoSubmit: true 
  });
  
  assert.equal(result.content[0]?.type, "text");
  assert.equal(result.content[0]?.text, mockContent);
});

test("handleType with autoSubmit handles empty terminal", async () => {
  // Create a mock terminal manager with empty content
  const mockManager = {
    write: () => {},
    getContent: () => "",
  } as TerminalManager;

  const result = await handleType(mockManager, { 
    text: "ls", 
    autoSubmit: true 
  });
  
  assert.equal(result.content[0]?.type, "text");
  assert.equal(result.content[0]?.text, "(empty terminal)");
});

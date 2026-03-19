import test from "node:test";
import assert from "node:assert/strict";
import {
  buildSetWindowTitleSequence,
  createClientTitleSetter,
  normalizeTitle,
} from "../src/utils/title.ts";

test("normalizeTitle returns undefined when not provided", () => {
  assert.equal(normalizeTitle(undefined), undefined);
  assert.equal(normalizeTitle("   \n\t "), undefined);
});

test("normalizeTitle compacts whitespace and preserves the full label", () => {
  assert.equal(normalizeTitle("  My   Very   Long Assistant  "), "My Very Long Assistant");
});

test("buildSetWindowTitleSequence strips control characters from the title", () => {
  assert.equal(
    buildSetWindowTitleSequence("Bad\u0007Title\u001bX"),
    "\u001b]0;BadTitleX\u0007"
  );
});

test("createClientTitleSetter writes the normalized title once", () => {
  const writes: string[] = [];

  const setTitle = createClientTitleSetter((data) => {
    writes.push(data);
  });

  setTitle("  Augment   Agent ");

  assert.deepEqual(writes, [
    buildSetWindowTitleSequence("Augment Agent"),
  ]);
});

test("createClientTitleSetter ignores empty titles", () => {
  const writes: string[] = [];

  const setTitle = createClientTitleSetter((data) => {
    writes.push(data);
  });

  setTitle(undefined);
  setTitle("   \t  ");

  assert.deepEqual(writes, []);
});
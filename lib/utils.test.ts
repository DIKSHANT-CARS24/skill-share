import test from "node:test";
import assert from "node:assert/strict";
import { hasSkillBeenEdited } from "./utils.ts";

test("hasSkillBeenEdited returns false when created and updated match", () => {
  assert.equal(
    hasSkillBeenEdited("2026-04-01T10:00:00.000Z", "2026-04-01T10:00:00.000Z"),
    false,
  );
});

test("hasSkillBeenEdited returns true when updated is after created", () => {
  assert.equal(
    hasSkillBeenEdited("2026-04-01T10:00:00.000Z", "2026-04-03T12:30:00.000Z"),
    true,
  );
});

test("hasSkillBeenEdited safely falls back to false for invalid dates", () => {
  assert.equal(hasSkillBeenEdited("invalid", "2026-04-03T12:30:00.000Z"), false);
});

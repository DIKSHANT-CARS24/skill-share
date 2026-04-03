import test from "node:test";
import assert from "node:assert/strict";
import {
  buildSkillChangeSummary,
  detectSkillChangeDetails,
  formatSkillVersionNumber,
} from "./skill-history.ts";

test("buildSkillChangeSummary captures metadata-only edits without a version bump", () => {
  const result = buildSkillChangeSummary({
    previousTitle: "Monthly close summary",
    nextTitle: "Monthly close summary",
    previousCategoryName: "Finance",
    nextCategoryName: "Finance",
    previousDescription: "Old description",
    nextDescription: "New description",
    previousVersion: 2,
    nextVersion: 2,
  });

  assert.deepEqual(result.changedFields, ["description"]);
  assert.equal(result.summary, "Updated description.");
});

test("buildSkillChangeSummary combines multiple edits into one entry", () => {
  const result = buildSkillChangeSummary({
    previousTitle: "Old title",
    nextTitle: "New title",
    previousCategoryName: "Finance",
    nextCategoryName: "Operations",
    previousDescription: "Old description",
    nextDescription: "New description",
    replacementFileName: "updated-skill.md",
    previousVersion: 1,
    nextVersion: 2,
  });

  assert.equal(
    result.summary,
    'Updated title to "New title", changed category to Operations, updated description, replaced the markdown file with updated-skill.md, and set version to v2.',
  );
});

test("detectSkillChangeDetails keeps field order stable", () => {
  const changes = detectSkillChangeDetails({
    previousTitle: "Old title",
    nextTitle: "New title",
    previousCategoryName: "Finance",
    nextCategoryName: "Operations",
    previousDescription: "Same description",
    nextDescription: "Same description",
    previousVersion: 1,
    nextVersion: 1,
  });

  assert.deepEqual(
    changes.map((change) => change.field),
    ["title", "category"],
  );
});

test("formatSkillVersionNumber keeps decimal values readable", () => {
  assert.equal(formatSkillVersionNumber(2), "2");
  assert.equal(formatSkillVersionNumber(2.5), "2.5");
  assert.equal(formatSkillVersionNumber("3.25"), "3.25");
});

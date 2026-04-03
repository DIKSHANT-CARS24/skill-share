import test from "node:test";
import assert from "node:assert/strict";
import {
  buildDownloadCountBySkillId,
  getDownloadCountForSkill,
  shouldLogSkillDownload,
} from "./downloads.ts";

test("buildDownloadCountBySkillId counts only the rows present for each skill", () => {
  const downloadCountBySkillId = buildDownloadCountBySkillId([
    { skill_id: "skill-a" },
    { skill_id: "skill-b" },
    { skill_id: "skill-a" },
  ]);

  assert.equal(getDownloadCountForSkill(downloadCountBySkillId, "skill-a"), 2);
  assert.equal(getDownloadCountForSkill(downloadCountBySkillId, "skill-b"), 1);
  assert.equal(getDownloadCountForSkill(downloadCountBySkillId, "skill-c"), 0);
});

test("shouldLogSkillDownload skips framework prefetch requests", () => {
  assert.equal(
    shouldLogSkillDownload(
      new Headers({
        "next-router-prefetch": "1",
      }),
    ),
    false,
  );

  assert.equal(
    shouldLogSkillDownload(
      new Headers({
        purpose: "prefetch",
      }),
    ),
    false,
  );

  assert.equal(
    shouldLogSkillDownload(
      new Headers({
        "sec-purpose": "prefetch;prerender",
      }),
    ),
    false,
  );
});

test("shouldLogSkillDownload keeps explicit download requests countable", () => {
  assert.equal(shouldLogSkillDownload(new Headers()), true);
});

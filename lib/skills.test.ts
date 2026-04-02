import test from "node:test";
import assert from "node:assert/strict";
import { skills } from "./mock-data.ts";
import {
  createSkillCatalogSearchParams,
  getSkillsForCatalog,
  parseSkillCatalogQuery,
} from "./skills.ts";

test("parseSkillCatalogQuery trims search and falls back for invalid sort", () => {
  const query = parseSkillCatalogQuery({
    q: "  regression  ",
    category: "engineering",
    uploader: "missing-uploader",
    sort: "not-real",
  });

  assert.deepEqual(query, {
    search: "regression",
    category: "development",
    uploader: "missing-uploader",
    sort: "newest",
  });
});

test("getSkillsForCatalog filters by search, category, and uploader", () => {
  const results = getSkillsForCatalog(skills, {
    search: "",
    category: "development",
    uploader: "arjun-menon",
    sort: "newest",
  });

  assert.equal(results.length, 2);
  assert.deepEqual(
    results.map((item) => item.id),
    ["incident-triage-brief", "qa-regression-scan"],
  );
});

test("getSkillsForCatalog sorts uploader names alphabetically", () => {
  const results = getSkillsForCatalog(skills, {
    search: "",
    category: "",
    uploader: "",
    sort: "uploader-asc",
  });

  assert.equal(results[0]?.uploaderId, "arjun-menon");
  assert.equal(results.at(-1)?.uploaderId, "rahul-verma");
});

test("createSkillCatalogSearchParams omits default values", () => {
  const searchParams = createSkillCatalogSearchParams({
    search: "",
    category: "",
    uploader: "",
    sort: "newest",
  });

  assert.equal(searchParams.toString(), "");
});

test("getSkillsForCatalog newest sort prefers the latest update timestamp", () => {
  const results = getSkillsForCatalog(
    [
      {
        ...skills[0],
        id: "older-created-newer-updated",
        createdAt: "2025-01-01",
        updatedAt: "2026-03-30",
      },
      {
        ...skills[1],
        id: "newer-created-older-updated",
        createdAt: "2025-12-01",
        updatedAt: "2026-03-01",
      },
    ],
    {
      search: "",
      category: "",
      uploader: "",
      sort: "newest",
    },
  );

  assert.equal(results[0]?.id, "older-created-newer-updated");
});

test("getSkillsForCatalog matches misspellings in searchable text", () => {
  const results = getSkillsForCatalog(
    [
      {
        ...skills[0],
        id: "writing-guidelines",
        title: "Writing Guidelines",
        summary: "Clear copy guidance for internal prompt authors.",
        description: "Helps teams follow shared writing guidelines and review copy quality.",
      },
      skills[1],
    ],
    {
      search: "guidline",
      category: "",
      uploader: "",
      sort: "newest",
    },
  );

  assert.deepEqual(results.map((item) => item.id), ["writing-guidelines"]);
});

test("getSkillsForCatalog matches partial words and prefers stronger title hits", () => {
  const results = getSkillsForCatalog(
    [
      skills[0],
      {
        ...skills[1],
        id: "incident-review",
        title: "Incident Review Notes",
        summary: "A handoff template for incident follow-up.",
        description: "Includes a triage recap section for leadership review.",
      },
    ],
    {
      search: "triag",
      category: "",
      uploader: "",
      sort: "newest",
    },
  );

  assert.equal(results[0]?.id, "incident-triage-brief");
  assert.equal(results[1]?.id, "incident-review");
});

test("getSkillsForCatalog matches spelling variants and category text fuzzily", () => {
  const summarizerResults = getSkillsForCatalog(skills, {
    search: "summariser",
    category: "",
    uploader: "",
    sort: "newest",
  });

  const categoryResults = getSkillsForCatalog(skills, {
    search: "developmnt",
    category: "",
    uploader: "",
    sort: "newest",
  });

  assert.equal(summarizerResults[0]?.id, "customer-thread-summarizer");
  assert.ok(categoryResults.some((item) => item.id === "incident-triage-brief"));
});

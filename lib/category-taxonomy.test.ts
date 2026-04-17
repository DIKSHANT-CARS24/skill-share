import test from "node:test";
import assert from "node:assert/strict";
import {
  getCanonicalCategories,
  getCanonicalCategoryById,
  getCanonicalCategoryFromRow,
  normalizeCategoryValue,
} from "./category-taxonomy.ts";

test("canonical category taxonomy includes marketing", () => {
  assert.deepEqual(
    getCanonicalCategories().map((category) => category.id),
    ["design", "development", "product", "finance", "operations", "marketing"],
  );
});

test("normalizeCategoryValue resolves marketing inputs", () => {
  assert.equal(normalizeCategoryValue("marketing"), "marketing");
  assert.equal(normalizeCategoryValue("Marketing"), "marketing");
});

test("canonical category lookup resolves marketing rows", () => {
  assert.equal(getCanonicalCategoryById("marketing")?.name, "Marketing");
  assert.equal(
    getCanonicalCategoryFromRow({ id: "raw-marketing", slug: "marketing", name: "Marketing" })?.id,
    "marketing",
  );
});

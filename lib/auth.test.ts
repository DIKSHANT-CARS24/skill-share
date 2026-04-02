import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_SIGN_IN_REDIRECT_PATH, getSafeNextPath, isCarsEmail } from "./auth-utils.ts";

test("isCarsEmail only allows cars24.com addresses", () => {
  assert.equal(isCarsEmail("owner@cars24.com"), true);
  assert.equal(isCarsEmail("OWNER@CARS24.COM"), true);
  assert.equal(isCarsEmail("owner@cars.com"), false);
  assert.equal(isCarsEmail("owner@example.com"), false);
});

test("getSafeNextPath keeps only internal callback destinations", () => {
  assert.equal(getSafeNextPath("/admin?tab=members"), "/admin?tab=members");
  assert.equal(getSafeNextPath("https://example.com/phish"), DEFAULT_SIGN_IN_REDIRECT_PATH);
  assert.equal(getSafeNextPath("//example.com/phish"), DEFAULT_SIGN_IN_REDIRECT_PATH);
  assert.equal(getSafeNextPath("admin"), DEFAULT_SIGN_IN_REDIRECT_PATH);
});

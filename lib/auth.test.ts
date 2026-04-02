import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_SIGN_IN_REDIRECT_PATH,
  buildLoginRedirectPath,
  getSafeNextPath,
  isCarsEmail,
  isPublicPath,
  isSkillOwner,
} from "./auth-utils.ts";

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

test("isPublicPath keeps auth and access-status routes public", () => {
  assert.equal(isPublicPath("/login"), true);
  assert.equal(isPublicPath("/auth/callback"), true);
  assert.equal(isPublicPath("/unauthorized"), true);
  assert.equal(isPublicPath("/forbidden"), true);
  assert.equal(isPublicPath("/skills"), false);
});

test("buildLoginRedirectPath only adds next when needed", () => {
  assert.equal(buildLoginRedirectPath("/"), "/login");
  assert.equal(
    buildLoginRedirectPath("/skills/intro-to-prompts", "?tab=versions"),
    "/login?next=%2Fskills%2Fintro-to-prompts%3Ftab%3Dversions",
  );
});

test("isSkillOwner only allows the uploader to edit", () => {
  assert.equal(isSkillOwner("member-123", "member-123"), true);
  assert.equal(isSkillOwner("admin-456", "member-123"), false);
  assert.equal(isSkillOwner("member-456", "member-123"), false);
});

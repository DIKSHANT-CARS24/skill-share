import test from "node:test";
import assert from "node:assert/strict";
import {
  getMarkdownUploadContentType,
  isAcceptedMarkdownMimeType,
  isMarkdownFileName,
  isSupportedMarkdownUpload,
  markdownToBlocks,
  validateUploadDraft,
} from "./upload-utils.ts";

test("isMarkdownFileName only accepts markdown files", () => {
  assert.equal(isMarkdownFileName("skill.md"), true);
  assert.equal(isMarkdownFileName("skill.MD"), true);
  assert.equal(isMarkdownFileName("skill.txt"), false);
});

test("markdown upload accepts common browser MIME variants", () => {
  assert.equal(isAcceptedMarkdownMimeType("text/markdown"), true);
  assert.equal(isAcceptedMarkdownMimeType("text/plain"), true);
  assert.equal(isAcceptedMarkdownMimeType("application/octet-stream"), true);
  assert.equal(isAcceptedMarkdownMimeType(""), true);
  assert.equal(isAcceptedMarkdownMimeType(undefined), true);
  assert.equal(isAcceptedMarkdownMimeType("application/pdf"), false);

  assert.equal(isSupportedMarkdownUpload("skill.md", "text/markdown"), true);
  assert.equal(isSupportedMarkdownUpload("skill.md", "text/plain"), true);
  assert.equal(isSupportedMarkdownUpload("skill.md", "application/octet-stream"), true);
  assert.equal(isSupportedMarkdownUpload("skill.md", ""), true);
  assert.equal(isSupportedMarkdownUpload("skill.md", undefined), true);
  assert.equal(isSupportedMarkdownUpload("skill.md", "application/pdf"), false);
  assert.equal(isSupportedMarkdownUpload("skill.txt", "text/markdown"), false);
  assert.equal(getMarkdownUploadContentType(), "text/markdown");
});

test("validateUploadDraft returns actionable validation messages", () => {
  const messages = validateUploadDraft({
    title: "",
    categoryId: "",
    summary: "",
    fileName: "notes.txt",
  });

  assert.deepEqual(messages, [
    "Enter a skill title.",
    "Choose a category.",
    "Add a short summary.",
    "Only .md files are supported.",
  ]);
});

test("markdownToBlocks parses common markdown structures for preview", () => {
  const blocks = markdownToBlocks(`# Incident Triage

## Purpose

Summarize the incident.

- Capture impact
- Capture owner

> Keep it concise
`);

  assert.deepEqual(blocks, [
    { type: "heading", level: 1, content: "Incident Triage" },
    { type: "heading", level: 2, content: "Purpose" },
    { type: "paragraph", content: "Summarize the incident." },
    { type: "list", items: ["Capture impact", "Capture owner"] },
    { type: "quote", content: "Keep it concise" },
  ]);
});

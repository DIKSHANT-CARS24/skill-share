import type { MarkdownBlock, UploadDraft } from "./types.ts";

export type UploadPhase = "idle" | "uploading" | "complete";

const acceptedMarkdownMimeTypes = new Set([
  "",
  "application/octet-stream",
  "text/markdown",
  "text/plain",
]);

export function isMarkdownFileName(fileName: string) {
  return /\.md$/i.test(fileName.trim());
}

export function isAcceptedMarkdownMimeType(fileType: string | null | undefined) {
  return acceptedMarkdownMimeTypes.has((fileType ?? "").trim().toLowerCase());
}

export function isSupportedMarkdownUpload(
  fileName: string,
  fileType: string | null | undefined,
) {
  return isMarkdownFileName(fileName) && isAcceptedMarkdownMimeType(fileType);
}

export function getMarkdownUploadContentType() {
  return "text/markdown";
}

export function validateUploadDraft(draft: UploadDraft) {
  const errors: string[] = [];

  if (!draft.title.trim()) {
    errors.push("Enter a skill title.");
  }

  if (!draft.categoryId) {
    errors.push("Choose a category.");
  }

  if (!draft.summary.trim()) {
    errors.push("Add a short summary.");
  }

  if (!draft.fileName.trim()) {
    errors.push("Select a markdown file.");
  } else if (!isMarkdownFileName(draft.fileName)) {
    errors.push("Only .md files are supported.");
  }

  return errors;
}

export function markdownToBlocks(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: MarkdownBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index]?.trim() ?? "";

    if (!line) {
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const language = line.replace(/```/, "").trim() || "txt";
      const codeLines: string[] = [];
      index += 1;

      while (index < lines.length && !(lines[index] ?? "").trim().startsWith("```")) {
        codeLines.push(lines[index] ?? "");
        index += 1;
      }

      blocks.push({
        type: "code",
        language,
        content: codeLines.join("\n").trim(),
      });
      index += 1;
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push({
        type: "heading",
        level: 1,
        content: line.replace(/^# /, "").trim(),
      });
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push({
        type: "heading",
        level: 3,
        content: line.replace(/^### /, "").trim(),
      });
      index += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({
        type: "heading",
        level: 2,
        content: line.replace(/^## /, "").trim(),
      });
      index += 1;
      continue;
    }

    if (line.startsWith(">")) {
      blocks.push({
        type: "quote",
        content: line.replace(/^>\s?/, "").trim(),
      });
      index += 1;
      continue;
    }

    if (isListLine(line)) {
      const items: string[] = [];

      while (index < lines.length && isListLine((lines[index] ?? "").trim())) {
        items.push((lines[index] ?? "").trim().replace(/^([-*]|\d+\.)\s+/, ""));
        index += 1;
      }

      blocks.push({ type: "list", items });
      continue;
    }

    const paragraphLines = [line];
    index += 1;

    while (index < lines.length) {
      const nextLine = (lines[index] ?? "").trim();

      if (!nextLine || isStructuredLine(nextLine)) {
        break;
      }

      paragraphLines.push(nextLine);
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      content: paragraphLines.join(" "),
    });
  }

  return blocks.length
    ? blocks
    : [{ type: "paragraph", content: "No markdown preview is available yet." }];
}

function isListLine(line: string) {
  return /^([-*]|\d+\.)\s+/.test(line);
}

function isStructuredLine(line: string) {
  return (
    line.startsWith("# ") ||
    line.startsWith("## ") ||
    line.startsWith("### ") ||
    line.startsWith(">") ||
    line.startsWith("```") ||
    isListLine(line)
  );
}

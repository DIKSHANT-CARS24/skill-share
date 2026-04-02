import type { UploadDraft, UploadFormMode } from "@/lib/types";

export interface UploadFormState {
  message: string;
  errors: string[];
  tone: "neutral" | "error";
  fieldValues?: Partial<UploadDraft>;
}

export function getInitialUploadFormState(mode: UploadFormMode = "create"): UploadFormState {
  return {
    message:
      mode === "edit"
        ? "Review the current metadata, version, and markdown, then save when you're ready."
        : "Upload a markdown file to publish a new skill.",
    errors: [],
    tone: "neutral",
    fieldValues: undefined,
  };
}

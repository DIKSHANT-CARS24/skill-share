"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { deleteSkill, updateSkill, uploadSkill } from "@/app/actions/skills";
import { MarkdownPreview } from "@/components/skills/markdown-preview";
import { Button } from "@/components/ui/button";
import { InputShell } from "@/components/ui/input-shell";
import { getPanelClassName, Panel } from "@/components/ui/panel";
import { TextAreaField } from "@/components/ui/text-area-field";
import {
  getInitialUploadFormState,
  type UploadFormState,
} from "@/lib/upload-form-state";
import type { Category, MarkdownBlock, UploadDraft, UploadFormMode } from "@/lib/types";
import { isSupportedMarkdownUpload, markdownToBlocks } from "@/lib/upload-utils";

interface UploadFormProps {
  categories: Category[];
  uploaderEmail: string;
  mode?: UploadFormMode;
  editSkill?: {
    id: string;
    slug: string;
    title: string;
    categoryId: string;
    description: string;
    currentFileName: string;
    currentVersion: string | number;
    markdownBlocks: MarkdownBlock[];
  };
  canDeleteSkill?: boolean;
}

const defaultPreviewBlocks: MarkdownBlock[] = [
  {
    type: "paragraph",
    content: "Choose a markdown file to preview it before uploading.",
  },
];

const initialDeleteFormState: UploadFormState = {
  message: "",
  errors: [],
  tone: "neutral",
};

async function noopDeleteAction() {
  return initialDeleteFormState;
}

function createInitialDraft(
  mode: UploadFormMode,
  editSkill?: UploadFormProps["editSkill"],
): UploadDraft {
  if (mode === "edit" && editSkill) {
    return {
      title: editSkill.title,
      categoryId: editSkill.categoryId,
      summary: editSkill.description,
      fileName: "",
      version: String(editSkill.currentVersion),
    };
  }

  return {
    title: "",
    categoryId: "",
    summary: "",
    fileName: "",
    version: "",
  };
}

export function UploadForm({
  categories,
  uploaderEmail,
  mode = "create",
  editSkill,
  canDeleteSkill = false,
}: UploadFormProps) {
  const formServerAction =
    mode === "edit" && editSkill ? updateSkill.bind(null, editSkill.id) : uploadSkill;
  const deleteServerAction =
    mode === "edit" && editSkill ? deleteSkill.bind(null, editSkill.id) : noopDeleteAction;
  const [state, formAction, isSubmitting] = useActionState(
    formServerAction,
    getInitialUploadFormState(mode),
  );
  const [deleteState, deleteFormAction, isDeleting] = useActionState(
    deleteServerAction,
    initialDeleteFormState,
  );
  const initialDraft = {
    ...createInitialDraft(mode, editSkill),
    ...state.fieldValues,
  };

  return (
    <UploadFormContent
      key={JSON.stringify(initialDraft)}
      categories={categories}
      uploaderEmail={uploaderEmail}
      mode={mode}
      editSkill={editSkill}
      canDeleteSkill={canDeleteSkill}
      formAction={formAction}
      state={state}
      isSubmitting={isSubmitting}
      deleteState={deleteState}
      deleteFormAction={deleteFormAction}
      isDeleting={isDeleting}
      initialDraft={initialDraft}
    />
  );
}

function UploadFormContent({
  categories,
  uploaderEmail,
  mode = "create",
  editSkill,
  canDeleteSkill = false,
  formAction,
  state,
  isSubmitting,
  deleteState,
  deleteFormAction,
  isDeleting,
  initialDraft,
}: UploadFormProps & {
  formAction: (payload: FormData) => void;
  state: UploadFormState;
  isSubmitting: boolean;
  deleteState: UploadFormState;
  deleteFormAction: (payload: FormData) => void;
  isDeleting: boolean;
  initialDraft: UploadDraft;
}) {
  const [draft, setDraft] = useState<UploadDraft>(initialDraft);
  const initialPreviewBlocks =
    mode === "edit" && editSkill ? editSkill.markdownBlocks : defaultPreviewBlocks;
  const [previewBlocks, setPreviewBlocks] = useState<MarkdownBlock[]>(initialPreviewBlocks);
  const [clientFileError, setClientFileError] = useState("");
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const isEditMode = mode === "edit" && Boolean(editSkill);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];

    if (!file) {
      setClientFileError("");
      setDraft((current) => ({ ...current, fileName: "" }));
      setPreviewBlocks(initialPreviewBlocks);
      return;
    }

    if (!isSupportedMarkdownUpload(file.name, file.type)) {
      setClientFileError("Only .md files are supported.");
      setDraft((current) => ({ ...current, fileName: "" }));
      setPreviewBlocks(initialPreviewBlocks);
      event.currentTarget.value = "";
      return;
    }

    setClientFileError("");
    setDraft((current) => ({ ...current, fileName: file.name }));
    const text = await file.text();
    setPreviewBlocks(markdownToBlocks(text));
  }

  function updateDraft<Key extends keyof UploadDraft>(key: Key, value: UploadDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  const titleError = state.errors.find((message) => message === "Enter a skill title.");
  const categoryError = state.errors.find((message) => message === "Choose a category.");
  const versionError = state.errors.find(
    (message) =>
      message === "Enter a valid version number." ||
      message === "Choose a version number that is not already in use for this skill.",
  );
  const markdownError = state.errors.find(
    (message) =>
      message === "Select a markdown file." || message === "Only .md files are supported.",
  );
  const formTitle = isEditMode ? "Edit skill" : "New skill details";
  const cancelHref = isEditMode && editSkill ? `/skills/${editSkill.slug}` : "/skills";
  const fileLabel = isEditMode ? "Replace markdown file" : "Markdown file";
  const fileHelpText = isEditMode
    ? "Leave this empty to keep the current markdown. Upload a replacement only when you want to replace the attached file."
    : "Upload a single `.md` file to create the skill preview and publish the latest version.";
  const submitLabel = isEditMode ? "Save changes" : "Publish skill";
  const statusVerb = isEditMode ? "Editing as" : "Uploading as";
  const emptyFileLabel = isEditMode ? "No replacement file selected" : "No file selected yet";
  const hasServerError = state.tone === "error";
  const hasDeleteError = deleteState.tone === "error";

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.04fr)_minmax(360px,0.96fr)]">
      <Panel padding="lg" className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(71,54,254,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,192,223,0.08),transparent_32%)]" />
        <div className="relative space-y-6">
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="glass-pill inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-strong">
              {isEditMode ? "Revision Flow" : "Publishing Flow"}
            </span>
            <h2 className="text-[1.65rem] leading-[1.05] font-semibold tracking-[-0.03em] text-foreground">
              {formTitle}
            </h2>
            <p className="max-w-2xl text-[var(--font-size-body-m)] leading-[1.6] text-muted">
              {isEditMode
                ? "The current skill metadata, version, and markdown are loaded below so you can edit them without rebuilding the entry from scratch."
                : "Add the core metadata and markdown file for the first published version."}
            </p>
          </div>

          <form action={formAction} encType="multipart/form-data" className="space-y-6">
            <div className="grid gap-4">
              <InputShell
                label="Skill title"
                name="title"
                value={draft.title}
                placeholder="Cross-team launch narrative"
                size="large"
                error={titleError}
                onChange={(event) => updateDraft("title", event.currentTarget.value)}
              />

              <InputShell label="Category" size="large" error={categoryError}>
                <select
                  name="categoryId"
                  aria-label="Category"
                  value={draft.categoryId}
                  onChange={(event) => updateDraft("categoryId", event.currentTarget.value)}
                  className="min-w-0 flex-1 bg-transparent text-[var(--font-size-body-l)] leading-[var(--line-height-body)] text-foreground outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </InputShell>

              {isEditMode && editSkill ? (
                <InputShell
                  label="Version"
                  name="version"
                  value={draft.version}
                  placeholder="2.1"
                  size="large"
                  helperText={`Editable in edit mode. Leave this as v${editSkill.currentVersion} to keep the current version number.`}
                  error={versionError}
                  inputMode="decimal"
                  step="any"
                  onChange={(event) => updateDraft("version", event.currentTarget.value)}
                />
              ) : null}
            </div>

            <TextAreaField
              label="Description"
              value={draft.summary}
              helperText="Optional. If you leave this blank, the title will be used as the catalog summary."
              rows={5}
              textAreaClassName="min-h-32"
              onChange={(event) => updateDraft("summary", event.currentTarget.value)}
              placeholder="Add extra context so people understand when to use this skill and what outcome it is meant to create."
            />

            <input
              type="hidden"
              name="summary"
              value={draft.summary.trim() || draft.title.trim()}
            />
            <input type="hidden" name="longDescription" value={draft.summary.trim()} />

            <label className="flex flex-col gap-2">
              <span className="text-[var(--font-size-label-s)] leading-[var(--line-height-body)] font-semibold uppercase tracking-[0.14em] text-muted">
                {fileLabel}
              </span>
              <div
                className={getPanelClassName({
                  tone: "subtle",
                  padding: "md",
                  className:
                    "border-dashed rounded-[24px] px-5 py-6 shadow-none " +
                    (clientFileError || markdownError ? "border-danger" : "border-border-strong"),
                })}
              >
                <input
                  name="markdown"
                  type="file"
                  accept=".md,text/markdown,text/plain,application/octet-stream"
                  aria-label="Markdown file"
                  onChange={handleFileChange}
                  className="block w-full text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted file:mr-4 file:rounded-xl file:border-0 file:bg-accent file:px-4 file:py-2 file:text-[var(--font-size-label-m)] file:leading-[var(--line-height-body)] file:font-semibold file:text-white hover:file:bg-accent-strong"
                />
                {isEditMode && editSkill ? (
                  <div className="glass-surface-subtle mt-4 rounded-[18px] px-4 py-3">
                    <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">
                      Current file: {editSkill.currentFileName}
                    </p>
                    <p className="mt-1 text-[var(--font-size-body-s)] leading-[1.5] text-muted">
                      Live version v{editSkill.currentVersion} is attached right now.
                    </p>
                  </div>
                ) : null}
                <p className="mt-4 text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-foreground">
                  {draft.fileName || emptyFileLabel}
                </p>
                <p className="mt-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-muted">
                  {fileHelpText}
                </p>
                {clientFileError || markdownError ? (
                  <p className="mt-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-danger">
                    {clientFileError || markdownError}
                  </p>
                ) : null}
              </div>
            </label>

            <div
              aria-live="polite"
              role={hasServerError ? "alert" : undefined}
              className={getPanelClassName({
                tone: "subtle",
                padding: "md",
                className: hasServerError
                  ? "border-danger bg-danger-soft shadow-none"
                  : "rounded-[22px] shadow-none",
              })}
            >
              <p className="text-[var(--font-size-body-s)] leading-[1.5] text-muted">
                {statusVerb} <span className="font-semibold text-foreground">{uploaderEmail}</span>
              </p>
              <p
                className={
                  hasServerError
                    ? "mt-1 text-[var(--font-size-body-s)] leading-[1.5] text-danger"
                    : "mt-1 text-[var(--font-size-body-s)] leading-[1.5] text-muted"
                }
              >
                {state.message}
              </p>
            </div>

            {state.errors.length > 0 ? (
              <div className="rounded-[16px] border border-danger/15 bg-danger-soft p-4 sm:p-5">
                <p className="text-[var(--font-size-label-m)] leading-[var(--line-height-body)] font-semibold text-danger">
                  Review these items before you submit
                </p>
                <ul className="mt-3 space-y-2 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-danger">
                  {state.errors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (isEditMode ? "Saving changes..." : "Publishing skill...") : submitLabel}
              </Button>
              <Button asChild variant="destructive">
                <Link href={cancelHref}>Cancel</Link>
              </Button>
            </div>
          </form>

          {isEditMode && editSkill && canDeleteSkill ? (
            <form action={deleteFormAction} className="border-t border-border pt-6">
              <div className="space-y-4 rounded-[24px] border border-danger/20 bg-[linear-gradient(180deg,rgba(255,239,241,0.84)_0%,rgba(255,239,241,0.62)_100%)] px-5 py-5 shadow-[0_20px_40px_rgba(180,35,24,0.08)]">
                <div className="space-y-1">
                  <h3 className="text-[var(--font-size-heading-s)] leading-[var(--line-height-heading)] font-semibold text-foreground">
                    Delete skill
                  </h3>
                  <p className="text-[var(--font-size-body-s)] leading-[1.5] text-muted">
                    This permanently removes the skill, its version history, dependent records, and attached markdown files.
                  </p>
                </div>

                <label className="flex items-start gap-3 text-[var(--font-size-body-m)] leading-[var(--line-height-body)] text-foreground">
                  <input
                    name="confirmDelete"
                    type="checkbox"
                    checked={deleteConfirmed}
                    onChange={(event) => setDeleteConfirmed(event.currentTarget.checked)}
                    className="mt-1 h-4 w-4 rounded border-border-strong accent-[var(--danger)]"
                  />
                  <span>I understand this will permanently delete this skill.</span>
                </label>

                {deleteState.errors.length > 0 ? (
                  <div className="rounded-[14px] border border-danger/15 bg-danger-soft px-4 py-3">
                    <p className="text-[var(--font-size-body-s)] leading-[1.5] text-danger">
                      {deleteState.errors[0]}
                    </p>
                  </div>
                ) : null}

                {deleteState.message && deleteState.errors.length === 0 ? (
                  <p
                    className={
                      hasDeleteError
                        ? "text-[var(--font-size-body-s)] leading-[1.5] text-danger"
                        : "text-[var(--font-size-body-s)] leading-[1.5] text-muted"
                    }
                  >
                    {deleteState.message}
                  </p>
                ) : null}

                <div className="flex justify-start">
                  <Button type="submit" variant="destructive" disabled={!deleteConfirmed || isDeleting}>
                    {isDeleting ? "Deleting skill..." : "Delete skill"}
                  </Button>
                </div>
              </div>
            </form>
          ) : null}
        </div>
        </div>
      </Panel>

      <div className="xl:sticky xl:top-24 xl:h-fit">
        <MarkdownPreview title="Markdown preview" blocks={previewBlocks} />
      </div>
    </div>
  );
}

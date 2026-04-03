"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isSkillOwner, requireActiveMember } from "@/lib/auth";
import {
  getCanonicalCategoryFromRow,
  normalizeCategoryValue,
  pickPreferredRawCategory,
} from "@/lib/category-taxonomy";
import type { UploadFormState } from "@/lib/upload-form-state";
import type { UploadDraft } from "@/lib/types";
import {
  getMarkdownUploadContentType,
  normalizeMarkdownUploadBlob,
  normalizeMarkdownUploadFile,
  isSupportedMarkdownUpload,
} from "@/lib/upload-utils";

type EditableSkillRecord = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  long_description: string | null;
  file_path: string;
  current_version: number | string;
  uploader_id: string;
};

type EditableSkillVersionRecord = {
  id: string;
  storage_path: string;
  change_notes: string | null;
};

type DeletableSkillRecord = {
  id: string;
  slug: string;
  file_path: string;
  uploader_id: string;
};

type SkillStoragePathRecord = {
  storage_path: string;
};

type StoredSkillFileBackup = {
  path: string;
  file: Blob;
  contentType: string;
};

type CategoryLookupRow = {
  id: string;
  slug?: string | null;
  name?: string;
};

type SkillCategoryLookupRow = {
  category_id: string;
};

type RawCategoryRow = {
  id: string;
  slug?: string | null;
  name?: string | null;
};

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "skill";
}

async function createUniqueSkillSlug(baseSlug: string, lookup: (slug: string) => Promise<boolean>) {
  let attempt = baseSlug;
  let index = 2;

  while (await lookup(attempt)) {
    attempt = `${baseSlug}-${index}`;
    index += 1;
  }

  return attempt;
}

function createResponse(
  message: string,
  errors: string[] = [],
  fieldValues?: Partial<UploadDraft>,
): UploadFormState {
  return {
    message,
    errors,
    tone: "error",
    fieldValues,
  };
}

function createCategorySaveFailureResponse(detail: string) {
  return createResponse("We couldn't save the category change. Your previous category is still in place.", [
    `Category update failed: ${detail}`,
  ]);
}

function createVersionSchemaFailureResponse(detail: string) {
  return createResponse("Decimal version numbers require the latest version schema update before they can be saved.", [
    `Apply supabase/migrations/20260403113000_allow_decimal_versions.sql, then try again. (${detail})`,
  ]);
}

function createDatabaseFailureResponse(detail: string, requestedVersionValue?: string) {
  const normalizedDetail = detail.toLowerCase();

  if (
    requestedVersionValue?.includes(".") &&
    normalizedDetail.includes('invalid input syntax for type integer')
  ) {
    return createVersionSchemaFailureResponse(detail);
  }

  return createResponse(detail);
}

function validateSkillFields({
  title,
  categoryId,
  summary,
  markdownFile,
  requireMarkdownFile,
}: {
  title: string;
  categoryId: string;
  summary: string;
  markdownFile: FormDataEntryValue | null;
  requireMarkdownFile: boolean;
}) {
  const errors: string[] = [];

  if (!title) {
    errors.push("Enter a skill title.");
  }

  if (!categoryId) {
    errors.push("Choose a category.");
  }

  if (!summary) {
    errors.push("Add a short summary.");
  }

  const hasMarkdownFile = markdownFile instanceof File && markdownFile.size > 0;

  if (requireMarkdownFile && !hasMarkdownFile) {
    errors.push("Select a markdown file.");
  } else if (hasMarkdownFile && !isSupportedMarkdownUpload(markdownFile.name, markdownFile.type)) {
    errors.push("Only .md files are supported.");
  }

  return {
    errors,
    hasMarkdownFile,
  };
}

async function removeStoredFiles(
  supabase: Awaited<ReturnType<typeof requireActiveMember>>["supabase"],
  storagePaths: string[],
) {
  if (!storagePaths.length) {
    return;
  }

  await supabase.storage.from("skills").remove(storagePaths);
}

async function rollbackCreatedSkill({
  skillId,
  storagePath,
  userSupabase,
}: {
  skillId: string;
  storagePath: string;
  userSupabase: Awaited<ReturnType<typeof requireActiveMember>>["supabase"];
}) {
  await Promise.allSettled([
    userSupabase.from("skills").delete().eq("id", skillId),
    userSupabase.storage.from("skills").remove([storagePath]),
  ]);
}

async function getValidCategory(
  supabase: Awaited<ReturnType<typeof requireActiveMember>>["supabase"],
  categoryId: string,
) {
  const normalizedCategoryId = normalizeCategoryValue(categoryId);
  let category: CategoryLookupRow | null = null;
  let categoryError: { message: string } | null = null;

  if (normalizedCategoryId) {
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, name");

    categoryError = error ? { message: error.message } : null;
    category = data ? pickPreferredRawCategory(data, normalizedCategoryId) : null;
  } else {
    const { data, error } = await supabase
      .from("categories")
      .select("id, slug, name")
      .eq("id", categoryId)
      .maybeSingle<CategoryLookupRow>();

    categoryError = error ? { message: error.message } : null;
    category = data ?? null;
  }

  if (categoryError) {
    return {
      category: null,
      response: createResponse(categoryError.message),
    };
  }

  if (!category) {
    return {
      category: null,
      response: createResponse("Choose a valid category before saving."),
    };
  }

  return {
    category,
    response: null,
  };
}

function createSubmittedFieldValues({
  title,
  categoryId,
  description,
  version,
}: {
  title: string;
  categoryId: string;
  description: string;
  version?: string;
}) {
  return {
    title,
    categoryId,
    summary: description,
    version,
  } satisfies Partial<UploadDraft>;
}

function describeMetadataChanges({
  previousTitle,
  nextTitle,
  previousCategoryId,
  nextCategoryId,
  previousDescription,
  nextDescription,
}: {
  previousTitle: string;
  nextTitle: string;
  previousCategoryId: string;
  nextCategoryId: string;
  previousDescription: string;
  nextDescription: string;
}) {
  const changedFields: string[] = [];

  if (previousTitle !== nextTitle) {
    changedFields.push("title");
  }

  if (previousCategoryId !== nextCategoryId) {
    changedFields.push("category");
  }

  if (previousDescription !== nextDescription) {
    changedFields.push("description");
  }

  return changedFields;
}

function formatChangeList(values: string[]) {
  if (values.length <= 1) {
    return values[0] ?? "";
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function buildChangeNotes({
  metadataChanges,
  replacementFileName,
  previousVersion,
  nextVersion,
}: {
  metadataChanges: string[];
  replacementFileName?: string;
  previousVersion: number;
  nextVersion: number;
}) {
  const notes: string[] = [];

  if (previousVersion !== nextVersion) {
    notes.push(`Set the live version to v${nextVersion}.`);
  }

  if (replacementFileName) {
    notes.push(`Replaced the markdown file with ${replacementFileName}.`);
  }

  if (metadataChanges.length > 0) {
    notes.push(`Updated ${formatChangeList(metadataChanges)}.`);
  }

  if (notes.length === 0) {
    notes.push("Saved the latest version.");
  }

  return notes.join(" ");
}

function parseVersionNumber(value: string) {
  if (!value) {
    return null;
  }

  if (!/^\d+(\.\d+)?$/.test(value)) {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

function normalizeStoredVersionNumber(value: number | string) {
  const parsedValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return null;
  }

  return parsedValue;
}

function getRollbackStoragePaths({
  uploadedStoragePath,
  versionChanged,
}: {
  uploadedStoragePath: string | null;
  versionChanged: boolean;
}) {
  return uploadedStoragePath && versionChanged ? [uploadedStoragePath] : [];
}

function getUniqueStoragePaths(paths: Array<string | null | undefined>) {
  return Array.from(new Set(paths.filter((value): value is string => Boolean(value))));
}

async function backupStoredFiles(
  supabase: Awaited<ReturnType<typeof requireActiveMember>>["supabase"],
  storagePaths: string[],
) {
  const backups: StoredSkillFileBackup[] = [];

  for (const path of storagePaths) {
    const { data, error } = await supabase.storage.from("skills").download(path);

    // Missing files should not block deletion because the database records are the source of truth.
    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes("not found") || message.includes("no such object")) {
        continue;
      }

      return {
        backups: [],
        error: error.message,
      };
    }

    backups.push({
      path,
      file: data,
      contentType: data.type || "text/markdown",
    });
  }

  return {
    backups,
    error: null,
  };
}

async function restoreStoredFiles(
  supabase: Awaited<ReturnType<typeof requireActiveMember>>["supabase"],
  backups: StoredSkillFileBackup[],
) {
  if (!backups.length) {
    return;
  }

  await Promise.allSettled(
    backups.map((backup) =>
      supabase.storage.from("skills").upload(backup.path, normalizeMarkdownUploadBlob(backup.file), {
        contentType: getMarkdownUploadContentType(),
        upsert: true,
      }),
    ),
  );
}

async function revalidateSkillPaths(slug: string, skillId?: string) {
  revalidatePath("/skills");
  revalidatePath("/profile");
  revalidatePath("/admin");
  revalidatePath(`/skills/${slug}`);

  if (skillId) {
    revalidatePath(`/skills/${skillId}`);
  }
}

export async function uploadSkill(
  _previousState: UploadFormState,
  formData: FormData,
): Promise<UploadFormState> {
  const context = await requireActiveMember();
  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const longDescription = String(formData.get("longDescription") ?? "").trim();
  const markdownFile = formData.get("markdown");
  const fieldValues = createSubmittedFieldValues({
    title,
    categoryId,
    description: longDescription,
  });
  const { errors } = validateSkillFields({
    title,
    categoryId,
    summary,
    markdownFile,
    requireMarkdownFile: true,
  });

  if (errors.length > 0) {
    return createResponse("Review the highlighted items, then try again.", errors, fieldValues);
  }

  const categoryLookup = await getValidCategory(context.supabase, categoryId);

  if (categoryLookup.response) {
    return {
      ...categoryLookup.response,
      fieldValues,
    };
  }

  const fileToUpload = markdownFile as File;
  const normalizedMarkdownFile = normalizeMarkdownUploadFile(fileToUpload);

  const baseSlug = slugify(title);
  const slug = await createUniqueSkillSlug(baseSlug, async (candidate) => {
    const { data } = await context.supabase
      .from("skills")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    return Boolean(data);
  });

  const skillId = randomUUID();
  const versionId = randomUUID();
  const storagePath = `${context.member.user_id}/${slug}/v1.md`;
  const { error: uploadError } = await context.supabase.storage.from("skills").upload(
    storagePath,
    normalizedMarkdownFile,
    {
      contentType: getMarkdownUploadContentType(),
      upsert: false,
    },
  );

  if (uploadError) {
    console.error("Markdown upload failed during skill creation", {
      storagePath,
      originalType: fileToUpload.type || "(empty)",
      normalizedType: normalizedMarkdownFile.type,
      message: uploadError.message,
    });
    return createResponse(uploadError.message, [], fieldValues);
  }

  const { error: skillError } = await context.supabase.from("skills").insert({
    id: skillId,
    title,
    slug,
    short_description: summary,
    long_description: longDescription || summary,
    uploader_id: context.member.user_id,
    file_path: storagePath,
    current_version: 1,
    status: "published",
  });

  if (skillError) {
    await context.supabase.storage.from("skills").remove([storagePath]);

    return createResponse(skillError.message, [], fieldValues);
  }

  const { error: skillCategoryError } = await context.supabase.from("skill_categories").insert({
    skill_id: skillId,
    category_id: categoryLookup.category.id,
  });

  if (skillCategoryError) {
    await rollbackCreatedSkill({
      skillId,
      storagePath,
      userSupabase: context.supabase,
    });

    return createResponse(skillCategoryError.message, [], fieldValues);
  }

  const { error: skillVersionError } = await context.supabase.from("skill_versions").insert({
    id: versionId,
    skill_id: skillId,
    version_number: 1,
    storage_path: storagePath,
    change_notes: "Initial upload.",
    created_by: context.member.user_id,
  });

  if (skillVersionError) {
    await rollbackCreatedSkill({
      skillId,
      storagePath,
      userSupabase: context.supabase,
    });

    return createResponse(skillVersionError.message, [], fieldValues);
  }

  await revalidateSkillPaths(slug, skillId);
  redirect(`/skills/${slug}`);
}

export async function updateSkill(
  skillId: string,
  _previousState: UploadFormState,
  formData: FormData,
): Promise<UploadFormState> {
  const context = await requireActiveMember();
  const title = String(formData.get("title") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const longDescription = String(formData.get("longDescription") ?? "").trim();
  const requestedVersionValue = String(formData.get("version") ?? "").trim();
  const markdownFile = formData.get("markdown");
  const fieldValues = createSubmittedFieldValues({
    title,
    categoryId,
    description: longDescription,
    version: requestedVersionValue,
  });
  const { errors, hasMarkdownFile } = validateSkillFields({
    title,
    categoryId,
    summary,
    markdownFile,
    requireMarkdownFile: false,
  });
  const requestedVersionNumber = parseVersionNumber(requestedVersionValue);

  if (requestedVersionNumber === null) {
    errors.push("Enter a valid version number.");
  }

  if (errors.length > 0) {
    return createResponse("Review the highlighted items, then try again.", errors, fieldValues);
  }

  const categoryLookup = await getValidCategory(context.supabase, categoryId);

  if (categoryLookup.response) {
    return {
      ...categoryLookup.response,
      fieldValues,
    };
  }

  const { data: existingSkill, error: existingSkillError } = await context.supabase
    .from("skills")
    .select(
      "id, slug, title, short_description, long_description, file_path, current_version, uploader_id",
    )
    .eq("id", skillId)
    .maybeSingle<EditableSkillRecord>();

  if (existingSkillError) {
    return createResponse(existingSkillError.message, [], fieldValues);
  }

  if (!existingSkill) {
    return createResponse("This skill could not be found for editing.", [], fieldValues);
  }

  const canEdit = isSkillOwner(context.member.user_id, existingSkill.uploader_id);

  if (!canEdit) {
    return createResponse("You do not have permission to edit this skill.", [], fieldValues);
  }

  const existingCurrentVersion = normalizeStoredVersionNumber(existingSkill.current_version);

  if (existingCurrentVersion === null) {
    return createResponse(
      "The current version on this skill is invalid and could not be edited.",
      [],
      fieldValues,
    );
  }

  const requestedVersion = requestedVersionNumber ?? existingCurrentVersion;

  const { data: existingMappings, error: existingMappingsError } = await context.supabase
    .from("skill_categories")
    .select("category_id")
    .eq("skill_id", skillId);

  if (existingMappingsError) {
    return createResponse(existingMappingsError.message, [], fieldValues);
  }

  const previousRawCategoryId =
    (existingMappings?.[0] as SkillCategoryLookupRow | undefined)?.category_id ?? "";
  let previousCanonicalCategoryId = "";

  if (previousRawCategoryId) {
    const { data: previousCategory, error: previousCategoryError } = await context.supabase
      .from("categories")
      .select("id, slug, name")
      .eq("id", previousRawCategoryId)
      .maybeSingle<RawCategoryRow>();

    if (previousCategoryError) {
      return createResponse(previousCategoryError.message, [], fieldValues);
    }

    previousCanonicalCategoryId =
      getCanonicalCategoryFromRow(previousCategory ?? { id: previousRawCategoryId })?.id ?? "";
  }

  const nextCanonicalCategoryId = normalizeCategoryValue(categoryId) || categoryId;
  const previousDescription =
    existingSkill.long_description ?? existingSkill.short_description ?? "";
  const versionChanged = requestedVersion !== existingCurrentVersion;
  const metadataChanges = describeMetadataChanges({
    previousTitle: existingSkill.title,
    nextTitle: title,
    previousCategoryId: previousCanonicalCategoryId,
    nextCategoryId: nextCanonicalCategoryId,
    previousDescription,
    nextDescription: longDescription || summary,
  });

  if (!hasMarkdownFile && metadataChanges.length === 0 && !versionChanged) {
    return createResponse("Make a change before saving so the edit is meaningful.", [], fieldValues);
  }

  const { data: currentVersionRecord, error: currentVersionRecordError } = await context.supabase
    .from("skill_versions")
    .select("id, storage_path, change_notes")
    .eq("skill_id", skillId)
    .eq("version_number", existingCurrentVersion)
    .maybeSingle<EditableSkillVersionRecord>();

  if (currentVersionRecordError) {
    return {
      ...createDatabaseFailureResponse(currentVersionRecordError.message, requestedVersionValue),
      fieldValues,
    };
  }

  if (versionChanged) {
    const { data: conflictingVersion, error: conflictingVersionError } = await context.supabase
      .from("skill_versions")
      .select("id")
      .eq("skill_id", skillId)
      .eq("version_number", requestedVersion)
      .maybeSingle();

    if (conflictingVersionError) {
      return {
        ...createDatabaseFailureResponse(conflictingVersionError.message, requestedVersionValue),
        fieldValues,
      };
    }

    if (conflictingVersion) {
      return createResponse("Review the highlighted items, then try again.", [
        "Choose a version number that is not already in use for this skill.",
      ], fieldValues);
    }
  }

  let uploadedStoragePath: string | null = null;

  if (hasMarkdownFile) {
    const fileToUpload = markdownFile as File;
    const normalizedMarkdownFile = normalizeMarkdownUploadFile(fileToUpload);
    uploadedStoragePath = versionChanged
      ? `${context.member.user_id}/${existingSkill.slug}/v${requestedVersion}.md`
      : existingSkill.file_path;

    const { error: uploadError } = await context.supabase.storage.from("skills").upload(
      uploadedStoragePath,
      normalizedMarkdownFile,
      {
        contentType: getMarkdownUploadContentType(),
        upsert: !versionChanged,
      },
    );

    if (uploadError) {
      console.error("Markdown upload failed during skill edit", {
        storagePath: uploadedStoragePath,
        originalType: fileToUpload.type || "(empty)",
        normalizedType: normalizedMarkdownFile.type,
        message: uploadError.message,
      });
      return createResponse(uploadError.message, [], fieldValues);
    }
  }

  const storagePathForVersion = uploadedStoragePath ?? existingSkill.file_path;
  const replacementFileName =
    hasMarkdownFile && markdownFile instanceof File ? markdownFile.name : undefined;
  const changeNotes = buildChangeNotes({
    metadataChanges,
    replacementFileName,
    previousVersion: existingCurrentVersion,
    nextVersion: requestedVersion,
  });
  const categoryChanged = previousCanonicalCategoryId !== nextCanonicalCategoryId;
  let insertedNewCategoryMapping = false;
  const insertedVersionId = versionChanged || !currentVersionRecord ? randomUUID() : null;
  const nextCategoryRowId = categoryLookup.category.id;

  if (categoryChanged) {
    const { error: insertCategoryError } = await context.supabase.from("skill_categories").insert({
      skill_id: skillId,
      category_id: nextCategoryRowId,
    });

    if (insertCategoryError) {
      await removeStoredFiles(
        context.supabase,
        getRollbackStoragePaths({ uploadedStoragePath, versionChanged }),
      );
      return {
        ...createCategorySaveFailureResponse(insertCategoryError.message),
        fieldValues,
      };
    }

    insertedNewCategoryMapping = true;
  }

  const versionMutation =
    versionChanged || !currentVersionRecord
      ? await context.supabase.from("skill_versions").insert({
          id: insertedVersionId,
          skill_id: skillId,
          version_number: requestedVersion,
          storage_path: storagePathForVersion,
          change_notes: changeNotes,
          created_by: context.member.user_id,
        })
      : null;

  if (versionMutation?.error) {
    if (insertedNewCategoryMapping) {
      await context.supabase
        .from("skill_categories")
        .delete()
        .eq("skill_id", skillId)
        .eq("category_id", nextCategoryRowId);
    }

    await removeStoredFiles(
      context.supabase,
      getRollbackStoragePaths({ uploadedStoragePath, versionChanged }),
    );
    return {
      ...createDatabaseFailureResponse(versionMutation.error.message, requestedVersionValue),
      fieldValues,
    };
  }

  const { data: updatedSkill, error: skillUpdateError } = await context.supabase
    .from("skills")
    .update({
      title,
      short_description: summary,
      long_description: longDescription || summary,
      file_path: storagePathForVersion,
      current_version: requestedVersion,
    })
    .eq("id", skillId)
    .select("id, slug")
    .maybeSingle();

  if (skillUpdateError || !updatedSkill) {
    if (insertedVersionId) {
      await context.supabase.from("skill_versions").delete().eq("id", insertedVersionId);
    }

    if (insertedNewCategoryMapping) {
      await context.supabase
        .from("skill_categories")
        .delete()
        .eq("skill_id", skillId)
        .eq("category_id", nextCategoryRowId);
    }

    await removeStoredFiles(
      context.supabase,
      getRollbackStoragePaths({ uploadedStoragePath, versionChanged }),
    );
    return {
      ...createDatabaseFailureResponse(
        skillUpdateError?.message ?? "This edit could not be saved. Please try again.",
        requestedVersionValue,
      ),
      fieldValues,
    };
  }

  if (categoryChanged) {
    const { data: removedCategoryMappings, error: removeOldCategoriesError } = await context.supabase
      .from("skill_categories")
      .delete()
      .eq("skill_id", skillId)
      .neq("category_id", nextCategoryRowId)
      .select("skill_id, category_id");

    const removedPreviousCategory =
      !previousRawCategoryId ||
      (removedCategoryMappings ?? []).some(
        (mapping) => (mapping as SkillCategoryLookupRow).category_id === previousRawCategoryId,
      );

    if (removeOldCategoriesError || !removedPreviousCategory) {
      await context.supabase
        .from("skills")
        .update({
          title: existingSkill.title,
          short_description: existingSkill.short_description,
          long_description: existingSkill.long_description,
          file_path: existingSkill.file_path,
          current_version: existingCurrentVersion,
        })
        .eq("id", skillId);

      if (insertedVersionId) {
        await context.supabase.from("skill_versions").delete().eq("id", insertedVersionId);
      }
      await context.supabase
        .from("skill_categories")
        .delete()
        .eq("skill_id", skillId)
        .eq("category_id", nextCategoryRowId);

      if (previousRawCategoryId) {
        await context.supabase.from("skill_categories").insert({
          skill_id: skillId,
          category_id: previousRawCategoryId,
        });
      }

      await removeStoredFiles(
        context.supabase,
        getRollbackStoragePaths({ uploadedStoragePath, versionChanged }),
      );
      return {
        ...createCategorySaveFailureResponse(
          removeOldCategoriesError?.message ??
            "The new category was added, but the previous category could not be removed.",
        ),
        fieldValues,
      };
    }
  }

  await revalidateSkillPaths(existingSkill.slug, skillId);
  redirect(`/skills/${existingSkill.slug}?updated=1`);
}

export async function deleteSkill(
  skillId: string,
  _previousState: UploadFormState,
  formData: FormData,
): Promise<UploadFormState> {
  const context = await requireActiveMember();
  const confirmed = String(formData.get("confirmDelete") ?? "") === "on";

  if (!confirmed) {
    return createResponse("Confirm deletion before continuing.", [
      "Check the confirmation box before deleting this skill.",
    ]);
  }

  const { data: existingSkill, error: existingSkillError } = await context.supabase
    .from("skills")
    .select("id, slug, file_path, uploader_id")
    .eq("id", skillId)
    .maybeSingle<DeletableSkillRecord>();

  if (existingSkillError) {
    return createResponse(existingSkillError.message);
  }

  if (!existingSkill) {
    return createResponse("This skill could not be found for deletion.");
  }

  const canDelete = isSkillOwner(context.member.user_id, existingSkill.uploader_id);

  if (!canDelete) {
    return createResponse("You do not have permission to delete this skill.");
  }

  const { data: versions, error: versionsError } = await context.supabase
    .from("skill_versions")
    .select("storage_path")
    .eq("skill_id", skillId);

  if (versionsError) {
    return createResponse(versionsError.message);
  }

  const storagePaths = getUniqueStoragePaths([
    existingSkill.file_path,
    ...(versions ?? []).map((version) => (version as SkillStoragePathRecord).storage_path),
  ]);
  const { backups, error: backupError } = await backupStoredFiles(context.supabase, storagePaths);

  if (backupError) {
    return createResponse(backupError);
  }

  if (storagePaths.length > 0) {
    const { error: storageDeleteError } = await context.supabase.storage
      .from("skills")
      .remove(storagePaths);

    if (storageDeleteError) {
      return createResponse(storageDeleteError.message);
    }
  }

  const { data: deletedSkill, error: deleteSkillError } = await context.supabase
    .from("skills")
    .delete()
    .eq("id", skillId)
    .select("id")
    .maybeSingle();

  if (deleteSkillError || !deletedSkill) {
    await restoreStoredFiles(context.supabase, backups);
    return createResponse(deleteSkillError?.message ?? "This skill could not be deleted.");
  }

  await revalidateSkillPaths(existingSkill.slug, skillId);
  redirect("/skills");
}

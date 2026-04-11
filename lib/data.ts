import type { SupabaseClient } from "@supabase/supabase-js";
import { markdownToBlocks } from "@/lib/upload-utils";
import { getDisplayNameFromEmail, type OrgMemberRecord } from "@/lib/auth";
import {
  getCanonicalCategories,
  getCanonicalCategoryFromRow,
} from "@/lib/category-taxonomy";
import {
  buildDownloadCountBySkillId,
  getDownloadCountForSkill,
  type DownloadCountRow,
} from "@/lib/downloads";
import { getSkillsForCatalog } from "@/lib/skills";
import type {
  Category,
  Skill,
  SkillCatalogQuery,
  SkillStatus,
  SkillVersion,
  Uploader,
} from "@/lib/types";

type SkillRow = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  uploader_id: string;
  file_path: string;
  current_version: number | string;
  status: string;
  created_at: string;
  updated_at: string;
};

type SkillCategoryRow = {
  skill_id: string;
  category_id: string;
};

type SkillVersionRow = {
  id: string;
  skill_id: string;
  version_number: number | string;
  storage_path: string;
  change_notes: string | null;
  created_at: string;
  created_by: string;
};

type SkillVersionCountRow = {
  skill_id: string;
};

type SkillChangeEventRow = {
  id: string;
  skill_id: string;
  version_number: number | string;
  change_summary: string;
  created_at: string;
  created_by: string;
};

type CategoryRow = {
  id: string;
  slug?: string;
  name: string;
};

function isUuidLike(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function isSkillStatus(value: string): value is SkillStatus {
  return [
    "approved",
    "in-review",
    "needs-changes",
    "draft",
    "published",
    "archived",
  ].includes(value);
}

function getFileNameFromStoragePath(storagePath: string) {
  return storagePath.split("/").filter(Boolean).at(-1) ?? "stored-skill.md";
}

export async function listCategories(_supabase: SupabaseClient) {
  void _supabase;
  return getCanonicalCategories();
}

async function listCategoryRows(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("categories")
    .select("id, slug, name")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CategoryRow[];
}

export async function listOrgMembers(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("org_members")
    .select("user_id, email, role, is_active, created_at")
    .order("email", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as OrgMemberRecord[];
}

export function mapMemberToUploader(member: OrgMemberRecord): Uploader {
  return {
    id: member.user_id,
    email: member.email,
    name: getDisplayNameFromEmail(member.email),
    role: member.role,
    initials: "",
    team: "Cars",
  };
}

export async function listCatalogData(supabase: SupabaseClient) {
  const [categories, members, skills, skillCategories, versions, downloads] = await Promise.all([
    listCategoryRows(supabase),
    listOrgMembers(supabase),
    supabase
      .from("skills")
      .select(
        "id, title, slug, short_description, long_description, uploader_id, file_path, current_version, status, created_at, updated_at",
      )
      .order("updated_at", { ascending: false }),
    supabase.from("skill_categories").select("skill_id, category_id"),
    supabase
      .from("skill_versions")
      .select("id, skill_id, version_number, storage_path, change_notes, created_at, created_by")
      .order("version_number", { ascending: false }),
    supabase.from("downloads").select("skill_id"),
  ]);

  if (skills.error) {
    throw new Error(skills.error.message);
  }

  if (skillCategories.error) {
    throw new Error(skillCategories.error.message);
  }

  if (versions.error) {
    throw new Error(versions.error.message);
  }

  if (downloads.error) {
    throw new Error(downloads.error.message);
  }

  return {
    categories,
    members,
    skills: (skills.data ?? []) as SkillRow[],
    skillCategories: (skillCategories.data ?? []) as SkillCategoryRow[],
    versions: (versions.data ?? []) as SkillVersionRow[],
    downloads: (downloads.data ?? []) as DownloadCountRow[],
  };
}

async function listCatalogIndexData(supabase: SupabaseClient) {
  const [categories, members, skills, skillCategories, versions, downloads] = await Promise.all([
    listCategoryRows(supabase),
    listOrgMembers(supabase),
    supabase
      .from("skills")
      .select(
        "id, title, slug, short_description, long_description, uploader_id, file_path, current_version, status, created_at, updated_at",
      )
      .order("updated_at", { ascending: false }),
    supabase.from("skill_categories").select("skill_id, category_id"),
    supabase.from("skill_versions").select("skill_id"),
    supabase.from("downloads").select("skill_id"),
  ]);

  if (skills.error) {
    throw new Error(skills.error.message);
  }

  if (skillCategories.error) {
    throw new Error(skillCategories.error.message);
  }

  if (versions.error) {
    throw new Error(versions.error.message);
  }

  if (downloads.error) {
    throw new Error(downloads.error.message);
  }

  return {
    categories,
    members,
    skills: (skills.data ?? []) as SkillRow[],
    skillCategories: (skillCategories.data ?? []) as SkillCategoryRow[],
    versions: (versions.data ?? []) as SkillVersionCountRow[],
    downloads: (downloads.data ?? []) as DownloadCountRow[],
  };
}

export async function listSkillsForCatalog(
  supabase: SupabaseClient,
  query: SkillCatalogQuery,
): Promise<{ categories: Category[]; uploaders: Uploader[]; skills: Skill[]; totalSkillCount: number }> {
  const catalog = await listCatalogIndexData(supabase);
  const rawCategoryById = new Map(catalog.categories.map((category) => [category.id, category]));
  const memberById = new Map(catalog.members.map((member) => [member.user_id, member]));
  const categoryIdBySkillId = new Map(
    catalog.skillCategories.map((item) => [item.skill_id, item.category_id] as const),
  );
  const versionCountBySkillId = new Map<string, number>();
  const downloadCountBySkillId = buildDownloadCountBySkillId(catalog.downloads);

  catalog.versions.forEach((version) => {
    versionCountBySkillId.set(
      version.skill_id,
      (versionCountBySkillId.get(version.skill_id) ?? 0) + 1,
    );
  });

  const skills: Skill[] = [];

  catalog.skills.forEach((skill) => {
    const rawCategoryId = categoryIdBySkillId.get(skill.id) ?? "";
    const rawCategory = rawCategoryById.get(rawCategoryId);
    const category = rawCategory ? getCanonicalCategoryFromRow(rawCategory) : null;
    const member = memberById.get(skill.uploader_id);

    if (!category || !member || !isSkillStatus(skill.status)) {
      return;
    }

    skills.push({
      id: skill.id,
      title: skill.title,
      slug: skill.slug,
      summary: skill.short_description ?? "No short description yet.",
      description: skill.long_description ?? skill.short_description ?? "No long description yet.",
      categoryId: category.id,
      categoryName: category.name,
      uploaderId: skill.uploader_id,
      uploaderName: getDisplayNameFromEmail(member.email),
      uploaderEmail: member.email,
      status: skill.status,
      latestVersion: String(skill.current_version),
      versionCount: versionCountBySkillId.get(skill.id) ?? 1,
      updatedAt: skill.updated_at,
      createdAt: skill.created_at,
      downloads: getDownloadCountForSkill(downloadCountBySkillId, skill.id),
      markdownBlocks: [],
      versionHistory: [],
      filePath: skill.file_path,
    });
  });

  const uploaders = Array.from(
    new Map(
      skills
        .map((skill) => memberById.get(skill.uploaderId))
        .filter((member): member is OrgMemberRecord => Boolean(member))
        .sort((left, right) => left.email.localeCompare(right.email))
        .map((member) => [member.user_id, mapMemberToUploader(member)]),
    ).values(),
  );

  return {
    categories: getCanonicalCategories(),
    uploaders,
    skills: getSkillsForCatalog(skills, query),
    totalSkillCount: skills.length,
  };
}

export async function getSkillDetailBySlug(supabase: SupabaseClient, slug: string) {
  const skillQuery = supabase
    .from("skills")
    .select(
      "id, title, slug, short_description, long_description, uploader_id, file_path, current_version, status, created_at, updated_at",
    );
  const skillResult = isUuidLike(slug)
    ? await skillQuery.eq("id", slug).maybeSingle<SkillRow>()
    : await skillQuery.eq("slug", slug).maybeSingle<SkillRow>();

  if (skillResult.error) {
    throw new Error(skillResult.error.message);
  }

  const skill = skillResult.data;

  if (!skill) {
    return null;
  }

  const [skillCategoryResult, uploaderResult, versionsResult, downloadsResult, changeEventsResult] =
    await Promise.all([
      supabase
        .from("skill_categories")
        .select("skill_id, category_id")
        .eq("skill_id", skill.id)
        .maybeSingle<SkillCategoryRow>(),
      supabase
        .from("org_members")
        .select("user_id, email, role, is_active, created_at")
        .eq("user_id", skill.uploader_id)
        .maybeSingle<OrgMemberRecord>(),
      supabase
        .from("skill_versions")
        .select("id, skill_id, version_number, storage_path, change_notes, created_at, created_by")
        .eq("skill_id", skill.id)
        .order("version_number", { ascending: false }),
      supabase.from("downloads").select("skill_id").eq("skill_id", skill.id),
      supabase
        .from("skill_change_events")
        .select("id, skill_id, version_number, change_summary, created_at, created_by")
        .eq("skill_id", skill.id)
        .order("created_at", { ascending: false }),
    ]);

  if (skillCategoryResult.error) {
    throw new Error(skillCategoryResult.error.message);
  }

  if (uploaderResult.error) {
    throw new Error(uploaderResult.error.message);
  }

  if (versionsResult.error) {
    throw new Error(versionsResult.error.message);
  }

  if (downloadsResult.error) {
    throw new Error(downloadsResult.error.message);
  }

  const rawCategoryId = skillCategoryResult.data?.category_id ?? "";
  let category: Category | null = null;

  if (rawCategoryId) {
    const categoryResult = await supabase
      .from("categories")
      .select("id, slug, name")
      .eq("id", rawCategoryId)
      .maybeSingle<CategoryRow>();

    if (categoryResult.error) {
      throw new Error(categoryResult.error.message);
    }

    category = categoryResult.data ? getCanonicalCategoryFromRow(categoryResult.data) : null;
  }

  const uploader = uploaderResult.data ?? null;

  if (!category || !uploader) {
    return null;
  }

  const versionsForSkill = ((versionsResult.data ?? []) as SkillVersionRow[]).sort(
    (left, right) => Number(right.version_number) - Number(left.version_number),
  );
  const latestVersion = versionsForSkill[0];
  const latestStoragePath = latestVersion?.storage_path ?? skill.file_path;
  const { data: file } = await supabase.storage.from("skills").download(latestStoragePath);
  const markdown = file ? await file.text() : "No markdown file could be loaded.";
  const downloadCountBySkillId = buildDownloadCountBySkillId(
    (downloadsResult.data ?? []) as DownloadCountRow[],
  );
  const changeEvents = changeEventsResult.data;
  const changeEventsError = changeEventsResult.error;

  if (changeEventsError) {
    console.warn("Failed to load skill change events, falling back to version rows.", {
      skillId: skill.id,
      message: changeEventsError.message,
    });
  }

  const changeEventHistory: SkillVersion[] = ((changeEvents ?? []) as SkillChangeEventRow[]).map(
    (item) => ({
      id: item.id,
      version: String(item.version_number),
      publishedAt: item.created_at,
      status: isSkillStatus(skill.status) ? skill.status : "published",
      summary: item.change_summary,
    }),
  );

  const fallbackVersionHistory: SkillVersion[] = versionsForSkill.map((item) => ({
    id: item.id,
    version: String(item.version_number),
    publishedAt: item.created_at,
    status: isSkillStatus(skill.status) ? skill.status : "published",
    summary: item.change_notes ?? "No change notes recorded.",
  }));

  return {
    skill: {
      id: skill.id,
      title: skill.title,
      slug: skill.slug,
      summary: skill.short_description ?? "No short description yet.",
      description: skill.long_description ?? skill.short_description ?? "No long description yet.",
      categoryId: category.id,
      categoryName: category.name,
      uploaderId: skill.uploader_id,
      uploaderName: getDisplayNameFromEmail(uploader.email),
      uploaderEmail: uploader.email,
      status: isSkillStatus(skill.status) ? skill.status : "published",
      latestVersion: String(skill.current_version),
      versionCount: versionsForSkill.length || 1,
      updatedAt: skill.updated_at,
      createdAt: skill.created_at,
      downloads: getDownloadCountForSkill(downloadCountBySkillId, skill.id),
      markdownBlocks: markdownToBlocks(markdown),
      versionHistory: changeEventHistory.length ? changeEventHistory : fallbackVersionHistory,
      filePath: latestStoragePath,
    } satisfies Skill,
    category,
    uploader: mapMemberToUploader(uploader),
    relatedSkills: [],
    currentFileName: getFileNameFromStoragePath(latestStoragePath),
  };
}

export async function listSkillsForMember(supabase: SupabaseClient, memberId: string) {
  const { skills } = await listSkillsForCatalog(supabase, {
    search: "",
    category: "",
    uploader: memberId,
    sort: "newest",
  });

  return skills;
}

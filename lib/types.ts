export type UserRole = "member" | "admin";

export type BadgeTone =
  | "neutral"
  | "information"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "danger";

export type BadgeAppearance = "subtle" | "solid" | "stroke";

export type BadgeSize = "xs" | "md";

export type SkillStatus =
  | "approved"
  | "in-review"
  | "needs-changes"
  | "draft"
  | "published"
  | "archived";

export type SkillSort = "newest" | "oldest" | "title-asc" | "uploader-asc";

export interface SkillCatalogQuery {
  search: string;
  category: string;
  uploader: string;
  sort: SkillSort;
}

export interface Category {
  id: string;
  slug?: string;
  name: string;
  description?: string;
}

export interface Uploader {
  id: string;
  name: string;
  email: string;
  initials?: string;
  role: string;
  team?: string;
}

export type MarkdownBlock =
  | { type: "heading"; content: string; level: 1 | 2 | 3 }
  | { type: "paragraph"; content: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; content: string }
  | { type: "code"; language: string; content: string };

export interface SkillVersion {
  version: string;
  publishedAt: string;
  status: SkillStatus;
  summary: string;
}

export interface Skill {
  id: string;
  title: string;
  slug?: string;
  summary: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  uploaderId: string;
  uploaderName?: string;
  uploaderEmail?: string;
  status: SkillStatus;
  latestVersion: string | number;
  versionCount: number;
  updatedAt: string;
  createdAt: string;
  usageLast30Days?: number;
  saves?: number;
  downloads?: number;
  tags?: string[];
  reviewNote?: string;
  markdownBlocks: MarkdownBlock[];
  versionHistory: SkillVersion[];
  filePath?: string;
}

export interface ReviewItem {
  id: string;
  skillId: string;
  priority: "High" | "Medium" | "Low";
  requestedBy: string;
  requestedAt: string;
  reason: string;
  currentStep: string;
}

export type ReviewDecision = "approved" | "rejected";

export interface ReviewedItem {
  id: string;
  skillId: string;
  reviewedBy: string;
  reviewedAt: string;
  decision: ReviewDecision;
  note: string;
}

export interface UploadDraft {
  title: string;
  categoryId: string;
  summary: string;
  fileName: string;
  version?: string;
}

export type UploadFormMode = "create" | "edit";

import { type NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { requireActiveMember } from "@/lib/auth";

function createDownloadFileName(title: string, fallbackSlug: string) {
  const normalizedTitle = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${normalizedTitle || fallbackSlug}.md`;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const context = await requireActiveMember();
  const { slug } = await params;
  const { data: skill, error } = await context.supabase
    .from("skills")
    .select("id, title, file_path, current_version")
    .eq("slug", slug)
    .maybeSingle<{
      id: string;
      title: string;
      file_path: string;
      current_version: number | string;
    }>();

  if (error) {
    throw new Error(error.message);
  }

  if (!skill) {
    notFound();
  }

  const { data: currentVersion, error: versionError } = await context.supabase
    .from("skill_versions")
    .select("storage_path")
    .eq("skill_id", skill.id)
    .eq("version_number", skill.current_version)
    .maybeSingle<{ storage_path: string }>();

  if (versionError) {
    throw new Error(versionError.message);
  }

  const storagePath = currentVersion?.storage_path ?? skill.file_path;

  const { data: file, error: downloadError } = await context.supabase.storage
    .from("skills")
    .download(storagePath);

  if (downloadError || !file) {
    throw new Error(downloadError?.message ?? "The markdown file could not be downloaded.");
  }

  const { error: insertDownloadError } = await context.supabase.from("downloads").insert({
    skill_id: skill.id,
    user_id: context.member.user_id,
  });

  if (insertDownloadError) {
    console.error("Failed to log skill download", insertDownloadError);
  }

  return new Response(file, {
    headers: {
      "Content-Type": `${file.type || "text/markdown"}; charset=utf-8`,
      "Content-Disposition": `attachment; filename="${createDownloadFileName(skill.title, slug)}"`,
      "Cache-Control": "no-store",
    },
  });
}

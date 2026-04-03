export type DownloadCountRow = {
  skill_id: string;
};

export function buildDownloadCountBySkillId(downloads: DownloadCountRow[]) {
  const downloadCountBySkillId = new Map<string, number>();

  downloads.forEach((download) => {
    downloadCountBySkillId.set(
      download.skill_id,
      (downloadCountBySkillId.get(download.skill_id) ?? 0) + 1,
    );
  });

  return downloadCountBySkillId;
}

export function getDownloadCountForSkill(
  downloadCountBySkillId: ReadonlyMap<string, number>,
  skillId: string,
) {
  return downloadCountBySkillId.get(skillId) ?? 0;
}

export function shouldLogSkillDownload(headers: Headers) {
  if (headers.has("next-router-prefetch")) {
    return false;
  }

  const purposeHeaders = ["purpose", "x-purpose", "sec-purpose", "x-middleware-prefetch"];

  return !purposeHeaders.some((headerName) =>
    headers.get(headerName)?.toLowerCase().includes("prefetch"),
  );
}

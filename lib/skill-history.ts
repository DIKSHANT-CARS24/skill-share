type BuildSkillChangeSummaryArgs = {
  previousTitle: string;
  nextTitle: string;
  previousCategoryName?: string;
  nextCategoryName?: string;
  previousDescription: string;
  nextDescription: string;
  replacementFileName?: string;
  previousVersion: number;
  nextVersion: number;
};

export type SkillChangeField =
  | "title"
  | "category"
  | "description"
  | "markdown"
  | "version";

export type SkillChangeDetail = {
  field: SkillChangeField;
  label: string;
  summary: string;
};

function formatChangeList(values: string[]) {
  if (values.length <= 1) {
    return values[0] ?? "";
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

export function formatSkillVersionNumber(value: number | string) {
  const normalized = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(normalized)) {
    return String(value);
  }

  return Number.isInteger(normalized) ? String(normalized) : String(normalized);
}

export function detectSkillChangeDetails({
  previousTitle,
  nextTitle,
  previousCategoryName,
  nextCategoryName,
  previousDescription,
  nextDescription,
  replacementFileName,
  previousVersion,
  nextVersion,
}: BuildSkillChangeSummaryArgs): SkillChangeDetail[] {
  const changes: SkillChangeDetail[] = [];

  if (previousTitle !== nextTitle) {
    changes.push({
      field: "title",
      label: "title",
      summary: `updated title to "${nextTitle}"`,
    });
  }

  if ((previousCategoryName ?? "") !== (nextCategoryName ?? "")) {
    changes.push({
      field: "category",
      label: "category",
      summary: nextCategoryName
        ? `changed category to ${nextCategoryName}`
        : "changed category",
    });
  }

  if (previousDescription !== nextDescription) {
    changes.push({
      field: "description",
      label: "description",
      summary: "updated description",
    });
  }

  if (replacementFileName) {
    changes.push({
      field: "markdown",
      label: "markdown file",
      summary: `replaced the markdown file with ${replacementFileName}`,
    });
  }

  if (previousVersion !== nextVersion) {
    changes.push({
      field: "version",
      label: "version",
      summary: `set version to v${formatSkillVersionNumber(nextVersion)}`,
    });
  }

  return changes;
}

export function buildSkillChangeSummary(args: BuildSkillChangeSummaryArgs) {
  const changes = detectSkillChangeDetails(args);

  if (!changes.length) {
    return {
      changedFields: [] as string[],
      summary: "Saved the latest version.",
    };
  }

  const summary = formatChangeList(changes.map((change) => change.summary));

  return {
    changedFields: changes.map((change) => change.label),
    summary: `${summary.charAt(0).toUpperCase()}${summary.slice(1)}.`,
  };
}

import type { Skill, SkillCatalogQuery, SkillSort } from "./types.ts";
import { normalizeCategoryValue } from "./category-taxonomy.ts";

type SearchParamValue = string | string[] | undefined;
type SearchFieldName = "title" | "summary" | "description" | "category" | "tag" | "uploader";
type MatchKind = "exact" | "prefix" | "substring" | "fuzzy";

type SearchField = {
  name: SearchFieldName;
  normalized: string;
  tokens: string[];
  weight: number;
};

type TokenMatch = {
  fieldName: SearchFieldName;
  kind: MatchKind;
  score: number;
};

type SkillSearchRank = {
  isMatch: boolean;
  score: number;
  phraseMatchCount: number;
  titleMatchCount: number;
  exactMatchCount: number;
  fuzzyMatchCount: number;
};

export const DEFAULT_SKILL_SORT: SkillSort = "newest";
export const sortOptions: Array<{ value: SkillSort; label: string }> = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "uploader-asc", label: "Uploader A-Z" },
];

export function getSingleSearchParamValue(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

export function parseSkillCatalogQuery(searchParams: Record<string, SearchParamValue>) {
  const search = getSingleSearchParamValue(searchParams.q).trim();
  const category = normalizeCategoryValue(getSingleSearchParamValue(searchParams.category));
  const uploader = getSingleSearchParamValue(searchParams.uploader);
  const sort = getSingleSearchParamValue(searchParams.sort);

  return {
    search,
    category,
    uploader,
    sort: isSkillSort(sort) ? sort : DEFAULT_SKILL_SORT,
  } satisfies SkillCatalogQuery;
}

export function createSkillCatalogSearchParams(query: SkillCatalogQuery) {
  const params = new URLSearchParams();

  if (query.search) {
    params.set("q", query.search);
  }

  if (query.category) {
    params.set("category", query.category);
  }

  if (query.uploader) {
    params.set("uploader", query.uploader);
  }

  if (query.sort !== DEFAULT_SKILL_SORT) {
    params.set("sort", query.sort);
  }

  return params;
}

export function getSkillsForCatalog(allSkills: Skill[], query: SkillCatalogQuery) {
  const filteredSkills = [...allSkills]
    .filter((skill) => matchesCategory(skill, query.category))
    .filter((skill) => matchesUploader(skill, query.uploader));

  if (!query.search) {
    return filteredSkills.sort((left, right) => compareSkills(left, right, query.sort));
  }

  return filteredSkills
    .map((skill) => ({ skill, rank: rankSkillForSearch(skill, query.search) }))
    .filter((item) => item.rank.isMatch)
    .sort((left, right) => {
      const byRelevance = compareSearchRanks(left.rank, right.rank);

      if (byRelevance !== 0) {
        return byRelevance;
      }

      return compareSkills(left.skill, right.skill, query.sort);
    })
    .map((item) => item.skill);
}

export function getSkillSortLabel(sort: SkillSort) {
  return sortOptions.find((option) => option.value === sort)?.label ?? "Newest";
}

function compareSkills(left: Skill, right: Skill, sort: SkillSort) {
  if (sort === "oldest") {
    return compareDates(getSortDate(left), getSortDate(right));
  }

  if (sort === "title-asc") {
    return left.title.localeCompare(right.title);
  }

  if (sort === "uploader-asc") {
    const leftUploader = left.uploaderName ?? left.uploaderEmail ?? left.uploaderId;
    const rightUploader = right.uploaderName ?? right.uploaderEmail ?? right.uploaderId;
    const byUploader = leftUploader.localeCompare(rightUploader);

    return byUploader || left.title.localeCompare(right.title);
  }

  return compareDates(getSortDate(right), getSortDate(left));
}

function compareDates(left: string, right: string) {
  return new Date(left).getTime() - new Date(right).getTime();
}

function getSortDate(skill: Skill) {
  return skill.updatedAt || skill.createdAt;
}

function matchesCategory(skill: Skill, categoryId: string) {
  return !categoryId || skill.categoryId === categoryId;
}

function matchesUploader(skill: Skill, uploaderId: string) {
  return !uploaderId || skill.uploaderId === uploaderId;
}

function isSkillSort(value: string): value is SkillSort {
  return sortOptions.some((option) => option.value === value);
}

function compareSearchRanks(left: SkillSearchRank, right: SkillSearchRank) {
  if (left.score !== right.score) {
    return right.score - left.score;
  }

  if (left.phraseMatchCount !== right.phraseMatchCount) {
    return right.phraseMatchCount - left.phraseMatchCount;
  }

  if (left.titleMatchCount !== right.titleMatchCount) {
    return right.titleMatchCount - left.titleMatchCount;
  }

  if (left.exactMatchCount !== right.exactMatchCount) {
    return right.exactMatchCount - left.exactMatchCount;
  }

  if (left.fuzzyMatchCount !== right.fuzzyMatchCount) {
    return left.fuzzyMatchCount - right.fuzzyMatchCount;
  }

  return 0;
}

function rankSkillForSearch(skill: Skill, search: string): SkillSearchRank {
  const normalizedSearch = normalizeSearchText(search);
  const searchTokens = tokenizeSearchText(normalizedSearch);

  if (!normalizedSearch || !searchTokens.length) {
    return {
      isMatch: true,
      score: 0,
      phraseMatchCount: 0,
      titleMatchCount: 0,
      exactMatchCount: 0,
      fuzzyMatchCount: 0,
    };
  }

  const fields = getSearchFields(skill);
  let score = 0;
  let phraseMatchCount = 0;
  let titleMatchCount = 0;
  let exactMatchCount = 0;
  let fuzzyMatchCount = 0;

  fields.forEach((field) => {
    if (field.normalized.includes(normalizedSearch)) {
      phraseMatchCount += 1;
      score += field.weight * (field.name === "title" ? 6 : 3);
    }
  });

  for (const token of searchTokens) {
    const bestMatch = findBestTokenMatch(token, fields);

    if (!bestMatch) {
      return {
        isMatch: false,
        score: 0,
        phraseMatchCount,
        titleMatchCount,
        exactMatchCount,
        fuzzyMatchCount,
      };
    }

    const resolvedMatch: TokenMatch = bestMatch;

    score += resolvedMatch.score;

    if (resolvedMatch.kind === "exact") {
      exactMatchCount += 1;
    }

    if (resolvedMatch.kind === "fuzzy") {
      fuzzyMatchCount += 1;
    }

    if (resolvedMatch.fieldName === "title") {
      titleMatchCount += 1;
    }
  }

  score += (searchTokens.length - fuzzyMatchCount) * 0.6;

  return {
    isMatch: true,
    score,
    phraseMatchCount,
    titleMatchCount,
    exactMatchCount,
    fuzzyMatchCount,
  };
}

function findBestTokenMatch(token: string, fields: SearchField[]): TokenMatch | null {
  let bestMatch: TokenMatch | null = null;

  fields.forEach((field) => {
    field.tokens.forEach((candidate) => {
      const baseMatch = scoreTokenAgainstCandidate(token, candidate);

      if (!baseMatch) {
        return;
      }

      const weightedScore = baseMatch.score * field.weight;
      const nextMatch = {
        fieldName: field.name,
        kind: baseMatch.kind,
        score: weightedScore,
      };

      if (!bestMatch || weightedScore > bestMatch.score) {
        bestMatch = nextMatch;
      }
    });
  });

  return bestMatch;
}

function scoreTokenAgainstCandidate(token: string, candidate: string) {
  if (token === candidate) {
    return { kind: "exact" as const, score: 5 };
  }

  if (candidate.startsWith(token) && token.length >= 2) {
    return { kind: "prefix" as const, score: 4.2 };
  }

  if (token.length >= 4 && candidate.includes(token)) {
    return { kind: "substring" as const, score: 3.5 };
  }

  const allowedDistance = getAllowedEditDistance(token, candidate);

  if (allowedDistance === 0) {
    return null;
  }

  const distance = getBoundedLevenshteinDistance(token, candidate, allowedDistance);

  if (distance === null) {
    return null;
  }

  const longestLength = Math.max(token.length, candidate.length);
  const similarity = 1 - distance / longestLength;

  return {
    kind: "fuzzy" as const,
    score: 2.2 + similarity,
  };
}

function getAllowedEditDistance(token: string, candidate: string) {
  const minLength = Math.min(token.length, candidate.length);
  const lengthDelta = Math.abs(token.length - candidate.length);

  if (minLength <= 3) {
    return 0;
  }

  if (minLength <= 5) {
    return lengthDelta <= 1 ? 1 : 0;
  }

  if (minLength <= 9) {
    return lengthDelta <= 2 ? 2 : 0;
  }

  return lengthDelta <= 3 ? 3 : 0;
}

function getBoundedLevenshteinDistance(source: string, target: string, maxDistance: number) {
  if (Math.abs(source.length - target.length) > maxDistance) {
    return null;
  }

  const previous = new Array(target.length + 1).fill(0);
  const current = new Array(target.length + 1).fill(0);

  for (let column = 0; column <= target.length; column += 1) {
    previous[column] = column;
  }

  for (let row = 1; row <= source.length; row += 1) {
    current[0] = row;
    let smallestInRow = current[0];

    for (let column = 1; column <= target.length; column += 1) {
      const substitutionCost = source[row - 1] === target[column - 1] ? 0 : 1;

      current[column] = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        previous[column - 1] + substitutionCost,
      );

      if (current[column] < smallestInRow) {
        smallestInRow = current[column];
      }
    }

    if (smallestInRow > maxDistance) {
      return null;
    }

    for (let column = 0; column <= target.length; column += 1) {
      previous[column] = current[column];
    }
  }

  return previous[target.length] <= maxDistance ? previous[target.length] : null;
}

function getSearchFields(skill: Skill): SearchField[] {
  return [
    createSearchField("title", skill.title),
    createSearchField("summary", skill.summary),
    createSearchField("description", skill.description),
    createSearchField("category", skill.categoryName ?? ""),
    createSearchField("uploader", skill.uploaderName ?? ""),
    ...(skill.tags ?? []).map((tag) => createSearchField("tag", tag)),
  ].filter((field) => field.tokens.length > 0);
}

function createSearchField(name: SearchFieldName, value: string): SearchField {
  const normalized = normalizeSearchText(value);

  return {
    name,
    normalized,
    tokens: tokenizeSearchText(normalized),
    weight: getFieldWeight(name),
  };
}

function getFieldWeight(name: SearchFieldName) {
  if (name === "title") {
    return 4.5;
  }

  if (name === "summary") {
    return 3.2;
  }

  if (name === "description") {
    return 2.2;
  }

  if (name === "category" || name === "tag") {
    return 1.8;
  }

  return 1.2;
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeSearchText(value: string) {
  return value.split(" ").filter(Boolean);
}

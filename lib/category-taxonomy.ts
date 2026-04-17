import type { Category } from "@/lib/types";

type CanonicalCategoryId =
  | "design"
  | "development"
  | "product"
  | "finance"
  | "operations"
  | "marketing";

type CategoryRowLike = {
  id: string;
  slug?: string | null;
  name?: string | null;
};

const CANONICAL_CATEGORIES: Category[] = [
  {
    id: "design",
    slug: "design",
    name: "Design",
    description: "Design systems, UI reviews, and design-to-content workflows.",
  },
  {
    id: "development",
    slug: "development",
    name: "Development",
    description: "Debugging, code generation, QA, and technical triage workflows.",
  },
  {
    id: "product",
    slug: "product",
    name: "Product",
    description: "Planning, hiring, enablement, and launch decision support.",
  },
  {
    id: "finance",
    slug: "finance",
    name: "Finance",
    description: "Reporting, review prep, and compliance support templates.",
  },
  {
    id: "operations",
    slug: "operations",
    name: "Operations",
    description: "Process design, support operations, and workflow automation prompts.",
  },
  {
    id: "marketing",
    slug: "marketing",
    name: "Marketing",
    description: "Campaign planning, copy review, and growth workflow prompts.",
  },
];

const CANONICAL_LOOKUP = new Map(
  CANONICAL_CATEGORIES.map((category) => [category.id, category] as const),
);

const CATEGORY_ALIASES: Record<CanonicalCategoryId, string[]> = {
  design: ["design"],
  development: ["development", "engineering"],
  product: ["product", "people-ops", "people"],
  finance: ["finance"],
  operations: ["operations", "customer-support"],
  marketing: ["marketing"],
};

function normalizeToken(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function getCanonicalCategories() {
  return CANONICAL_CATEGORIES;
}

export function normalizeCategoryValue(value: string) {
  const token = normalizeToken(value);

  for (const [canonicalId, aliases] of Object.entries(CATEGORY_ALIASES) as Array<
    [CanonicalCategoryId, string[]]
  >) {
    if (aliases.includes(token)) {
      return canonicalId;
    }
  }

  return "";
}

export function getCanonicalCategoryById(value: string) {
  const canonicalId = normalizeCategoryValue(value);
  return canonicalId ? CANONICAL_LOOKUP.get(canonicalId) ?? null : null;
}

export function getCanonicalCategoryFromRow(category: CategoryRowLike) {
  const canonicalFromSlug = category.slug ? getCanonicalCategoryById(category.slug) : null;

  if (canonicalFromSlug) {
    return canonicalFromSlug;
  }

  if (category.name) {
    return getCanonicalCategoryById(category.name);
  }

  return null;
}

export function getRawCategorySlugsForCanonicalId(value: string) {
  const canonicalId = normalizeCategoryValue(value) as CanonicalCategoryId | "";
  return canonicalId ? CATEGORY_ALIASES[canonicalId] : [];
}

export function pickPreferredRawCategory<Row extends CategoryRowLike>(
  rows: Row[],
  canonicalId: string,
) {
  const aliases = getRawCategorySlugsForCanonicalId(canonicalId);

  for (const alias of aliases) {
    const matchingRow = rows.find((row) => {
      const normalizedSlug = row.slug ? normalizeToken(row.slug) : "";
      const normalizedName = row.name ? normalizeToken(row.name) : "";

      return normalizedSlug === alias || normalizedName === alias;
    });

    if (matchingRow) {
      return matchingRow;
    }
  }

  return null;
}

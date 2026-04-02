# Category taxonomy update

## Exact files changed

- `docs/data/category-taxonomy-update.md`
- `lib/constants.ts`
- `lib/mock-data.ts`
- `lib/skills.test.ts`
- `supabase/migrations/20260331092000_seed_categories.sql`
- `supabase/migrations/20260403090000_update_category_taxonomy.sql`

## Final canonical category list

- `design`
- `development`
- `product`
- `finance`
- `operations`

## Old-to-new category mapping

- `Engineering` -> `Development`
- `Finance` -> `Finance`
- `Operations` -> `Operations`
- `People Ops` -> `Product`
- `Customer Support` -> `Operations`

## Skills that needed judgment-based reassignment

- `Launch Readiness Check`
  Moved from `Operations` to `Product` in the mock/sample data because the title and description are explicitly centred on PMs, release managers, and launch readiness decisions.

## UI coverage

- The canonical category set now flows through the shared category data used by:
  - catalog filters
  - skill cards and badges
  - skill detail badges
  - profile contribution chips
  - upload and edit form dropdowns
  - empty/loading/no-results preview states backed by mock data

- The database seed now inserts only the five canonical categories.
- The follow-up migration remaps existing `skill_categories` rows from the retired categories into the new canonical set and removes the retired category rows.
- The app also normalizes legacy category rows at read time so pages and filters render only the canonical five even before every existing database environment has applied the remap migration.
- Sample constants and tests that depended on the old taxonomy were updated to the new category names and ids.

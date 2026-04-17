# Category taxonomy update

## Exact files changed

- `docs/data/category-taxonomy-update.md`
- `docs/supabase-setup.md`
- `docs/ui-redesign/edit-skill/category-bug-fix-notes.md`
- `lib/category-taxonomy.test.ts`
- `lib/category-taxonomy.ts`
- `lib/mock-data.ts`
- `supabase/migrations/20260331092000_seed_categories.sql`
- `supabase/migrations/20260403090000_update_category_taxonomy.sql`
- `supabase/migrations/20260403123000_ensure_canonical_categories.sql`
- `supabase/migrations/20260417113000_add_marketing_category.sql`

## Final canonical category list

- `design`
- `development`
- `product`
- `finance`
- `operations`
- `marketing`

## Manual Supabase migration

Yes. Existing deployed databases need [20260417113000_add_marketing_category.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260417113000_add_marketing_category.sql) applied.

Fresh environments that run the full migration chain will also receive `marketing` because the historical seed and canonical-category migrations were updated.

## What changed

- The canonical category set now flows through the shared category data used by:
  - catalog filters
  - skill cards and badges
  - skill detail badges
  - profile contribution chips
  - upload and edit form dropdowns
  - empty/loading/no-results preview states backed by mock data

- The database seed now inserts the six canonical categories.
- The historical canonical-category migrations were updated so clean setups stay aligned with the app taxonomy.
- A new forward-only migration adds `marketing` to already-deployed Supabase databases.
- The app still normalizes legacy rows such as `engineering` and `customer-support` into the canonical frontend taxonomy.

## Manual tests to run

1. Apply the new Supabase migration in the target environment.
2. Open `/skills` and confirm category filter dropdowns include `Marketing`.
3. Open `/upload` and confirm the category selector includes `Marketing`.
4. Open `/skills/[id]/edit` and confirm the category selector includes `Marketing`.
5. Create or edit a skill to use `Marketing`, then verify:
   - the catalog card badge shows `Marketing`
   - the skill detail badge shows `Marketing`
   - profile/category chips show `Marketing`
6. Confirm search/filter URL behavior still works when `category=marketing`.

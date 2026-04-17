# Category taxonomy update

## Exact files changed

- `app/actions/skills.ts`
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

## Root cause of the rejection

- The frontend category selector was already using the canonical taxonomy and correctly showed `Marketing`.
- The create/upload and edit save flows both validate category values against the real `public.categories` rows before writing `skill_categories`.
- In environments where the new category migration had not been applied yet, `marketing` existed in the UI but not in `public.categories`, so the server returned the generic “Choose a valid category before saving.” response.
- This was primarily a backend validation plus database-data mismatch, not a frontend dropdown bug.

## Manual Supabase migration

Yes. Existing deployed databases still need [20260417113000_add_marketing_category.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260417113000_add_marketing_category.sql) applied.

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
- The server action now reports the real failure mode when a canonical category is missing from `public.categories`, including the exact migration file that must be applied.

## Manual tests to run

1. Apply the new Supabase migration in the target environment.
2. Open `/skills` and confirm category filter dropdowns include `Marketing`.
3. Open `/upload` and confirm the category selector includes `Marketing`.
4. Try creating a skill with `Marketing` before the migration in a stale environment and confirm the server now points to the exact required migration instead of only saying the category is invalid.
5. Open `/skills/[id]/edit` and confirm the category selector includes `Marketing`.
6. Create or edit a skill to use `Marketing`, then verify:
   - the catalog card badge shows `Marketing`
   - the skill detail badge shows `Marketing`
   - profile/category chips show `Marketing`
7. Confirm search/filter URL behavior still works when `category=marketing`.

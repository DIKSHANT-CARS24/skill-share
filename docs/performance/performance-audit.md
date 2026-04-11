# Performance Audit

## Exact Files Changed
- `app/(workspace)/skills/page.tsx`
- `app/globals.css`
- `components/app-shell/workspace-shell.tsx`
- `components/skills/skill-card.tsx`
- `components/ui/panel.tsx`
- `lib/auth.ts`
- `lib/data.ts`
- `docs/performance/performance-audit.md`

## Main Bottlenecks Found
- Request-time auth and org member resolution was duplicated because both the workspace layout and child pages called `requireActiveMember()`.
- The `/skills` page loaded catalog data once, then filtered and sorted it a second time in-process.
- The skill detail loader fetched the entire catalog dataset, versions, categories, members, and downloads just to render one skill.
- `listCategories()` performed a Supabase query even though it always returned the static canonical category set.
- The `/skills` page stacked a large glass panel on top of many glass skill cards, so repeated `backdrop-filter` work was happening in the heaviest grid surface.
- Shared shell background blobs and glass blur values were stronger than needed for the current visual result.

## Which Fixes Were Made
- Added request-scoped caching to `getOptionalMemberContext()`, `requireActiveMember()`, and `requireAdmin()` so repeated auth/member checks in the same render tree reuse the same result.
- Replaced the `/skills` page’s double filtering path so `listSkillsForCatalog()` now returns the already-filtered list plus `totalSkillCount`.
- Added a lightweight catalog index loader in `lib/data.ts` for `/skills` so the catalog page only pulls the fields it actually uses for cards and filters.
- Reworked `getSkillDetailBySlug()` to query only the target skill and its direct related records instead of loading the whole catalog.
- Removed the unnecessary categories table query from `listCategories()` because the page uses the canonical category set.
- Removed the large glass wrapper panel around the `/skills` listing and left the grid as the primary focus area.
- Added a `static-subtle` panel tone with no `backdrop-filter`, then moved skill cards to that lighter surface.
- Reduced global glass blur values and softened workspace-shell background blobs to cut paint/compositing cost without dropping the visual direction.

## Main Issue Classification
The main issue was both data fetching and frontend rendering.

- Data fetching: duplicated auth/member work, oversized catalog/detail queries, and redundant category lookup.
- Frontend rendering: repeated backdrop blur on the `/skills` grid plus an extra large blurred surface around the listing.

## Which Pages Improved Most
- `/skills`
  - fewer server-side queries and less repeated filtering work
  - lighter repeated card surfaces
  - no extra large glass container around the listing
- `/skills/[id]`
  - detail data path now loads only the requested skill instead of the full catalog
- `/skills/[id]/edit`
  - benefits from the targeted detail loader and the removed redundant categories query

## What You Should Manually Test Next
1. Open `/skills` and confirm first load feels faster and scrolling the grid feels lighter.
2. Use topbar search, category, uploader, and sort controls on `/skills` and confirm URL params still update correctly.
3. Open a skill detail page directly and confirm markdown, metadata, download action, and history all still render correctly.
4. Open the edit page for a skill and confirm the form still loads existing values correctly.
5. Verify an admin page still shows recent versions and moderation data correctly.
6. Compare locally and on Vercel using browser devtools:
   - initial document timing
   - server response time for `/skills`
   - render/composite activity while scrolling the catalog grid

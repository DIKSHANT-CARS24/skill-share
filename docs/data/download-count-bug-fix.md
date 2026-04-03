# Download Count Bug Fix

## Exact Files Changed

- `app/(workspace)/skills/[id]/page.tsx`
- `app/api/skills/[slug]/download/route.ts`
- `lib/data.ts`
- `lib/downloads.ts`
- `lib/downloads.test.ts`
- `docs/data/download-count-bug-fix.md`

## Root Cause

The inflated count came from download rows being created too eagerly.

- The download endpoint logged a `downloads` row during a `GET` request.
- The skill detail page exposed that endpoint through `next/link`, which made the route vulnerable to framework or browser prefetch traffic instead of only explicit user download clicks.
- Once those extra rows existed, both the catalog and detail page showed the inflated totals because they were counting rows from the same `downloads` table.

## Was It Row Creation, Counting Logic, Or Both?

Primarily row creation.

- The main bug was that non-download requests could create `downloads` rows.
- Counting logic was not the original source of the inflation, but it has now been unified so the catalog and detail page use the same shared count computation.

## How Download Counts Are Now Computed

- A shared helper builds a `skill_id -> count` map directly from real `downloads` rows.
- The catalog card count and skill detail count both read from that same shared aggregation.
- The download route now skips logging when the request carries prefetch headers.
- The detail page download control now uses a plain anchor instead of router navigation, which prevents Next.js route prefetch behavior from creating false download records.

## Manual Tests To Run

1. Upload a brand-new skill and confirm the catalog card and detail page both show `0 downloads`.
2. Open the new skill detail page and confirm the count still stays at `0` before clicking download.
3. Refresh the detail page a few times and confirm the count does not change.
4. Click `Download .md` once and confirm the file downloads and both pages show `1 download`.
5. Click `Download .md` again and confirm both pages show `2 downloads`.
6. Edit the skill metadata without downloading and confirm the count does not change.
7. Replace the markdown file during edit mode and confirm the count still does not change.
8. Compare the catalog card count and detail page count for the same skill and confirm they always match.

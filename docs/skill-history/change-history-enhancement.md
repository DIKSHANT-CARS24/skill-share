# Change history enhancement

## Exact files changed

- `app/actions/skills.ts`
- `components/skills/version-history.tsx`
- `docs/skill-history/change-history-enhancement.md`
- `lib/data.ts`
- `lib/skill-history.test.ts`
- `lib/skill-history.ts`
- `lib/types.ts`
- `supabase/migrations/20260403093000_create_skill_change_events.sql`

## How changes are detected

- The edit save flow now compares the previous and next values for title, category, and description.
- It also checks whether a markdown file was replaced and whether the version number changed.
- A save is treated as meaningful when at least one of those tracked fields changes.

## Which fields are tracked

- title
- category
- description
- markdown file replacement
- version

## How summaries are generated

- A shared helper builds one human-readable summary per save.
- When multiple fields change together, they are combined into one readable entry.
- Example: `Updated title to "New title", changed category to Operations, and updated description.`

## Whether any schema changes were needed

- Yes. A new `skill_change_events` table was added.
- `skill_versions` still stores real version rows and storage paths.
- `skill_change_events` stores one change-log entry per save so non-version edits can appear in the history UI.
- The migration also backfills existing `skill_versions.change_notes` into the new change-event table.

## How version number and change summary now work together

- Every history entry stores the version number that was live for that save.
- If the version changes, the entry shows the new version and also describes the rest of the fields that changed in the same save.
- If the version does not change, a new history entry still appears with the existing version number plus the field-level summary.

## Manual tests I should run

1. Edit only the description and confirm a new history entry appears with the same version number and a description-change summary.
2. Edit title and category together and confirm one history entry mentions both changes.
3. Replace the markdown file only and confirm the entry says the markdown file was replaced.
4. Change version and description together and confirm the new entry shows the new version plus both changes.
5. Create a brand-new skill and confirm the first history entry still shows the initial upload.
6. Apply the migration, open an older skill, and confirm its older version notes are still visible through the backfilled history entries.

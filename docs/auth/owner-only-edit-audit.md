# Owner-only edit audit

## Exact files changed

- `app/unauthorized.tsx`
- `app/(workspace)/skills/[id]/page.tsx`
- `app/(workspace)/skills/[id]/edit/page.tsx`
- `app/actions/skills.ts`
- `lib/auth.ts`
- `lib/auth-utils.ts`
- `lib/auth.test.ts`
- `docs/auth/owner-only-edit-audit.md`

## Whether admins can edit non-owned skills or not

- Admins can no longer edit non-owned skills.
- Editing is now strict owner-only: only the uploader of the skill can access the edit UI, submit the edit action, or submit the delete action from the edit screen.

## Where UI visibility checks happen

- `app/(workspace)/skills/[id]/page.tsx`
- The skill detail page now computes ownership using the shared `isSkillOwner` helper and only renders the `Edit skill` button when the current signed-in member is the uploader.

## Where server-side ownership enforcement happens

- `app/(workspace)/skills/[id]/edit/page.tsx`
  - Direct access to the edit route now calls `unauthorized()` unless the current member owns the skill.
- `app/actions/skills.ts`
  - `updateSkill` now allows edits only when `isSkillOwner(...)` returns true.
  - `deleteSkill` now allows deletion only when `isSkillOwner(...)` returns true.
- `lib/auth-utils.ts`
  - Added the shared `isSkillOwner` helper so UI and server enforcement use the same ownership rule.

## What was changed on the unauthorized screen copy

- `app/unauthorized.tsx` now says:
  - `Sign in with your Cars24 account.`

## Manual tests I should run

1. Sign in as the uploader of a skill and open `/skills/[slug]`.
   - Confirm the `Edit skill` button is visible.
2. Click `Edit skill` as the uploader.
   - Confirm `/skills/[slug]/edit` opens successfully.
3. Save an edit as the uploader.
   - Confirm the update succeeds.
4. Delete a skill as the uploader from the edit screen if deletion is expected in your workflow.
   - Confirm the delete succeeds.
5. Sign in as a different active member and open the same `/skills/[slug]`.
   - Confirm the `Edit skill` button is not shown.
6. Manually navigate to `/skills/[slug]/edit` as that non-owner.
   - Confirm access is blocked.
7. If you have an admin user, open a skill uploaded by someone else.
   - Confirm the `Edit skill` button is still hidden.
   - Confirm direct access to `/skills/[slug]/edit` is blocked.
8. Open `/unauthorized`.
   - Confirm the copy says `Sign in with your Cars24 account.`

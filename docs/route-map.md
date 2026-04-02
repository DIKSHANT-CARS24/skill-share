# Route map

## Planned route structure

### Public and auth-adjacent

- `/`
  - Temporary landing page and later an authenticated dashboard redirect
- `/login`
  - Sign-in entry point for Cars users
- `/auth/callback`
  - Supabase auth callback handler
- `/unauthorized`
  - Shown when a user signs in with a non-`@cars24.com` account

### Main marketplace

- `/skills`
  - Browse all skills with search, sorting, and filters
- `/skills/[skillSlug]`
  - Skill detail page with metadata, preview, version history, and download actions
- `/upload`
  - Upload a new markdown skill or a new version of an existing skill
- `/profile/[userId]`
  - Optional later page for uploader history and contributed skills

### Admin

- `/admin`
  - Moderation dashboard
- `/admin/skills`
  - Review flagged or recently uploaded skills
- `/admin/users`
  - Manage admin permissions later

## Initial implementation recommendation

Phase one can start with these routes only:

- `/`
- `/skills`
- `/skills/[skillSlug]`
- `/upload`

## Layout recommendation

- Root layout for global styles and providers
- Authenticated app shell once Supabase is connected
- Reusable list and detail page components in `components/`

## Future API touchpoints

If route handlers are added later, likely candidates are:

- `/api/skills`
- `/api/uploads/sign`
- `/api/admin/moderation`

These are not needed during the scaffold phase.

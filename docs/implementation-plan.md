# Implementation plan

## Phase 0: scaffold

- Create a Next.js App Router project with TypeScript and Tailwind CSS
- Add a clean folder structure for `app`, `components`, `docs`, `lib`, and `public`
- Replace the default starter page with a placeholder dashboard
- Add product and technical planning docs

## Phase 1: auth and data foundations

- Add Supabase project setup and environment variable plumbing
- Configure Supabase Auth for Google OAuth sign-in
- Restrict access to `@cars24.com` users
- Add a basic app shell and protected routes
- Create initial Postgres schema for users, categories, skills, and versions

## Phase 2: browse and detail experience

- Build `/skills` with:
  - search
  - sort
  - category filter
  - uploader filter
- Build `/skills/[skillSlug]` with:
  - markdown preview
  - metadata
  - version history
  - download action

## Phase 3: upload flow

- Create `/upload`
- Parse markdown files and optional frontmatter
- Save markdown files to Supabase Storage
- Create or update skill records in Postgres
- Add simple validation and friendly error states

## Phase 4: admin groundwork

- Add role-aware access checks
- Create placeholder admin pages
- Support moderation states such as active, hidden, and flagged
- Record audit-friendly metadata for future admin actions

## Phase 5: quality and deployment

- Add unit and integration tests
- Add empty, loading, and error states
- Prepare Vercel deployment settings
- Add observability and basic product analytics

## Recommended next coding prompt

```text
Set up Supabase auth scaffolding for @cars24.com users, define the initial Postgres schema for users, skills, categories, and skill versions, and add placeholder pages for /skills, /skills/[skillSlug], and /upload.
```

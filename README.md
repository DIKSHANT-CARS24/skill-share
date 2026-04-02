# skill-share

`skill-share` is an internal Next.js app for sharing markdown-based ChatGPT and Codex skills across Cars teams.

The app now uses:

- Supabase Auth for Google sign-in
- Supabase Postgres for skills, categories, versions, downloads, and org membership
- Supabase Storage for private markdown file uploads and downloads
- Server-side access control with role checks and row-level security

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Storage

## Prerequisites

- Node.js `20.x` or `22.x` LTS is recommended
- npm `10+`
- A Supabase project
- A Google OAuth client that is connected to Supabase Auth

## Local setup

1. Install dependencies.

```bash
npm install
```

2. Create `.env.local` from `.env.example`.

```bash
cp .env.example .env.local
```

3. Fill in these variables in `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

4. In Supabase, configure Google sign-in and URL settings.

- Site URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/auth/callback`
- Google provider: enabled with your Google client ID and secret

5. Run every SQL migration in `supabase/migrations` in timestamp order.

- [20260331090000_create_skill_share_schema.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260331090000_create_skill_share_schema.sql)
- [20260331091000_enable_rls_and_storage.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260331091000_enable_rls_and_storage.sql)
- [20260331092000_seed_categories.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260331092000_seed_categories.sql)
- [20260403090000_update_category_taxonomy.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260403090000_update_category_taxonomy.sql)
- [20260403103000_fix_edit_skill_rls.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260403103000_fix_edit_skill_rls.sql)
- [20260403113000_allow_decimal_versions.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260403113000_allow_decimal_versions.sql)

You can use the Supabase CLI with `supabase db push` or paste them into the SQL editor.

6. Start the local dev server.

```bash
npm run dev
```

7. Open [http://localhost:3000/login](http://localhost:3000/login) and sign in with a Google account whose primary email ends with `@cars24.com`.

8. After the first sign-in, promote an admin in the Supabase SQL editor if you need `/admin`.

```sql
update public.org_members
set role = 'admin'
where email = 'your.name@cars24.com';
```

9. Upload the first markdown skill from `/upload`.

The catalog intentionally starts empty. After the first upload, `/skills` and `/skills/[id]` will render real data.

## Available scripts

- `npm run dev` starts the local development server
- `npm run build` creates a production build
- `npm run lint` runs ESLint
- `npm run typecheck` runs TypeScript without emitting files
- `npm run start` runs the production server after a build

## Project structure

```text
app/        Next.js routes, layouts, and page entry points
components/ Reusable UI building blocks
docs/       Product, route, and implementation planning docs
lib/        Shared types, constants, and utility code
public/     Static assets
```

## Current status

- `/skills` loads real skills, categories, uploader info, search/filter state, and sorting from Supabase-backed data
- `/skills/[id]` loads real metadata, stored markdown, and version history
- `/upload` writes to the private `skills` bucket and creates matching database rows
- `/api/skills/[slug]/download` securely downloads the markdown file and logs a row in `downloads`
- `/admin` is protected by the member role in `org_members`

## Manual data setup still required

- Configure Google OAuth in both Google Cloud and Supabase
- Run the Supabase migrations
- Promote at least one admin user manually
- Upload the first real skill, since sample catalog seeding is no longer automatic

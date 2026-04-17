# Supabase Setup

This project now expects Supabase for:

- Auth
- Postgres
- Storage

The app is built to stay beginner-readable and secure:

- only `@cars24.com` emails may sign in
- access is checked from `org_members`, not from `raw_user_meta_data`
- protected pages use `supabase.auth.getClaims()` on the server
- the browser only receives the Supabase publishable key
- no service role key is required by the app

## 1. Create the project

1. Create a new Supabase project.
2. Copy the project URL.
3. Copy the project publishable key.

Put them in your local `.env.local` file using the same names shown in [.env.example](/Users/a61813/Desktop/skill-share/.env.example).

## 2. Configure Auth URLs in the dashboard

Open `Authentication -> URL Configuration` and set:

- Site URL:
  `http://localhost:3000`
- Redirect URLs:
  `http://localhost:3000/auth/callback`

If you deploy later, add your production URL and production callback URL too.

Example:

- `https://your-app.example.com`
- `https://your-app.example.com/auth/callback`

## 3. Configure Google OAuth in Google Cloud

Open the Google Cloud console and use the Google Auth Platform.

1. Create or choose a Google Cloud project.
2. Configure the consent screen.
3. Add the default scopes Supabase expects:
   `openid`, `userinfo.email`, and `userinfo.profile`.
4. Create an OAuth client ID with application type `Web application`.
5. Add these Authorized JavaScript origins:
   - `http://localhost:3000`
   - your production app origin, for example `https://your-app.example.com`
6. Add the Authorized redirect URI shown by Supabase on the Google provider page.
   It will look like:
   `https://<your-project-ref>.supabase.co/auth/v1/callback`
7. Save the Google Client ID and Google Client Secret.

If your Google app is in testing mode, add your own Google account as a test user.

## 4. Configure Google OAuth in Supabase

Open `Authentication -> Sign In / Providers -> Google`.

1. Enable the Google provider.
2. Paste the Google Client ID.
3. Paste the Google Client Secret.
4. Copy the Supabase redirect URI from this page and make sure the exact same URI is present in Google Cloud.

Then open `Authentication -> URL Configuration` and set:

- Site URL:
  `http://localhost:3000`
- Redirect URLs:
  `http://localhost:3000/auth/callback`

For production, also add your production app URL and production callback URL:

- `https://your-app.example.com`
- `https://your-app.example.com/auth/callback`

The app uses Google OAuth for sign-in and then enforces `@cars24.com` in the callback before access is granted.
## 5. Run the SQL migrations

Run every SQL file in `supabase/migrations` in timestamp order:

1. [20260331090000_create_skill_share_schema.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260331090000_create_skill_share_schema.sql)
2. [20260331091000_enable_rls_and_storage.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260331091000_enable_rls_and_storage.sql)
3. [20260331092000_seed_categories.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260331092000_seed_categories.sql)
4. [20260403090000_update_category_taxonomy.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260403090000_update_category_taxonomy.sql)
5. [20260403103000_fix_edit_skill_rls.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260403103000_fix_edit_skill_rls.sql)
6. [20260403113000_allow_decimal_versions.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260403113000_allow_decimal_versions.sql)
7. [20260417113000_add_marketing_category.sql](/Users/a61813/Desktop/workspace/skill-share/supabase/migrations/20260417113000_add_marketing_category.sql)

You can do this either:

- with the Supabase CLI and `supabase db push`
- or by pasting the files into the Supabase SQL Editor one by one

What these migrations do:

- create the app tables
- add helper SQL functions for access checks
- enable RLS on every exposed table
- create the private `skills` storage bucket
- add storage policies so only authenticated active org members can upload and download markdown files
- seed 6 categories

## 6. Sign in once to create the first member row

After the migrations are applied:

1. Start the app.
2. Open `/login`.
3. Click `Continue with Google`.
4. Complete sign-in with a Google account whose primary email ends with `@cars24.com`.

On the first valid sign-in, the app will:

- create your `org_members` row if it does not exist yet
- leave the catalog empty until a real markdown skill is uploaded

This keeps the first-run experience aligned with the real empty catalog onboarding state.

## 7. Promote the first admin

The first signed-in user is created with role `member`.

To make that user an admin, run this in the SQL Editor after their first sign-in:

```sql
update public.org_members
set role = 'admin'
where email = 'your.name@cars24.com';
```

After that, the `/admin` route will open for that user.

## 8. How access works

### Login

- The login page starts Google OAuth through Supabase Auth.

### Callback

- The callback exchanges the auth code for a session.
- It checks the authenticated Google email domain.
- If the email does not end with `@cars24.com`, the app signs the user out and redirects back to `/login` with a clear unauthorized message.
- It ensures the `org_members` row exists.

### Page protection

- Protected pages call `supabase.auth.getClaims()` on the server.
- The app does not use `getSession()` for protection logic.

### Data access

- Table reads and writes depend on RLS.
- A user must have an active `org_members` row.
- Admin-only routes require `role = 'admin'`.

## 9. Storage layout

Files are stored in the `skills` bucket under paths like:

```text
<user_id>/<skill-slug>/v1.md
```

That path shape is intentional:

- members can upload into their own folder
- admins can manage any folder
- all active org members can download from the bucket

## 10. Required environment variables

The app requires these variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

No service role key is required.

## 11. Quick smoke test

After setup, verify:

1. `/login` shows a Google sign-in button and no visible magic-link form.
2. A Google account with an email ending in `@cars24.com` reaches `/skills`.
3. A Google account without `@cars24.com` is signed out and sent back to `/login` with an error message.
4. A row exists in `public.org_members` for your user.
5. The `skills` bucket exists.
6. `/upload` creates a new skill and a new `skill_versions` row.
7. `/api/skills/[slug]/download` downloads the markdown file and writes a `downloads` row.
8. `/admin` is blocked for members and visible for admins.

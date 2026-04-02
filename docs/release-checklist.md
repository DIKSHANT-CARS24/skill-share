# Release Checklist

## Pre-deploy

1. Confirm Vercel project environment variables are set for every target environment:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
2. In Supabase Auth URL configuration, add the exact production origin and callback URL:
   - `https://<your-domain>`
   - `https://<your-domain>/auth/callback`
3. In Google Cloud OAuth, add the same production origin and keep the Supabase redirect URI in the allowed redirect list.
4. Apply the Supabase migrations in order if production has not been initialized yet:
   - [20260331090000_create_skill_share_schema.sql](/Users/a61813/Desktop/skill-share/supabase/migrations/20260331090000_create_skill_share_schema.sql)
   - [20260331091000_enable_rls_and_storage.sql](/Users/a61813/Desktop/skill-share/supabase/migrations/20260331091000_enable_rls_and_storage.sql)
   - [20260331092000_seed_categories.sql](/Users/a61813/Desktop/skill-share/supabase/migrations/20260331092000_seed_categories.sql)
5. Ensure at least one previously signed-in user has been promoted to `admin` in `public.org_members`.

## Validation

1. Run `npm run lint`.
2. Run `npm run typecheck`.
3. Run `npm test`.
4. Run `npm run build`.
5. Smoke test the deployed app with a real `@cars24.com` Google account:
   - Sign in from `/login`.
   - Confirm a first-time user gets an `org_members` row.
   - Confirm a non-`@cars24.com` account is rejected and signed out.
   - Confirm `/skills`, `/upload`, and `/profile` load for an active member.
   - Confirm `/admin` is blocked for members and opens for admins.
   - Upload a `.md` file and verify `skills`, `skill_categories`, and `skill_versions` rows are created.
   - Download that skill and verify the file is delivered and a `downloads` row is recorded.

## Post-deploy

1. Verify the Vercel deployment used the intended environment and branch.
2. Open the production login page and confirm Google OAuth returns to `/auth/callback` on the same domain.
3. Check Supabase for any auth, database, or storage errors from the first production sign-in and upload.
4. Upload a rollback-safe test skill if the catalog is empty so the first-run user journey is fully exercised.

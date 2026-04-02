# Unauthenticated Redirect Fix

## Exact files changed

- `app/auth/callback/route.ts`
- `app/login/page.tsx`
- `app/page.tsx`
- `app/unauthorized.tsx`
- `components/auth/login-form.tsx`
- `lib/auth.test.ts`
- `lib/auth-utils.ts`
- `lib/auth.ts`
- `lib/supabase/proxy.ts`

## Root cause

Anonymous users and signed-in-but-denied users were being collapsed into the same branch.

- The shared guard in `lib/auth.ts` called `unauthorized()` when there was no session.
- The root route in `app/page.tsx` always redirected to `/skills`, which forced anonymous users into protected routing immediately.
- The proxy only refreshed Supabase cookies and did not redirect anonymous requests away from protected routes.
- The callback flow signed unauthorized users back out and returned them to `/login`, which prevented a signed-in authorization failure from ever reaching the unauthorized screen.

## How anonymous vs unauthorized are now separated

- Anonymous user:
  - `lib/supabase/proxy.ts` treats `/login` and `/auth/callback` as public.
  - Any other route without a session is redirected to `/login`.
  - Requested protected paths are preserved with `?next=...`.
  - `lib/auth.ts` also redirects missing-session server guard calls to `/login` as a fallback.
- Signed-in but unauthorized user:
  - Shared guards now use `unauthorized()` only for authorization failures after a valid session exists.
  - This includes invalid email domain, missing `org_members`, inactive `org_members`, and admin-role denial.
  - The OAuth callback preserves the session and redirects those users to `/unauthorized` instead of signing them out.
- Signed-in and authorized user:
  - The proxy allows the request through.
  - Shared guards return the active member context.
  - `/login` redirects them to the safe `next` path or `/skills`.

## Which routes are public

- `/login`
- `/auth/callback`

## Which routes are protected

- `/`
- All workspace routes under `app/(workspace)`
- Protected route handlers that call `requireActiveMember()`, including the skill download route
- `/unauthorized` and `/forbidden` now require a session in the proxy, so anonymous users are redirected away from them

## What manual tests to run

1. Open `/` in a fresh private window and confirm it redirects to `/login`.
2. Open a protected route like `/skills` or `/skills/<slug>` in a fresh private window and confirm it redirects to `/login?next=...`.
3. From `/login`, sign in with an active authorized `@cars24.com` user and confirm you land on `/skills` or the originally requested protected route.
4. Sign in with a valid Google account whose email is not `@cars24.com` and confirm the callback ends on `/unauthorized` without showing `/login`.
5. Sign in with a `@cars24.com` account that has no usable `org_members` access and confirm you end on `/unauthorized`.
6. Mark an existing `org_members` row inactive, sign in again, and confirm you end on `/unauthorized`.
7. Sign in as a non-admin active member and open `/admin`; confirm you see the unauthorized screen.
8. While signed in and unauthorized, open `/login` and confirm it redirects back to `/unauthorized`.
9. While signed in and unauthorized, use the sign-out button on `/unauthorized` and confirm you return to `/login`.

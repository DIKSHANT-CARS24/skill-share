# Vercel Deployment Guide

## Deployment readiness

This repo is a standard Next.js app and does not require a custom `vercel.json` or Vercel-specific code path for deployment.

The app build depends on these runtime environment variables only:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

No service-role key is required by the app and no secrets should be hardcoded into the repository.

## Required environment variables

Set these in Vercel for every environment you plan to use:

| Variable | Development | Preview | Production | Notes |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Required | Required | Required | Supabase project URL, for example `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Required | Required | Required | Supabase publishable / anon key |

### Environment guidance

- Development:
  Use your local `.env.local` file for the same variables.
- Preview:
  Set the same variables in the Vercel Preview environment, or use a dedicated preview Supabase project if you want isolated data.
- Production:
  Set the production Supabase URL and publishable key in the Vercel Production environment.

## Important auth setup before deploy

Because login uses Google OAuth through Supabase, deployment also depends on dashboard configuration outside Vercel.

### Supabase Auth URL Configuration

In Supabase `Authentication -> URL Configuration`, add:

- Site URL:
  your deployed app origin
- Redirect URL:
  `https://<your-domain>/auth/callback`

For local development, keep:

- `http://localhost:3000`
- `http://localhost:3000/auth/callback`

### Google Cloud OAuth

In Google Cloud for the OAuth client used by Supabase:

- add every allowed app origin under Authorized JavaScript origins
- keep the Supabase OAuth callback URL in Authorized redirect URIs

### Preview deployment note

Preview deploys can be blocked by OAuth configuration if Google Cloud and Supabase are not configured for the preview origin.

That means:

- stable preview domains are easier to support than constantly changing deployment URLs
- if you use Google OAuth on previews, make sure the preview origin is explicitly allowed in both Supabase and Google Cloud

## GitHub-connected Vercel deployment steps

1. Push the repository to GitHub.
2. In Vercel, click `Add New... -> Project`.
3. Import the GitHub repository.
4. Let Vercel detect it as a Next.js project.
5. Set the root directory to the repo root if prompted.
6. Add the required environment variables for:
   - Development
   - Preview
   - Production
7. Deploy.
8. After the first deployment, configure your custom production domain if you use one.
9. Update Supabase Auth URL configuration and Google OAuth origins to match the final deployed domain.

## Vercel CLI deployment steps

1. Install the Vercel CLI if needed:

```bash
npm i -g vercel
```

2. From the repo root, log in:

```bash
vercel login
```

3. Link the local repo to a Vercel project:

```bash
vercel
```

4. Add environment variables:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

5. Deploy a preview build:

```bash
vercel
```

6. Deploy to production:

```bash
vercel --prod
```

7. Update Supabase and Google OAuth configuration to include the final production origin and callback URL.

## Post-deploy smoke tests

Run these checks against the deployed environment:

1. Open `/login`.
2. Sign in with a valid `@cars24.com` Google account.
3. Confirm you land in `/skills`.
4. Confirm a first-time valid user gets an `org_members` row.
5. Confirm a non-`@cars24.com` Google account is rejected and signed out.
6. Confirm `/skills`, `/upload`, and `/profile` load for an active member.
7. Confirm `/admin` is blocked for non-admin members and opens for admins.
8. Upload a `.md` file from `/upload`.
9. Open the uploaded skill detail page and verify markdown preview renders.
10. Download the skill and confirm the file is delivered.
11. Confirm the download created a row in `downloads`.
12. Check the empty and error states still render without runtime failures.

## Local verification commands

Before deploying, run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

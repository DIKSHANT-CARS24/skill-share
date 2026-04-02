# Theme Adoption Notes

## Goal

Adopt the Figma foundations page as the source of truth for typography and color without redesigning individual screens or touching backend, auth, Supabase, storage, or RLS behavior.

## Where the Theme Lives Now

- `app/globals.css`
  - owns the global Figma-derived color tokens
  - owns the typography scale tokens
  - exposes the Tailwind-facing aliases used across the app
- Shared primitives now consume those tokens directly:
  - `components/ui/button.tsx`
  - `components/ui/badge.tsx`
  - `components/ui/input-shell.tsx`
  - `components/ui/panel.tsx`
  - `components/ui/avatar.tsx`
  - `components/ui/section-heading.tsx`

## Adoption Strategy

1. Keep the existing semantic class names such as `bg-surface`, `text-muted`, and `border-border` so color adoption stays low-risk.
2. Retokenize those semantic aliases in `app/globals.css` so most components inherit the Figma palette automatically.
3. Replace hardcoded shared typography classes with Figma-derived size and line-height tokens, especially in buttons, badges, section headings, auth shells, stats, and dense metadata surfaces.
4. Keep structural layout, spacing, route behavior, data fetching, and backend contracts unchanged.

## What Changed

- Color system
  - Replaced the previous blue-gray palette with Figma-derived brand, surface, text, and border tokens.
  - Preserved semantic aliases like `accent`, `surface`, `foreground`, and `muted` so component churn stayed small.
  - Stored the Figma badge surfaces for future screen-level use.
- Typography system
  - Switched the global font stack to Inter-first.
  - Added tokenized font sizes for display, heading, title, body, label, and caption styles.
  - Updated shared and high-traffic UI surfaces to use those tokens instead of ad hoc `text-sm`, `text-lg`, and `tracking-tight` combinations.
- Shells and screens
  - Updated the login flow, workspace shell, catalog, admin, profile, preview, upload, empty/error states, and root dashboard to consume the new foundations.

## Intentional Non-Changes

- No backend logic changed.
- No Supabase auth flow changed.
- No storage, org membership, or RLS behavior changed.
- No route structure changed.
- No screen-specific redesign was attempted beyond typography/color adoption.

## Follow-Up Opportunities

- Introduce explicit badge variants for `feature`, `sky`, and `drive` so the stored badge surface tokens can be used intentionally.
- If the Figma file later exposes feedback text and border values directly on the foundations page, replace the current inferred semantic feedback text colors.
- If the app later adopts the spacing/radius foundations, move recurring radius values like `24px` and `28px` into reusable tokens too.

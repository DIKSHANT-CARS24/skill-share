# Badge Adoption Notes

## Decision

The badge was updated directly in the existing shared component at `components/ui/badge.tsx`.

That was the safest approach because:

- the app already uses the shared badge widely
- a direct update propagates the Figma visual language consistently
- the app only needed a small compatibility layer for tone naming
- there was one custom tag/chip path, which could be folded into the shared component cleanly

## What Changed

### Shared badge API

- Added Figma semantic tones:
  - `neutral`
  - `information`
  - `success`
  - `warning`
  - `error`
- Added Figma appearances:
  - `subtle`
  - `solid`
  - `stroke`
- Added Figma sizes:
  - `xs`
  - `md`
- Kept compatibility aliases:
  - `accent` -> `information`
  - `danger` -> `error`

### Theme support

- Added reusable badge tokens to `app/globals.css` for:
  - neutral subtle/solid/stroke values
  - information subtle/solid/stroke values
  - success text and solid values
  - warning text and solid values
  - error text and solid values

### Usage cleanup

- Major informational badges were switched to `tone="information"` explicitly.
- Error-status badge usage was switched to `tone="error"` explicitly.
- Skill-card tag pills were moved to the shared `Badge` component using `size="xs"`.

## Screens Using the Updated Badge

The updated badge style now appears across the app, including:

- login
- workspace shell
- skills catalog
- skill detail
- profile
- admin
- design preview
- upload
- version history
- moderation queue

## Intentional Non-Changes

- No backend logic changed.
- No auth or Supabase flow changed.
- No `org_members`, storage, or RLS behavior changed.
- No unrelated non-badge components were redesigned.

## Known Gaps

- The inspected Figma badge component page did not expose icon variants, so icon-specific badge behavior was not added.
- The inspected page also did not expose hover, pressed, or disabled states for badges, so the implementation is limited to the published tone/appearance/size matrix.
- Most current product usages intentionally stay on the default `subtle` appearance because that is the closest match to the app’s existing badge semantics; `solid` and `stroke` are now available for future use through the shared API.

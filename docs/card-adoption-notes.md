# Card Adoption Notes

## Decision

The card was updated directly in the shared surface layer.

That included:

- expanding `components/ui/panel.tsx` to support Figma-aligned `tone` and `padding`
- exporting `getPanelClassName()` for semantic wrappers that should keep their native HTML tags

This was safer than creating a parallel wrapper component because the app already centralizes most major card surfaces through `Panel` or near-identical card container classes.

## What Changed

### Shared surface layer

- Added card shadow token in `app/globals.css`
- Added `Panel` variants:
  - `default`
  - `subtle`
  - `brand-subtle`
- Added `Panel` padding presets:
  - `none`
  - `md`
  - `lg`
- Added `getPanelClassName()` for semantic wrappers such as:
  - `aside`
  - `header`
  - `article`
  - `form`

### Major surface adoption

The shared card surface is now used by:

- workspace shell side rail and header
- filter toolbar container
- dashboard shell major cards and stat cards
- skill cards
- upload panels
- version history
- profile overview panels
- forbidden and unauthorized pages
- design preview cards
- major skills, profile, admin, and detail side panels
- loading-state placeholder panels

## Variants Now Supported

### Surface tones

- `default`
- `subtle`
- `brand-subtle`

### Padding presets

- `none`
- `md`
- `lg`

## Intentional Non-Changes

- No backend logic changed.
- No auth or Supabase flow changed.
- No `org_members`, storage, or RLS behavior changed.
- No non-card interaction behavior changed.

## Known Gaps

- The inspected Figma Cards page did not define hover, selected, or disabled card states, so none were invented in code.
- The inspected `Card Surface` component demonstrates a representative content structure, but the app still composes card internals case-by-case based on product needs rather than enforcing a rigid header/body/footer API.
- Some smaller nested sub-cards inside larger layouts still use local utility classes when they represent secondary internal surfaces rather than top-level card shells.

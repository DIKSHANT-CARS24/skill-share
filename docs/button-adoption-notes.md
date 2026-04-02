# Button Adoption Notes

## Decision

The button was updated directly in the shared app component at `components/ui/button.tsx`.

This was the safest option because:

- the app already routes major actions through the shared `Button`
- changing the shared component propagates the Figma style consistently
- only a few call sites needed explicit cleanup to use the real `tertiary` name or the `large` size
- no wrapper layer was necessary to preserve functionality

## What Changed

### Shared component

- Added Figma-aligned variants:
  - `primary`
  - `secondary`
  - `tertiary`
- Added Figma-aligned sizes:
  - `large`
  - `medium`
  - `small`
  - `xsmall`
- Preserved `asChild`
- Preserved backward compatibility with a `ghost` alias that renders like `tertiary`
- Updated disabled styling to match the shared disabled appearance visible in Figma

### Screen adoption

- Login CTA now uses `size="large"` to match the prominent Figma button proportion.
- Existing `ghost` usages were updated to `tertiary` in the main interactive flows that expose the button visually:
  - filter reset
  - upload form clear action
  - moderation reject action

## Screens Using the Updated Button

The updated shared component is now used across the app wherever `Button` is consumed, including:

- login
- unauthorized
- forbidden
- workspace header
- catalog page actions
- skill detail page actions
- filter toolbar
- upload flow
- moderation queue
- empty and error states

## Intentional Non-Changes

- No backend logic changed.
- No auth or Supabase flow changed.
- No `org_members`, storage, or RLS behavior changed.
- No unrelated components were redesigned.

## Limitations and Known Gaps

- The inspected Figma Buttons page only defined `default` and `disabled`; no explicit `hover` or `pressed` state specimens were available there to map.
- The inspected Figma buttons were text-only; no icon-bearing button variants were defined on that page.
- The compatibility alias `ghost` still exists for safety, but `tertiary` is the source-of-truth variant name going forward.

# Skill Share Design System

## Color usage
- `background`: cool, low-contrast workspace canvas for the overall app shell.
- `surface-strong`: primary cards, page containers, and elevated panels.
- `surface` and `surface-muted`: secondary cards, filter bars, and metadata trays.
- `accent`: primary action color and active navigation state.
- `success`, `warning`, `danger`: status badges and moderation messaging only.
- Avoid mixing status colors into general layout chrome; keep them reserved for meaning.

## Spacing
- Page shell uses generous outer gutters with compact internal card padding.
- Core spacing rhythm:
  - 4px for micro gaps inside badges and dense metadata
  - 8px to 12px for control spacing
  - 16px to 20px for card internals
  - 24px to 32px for section separation
- Keep laptop layouts dense but never reduce touch targets below comfortable tap size on mobile.

## Typography
- Primary stack: `Aptos`, `Inter`, `Segoe UI Variable`, `Segoe UI`, `Arial`, `sans-serif`.
- Use strong weight and tight tracking for page titles and key card headings.
- Body text stays at 14px to 16px with generous line-height for readability.
- Metadata labels use uppercase micro-copy sparingly to reinforce hierarchy.

## Card patterns
- Large surface cards use rounded corners and soft elevation with thin borders.
- Dense rows use nested muted surfaces inside larger panels to improve scanability.
- Cards should group one primary action or insight, not multiple competing messages.
- Right-rail cards stay concise and support the main content rather than replacing it.

## Badges
- Badge tones:
  - Accent for category, active, and review-ready states
  - Success for approved or healthy states
  - Warning for in-review or cautionary states
  - Danger for blocked or needs-changes states
  - Neutral for supporting metadata such as version or non-critical tags
- Badge text should stay short and scannable.

## Forms
- Inputs and selectors share the same bordered surface container.
- Labels use small uppercase styling for fast recognition.
- Upload and auth flows should show trust-building guidance near the action area.
- Primary actions stay visually distinct, with secondary actions available but quieter.

## Tables and lists
- Admin and profile lists use card-like rows instead of dense data grids in this first pass.
- Keep one clear headline per row, followed by reason/context and then actions.
- Align timestamps and status markers consistently so moderation queues scan quickly.
- Prefer compact metadata blocks over wide tables on smaller screens.

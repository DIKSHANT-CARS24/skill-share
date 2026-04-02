# Button Mapping

## Source

- Figma file: `Turbo-UI-Minimal-DLS`
- File key: `ZSUXGVeiT6EpNTQRLinHge`
- Buttons page node: `2:3`
- Button component set node: `10:53`
- Representative component variants inspected:
  - `10:5` primary / large / default
  - `10:21` secondary / large / default
  - `10:37` tertiary / large / default
  - `10:9` primary / medium / default
  - `10:13` primary / small / default
  - `10:17` primary / xsmall / default
  - `10:7` primary / large / disabled
  - `10:23` secondary / large / disabled
  - `10:39` tertiary / large / disabled

## Figma Component Contract

### Variants

| Figma variant | Visual treatment | App variant |
| --- | --- | --- |
| `primary` | Solid brand fill, white text | `primary` |
| `secondary` | Brand border, brand-secondary fill, brand text | `secondary` |
| `tertiary` | Primary neutral border, default-strong surface, primary text | `tertiary` |

### Sizes

| Figma size | Height | Radius | Padding | Text style | App size |
| --- | --- | --- | --- | --- | --- |
| `large` | 56px | 14px | 16px horizontal, 14px vertical | Inter 600 / 17px / 1.3 | `large` |
| `medium` | 48px | 12px | 14px horizontal, 10px vertical | Inter 600 / 15px / 1.3 | `medium` |
| `small` | 40px | 8px | 12px horizontal, 8px vertical | Inter 600 / 12px / 1.3 | `small` |
| `xsmall` | 36px | 8px | 12px horizontal, 6px vertical | Inter 600 / 12px / 1.3 | `xsmall` |

### States

| State | Figma definition | App mapping |
| --- | --- | --- |
| `default` | Variant-specific styling | Matches per variant |
| `disabled` | Shared disabled styling across all variants | `disabled:*` classes override every variant to neutral surface, secondary border, and muted text |

### Disabled State Details

- Background: `Surface / Default / Strong` `#F1F5F9`
- Border: `Border / Secondary` `#CAD5E2`
- Text: visually uses `Border / Primary` `#90A1B9`
- Cursor remains non-interactive in the app

## Visual Tokens Used

| Figma token | Value | App token |
| --- | --- | --- |
| Surface / Brand / Primary | `#4736FE` | `--accent` |
| Surface / Brand / Secondary | `#E3E1FF` | `--accent-soft` |
| Surface / Default / Strong | `#F1F5F9` | `--surface` |
| Border / Brand / Primary | `#4736FE` | `--border-brand-primary`, `--accent` |
| Border / Primary | `#90A1B9` | `--border-strong` |
| Border / Secondary | `#CAD5E2` | `--border` |
| Text / Primary | `#0F172B` | `--foreground` |
| Text / Brand / Primary | `#4736FE` | `--accent` |
| Text / Inverse | `#FFFFFF` | `--text-inverse` |

## Text, Icon, and Spacing Notes

- Text style is semibold Inter in every inspected size.
- The component page shows text-only buttons; no icon-bearing button variants were defined on that page.
- The app button keeps `inline-flex` with a small `gap` so icons can still be passed as children later without needing another API change.
- No special pressed or hover states were defined on the inspected Figma Buttons page, so the implementation follows the published default and disabled visuals instead of inventing alternate color states.

## App API Mapping

| App prop | Supported values |
| --- | --- |
| `variant` | `primary`, `secondary`, `tertiary`, `ghost` |
| `size` | `large`, `medium`, `small`, `xsmall` |
| `asChild` | preserved |

### Compatibility alias

- `ghost` is kept as a compatibility alias and maps to the same visual treatment as Figma `tertiary`.
- New or updated call sites should prefer `tertiary`.

## Files Updated for This Mapping

- `components/ui/button.tsx`
- `components/auth/login-form.tsx`
- `components/upload/upload-form.tsx`
- `components/skills/filter-toolbar.tsx`
- `components/admin/review-queue.tsx`
- `docs/button-mapping.md`
- `docs/button-adoption-notes.md`

## Storybook / DLS Check

- No local Storybook button implementation was found in this repo during inspection.
- The implementation decision was therefore based on:
  - the current shared app button in `components/ui/button.tsx`
  - the connected Figma component set on the Buttons page

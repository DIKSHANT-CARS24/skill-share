# Badge Mapping

## Source

- Figma file: `Turbo-UI-Minimal-DLS`
- File key: `ZSUXGVeiT6EpNTQRLinHge`
- Badges page node: `2:5`
- Badge component set node: `12:65`
- Representative nodes inspected:
  - neutral: `12:5`, `12:7`, `12:9`, `12:13`
  - information: `12:17`, `12:21`, `12:25`
  - success: `12:29`, `12:33`, `12:37`
  - warning: `12:41`, `12:45`, `12:49`
  - error: `12:53`, `12:57`, `12:61`

## Figma Component Contract

### Tones

| Figma tone | Meaning in app | App tone |
| --- | --- | --- |
| `neutral` | metadata, version labels, non-critical supporting labels | `neutral` |
| `information` | category, informational labels, feature context | `information` |
| `success` | healthy, approved, published states | `success` |
| `warning` | caution, in-review, attention-needed states | `warning` |
| `error` | blocked, rejected, needs-changes states | `error` |

### Appearances

| Figma appearance | Visual treatment | App appearance |
| --- | --- | --- |
| `subtle` | filled chip with no visible stroke | `subtle` |
| `solid` | strong filled chip with inverse text | `solid` |
| `stroke` | bordered chip with light surface fill | `stroke` |

### Sizes

| Figma size | Radius | Padding | Text style | App size |
| --- | --- | --- | --- | --- |
| `xs` | 12px | 8px horizontal, 6px vertical | Inter 600 / 11px / 1.3 | `xs` |
| `md` | 14px | 12px horizontal, 8px vertical | Inter 600 / 13px / 1.3 | `md` |

## Figma Color Values Used

### Neutral

| Appearance | Background | Border | Text |
| --- | --- | --- | --- |
| subtle | `#F8FAFC` | none | `#475569` |
| solid | `#0F172B` | none | `#FFFFFF` |
| stroke | `#F1F5F9` | `#CAD5E2` | `#0F172B` |

### Information

| Appearance | Background | Border | Text |
| --- | --- | --- | --- |
| subtle | `#F6F5FF` | none | `#4736FE` |
| solid | `#4736FE` | none | `#FFFFFF` |
| stroke | `#F6F5FF` | `#C6C1FF` | `#4736FE` |

### Success

| Appearance | Background | Border | Text |
| --- | --- | --- | --- |
| subtle | `#EFFFF7` | none | `#368C61` |
| solid | `#00A63E` | none | `#FFFFFF` |
| stroke | `#EFFFF7` | `#368C61` | `#368C61` |

### Warning

| Appearance | Background | Border | Text |
| --- | --- | --- | --- |
| subtle | `#FFFBEB` | none | `#E17100` |
| solid | `#FD9A00` | none | `#FFFFFF` |
| stroke | `#FFFBEB` | `#E17100` | `#E17100` |

### Error

| Appearance | Background | Border | Text |
| --- | --- | --- | --- |
| subtle | `#FEF2F2` | none | `#C10007` |
| solid | `#C10007` | none | `#FFFFFF` |
| stroke | `#FEF2F2` | `#C10007` | `#C10007` |

## App API Mapping

### Public props

| Prop | Supported values |
| --- | --- |
| `tone` | `neutral`, `information`, `success`, `warning`, `error`, plus compatibility aliases `accent` and `danger` |
| `appearance` | `subtle`, `solid`, `stroke` |
| `size` | `xs`, `md` |

### Compatibility aliases

- `accent` resolves to Figma `information`
- `danger` resolves to Figma `error`

These aliases are kept so the app could adopt the Figma semantics without breaking existing callers.

## Implementation Notes

- The component remains text-first and inline-flex.
- No icon-bearing badge variants were visible on the inspected Figma page.
- A small `gap` is still preserved in the shared component so icons can be added later without changing the badge API.
- The Figma page did not expose disabled, hover, or pressed badge states; only tone, appearance, and size were implemented from the published component set.

## Current Usage Alignment

- Default app usage now maps to `size="md"` and `appearance="subtle"`, which most closely matches the existing chip usage patterns in the product.
- The custom tag pills in `components/skills/skill-card.tsx` were migrated onto the shared badge component using `size="xs"` so badge/tag/chip visuals now come from one source.

## Storybook / DLS Check

- No local Storybook badge implementation was found in this repo.
- The source of truth for this task was the connected Figma badge component set plus the existing shared app badge implementation.

# Card Mapping

## Source

- Figma file: `Turbo-UI-Minimal-DLS`
- File key: `ZSUXGVeiT6EpNTQRLinHge`
- Cards page node: `2:6`
- Main component set: `Card Surface` (`13:47`)
- Representative variants inspected:
  - `13:5` tone `default`, padding `md`
  - `13:12` tone `default`, padding `lg`
  - `13:19` tone `subtle`, padding `md`
  - `13:33` tone `brand-subtle`, padding `md`

## Figma Component Contract

### Variants

| Figma tone | Background | Border | Radius | App tone |
| --- | --- | --- | --- | --- |
| `default` | white | `#CAD5E2` | 16px | `default` |
| `subtle` | `#F1F5F9` | `#CAD5E2` | 16px | `subtle` |
| `brand-subtle` | `#F6F5FF` | `#CAD5E2` | 20px | `brand-subtle` |

### Padding presets

| Figma padding | Value | App padding |
| --- | --- | --- |
| `md` | 16px | `md` |
| `lg` | 24px | `lg` |

### Border and shadow

| Property | Figma value | App mapping |
| --- | --- | --- |
| Border width | 1px | `border` |
| Border color | `#CAD5E2` | `border-border` |
| Shadow | `0 8px 24px rgba(0, 0, 0, 0.08)` | `--card-shadow` |

### Internal spacing and content structure

The inspected Figma card specimens follow a consistent internal stack:

1. Eyebrow/meta label
2. Title
3. Body copy
4. Footer row with left/right content

Shared content spacing between those blocks is `16px`.

### Text styles visible in the specimen

| Role | Style |
| --- | --- |
| Eyebrow/meta | Inter 600 / 11px / muted text |
| Title | Inter 600 / 20px / primary text |
| Body | Inter 400 / 15px / secondary text |
| Footer meta | Inter 400 / 13px / secondary text |
| Footer action | Inter 600 / 13px / brand text |

## States

- No hover state was shown on the inspected Cards page.
- No selected state was shown on the inspected Cards page.
- No pressed or disabled state was shown on the inspected Cards page.

The implementation therefore maps the published surface treatments only and avoids inventing new card-state styling.

## App Reusable Surface API

### `Panel`

The shared app card surface now supports:

| Prop | Supported values |
| --- | --- |
| `tone` | `default`, `subtle`, `brand-subtle` |
| `padding` | `none`, `md`, `lg` |

### `getPanelClassName`

For semantic wrappers that should stay `aside`, `article`, `header`, or `form`, the same card treatment is available through:

- `getPanelClassName({ tone, padding, className })`

This keeps the Figma card surface reusable without forcing non-section elements into the `Panel` component.

## Current Token Mapping

| Figma token/value | App token or alias |
| --- | --- |
| white default surface | `--surface-strong` |
| `#F1F5F9` | `--surface`, `Surface / Default / Strong` |
| `#F6F5FF` | `--surface-brand-subtle`, `Surface / Brand / Subtle` |
| `#CAD5E2` | `--border`, `Border / Secondary` |
| `0 8px 24px rgba(0,0,0,0.08)` | `--card-shadow` |

## Storybook / DLS Check

- No local Storybook card/panel implementation was found in this repo.
- The source of truth for this task was the connected Figma `Card Surface` component set plus the existing shared `Panel`/container usage in the app.

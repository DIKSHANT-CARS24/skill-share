# Figma Parity: List Row

This file records the current parity status between the List Row implementation spec in [dls-spec-list-row.md](/Users/a61813/Desktop/workspace/skill-share/docs/dls-spec-list-row.md) and the Figma library component updated in:

- [Turbo UI Minimal DLS](https://www.figma.com/design/ZSUXGVeiT6EpNTQRLinHge)
- Page: `List Rows`
- Component set: `List Row`

## Variant Coverage

The Figma component set currently includes these visual variants:

- `Theme=light, Density=large, Media=image`
- `Theme=light, Density=large, Media=none`
- `Theme=light, Density=small, Media=image`
- `Theme=light, Density=small, Media=none`
- `Theme=dark, Density=large, Media=image`
- `Theme=dark, Density=large, Media=none`
- `Theme=dark, Density=small, Media=image`
- `Theme=dark, Density=small, Media=none`

## Expected vs Actual

## Root container

| Spec value | Actual Figma value | Status |
| --- | --- | --- |
| Horizontal auto layout | Horizontal auto layout | Match |
| Padding `0 / 16 / 0 / 0` | `0 / 16 / 0 / 0` | Match |
| Root gap `12` | `12` | Match |
| Large fixed height `84` | `84` | Match |
| Small fixed height `66` | `66` | Match |
| Large radius `16` | `16` | Match |
| Small radius `8` | `8` | Match |
| Clip content on root | Enabled | Match |
| Light fill `#FFFFFF` | `#FFFFFF` | Match |
| Dark fill `rgba(255,255,255,0.1)` | white fill at `0.1` opacity | Match |
| Ring `1px black/10` | `1px` inside stroke with black `10%` opacity | Match |
| Shadow `0 1 2 0 rgba(0,0,0,0.05)` | drop shadow `x=0 y=1 blur=2 opacity=0.05` | Match |

## Media slot

| Spec value | Actual Figma value | Status |
| --- | --- | --- |
| Media slot always exists | Slot exists in all `Media=image` and `Media=none` variants | Match |
| Large media size `84 x 84` | `84 x 84` | Match |
| Small media size `88 x 66` | `88 x 66` | Match |
| Left-only radius `16 / 0 / 0 / 16` on media wrapper | `16 / 0 / 0 / 16` | Match |
| Empty state keeps slot and shows placeholder | `Media=none` variants use a white placeholder inside the same slot | Match |
| Empty placeholder background `#FFFFFF` | `#FFFFFF` | Match |
| Empty placeholder stroke `#FD67CA`, dashed | `#FD67CA`, dashed | Match |

Implementation note:

- Figma uses dash pattern `[4,4]` for the placeholder stroke because the source only specifies `border-dashed`, not exact dash lengths.

## Body frame

| Spec value | Actual Figma value | Status |
| --- | --- | --- |
| Horizontal body frame | Horizontal auto layout | Match |
| Body gap `8` | `8` | Match |
| Body fills remaining width | `FILL` horizontal sizing | Match |
| Large body width at 520 sample width | `408` | Match |
| Small body width at 520 sample width | `404` | Match |

## Content stack

| Spec value | Actual Figma value | Status |
| --- | --- | --- |
| Vertical content stack | Vertical auto layout | Match |
| Large content gap `4` | `4` | Match |
| Small content gap `2` | `2` | Match |
| Content fills body width | `FILL` horizontal sizing | Match |
| Large content width at 520 sample width | `368` | Match |
| Small content width at 520 sample width | `364` | Match |

## Trailing action

| Spec value | Actual Figma value | Status |
| --- | --- | --- |
| Separate trailing action frame | Present as `Trailing Action` frame | Match |
| Transparent shell | No fill, no stroke | Match |
| Fixed `32 x 32` shell | `32 x 32` | Match |
| Positioned at far right of body | Yes, after fill content frame | Match |

Implementation note:

- The production source does not specify an explicit chevron glyph size, only the shell behavior. Figma currently uses a `Geist SemiBold` text chevron at `18px` inside the correct `32px` action shell.

## Typography

| Spec value | Actual Figma value | Status |
| --- | --- | --- |
| Title family uses Cars24 Geist stack | `Geist SemiBold` | Match |
| Title size `15` | `15` | Match |
| Supporting text family uses Cars24 Geist stack | `Geist Regular` | Match |
| Supporting text size `13` | `13` | Match |
| Badge text family uses Cars24 Geist stack | `Geist Medium` | Match |
| Badge text size `13` | `13` | Match |

Implementation note:

- Figma exposes the title weight as `SemiBold` without a space, while the source token naming resolves to semibold weight `600`. This is equivalent in practice.

## Badge

| Spec value | Actual Figma value | Status |
| --- | --- | --- |
| Fixed badge height `24` | `24` | Match |
| Horizontal padding `6` | `6` left and right | Match |
| Internal gap `2` | `2` | Match |
| Radius `12` | `12` | Match |
| Fill `#EFFFF7` | `#EFFFF7` | Match |
| Stroke `#368C61` | `#368C61` | Match |
| Text color `#2A6B4A` | `#2A6B4A` | Match |

## Remaining Mismatch

The structural and measured layout values now match the documented implementation spec for the screen-ready row shell. The remaining gaps are modeling gaps, not spacing drift:

- The production `showBorder` flag is not currently exposed as a Figma variant axis. The component models the default root ring and surface correctly, but not the extra `border-slate-200` add-on state as a separate reusable toggle.
- Optional visibility states for badge, supporting text, and trailing action are not yet exposed as boolean component properties. Designers can still hide those layers manually in an instance, but the toggles are not formalized.
- The placeholder dash pattern is explicit in Figma (`[4,4]`) because the source only says `border-dashed`.
- The chevron glyph size is represented in Figma for visual usability, but the source implementation does not define a fixed icon glyph size; it only defines the action shell and color behavior.

## Reuse Readiness

The component is ready for reuse in screen designs for the primary List Row shell:

- Root spacing and fixed heights match the implementation spec
- The media slot behavior now matches production, including placeholder-on-empty
- The body frame and content stack now follow the documented auto-layout structure
- Light and dark visual themes are available
- Large and small densities are available

Manual follow-up is only needed if you want the Figma family to expose every optional implementation state as formal component properties, especially `showBorder`, badge visibility, supporting-text visibility, or trailing-action visibility.


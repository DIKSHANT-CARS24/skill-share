# List Row Implementation Spec

This document captures the exact production implementation spec for the `List` / `Row` component family in `turbo-ui-master`, limited to the reusable list row itself. It is intended to be the source document for recreating the component accurately later in Figma, without pulling in Storybook-only assumptions.

## Scope

- Component family: `List` row item only
- Source package: `turbo-ui-master/packages/components/list`
- Visual source of truth: production source first, Storybook second
- Explicitly out of scope: widget header, CTA button, overall section shell, non-row demo arrangements

## Primary Source Of Truth

### Production source

- `turbo-ui-master/packages/components/list/src/index.tsx`
- `turbo-ui-master/packages/components/list/src/styles.ts`
- `turbo-ui-master/packages/components/list/src/types.ts`

### Supporting primitives and tokens

- `turbo-ui-master/packages/components/badge/src/styles.ts`
- `turbo-ui-master/packages/components/icon-button/src/index.tsx`
- `turbo-ui-master/packages/theme/src/design-tokens.ts`
- `turbo-ui-master/packages/theme/src/font-tokens.ts`
- `turbo-ui-master/packages/theme/src/color-tokens.ts`
- `turbo-ui-master/packages/theme/src/tailwind-config.ts`
- `turbo-ui-master/packages/theme/src/icons.ts`
- `turbo-ui-master/packages/theme/src/icons-generated.css`

### Storybook source

- `turbo-ui-master/packages/components/list/src/list.stories.tsx`

## What Storybook Actually Demonstrates

Storybook exposes the family as `Components/List` and demonstrates two real row presentations:

- `LargeCards`: light and dark rows with `aspectRatioValue: "1/1"` and three columns in the story wrapper
- `SmallCards`: light and dark rows with `aspectRatioValue: "4/3"`

Source:

- `list.stories.tsx:40-75` defines the story meta and default args.
- `list.stories.tsx:79-121` shows the large row story.
- `list.stories.tsx:123-161` shows the small row story.

Important production constraint:

- The row size is not independently selected in normal use.
- In production code, `aspectRatioValue === "4/3"` forces `size = "small"`, otherwise the row is `size = "large"`.
- This comes from `index.tsx:242-247`.

That means the public production pairings are:

- `large` row + `1/1` media
- `small` row + `4/3` media

## Component Anatomy

The production row structure is:

1. Row container
2. Media/thumbnail wrapper
3. Media content or empty placeholder
4. Content/action wrapper
5. Content column
6. Optional badge
7. Title
8. Optional supporting text
9. Optional trailing icon button

Source:

- `index.tsx:107-207`

### Anatomy breakdown

| Part | Production implementation | Exact source |
| --- | --- | --- |
| Container | `<a>` only when `item.redirection.action === "DEEP_LINK"`, otherwise `<div>` | `index.tsx:75-85` |
| Click behavior | Always gets `role="button"` and `onClick={handleRowClick}`; `cursor-pointer` only added for deep links | `index.tsx:107-125` |
| Media wrapper | Always rendered as left-most child with `overflow-hidden rounded-l-160 shrink-0 h-full` | `index.tsx:126` |
| Media content | If `item.media.url` exists, render image in aspect-ratio box | `index.tsx:127-135` |
| Empty media state | If no image URL, still render placeholder box with dashed border | `index.tsx:136-143` |
| Main content/action wrapper | Horizontal flex row, `flex items-center gap-80 space-between flex-1` | `index.tsx:146` |
| Content column | Vertical flex column, `contentColClass({ size })` | `index.tsx:147`, `styles.ts:77-85` |
| Badge area | Rendered only when `item.tag.text` exists | `index.tsx:148-155` |
| Title | Always rendered from `item.title`; default tag is `h3` unless overridden | `index.tsx:61-63`, `index.tsx:156-164` |
| Supporting text | Rendered only when `item.description.text` exists | `index.tsx:165-183` |
| Trailing action | Rendered only when `item.icon` exists and is a valid icon name | `index.tsx:186-205`, `icons.ts:2824-2826` |

### Important data-model notes

- The row uses `description`, not `subTitle`, for supporting text.
- `subTitle` exists in the type but is not rendered in the row implementation.

Source:

- `types.ts:19-31`
- `index.tsx:165-183`

## Exact Sizing Rules

## Overall row size

`rowClass` defines fixed heights:

- `large`: `h-840 md:h-30`
- `small`: `h-660 md:h-30`

Source:

- `styles.ts:27-46`

Token and value resolution:

- `h-840` -> 84px from `design-tokens.ts:147`
- `h-660` -> 66px from `design-tokens.ts:140`
- `md:h-30` uses default Tailwind spacing scale, not a custom token, so `h-30` = `7.5rem` = 120px

Practical row heights:

| Variant | Default/mobile height | `md` and up height | Source |
| --- | --- | --- | --- |
| `large` | 84px | 120px | `styles.ts:36`, `design-tokens.ts:147` |
| `small` | 66px | 120px | `styles.ts:37`, `design-tokens.ts:140` |

## Width rules

- The row itself always includes `w-full`
- No min-width is defined on the row container
- No max-width is defined on the row container
- Width is controlled by the parent list grid: `repeat(columns, minmax(0, 1fr))`

Source:

- `index.tsx:116`
- `index.tsx:249-255`

## Thumbnail size

The media wrapper is `h-full`, and the media box uses `imageSizeClass`:

- base: `h-full w-full`
- `1/1`: `aspect-square`
- `4/3`: `aspect-[4/3]`

Source:

- `index.tsx:126-143`
- `styles.ts:87-96`

Because the row height is fixed, the media size is derived exactly from height plus aspect ratio:

| Pairing | Row height | Aspect ratio | Thumbnail size |
| --- | --- | --- | --- |
| `large` default/mobile | 84px | `1:1` | 84 x 84 |
| `small` default/mobile | 66px | `4:3` | 88 x 66 |
| `large` at `md+` | 120px | `1:1` | 120 x 120 |
| `small` at `md+` | 120px | `4:3` | 160 x 120 |

These are implementation-derived dimensions from:

- `styles.ts:36-37`
- `styles.ts:88-93`
- `design-tokens.ts:140`
- `design-tokens.ts:147`

## Exact Layout Rules

## Row container layout

`rowClass` base:

```tsx
"flex items-center pl-0 py-0 shadow-xs ring-1 ring-black/10"
```

Size variants add:

```tsx
large: "gap-120 pr-160 h-840 md:h-30 rounded-lego-list-lg"
small: "gap-120 pr-160 h-660 md:h-30 rounded-lego-list-sm"
```

Source:

- `styles.ts:27-46`

Exact layout values:

| Property | Value | Token/class source | File |
| --- | --- | --- | --- |
| Auto-layout direction | Horizontal | `flex` | `styles.ts:28` |
| Cross-axis alignment | Center | `items-center` | `styles.ts:28` |
| Top padding | 0px | `py-0` | `styles.ts:28` |
| Bottom padding | 0px | `py-0` | `styles.ts:28` |
| Left padding | 0px | `pl-0` | `styles.ts:28` |
| Right padding | 16px | `pr-160` -> token `160 = 16px` | `styles.ts:36-37`, `design-tokens.ts:28` |
| Gap between media block and content/action wrapper | 12px | `gap-120` -> token `120 = 12px` | `styles.ts:36-37`, `design-tokens.ts:26` |
| Height behavior | Fixed height, not hug content | `h-840` or `h-660`, `md:h-30` | `styles.ts:36-37` |
| Width behavior | Fill parent width | `w-full` | `index.tsx:116` |

## Media wrapper layout

Media wrapper class:

```tsx
"flex flex-col items-center justify-center overflow-hidden rounded-l-160 shrink-0 h-full"
```

Source:

- `index.tsx:126`

Exact layout behavior:

| Property | Value | Source |
| --- | --- | --- |
| Direction | Vertical flex | `index.tsx:126` |
| Horizontal alignment | Center | `items-center` |
| Vertical alignment | Center | `justify-center` |
| Height | Matches parent row height | `h-full` |
| Width | Derived from inner aspect-ratio media box | `index.tsx:128-141`, `styles.ts:88-93` |
| Resizing | Does not shrink | `shrink-0` |
| Clipping | Yes | `overflow-hidden` |
| Corner treatment | Left corners rounded, right corners not rounded here | `rounded-l-160` |

`rounded-l-160` resolves to a 16px left radius token:

- token `160 = 16px` from `design-tokens.ts:105`

## Content/action wrapper layout

Wrapper class:

```tsx
"flex items-center gap-80 space-between flex-1"
```

Source:

- `index.tsx:146`

Exact layout behavior:

| Property | Value | Token/class source | File |
| --- | --- | --- | --- |
| Direction | Horizontal | `flex` | `index.tsx:146` |
| Cross-axis alignment | Center | `items-center` | `index.tsx:146` |
| Internal gap | 8px | `gap-80` -> token `80 = 8px` | `index.tsx:146`, `design-tokens.ts:23` |
| Width behavior | Fill remaining width | `flex-1` | `index.tsx:146` |

Note:

- `space-between` appears in the class string, but Tailwind does not provide a standard `space-between` utility for flex justification. The actual right-push behavior comes from the trailing wrapper using `ml-auto`, not from `space-between`.

Source:

- `index.tsx:146`
- `index.tsx:187`

## Content column layout

`contentColClass`:

```tsx
"min-w-0 flex-1 flex flex-col items-start"
```

Variants:

- `large`: `gap-40`
- `small`: `gap-20`

Source:

- `styles.ts:77-85`

Exact layout values:

| Property | Large | Small | Source |
| --- | --- | --- | --- |
| Direction | Vertical | Vertical | `styles.ts:77` |
| Cross-axis alignment | Start | Start | `styles.ts:77` |
| Width behavior | Fill remaining space and allow text truncation | same | `min-w-0 flex-1` |
| Gap between stacked children | 4px | 2px | `gap-40` / `gap-20`, `design-tokens.ts:21`, `design-tokens.ts:20` |

Child order inside the content column:

1. Badge, if present
2. Title
3. Supporting text, if present

Source:

- `index.tsx:147-183`

## Trailing action layout

Trailing wrapper:

```tsx
"ml-auto shrink-0"
```

Source:

- `index.tsx:187`

Trailing action button:

- Uses `IconButton`
- `theme={mode}`
- `showBorder={false}`
- no explicit `size`, so default size is `sm`

Source:

- `index.tsx:188-203`
- `icon-button/src/index.tsx:200-206`

`IconButton` base sizing:

- base classes: `!box-content p-1.5 shrink-0`
- `size="sm"`: `h-200 w-200`

Source:

- `icon-button/src/index.tsx:52-106`
- `icon-button/src/index.tsx:200-206`

Resolved values:

| Property | Value | Source |
| --- | --- | --- |
| Content box size | 20 x 20 | `h-200 w-200`, `design-tokens.ts:123` |
| Internal button padding | 6px each side | `p-1.5` Tailwind default |
| Total tap target | effectively 32 x 32 | derived from 20px box + 6px left + 6px right |
| Horizontal placement | pushed to the far right | `ml-auto` |
| Shrink | none | `shrink-0` |

Important icon-size note:

- The row calls `icons.getIconClass(item.icon)` without a size argument.
- `getIconClass` only appends an `icon-*` size utility when a size is passed.
- So the glyph font size is not explicitly set by the row implementation.

Source:

- `index.tsx:197-200`
- `icons.ts:2802-2805`
- `icons-generated.css:16232-16250`

## Exact Style Rules

## Container surface styles

| Property | Light mode | Dark mode | Source |
| --- | --- | --- | --- |
| Background | `bg-white` -> `#FFFFFF` | `bg-white-alpha-10` -> `rgba(255,255,255,0.1)` | `styles.ts:31-34`, `color-tokens.ts:215-220` |
| Text default | `text-slate-900` -> `#0F172B` | `text-white` -> `#FFFFFF` | `styles.ts:31-34`, `color-tokens.ts:94-105`, `color-tokens.ts:215-216` |
| Shadow | `shadow-xs` | same | `styles.ts:28` |
| Ring | `ring-1 ring-black/10` | same | `styles.ts:28` |
| Optional border | `border-1 border-slate-200` | same class when `showBorder=true` | `styles.ts:39-41`, `design-tokens.ts:85`, `color-tokens.ts:97` |

Border radius:

| Row variant | Radius token | Resolved value | Source |
| --- | --- | --- | --- |
| `large` | `rounded-lego-list-lg` -> `--lego-radius-list-lg` | 16px for Cars24 | `styles.ts:36`, `tailwind-config.ts:53-76`, `tailwind-config.ts:378-381` |
| `small` | `rounded-lego-list-sm` -> `--lego-radius-list-sm` | 8px for Cars24 | `styles.ts:37`, `tailwind-config.ts:53-76`, `tailwind-config.ts:378-381` |

Media wrapper radius:

- `rounded-l-160` -> 16px on left side only
- token source: `design-tokens.ts:105`

## Title text styles

`rowTitleClass`:

```tsx
"font-semibold break-words hyphens-auto"
```

Variants:

- light: `text-slate-900`
- dark: `text-white`
- both sizes: `line-clamp-1 text-fs-150 md:text-fs-200 md:line-clamp-2`

Source:

- `styles.ts:48-59`

Resolved title spec:

| Property | Value | Source |
| --- | --- | --- |
| Font family | `var(--tw-lego-font)` -> Cars24 defaults to Geist stack | `tailwind-config.ts:21-29`, `tailwind-config.ts:327`, `tailwind-config.ts:383-389` |
| Font weight | 600 | `font-semibold`, `tailwind-config.ts:31-37` |
| Mobile/default size | 15px | `text-fs-150`, `font-tokens.ts:149-151` |
| `md+` size | 20px | `text-fs-200`, `font-tokens.ts:134-136` |
| Default line clamp | 1 line on default/mobile | `styles.ts:55-56` |
| `md+` line clamp | 2 lines | `styles.ts:55-56` |
| Light color | `#0F172B` | `styles.ts:50-52`, `color-tokens.ts:104` |
| Dark color | `#FFFFFF` | `styles.ts:50-53`, `color-tokens.ts:216` |

Dynamic override behavior:

- `item.title.properties.lineLimit` can override the line clamp through inline styles
- `item.title.color` can override the class-based color through inline styles

Source:

- `index.tsx:156-164`
- `index.tsx:40-47`

## Supporting text styles

`rowSubtitleClass`:

```tsx
"text-fs-130 font-normal break-words hyphens-auto"
```

Variants:

- light: `text-slate-500`
- dark: `text-white/80`
- `large`: `line-clamp-2 text-fs-130 md:text-sm`
- `small`: `line-clamp-1 text-fs-130 md:text-sm`

Source:

- `styles.ts:61-75`

Resolved supporting text spec:

| Property | Large | Small | Source |
| --- | --- | --- | --- |
| Font family | Geist stack | Geist stack | `tailwind-config.ts:21-29`, `tailwind-config.ts:327`, `tailwind-config.ts:383-389` |
| Font weight | 400 | 400 | `font-normal` |
| Mobile/default size | 13px | 13px | `text-fs-130`, `font-tokens.ts:146-148` |
| `md+` size | 14px | 14px | `text-sm`, `font-tokens.ts:63-65` |
| Default/mobile clamp | 2 lines | 1 line | `styles.ts:70-71` |
| Light color | `#62748E` | `#62748E` | `styles.ts:65-67`, `color-tokens.ts:100` |
| Dark color | white at 80% opacity | same | `styles.ts:65-68`, derived from Tailwind opacity utility |

Dynamic override behavior:

- `item.description.properties.lineLimit` can override the clamp
- `item.description.color` can override the class-based color

Source:

- `index.tsx:165-183`
- `index.tsx:40-47`

## Badge styles

The row hardcodes badge usage to:

- `appearance="stroke"`
- `size="xs"`
- `variant="success"`

Source:

- `index.tsx:148-154`

Badge primitive resolution:

| Property | Value | Source |
| --- | --- | --- |
| Layout | `inline-flex items-center` | `badge/src/styles.ts:5-7` |
| Weight | 500 | `font-medium`, `tailwind-config.ts:31-37` |
| Family | Geist | `font-geist` in `badge/src/styles.ts:6` |
| Height | 24px | `h-240`, `badge/src/styles.ts:11`, `design-tokens.ts:124` |
| Horizontal padding | 6px left and right | `px-60`, `badge/src/styles.ts:11`, `design-tokens.ts:22` |
| Internal gap | 2px | `gap-20`, `badge/src/styles.ts:11`, `design-tokens.ts:20` |
| Text size | 13px | `text-fs-130`, `badge/src/styles.ts:103`, `font-tokens.ts:146-148` |
| Radius | `rounded-lego-badge-sm` | `badge/src/styles.ts:21-22`, `tailwind-config.ts:73`, `tailwind-config.ts:378-381` |
| Radius value | 12px in Cars24 | `tailwind-config.ts:53-76` |
| Background | `bg-mint-green-50` -> `#EFFFF7` | `badge/src/styles.ts:52-56`, `color-tokens.ts:203-205` |
| Text color | `text-mint-green-900` -> `#2A6B4A` | `badge/src/styles.ts:52-56`, `color-tokens.ts:212-213` |
| Border | `border border-mint-green-800` -> 1px `#368C61` | `badge/src/styles.ts:55`, `color-tokens.ts:211-213` |

## Empty media placeholder styles

When `item.media.url` is missing, the row still renders a media box with:

- `bg-white`
- `border`
- `border-dashed`
- `border-drive-pink-300`
- `grid place-items-center`

Source:

- `index.tsx:137-141`

Resolved color:

- `drive-pink-300` -> `#FD67CA`

Source:

- `color-tokens.ts:167-172`

## Trailing icon styles

Trailing icon color:

- dark mode: `text-white/80`
- light mode: `text-slate-500`

Source:

- `index.tsx:197-201`

The button shell itself is transparent because `showBorder={false}` adds:

- `border-0 bg-transparent`

Source:

- `icon-button/src/index.tsx:85-88`

## Exact States And Variants

## Real production row variants

| Variant axis | Real production behavior | Source |
| --- | --- | --- |
| Theme | `light` or `dark` | `styles.ts:31-34`, `index.tsx:223-240` |
| Size | `large` or `small` | `types.ts:5`, `styles.ts:35-38` |
| Media ratio | `1/1` or `4/3` | `types.ts:53-67`, `styles.ts:88-93` |
| Border | `showBorder` true or false | `styles.ts:39-41`, `types.ts:95-96` |
| Tag present | badge visible only if `item.tag.text` exists | `index.tsx:148-155` |
| Description present | supporting text visible only if `item.description.text` exists | `index.tsx:165-183` |
| Trailing icon present | icon button visible only if `item.icon` exists and is valid | `index.tsx:186-205` |
| Clickable element type | anchor only for `DEEP_LINK`; otherwise `div` | `index.tsx:75-85`, `index.tsx:107-125` |

## Requested state mapping

### With badge / without badge

- Supported
- Badge shows only when `item.tag.text` exists
- Badge styling is not data-driven beyond the text content; it is always `success + stroke + xs`

Source:

- `index.tsx:148-155`

### With media / without media

- Supported
- Without media does not remove the media region
- The media slot remains present and becomes a white dashed placeholder

Source:

- `index.tsx:126-143`

### Clickable / static

- Partially supported
- If `redirection.action === "DEEP_LINK"`, the container becomes an anchor
- If no deep link exists, the container is still rendered with `role="button"` and still wires `onClick={handleRowClick}`
- So the production implementation is not truly "static" in markup terms if an `onItemClick` handler is supplied

Source:

- `index.tsx:68-85`
- `index.tsx:107-125`

### Status variants

- No row-level status variants exist
- The only visible status-like treatment is the optional badge
- That badge is hardcoded to the success stroke style, regardless of the tag text

Source:

- `index.tsx:148-154`

## Source Of Truth By Value

## Row shell values

| Value | Token or class | Exact source |
| --- | --- | --- |
| Top padding 0px | `py-0` | `styles.ts:28` |
| Bottom padding 0px | `py-0` | `styles.ts:28` |
| Left padding 0px | `pl-0` | `styles.ts:28` |
| Right padding 16px | `pr-160` + token `160 = 16px` | `styles.ts:36-37`, `design-tokens.ts:28` |
| Internal outer gap 12px | `gap-120` + token `120 = 12px` | `styles.ts:36-37`, `design-tokens.ts:26` |
| Large height 84px | `h-840` + token `840 = 84px` | `styles.ts:36`, `design-tokens.ts:147` |
| Small height 66px | `h-660` + token `660 = 66px` | `styles.ts:37`, `design-tokens.ts:140` |
| Desktop height 120px | `md:h-30` Tailwind default | `styles.ts:36-37` |
| Large radius 16px | `rounded-lego-list-lg` -> Cars24 `list-lg` | `styles.ts:36`, `tailwind-config.ts:53-76` |
| Small radius 8px | `rounded-lego-list-sm` -> Cars24 `list-sm` | `styles.ts:37`, `tailwind-config.ts:53-76` |
| Optional border width 1px | `border-1` | `styles.ts:40`, `design-tokens.ts:85` |
| Optional border color `#E2E8F0` | `border-slate-200` | `styles.ts:40`, `color-tokens.ts:97` |
| Light background `#FFFFFF` | `bg-white` | `styles.ts:32`, `color-tokens.ts:215-216` |
| Dark background `rgba(255,255,255,0.1)` | `bg-white-alpha-10` | `styles.ts:33`, `color-tokens.ts:218-220` |

## Content stack values

| Value | Token or class | Exact source |
| --- | --- | --- |
| Content/action gap 8px | `gap-80` + token `80 = 8px` | `index.tsx:146`, `design-tokens.ts:23` |
| Large content vertical gap 4px | `gap-40` + token `40 = 4px` | `styles.ts:80`, `design-tokens.ts:21` |
| Small content vertical gap 2px | `gap-20` + token `20 = 2px` | `styles.ts:81`, `design-tokens.ts:20` |
| Title mobile size 15px | `text-fs-150` | `styles.ts:55-56`, `font-tokens.ts:149-151` |
| Title desktop size 20px | `md:text-fs-200` | `styles.ts:55-56`, `font-tokens.ts:134-136` |
| Supporting text mobile size 13px | `text-fs-130` | `styles.ts:62`, `font-tokens.ts:146-148` |
| Supporting text desktop size 14px | `md:text-sm` | `styles.ts:70-71`, `font-tokens.ts:63-65` |

## Media values

| Value | Token or class | Exact source |
| --- | --- | --- |
| Left-side media radius 16px | `rounded-l-160` | `index.tsx:126`, `design-tokens.ts:105` |
| Empty media border color `#FD67CA` | `border-drive-pink-300` | `index.tsx:139`, `color-tokens.ts:171` |
| Square media | `aspect-square` | `styles.ts:91` |
| Landscape media | `aspect-[4/3]` | `styles.ts:92` |

## Implementation-ready Figma structure

Expected Figma auto-layout structure for the production row:

1. `List Row / Root`
   - Horizontal auto-layout
   - Width: Fill container
   - Height: Fixed
   - Cross-axis align: Center
   - Padding: top 0, right 16, bottom 0, left 0
   - Gap: 12
   - Corner radius: 16 for `large`, 8 for `small`
2. `Media`
   - Fixed-size frame derived from row height and aspect ratio
   - Height: Fill row height
   - Width: 84, 88, 120, or 160 depending on row size and breakpoint target being represented
   - Overflow clip: on
   - Left corners radius: 16
   - Right corners radius: 0
3. `Body`
   - Horizontal auto-layout
   - Width: Fill container
   - Height: Hug
   - Cross-axis align: Center
   - Gap: 8
4. `Content`
   - Vertical auto-layout
   - Width: Fill container
   - Height: Hug
   - Cross-axis align: Start
   - Gap: 4 for `large`, 2 for `small`
   - Children in order: `Badge` optional, `Title`, `Supporting Text` optional
5. `Trailing Action`
   - Optional frame aligned at far right
   - Width/height based on the button shell
   - No visible border/background in row usage

Important Figma note:

- The row is a fixed-height component, not a hug-height card with vertical padding.
- The visual height comes from the explicit `h-*` classes, while top and bottom padding remain `0`.

## Direct Answers

### Is vertical padding actually zero?

Yes. The row container explicitly uses `py-0` in `styles.ts:28`, so top and bottom padding are both exactly `0px`.

### Exact expected padding values

- Top: `0px`
- Right: `16px`
- Bottom: `0px`
- Left: `0px`

Source:

- `styles.ts:28`
- `styles.ts:36-37`
- `design-tokens.ts:28`

### Exact expected Figma auto-layout structure

- Root frame: horizontal auto-layout, fixed height, fill width, center aligned, `0 / 16 / 0 / 0` padding, `12px` gap
- Child 1: media frame, fixed aspect-ratio thumbnail, `shrink-0`, left-only `16px` rounding, overflow hidden
- Child 2: body frame, horizontal auto-layout, fill remaining width, `8px` gap, center aligned
- Inside body: content column as vertical auto-layout, fill remaining width, start aligned, `4px` gap for large or `2px` gap for small
- Optional last child in body: trailing action frame pushed to the end


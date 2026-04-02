# Input Mapping

## Source

- Figma file: `Turbo-UI-Minimal-DLS`
- File key: `ZSUXGVeiT6EpNTQRLinHge`
- Inputs page node: `2:4`
- Component groups inspected:
  - `11:65` `Input Field`
  - `11:81` `Text Area`
- Representative variants inspected:
  - `11:5` `Input Field` / `Size=medium` / `Variant=default` / `State=default`
  - `11:10` `Input Field` / `Size=medium` / `Variant=default` / `State=error`
  - `11:15` `Input Field` / `Size=medium` / `Variant=default` / `State=disabled`
  - `11:35` `Input Field` / `Size=large` / `Variant=default` / `State=default`
  - `11:50` `Input Field` / `Size=large` / `Variant=primary` / `State=default`
  - `11:66` `Text Area` / `State=default`
  - `11:71` `Text Area` / `State=error`
  - `11:76` `Text Area` / `State=disabled`

## Implementation Decision

- The existing shared single-line field in `components/ui/input-shell.tsx` was updated directly to match the Figma `Input Field`.
- A new dedicated multi-line component was added in `components/ui/text-area-field.tsx` to represent the Figma `Text Area`.
- This preserves the existing codebase shape safely:
  - single-line inputs and select-like controls keep using the shared input wrapper
  - multi-line fields now use a separate shared textarea component
- No generic single-component collapse was introduced for both field types.

## Input Field Contract

### Variants

| Figma variant | Visual treatment | App mapping |
| --- | --- | --- |
| `default` | White field, secondary border | default field state |
| `primary` | Brand-subtle surface with brand border | mapped to explicit `variant="primary"` and used as the focus treatment |

### Sizes

| Figma size | Height | Radius | Padding | Text style | App size |
| --- | --- | --- | --- | --- | --- |
| `medium` | 48px | 12px | 8px horizontal, 12px vertical | Inter 400 / 15px / 1.4 | `medium` |
| `large` | 56px | 14px | 12px horizontal, 14px vertical | Inter 400 / 17px / 1.4 | `large` |

### Label and Helper Text

| Element | Figma treatment | App mapping |
| --- | --- | --- |
| Label | Inter 400 / 15px / `#0F172B` | `text-[var(--font-size-label-m)]` with regular weight |
| Helper text | Inter 400 / 13px / `#62748E` | `text-[var(--font-size-body-s)] text-muted` |
| Error helper text | Inter 400 / 13px / `#E7000B` | `text-[var(--font-size-body-s)] text-danger` |

### Placeholder and Text

- Medium input placeholder text is `15px`.
- Large input placeholder text is `17px`.
- Placeholder color uses `Text / Secondary` `#62748E`.
- The app keeps placeholders on `text-muted`, which is already mapped to that Figma token.

### States

| State | Figma definition | App mapping |
| --- | --- | --- |
| `default` | White surface, secondary border | default field state |
| `error` | White surface, red border, red helper text | `error` prop |
| `disabled` | Strong default surface, secondary border, muted label/value | `disabled` prop |
| `focus` | No explicit `focus` specimen label, but `primary` variant matches active/focused styling | mapped via `focus-within` and optional `variant="primary"` |

### Input Tokens Used

| Figma token | Value | App token |
| --- | --- | --- |
| Surface / Elevated | `#FFFFFF` | `--surface-strong` |
| Surface / Brand / Subtle | `#F6F5FF` | `--surface-brand-subtle` |
| Surface / Default / Strong | `#F1F5F9` | `--surface` |
| Border / Secondary | `#CAD5E2` | `--border` |
| Border / Brand / Primary | `#4736FE` | `--accent`, `--border-brand-primary` |
| Text / Primary | `#0F172B` | `--foreground` |
| Text / Secondary | `#62748E` | `--muted` |
| Disabled label/value | `#90A1B9` | `--border-strong` |
| Error border/text | `#E7000B` | `--danger` |

## Text Area Contract

### Variants and Sizes

| Figma component | States available | App mapping |
| --- | --- | --- |
| `Text Area` | `default`, `error`, `disabled` | `TextAreaField` with `error` and `disabled` support |

- The inspected page exposed a single size:
  - height: 128px in the specimen
  - radius: 14px
  - padding: 12px on all sides

### Label and Footer

| Element | Figma treatment | App mapping |
| --- | --- | --- |
| Label | Inter 600 / 15px / `#0F172B` | `text-[var(--font-size-label-m)]` with semibold weight |
| Footer default | Inter 400 / 13px / `#62748E` | `helperText` or `characterCount` footer in muted tone |
| Footer error | Inter 400 / 13px / `#E7000B` | `error` footer in danger tone |

### Character Count Treatment

- In the default and disabled Figma specimens, the footer line is used for a character count like `0/240`.
- In the error specimen, the counter is replaced by the validation message.
- The app component supports an optional counter API, but it was not activated in current screens because no product limits are defined in existing behavior.

### States

| State | Figma definition | App mapping |
| --- | --- | --- |
| `default` | White surface, secondary border | default field state |
| `error` | White surface, red border, red footer text | `error` prop |
| `disabled` | Strong default surface, secondary border, muted content | `disabled` prop |
| `focus` | Not explicitly shown on the page | app mirrors the brand-border / brand-subtle focus treatment used by `Input Field` |

## Current App Adoption

### Input Field Usage

- `components/skills/filter-toolbar.tsx`
  - search
  - category filter shell
  - uploader filter shell
  - sort shell
- `components/app-shell/workspace-shell.tsx`
  - read-only global search field
- `components/upload/upload-form.tsx`
  - skill title
  - category field shell

### Text Area Usage

- `components/upload/upload-form.tsx`
  - short description
  - long description

### Screens with Applicable Inputs

- `/skills`
- `/upload`
- workspace shell header used across authenticated pages

### Screens With No Applicable Text Inputs

- `/login`
  - OAuth-only flow, no text input fields to map
- `/admin`
  - current screen exposes review actions and data cards, not admin form fields

## Storybook / DLS Check

- No local Storybook or DLS-specific input implementation was found in this repo during inspection.
- The implementation decision was based on:
  - the shared app input wrapper in `components/ui/input-shell.tsx`
  - raw textarea usage in `components/upload/upload-form.tsx`
  - the connected Figma `Inputs` page

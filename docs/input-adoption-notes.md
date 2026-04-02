# Input Adoption Notes

## Decision

The Figma `Input Field` was adopted by updating the existing shared single-line wrapper in `components/ui/input-shell.tsx`.

The Figma `Text Area` was adopted by adding a new dedicated shared component in `components/ui/text-area-field.tsx`.

That was the safest approach because:

- the app already had a shared single-line field wrapper used in multiple places
- multi-line fields were still raw textareas and needed a dedicated reusable component
- keeping the two components separate matches the Figma library and avoids forcing both field types through one generic API
- existing select-like controls can still use the same shared field shell without changing behavior

## What Changed

### Shared Input Field

- Updated label treatment from uppercase utility styling to the Figma input label style
- Added Figma-aligned sizes:
  - `medium`
  - `large`
- Added helper and error text support
- Added disabled styling
- Added `primary` variant support and mapped it to the active/focus treatment
- Preserved the current compatibility pattern where the wrapper can still host custom children like `select`

### Shared Text Area

- Added a dedicated `TextAreaField` component
- Added helper and error footer support
- Added disabled styling
- Added optional character count support
- Applied the same border and surface language as the Figma text area specimens

### Screen Adoption

- `FilterToolbar` now uses the updated shared `Input Field` styling for search and filter shells.
- The authenticated workspace header uses the updated shared `Input Field` styling for the read-only global search field.
- The upload form now uses:
  - Figma `Input Field` styling for title and category
  - Figma `Text Area` styling for short and long descriptions
- Upload validation now also maps existing title/category/summary errors into field-level input states without changing submission behavior.

## Screens Using the Updated Input Components

- `/skills`
- authenticated workspace shell header across app routes
- `/upload`

## Screens Intentionally Unchanged

- `/login`
  - there are no text inputs in the current Google OAuth flow
- `/admin`
  - there are no editable form fields on the current review dashboard

## Intentional Non-Changes

- No backend logic changed.
- No auth or Supabase flow changed.
- No `org_members`, storage, or RLS behavior changed.
- No file upload semantics changed.
- No unrelated components were redesigned.

## Known Gaps

- The Figma `Text Area` page did not expose a separately named focus specimen, so the app reuses the brand-border active treatment from the `Input Field` for consistency.
- The current product flow does not define hard character limits for description fields, so the component supports counters but the upload form does not display one yet.
- The app still uses a custom file picker surface for markdown uploads because the Figma Inputs page only covered single-line inputs and text areas, not file-upload controls.

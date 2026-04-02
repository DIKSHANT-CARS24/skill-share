# Upload page redesign implementation notes

## Exact files changed

- `app/(workspace)/upload/page.tsx`
- `components/app-shell/workspace-shell.tsx`
- `components/ui/button.tsx`
- `components/upload/upload-form.tsx`

## What was removed from the top section

- Removed the shared top banner section for the upload route, including:
  - `Supabase SSR`
  - `RLS protected`
  - descriptive helper text
  - global search
  - top-level sign out button
  - top-level upload skill button
- Removed the old upload header treatment that included:
  - `UPLOAD FLOW`
  - the `Authenticated workflow` badge

## What was removed from the sidebar

- Removed the `Workspace status` section from the upload shell variant.
- Removed the `Why this shell exists` section from the upload shell variant.
- Reused the lighter compact sidebar already introduced for the skills routes.

## How the upload form was simplified

- Reduced the form to the essential visible fields:
  - skill title
  - category
  - description
  - markdown file
- Removed the extra authenticated-upload support card with badges.
- Removed the separate submission checklist panel.
- Removed the `Clear form` action and replaced it with `Cancel`.
- Kept the markdown preview and upload validation flow intact.

## How the description fields were consolidated

- Removed the separate `Short description` and `Long description` text areas.
- Replaced them with a single `Description` text area.
- The single field is visually optional in the UI.
- Under the hood, the form still submits the expected `summary` and `longDescription` fields so the existing server action continues to work without changing the data model.

## Whether the cancel button now uses the correct destructive styling from the Figma library

- Yes, the cancel action now uses the shared `Button` component with a dedicated destructive variant.
- It keeps the same shared Figma-aligned button sizing, radius, spacing, and typography, while applying semantic destructive colours from the existing design token set.

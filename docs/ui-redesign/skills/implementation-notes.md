# Skills page implementation notes

## Exact files changed

- `components/skills/filter-toolbar.tsx`
- `docs/ui-redesign/skills/implementation-notes.md`

## How the Clear filters button was removed

- Removed the `Clear filters` action from the filtered-state toolbar in `components/skills/filter-toolbar.tsx`.
- No replacement secondary button was added, so the filtered state now relies on the existing applied-filter chips for removal.

## How the filter chip click behavior was changed

- Changed each applied filter chip from a single clickable button into a static chip container with a dedicated close-icon button inside it.
- The chip text/body is now non-interactive and only the cross icon can trigger filter removal.
- The chip styling remains aligned with the current Figma-library-based surface and border treatment.

## Whether URL params and results still update correctly after chip removal

- Yes.
- The close icon still calls the existing query update flow in `filter-toolbar.tsx`.
- Removing a filter updates the URL params, refreshes the catalog results, and keeps the current URL-driven `/skills` state behavior in sync.

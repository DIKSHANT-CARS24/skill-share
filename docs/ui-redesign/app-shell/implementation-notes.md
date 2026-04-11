# App Shell Avatar Menu Overlay Refinement

## Exact files changed

- `components/skills/skills-account-menu.tsx`
- `docs/ui-redesign/app-shell/implementation-notes.md`

## How dropdown readability was improved

- Increased the effective opacity of the shared dropdown surface so page content behind the menu no longer competes with the menu text.
- Strengthened the inactive menu item surfaces so each row reads as a clearer layer instead of melting into the page behind it.
- Increased text contrast on the email line and preserved stronger foreground contrast for the rest of the menu content.
- Kept the active item styling and existing menu structure intact.

## What surface/opacity/blur/shadow changes were made

- The floating menu panel now uses a denser white-to-soft-lilac gradient background with much higher opacity.
- The panel border was made clearer and brighter.
- The panel shadow was deepened to separate the dropdown more strongly from the page behind it.
- Backdrop blur was preserved, but paired with a more solid fill so the dropdown still feels glassy without becoming hard to read.
- Inactive menu rows now use a more opaque glass treatment with stronger borders and lighter internal highlights.
- The destructive sign-out row was given a more legible tinted surface while keeping its existing action behavior.

## How stacking and z-index were fixed

- The dropdown is now rendered through a `createPortal(..., document.body)` layer instead of being left inside the local page stacking context.
- The floating panel uses fixed positioning with a dedicated `z-[10000]` overlay layer so catalog chips, filters, cards, and other glass surfaces cannot render above it.
- The overlay still measures the avatar trigger and anchors itself to that trigger position, so the behavior stays popover-like without re-entering normal layout flow.

## Confirmation that the menu still floats outside the topbar layout

- Yes.
- The dropdown still uses fixed overlay positioning anchored to the avatar trigger.
- It remains outside the topbar's normal layout flow, so opening it does not affect topbar height or surrounding content layout.
- With the portal layer in place, it now also appears above the stats chips and page content instead of competing with their local stacking contexts.

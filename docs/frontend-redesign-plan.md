# Frontend redesign plan

## Purpose

This document proposes a frontend-only redesign for the current `skill-share` app. It is based on the existing repository structure and is intentionally scoped to visual design, hierarchy, spacing, usability, and consistency.

## Hard guardrails

- Keep all existing backend, auth, Supabase, and server action logic intact.
- Keep the current route structure intact:
  - `/login`
  - `/skills`
  - `/skills/[id]`
  - `/upload`
  - `/admin`
- Do not change the current query parameter model for catalog filters without explicit approval.
- Preserve beginner-readability:
  - route files stay easy to scan
  - shared UI primitives stay small and obvious
  - avoid over-abstraction, clever state layers, or hard-to-follow variant systems

## Current frontend structure audit

### Route and component map

- Root layout:
  - `app/layout.tsx`
  - `app/globals.css`
- Auth route:
  - `app/login/page.tsx`
  - `components/auth/login-form.tsx`
- Authenticated workspace shell:
  - `app/(workspace)/layout.tsx`
  - `components/app-shell/workspace-shell.tsx`
  - `components/app-shell/sidebar-nav.tsx`
- Catalog:
  - `app/(workspace)/skills/page.tsx`
  - `components/skills/filter-toolbar.tsx`
  - `components/skills/skill-card.tsx`
- Skill detail:
  - `app/(workspace)/skills/[id]/page.tsx`
  - `components/skills/markdown-preview.tsx`
  - `components/skills/version-history.tsx`
- Upload:
  - `app/(workspace)/upload/page.tsx`
  - `components/upload/upload-form.tsx`
- Admin:
  - `app/(workspace)/admin/page.tsx`
- Shared primitives:
  - `components/ui/panel.tsx`
  - `components/ui/button.tsx`
  - `components/ui/badge.tsx`
  - `components/ui/input-shell.tsx`
  - `components/ui/text-area-field.tsx`
  - `components/ui/section-heading.tsx`
  - `components/states/state-panels.tsx`

### What is already working well

- The app already has a usable token foundation in `app/globals.css`.
- Pages are route-local and readable.
- Business logic is reasonably separated from presentational components.
- Shared primitives already exist for buttons, panels, badges, and form fields.
- Catalog filters already use URL-based state, which is worth preserving.

## Main design weaknesses

### Across the app

1. The UI relies too heavily on the same rounded panel treatment.
   Most sections use the same border, fill, shadow, and spacing pattern, so important areas do not stand out clearly.

2. Information hierarchy is too flat.
   Headers, metrics, notes, and secondary explanations often compete visually with the primary task on the page.

3. The product feels more like a scaffold than an enterprise tool.
   Many surfaces explain implementation details instead of helping users complete their task quickly.

4. Navigation and shell chrome are noisy.
   The sidebar, top header, badges, and helper notes repeat the same auth and workspace information in multiple places.

5. The app overuses badges.
   Category, status, counts, uploader email, and helper labels often appear as badges even when plain text or structured metadata would scan better.

6. Data-heavy screens use card stacks where denser row or table patterns would work better.
   This makes catalog and admin views feel less efficient and less enterprise-grade.

7. Copy is too technical in user-facing places.
   Terms like `org_members`, `getClaims()`, RLS, and storage bucket details are useful for developers but should not dominate the primary UI.

8. Empty, loading, and error states are generic.
   They are functional, but they do not feel tailored to the page or give the product a polished recovery experience.

### `/login`

- The page splits attention too evenly between product pitch and implementation notes.
- The primary task is simple, but the screen is text-heavy.
- Security and access rules are explained in a technical way instead of a trust-building way.
- The current layout does not create a strong focal point around the single sign-in action.

### `/skills`

- The page header, KPI strip, filters, grid, and right rail all compete for attention.
- The right rail takes space without adding enough operational value.
- The current card grid is attractive enough for a scaffold, but not efficient for frequent browsing.
- Search and filters feel like a form, not a catalog command bar.

### `/skills/[id]`

- The page lacks a strong entry point such as breadcrumb, back link, or top-level action summary.
- The detail view breaks into many similar-looking panels on the right, which weakens hierarchy.
- Markdown preview is the right primary surface, but it needs stronger editorial rhythm and supporting navigation.
- Metadata, status, download, and version info are not grouped into a decisive summary block.

### `/upload`

- The current form is correct but visually undifferentiated.
- The file upload interaction feels basic for a primary workflow.
- Guidance is spread across small helper areas rather than structured as a clear submission flow.
- The preview panel exists, but the relationship between form input and preview is not visually strong.

### `/admin`

- The page reads more like a read-only data dump than an admin workspace.
- Active members and recent versions are useful, but the layout does not frame them as oversight tools.
- The screen lacks stronger distinction between summary metrics, activity, and governance-related information.

## Proposed redesign direction

### Experience goals

- Make the product feel calmer, sharper, and more deliberate.
- Reduce visual repetition by creating clearer levels of emphasis.
- Shift from “UI scaffold with explanatory notes” to “internal product with confident defaults”.
- Preserve the existing mental model and route map while improving scanability.

### Visual direction

- Use a more restrained enterprise palette:
  - neutral canvas
  - elevated white and soft grey surfaces
  - one controlled accent colour for active states and primary actions
  - semantic colours reserved for status only
- Reduce default shadow strength and let spacing and contrast create hierarchy first.
- Use fewer oversized pill elements.
- Introduce more deliberate spacing between page header, controls, and content body.

### Copy direction

- Use sentence case throughout.
- Lead with user benefit, not implementation detail.
- Move developer-facing details into secondary notes, tooltips, or admin-only supporting areas.
- Keep CTA labels short and direct:
  - `Sign in with Google`
  - `Upload skill`
  - `Download markdown`
  - `Clear filters`

## Screen-by-screen proposed changes

### `/login`

#### New page structure

- Keep a two-column layout on desktop, but rebalance it:
  - left side: product value, trust signals, lightweight product overview
  - right side: focused sign-in card
- Collapse technical explanation into one secondary “Access requirements” module below the CTA card.

#### Proposed content hierarchy

1. Product name and one-line positioning
2. Clear benefit-led headline
3. Three short proof points
4. Single sign-in card with CTA
5. Access rules and help state

#### Proposed visual changes

- Replace the current equal-weight panels with:
  - one brand-led welcome section
  - one elevated auth card
- Use a stronger hero composition with more whitespace and fewer bordered boxes.
- Turn the three current technical stat cards into concise trust cards:
  - `Workspace-only access`
  - `Private file storage`
  - `Protected downloads`
- Make the error state feel like a focused inline alert inside the sign-in card, not a standalone block.

#### Copy changes

- Replace technical copy about `org_members`, RLS, and `getClaims()` with plain-language guidance.
- Keep one short secondary note for internal access rules.
- Add a support line such as:
  - `Use your Cars Google Workspace account to continue.`

### `/skills`

#### New page structure

- Replace the current “hero + KPI strip + right rail + card grid” stack with a cleaner catalog shell:
  - page header
  - sticky search and filter command bar
  - compact summary row
  - primary results area

#### Primary browsing pattern

- Shift desktop results from large card grid to a row-card or list-table hybrid:
  - title and summary on the left
  - category and status in a compact metadata block
  - uploader, updated date, version, and downloads aligned on the right
- Keep a more card-like stacked layout on mobile.

#### Proposed visual changes

- Remove the current right rail from the default catalog layout.
- Reduce KPI cards to one compact inline summary strip:
  - total skills
  - categories
  - uploaders
- Make search the dominant control.
- Present active filters as removable chips below the toolbar.
- Keep the current URL-driven filter model, but make the surface feel like a live catalog tool rather than a settings form.

#### Interaction notes

- Preserve `q`, `category`, `uploader`, and `sort`.
- If later implemented, instant submit should still write the same query params.
- Do not add route changes for saved views or tabs without approval.

#### Content upgrades

- Each skill row should emphasise:
  - title
  - summary
  - owner
  - freshness
  - status
- Tags should be secondary and capped more intentionally.
- Use fewer badges and more aligned metadata text.

### `/skills/[id]`

#### New page structure

- Introduce a stronger top section:
  - breadcrumb or back link to `/skills`
  - title
  - short description
  - key metadata strip
  - primary actions
- Use a two-column detail layout:
  - left: primary content preview
  - right: sticky summary rail

#### Primary content rail

- Keep markdown preview as the hero surface.
- Improve editorial styling:
  - stronger heading rhythm
  - more breathing room between sections
  - more refined list and quote styling
  - code blocks that feel integrated with the system

#### Summary rail

- Merge scattered right-side panels into three clearer blocks:
  - skill summary
  - uploader and metadata
  - versions and related skills
- Put download, version number, status, category, and updated date in the first block.
- Treat storage-path or implementation notes as tertiary details, not first-class content.

#### Proposed visual changes

- Reduce badge noise at the top of the page.
- Make the action area feel more decisive:
  - primary: `Download markdown`
  - secondary: `Upload new version` or `Create draft`
- Give version history a more timeline-like treatment so recency is obvious.

### `/upload`

#### New page structure

- Turn the upload screen into a guided workspace with three visible sections:
  - skill details
  - markdown file
  - review and submit
- Keep preview visible alongside the form on desktop.

#### Proposed visual changes

- Replace the basic file input presentation with a clear upload dropzone treatment.
- Visually connect the selected file and the preview panel.
- Add a stronger section hierarchy inside the form instead of one long undifferentiated card.
- Move the checklist and submission readiness into a right-side or bottom review module.

#### Form usability changes

- Clarify the difference between:
  - short description
  - long description
- Add lightweight helper text around title and category naming.
- Keep validation inline at the field level, with the form-level error summary only when needed.
- Use clearer submission states:
  - idle
  - ready to submit
  - upload in progress
  - upload complete

#### Copy direction

- Frame this page around contribution, not infrastructure.
- Example section labels:
  - `Skill details`
  - `Markdown file`
  - `Review before upload`

### `/admin`

#### New page structure

- Reframe the page as an oversight workspace, not a generic dashboard:
  - header with scope and constraints
  - metrics row
  - main operational content
  - governance notes

#### Proposed content zones

- Summary metrics:
  - active members
  - published skills
  - recent versions
  - logged downloads
- Main body:
  - member roster as a compact table or dense row list
  - recent version activity as a feed
- Supporting rail:
  - role definitions
  - admin-only reminders
  - future moderation placeholders clearly labelled as not yet active

#### Proposed visual changes

- Make the member roster feel like a true admin list with aligned columns.
- Use status styling sparingly and consistently.
- Treat admin guidance as supporting documentation, not part of the main flow.

#### Scope note

- Since the current admin route is read-only, redesign should stay read-only until admin mutation logic is explicitly approved.

## Reusable component changes

### Layout shell

- Simplify `WorkspaceShell`:
  - remove repeated auth and member metadata across sidebar and header
  - keep one compact identity area
  - keep one clear page action area
- Reduce visual weight of the sidebar.
- Make the content column feel more like the product’s centre of gravity.
- Establish standard page widths:
  - narrow for auth
  - standard for forms and detail pages
  - wide for catalog and admin

### Navigation

- Move from generic pill links to clearer primary navigation items.
- Keep `/skills`, `/upload`, and `/admin` prominent.
- De-emphasise `/profile` and `/design-preview` visually if they remain in navigation.
- Add clearer active-state treatment using background, left rule, or icon plus text.
- Consider a secondary utilities area for sign out and user identity instead of mixing them into the page header.

### Cards, lists, and tables

- Define three display patterns instead of using one panel style everywhere:
  - highlight card
  - row card
  - dense admin table/list
- Reserve large soft-shadow cards for hero or summary surfaces only.
- Use denser row-based layouts for catalog and admin.
- Standardise metadata alignment:
  - label left
  - value right for definition lists
  - consistent column widths for admin rows

### Filters and search

- Make search the first and strongest control.
- Keep filters in a compact secondary row.
- Use active filter chips below the main toolbar.
- Keep sort visually distinct from filtering.
- Add a consistent `Clear filters` affordance.

### Form styling

- Standardise all labels, helper text, errors, and section spacing.
- Use sentence case labels and short helper text.
- Make focus states more visible and consistent.
- Reduce decorative borders around every field group.
- Introduce clear form section headers for long workflows.

### Badges and status indicators

- Reduce badge usage overall.
- Use badges for status first, category second, metadata only when necessary.
- Standardise status mapping:
  - draft
  - in review
  - needs changes
  - published
  - archived
- Consider adding small status dots or inline pills for dense admin and catalog layouts.

### Empty, loading, and error states

- Make states page-specific.
- Add more contextual titles and actions.
- Create separate skeleton patterns for:
  - catalog list
  - skill detail
  - upload workspace
  - admin roster/activity
- Remove placeholder actions that are visibly disabled unless they will soon be functional.

## Design system changes

### Colour

- Introduce a more restrained neutral base.
- Use the accent colour more intentionally and less frequently.
- Keep semantic colours reserved for state, moderation, and alerts.
- Increase contrast between:
  - page background
  - shell surface
  - content surface
  - interactive controls

### Typography

- Tighten the type scale into clearer tiers:
  - page title
  - section title
  - body
  - metadata
  - label
- Reduce reliance on all-caps microcopy.
- Keep long-form markdown readable with stronger paragraph spacing and heading rhythm.

### Spacing

- Adopt a visibly stricter spacing system:
  - 4
  - 8
  - 12
  - 16
  - 24
  - 32
  - 40
- Use larger separation between major sections and tighter spacing inside dense rows.

### Radius and shadow

- Use fewer radius sizes.
- Reduce the number of soft-shadow surfaces.
- Let hierarchy come from structure before decoration.

### Page patterns

- Create standard page templates for:
  - auth
  - browse/list
  - detail
  - form/workflow
  - admin/ops

### Copy system

- Keep labels, headers, and helpers in sentence case.
- Prioritise task language over implementation language.
- Avoid surfacing database table names and framework terms unless the page is explicitly technical.

## Risks and dependencies

### Risks

- If the redesign becomes too component-heavy, beginner-readability will drop.
- If catalog stays as large cards only, enterprise scanability will remain weak.
- If catalog moves to a denser row format, mobile behaviour must be designed intentionally.
- If admin surfaces imply moderation actions that do not exist yet, the UI could over-promise.
- If the accent colour changes significantly, the app may need stakeholder approval for brand alignment.

### Dependencies

- Preserve current auth and route guards in `requireActiveMember` and `requireAdmin`.
- Preserve current Supabase-backed page data contracts.
- Preserve current filter URL shape on `/skills`.
- Preserve current upload action contract and validation rules unless separately approved.
- Review whether `/profile` and `/design-preview` should stay in primary navigation or move to lower emphasis.

## Phased implementation plan

### Phase 1: foundations and shell

- Refine tokens for colour, spacing, elevation, and type scale.
- Redesign `WorkspaceShell`, `SidebarNav`, `Panel`, `SectionHeading`, `Badge`, and state panels.
- Remove repeated shell messaging and establish stronger page templates.

### Phase 2: catalog

- Redesign `/skills`.
- Replace the current large-card default with a denser browse pattern.
- Redesign search, filters, active chips, result summary, empty state, loading state, and error state.

### Phase 3: detail and upload

- Redesign `/skills/[id]` with a stronger summary header and cleaner right rail.
- Redesign `/upload` as a guided workspace with a stronger file-upload and review experience.
- Refine markdown preview styling across both pages.

### Phase 4: admin

- Redesign `/admin` as a read-only operations view using current data only.
- Add denser roster/activity patterns.
- Align status and governance presentation with the rest of the product.

### Phase 5: polish and consistency pass

- Unify copy, spacing, responsive behaviour, and state treatments across all target routes.
- Check accessibility contrast, keyboard focus, loading behaviour, and empty/error recovery.
- Keep implementation simple and local so route files remain readable.

## Top 10 proposed changes

1. Replace the current “panel everywhere” approach with clearer hierarchy levels for hero, content, dense rows, and supporting notes.
2. Simplify the authenticated shell by removing repeated member, auth, and status messaging across sidebar and header.
3. Turn `/skills` into a cleaner catalog workspace with a sticky search-and-filter command bar and a denser row-based result pattern.
4. Remove the default right rail from `/skills` and reclaim that space for faster catalog scanning.
5. Redesign `/skills/[id]` around a stronger summary header, primary markdown content rail, and consolidated sticky summary rail.
6. Turn `/upload` into a guided workflow with stronger sectioning, a better file-drop presentation, and a clearer review-before-submit step.
7. Reframe `/admin` as a read-only oversight workspace with aligned roster and activity views instead of generic stacked cards.
8. Reduce badge usage and reserve strong colour mainly for status, primary actions, and meaningful alerts.
9. Rewrite user-facing copy to be benefit-led and plain-language, while moving developer-facing implementation details into secondary surfaces.
10. Keep the redesign implementation-friendly by preserving routes, server boundaries, filter URLs, and existing Supabase/auth logic while improving only the frontend system.

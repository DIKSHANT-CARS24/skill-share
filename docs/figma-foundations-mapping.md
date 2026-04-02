# Figma Foundations Mapping

## Source

- Figma file: `Turbo-UI-Minimal-DLS`
- File key: `ZSUXGVeiT6EpNTQRLinHge`
- Foundations page node: `2:2`
- Extracted from:
  - typography stack node `9:101`
  - color grid node `9:25`

## Typography Foundations

| Figma style | Font family | Weight | Size | Line height | Letter spacing | App usage |
| --- | --- | --- | --- | --- | --- | --- |
| Display / XL | Inter | Semi Bold (600) | 48px | 1.25 | Not explicitly defined | Hero page titles and large auth headings |
| Heading / L | Inter | Semi Bold (600) | 32px | 1.25 | Not explicitly defined | Section page titles and large stat values |
| Heading / M | Inter | Semi Bold (600) | 24px | 1.25 | Not explicitly defined | Panel titles and prominent subheadings |
| Title / M | Inter | Semi Bold (600) | 20px | 1.4 | Not explicitly defined | Card titles and secondary section headings |
| Body / L | Inter | Regular (400) | 17px | 1.4 | Not explicitly defined | Introductory copy and larger supporting text |
| Body / M | Inter | Regular (400) | 15px | 1.4 | Not explicitly defined | Default body copy, forms, filters, and lists |
| Body / S | Inter | Regular (400) | 13px | 1.4 | Not explicitly defined | Dense secondary copy and metadata |
| Label / M | Inter | Semi Bold (600) | 15px | 1.4 | Not explicitly defined | Buttons, nav labels, and emphasized labels |
| Label / S | Inter | Semi Bold (600) | 13px | 1.4 | Not explicitly defined | Eyebrows, form labels, and compact labels |
| Caption / XS | Inter | Regular (400) | 11px | 1.4 | Not explicitly defined | Tiny metadata and tag chips |

## Color Foundations

### Direct Figma mappings

| Figma token | Value | App token / alias | Usage |
| --- | --- | --- | --- |
| Surface / Brand / Primary | `#4736FE` | `--surface-brand-primary`, `--accent` | Primary actions, active nav, brand emphasis |
| Surface / Brand / Secondary | `#E3E1FF` | `--surface-brand-secondary`, `--accent-soft` | Soft brand fills and selected states |
| Surface / Brand / Subtle | `#F6F5FF` | `--surface-brand-subtle`, `--surface-muted` | Soft tinted panels and muted accent surfaces |
| Surface / Default / Strong | `#F1F5F9` | `--surface-default-strong`, `--surface` | Nested cards and default filled containers |
| Surface / Default / Subtle | `#F8FAFC` | `--surface-default-subtle`, `--background` | App canvas and soft background surfaces |
| Text / Primary | `#0F172B` | `--text-primary`, `--foreground` | Main text and strong content |
| Text / Secondary | `#62748E` | `--text-secondary`, `--muted` | Supporting text and metadata |
| Text / Brand / Primary | `#4736FE` | `--text-brand-primary` | Brand-emphasis text |
| Text / Inverse | `#FFFFFF` | `--text-inverse` | Text on primary brand backgrounds |
| Border / Primary | `#90A1B9` | `--border-primary`, `--border-strong` | Stronger borders and emphasized outlines |
| Border / Secondary | `#CAD5E2` | `--border-secondary`, `--border` | Default borders and dividers |
| Border / Brand / Primary | `#4736FE` | `--border-brand-primary` | Brand-border alias for future use |
| Feedback / Success / Surface | `#EFFFF7` | `--feedback-success-surface`, `--success-soft` | Success surfaces |
| Feedback / Warning / Surface | `#FFFBEB` | `--feedback-warning-surface`, `--warning-soft` | Warning surfaces |
| Feedback / Error / Surface | `#FEF2F2` | `--feedback-error-surface`, `--danger-soft` | Error surfaces |
| Badge / Feature / Surface | `#FBE6FE` | `--badge-feature-surface` | Stored for future badge variants |
| Badge / Sky / Surface | `#EBFEFF` | `--badge-sky-surface` | Stored for future badge variants |
| Badge / Drive / Surface | `#FFE8F7` | `--badge-drive-surface` | Stored for future badge variants |

### Derived app aliases

| App token | Value source | Reason |
| --- | --- | --- |
| `--surface-strong` | `#FFFFFF` derived alias | The foundations page does not publish a dedicated elevated white card token, but the current app relies on clear panel elevation. A white alias was kept for readable cards without redesigning screen structure. |
| `--accent-strong` | `color-mix()` from brand primary and text primary | The foundations page publishes only one brand primary. Hover and active emphasis needed a safe derived state token. |
| `--success` | inferred semantic text color | The foundations page publishes the success surface but not the paired readable text value on that page. |
| `--warning` | inferred semantic text color | Same reason as success. |
| `--danger` | retained semantic text color | The foundations page publishes the error surface but not the paired readable text value on that page. |

## File-Level Mapping

- Global token source: `app/globals.css`
- Shared primitive adoption:
  - `components/ui/button.tsx`
  - `components/ui/badge.tsx`
  - `components/ui/input-shell.tsx`
  - `components/ui/panel.tsx`
  - `components/ui/avatar.tsx`
  - `components/ui/section-heading.tsx`
- App-shell adoption:
  - `components/app-shell/sidebar-nav.tsx`
  - `components/app-shell/workspace-shell.tsx`
  - `components/dashboard-shell.tsx`
- Screen and feature adoption:
  - `app/login/page.tsx`
  - `app/forbidden.tsx`
  - `app/unauthorized.tsx`
  - `app/(workspace)/skills/page.tsx`
  - `app/(workspace)/admin/page.tsx`
  - `app/(workspace)/profile/page.tsx`
  - `app/(workspace)/design-preview/page.tsx`
  - `components/auth/login-form.tsx`
  - `components/skills/filter-toolbar.tsx`
  - `components/skills/skill-card.tsx`
  - `components/profile/profile-overview.tsx`
  - `components/states/state-panels.tsx`
  - `components/admin/review-queue.tsx`
  - `components/upload/upload-form.tsx`

## Known Mapping Gaps

- The foundations page does not show letter-spacing values in the extracted typography specimens, so no global tracking token was introduced from Figma.
- The foundations page publishes feedback surfaces but not explicit feedback text and border values in the same foundation grid; those semantic text colors remain documented inferences.
- The three badge surfaces are stored as reusable tokens, but the current app badge API does not yet have matching `feature`, `sky`, and `drive` variants, so they are not assigned to screen-specific badges yet.
- Spacing and radius were visible in the foundations page, but this task intentionally limited implementation to typography and color adoption.
